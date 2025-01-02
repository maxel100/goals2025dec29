import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { openai } from '../lib/openai';
import { categories } from '../data/categories';
import { Goal } from '../types/goals';
import { Priority } from '../types/priorities';

interface YearlyGoal {
  id: string;
  text: string;
  type: 'simple' | 'quantifiable' | 'monthly';
  progress?: number;
  target?: number;
  unit?: string;
  completed?: boolean;
  monthlyProgress?: Record<string, boolean>;
}

interface WeeklyPriority {
  text: string;
}

interface DailyPriority {
  text: string;
}

export async function generateDailyPriorities(): Promise<string[]> {
  try {
    const user = await getCurrentUser();

    // Get weekly priorities
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const { data: weeklyData } = await supabase
      .from('weekly_priorities')
      .select('priorities')
      .eq('user_id', user.id)
      .eq('week_of', weekStart.toISOString())
      .single();

    // Get past daily priorities
    const { data: dailyData } = await supabase
      .from('daily_priorities')
      .select('priorities')
      .eq('user_id', user.id)
      .order('date_of', { ascending: false })
      .limit(5);

    const weeklyPriorities = weeklyData?.priorities || [];
    const pastDailyPriorities = dailyData?.map(d => d.priorities).flat() || [];

    const prompt = `Based on these weekly priorities:
${weeklyPriorities.map((p: WeeklyPriority) => `- ${p.text}`).join('\n')}

And these past daily priorities:
${pastDailyPriorities.map((p: DailyPriority) => `- ${p.text}`).join('\n')}

Generate 5 specific and actionable daily priorities that align with the weekly goals and build on past progress. Each priority should be clear and achievable within a day.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const suggestions = completion.choices[0].message.content
      ?.split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^[0-9-.\s]+/, '').trim())
      .filter((line: string) => line.length > 0) || [];

    return suggestions;
  } catch (error) {
    console.error('Error generating daily priorities:', error);
    throw new Error('Failed to generate daily priorities. Please try again.');
  }
}

export async function generateWeeklyPriorities(): Promise<string[]> {
  try {
    const user = await getCurrentUser();

    // Get monthly goals
    const monthStart = new Date();
    monthStart.setDate(1);
    const { data: monthlyData } = await supabase
      .from('monthly_goals')
      .select('goals')
      .eq('user_id', user.id)
      .eq('month_of', monthStart.toISOString())
      .single();

    // Get past weekly priorities
    const { data: weeklyData } = await supabase
      .from('weekly_priorities')
      .select('priorities')
      .eq('user_id', user.id)
      .order('week_of', { ascending: false })
      .limit(4);

    const monthlyGoals = monthlyData?.goals || [];
    const pastWeeklyPriorities = weeklyData?.map(w => w.priorities).flat() || [];

    const prompt = `Based on these monthly goals:
${monthlyGoals.map((g: Priority) => `- ${g.text}`).join('\n')}

And these past weekly priorities:
${pastWeeklyPriorities.map((p: WeeklyPriority) => `- ${p.text}`).join('\n')}

Generate 5 specific and actionable weekly priorities that align with the monthly goals and build on past progress. Each priority should be clear and achievable within a week.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const suggestions = completion.choices[0].message.content
      ?.split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^[0-9-.\s]+/, '').trim())
      .filter((line: string) => line.length > 0) || [];

    return suggestions;
  } catch (error) {
    console.error('Error generating weekly priorities:', error);
    throw new Error('Failed to generate weekly priorities. Please try again.');
  }
}

export async function generateQuarterlyGoals(): Promise<string[]> {
  try {
    const user = await getCurrentUser();
    const currentDate = new Date();
    const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
    const remainingQuarters = 4 - currentQuarter + 1;

    // Get yearly goals with their categories and progress
    const { data: yearlyData } = await supabase
      .from('yearly_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('year_of', new Date().getFullYear())
      .single();

    // Get all goals across categories
    const { data: goalsData } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('hidden', false);

    // Get past quarterly goals for context
    const { data: quarterlyData } = await supabase
      .from('quarterly_goals')
      .select('goals')
      .eq('user_id', user.id)
      .order('quarter_start', { ascending: false })
      .limit(3);

    const yearlyGoals = yearlyData?.goals || [];
    const allGoals = (goalsData || []) as Goal[];
    const pastQuarterlyGoals = quarterlyData?.map(q => q.goals).flat() || [];

    // Group goals by category
    const goalsByCategory = allGoals.reduce<Record<string, Goal[]>>((acc, goal) => {
      if (!acc[goal.category]) acc[goal.category] = [];
      acc[goal.category].push(goal);
      return acc;
    }, {});

    // Calculate progress and remaining work for each goal
    const goalsWithProgress = yearlyGoals.map((goal: YearlyGoal) => {
      let progress = 0;
      let remaining = 0;

      if (goal.type === 'quantifiable' && goal.target) {
        progress = ((goal.progress || 0) / goal.target) * 100;
        remaining = goal.target - (goal.progress || 0);
      } else if (goal.type === 'monthly') {
        const completedMonths = Object.values(goal.monthlyProgress || {}).filter(Boolean).length;
        progress = (completedMonths / 12) * 100;
        remaining = 12 - completedMonths;
      } else {
        progress = goal.completed ? 100 : 0;
        remaining = goal.completed ? 0 : 1;
      }

      return {
        ...goal,
        progress,
        remaining,
        quarterlyTarget: remaining / remainingQuarters
      };
    });

    const prompt = `Based on the following yearly goals and their current progress:

${goalsWithProgress.map((g: YearlyGoal & { progress: number; remaining: number }) => {
  let progressInfo = '';
  if (g.type === 'quantifiable') {
    progressInfo = `(${g.progress.toFixed(1)}% complete, ${g.remaining} ${g.unit} remaining)`;
  } else if (g.type === 'monthly') {
    progressInfo = `(${g.progress.toFixed(1)}% complete, ${g.remaining} months remaining)`;
  } else {
    progressInfo = g.completed ? '(Completed)' : '(Not started)';
  }
  return `- ${g.text} ${progressInfo}`;
}).join('\n')}

Goals by category:
${Object.entries(goalsByCategory).map(([category, goals]) => `
${categories[category as keyof typeof categories]?.title}:
${goals.map(g => `- ${g.title}`).join('\n')}`).join('\n')}

Past quarterly goals for context:
${pastQuarterlyGoals.map((g: Priority) => `- ${g.text}`).join('\n')}

With ${remainingQuarters} quarters remaining in the year, generate 8 specific and actionable quarterly goals that will help achieve the yearly goals. Each goal should:
1. Be a single, clear action item without category labels
2. Be concise and direct (e.g. "Schedule meditation retreat" instead of "Mind & Beliefs: Plan and finalize arrangements for a meditation retreat")
3. Include specific numbers when relevant (e.g. "Read 5 books" instead of "Read books regularly")
4. Focus on one clear objective per suggestion
5. Be immediately actionable
6. Consider current progress and remaining work
7. Prioritize goals that are behind schedule
8. Balance effort across different life categories

For quantifiable goals, calculate specific numbers based on remaining work divided by remaining quarters.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const suggestions = completion.choices[0].message.content
      ?.split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^[0-9-.\s]+/, '').trim())
      .filter((line: string) => line.length > 0) || [];

    return suggestions;
  } catch (error) {
    console.error('Error generating quarterly goals:', error);
    throw new Error('Failed to generate quarterly goals. Please try again.');
  }
} 