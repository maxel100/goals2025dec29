import { supabase } from '../lib/supabase';
import { openai } from './openai';
import { getCurrentUser } from '../lib/auth';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateMonthlyPriorities() {
  const user = await getCurrentUser();

  // Fetch user's goals and priorities
  const [goalsResponse, weeklyResponse, dailyResponse] = await Promise.all([
    supabase.from('goals').select('*').eq('user_id', user.id),
    supabase.from('weekly_priorities').select('*').eq('user_id', user.id),
    supabase.from('daily_priorities').select('*').eq('user_id', user.id)
  ]);

  const goals = goalsResponse.data || [];
  const weeklyPriorities = weeklyResponse.data || [];
  const dailyPriorities = dailyResponse.data || [];

  // Format the context
  const context = {
    goals: goals.map(g => ({
      title: g.title || '',
      category: g.category || '',
      progress: g.progress || 0,
      completed: g.completed || false,
    })),
    weeklyPriorities: weeklyPriorities.map(wp => ({
      priorities: wp.priorities || [],
      weekOf: wp.week_of || '',
    })),
    dailyPriorities: dailyPriorities.map(dp => ({
      priorities: dp.priorities || [],
      date: dp.date || '',
    })),
  };

  // Retry logic for OpenAI API calls
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI Priority Coach helping users plan their monthly priorities. Your suggestions should be specific, actionable, and aligned with the user's goals."
          },
          {
            role: "user",
            content: `Based on the user's context, suggest 5 strategic monthly priorities that will help them make progress on their goals:

Goals:
${context.goals.map(g => `- ${g.title} (${g.category})`).join('\n')}

Recent Weekly Priorities:
${context.weeklyPriorities.map(wp => 
  `Week of ${wp.weekOf}:\n${wp.priorities.map(p => `- ${p.text || ''}`).join('\n')}`
).join('\n\n')}

Recent Daily Priorities:
${context.dailyPriorities.map(dp => 
  `${dp.date}:\n${dp.priorities.map(p => `- ${p.text || ''}`).join('\n')}`
).join('\n\n')}

Format each suggestion as a clear, actionable priority statement.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const suggestions = completion.choices[0]?.message?.content
        ?.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5) || [];

      return suggestions;

    } catch (err: any) {
      if (err?.error?.code === 'rate_limit_exceeded' && attempt < 2) {
        await delay((attempt + 1) * 2000);
        continue;
      }
      throw err;
    }
  }

  throw new Error('Failed to generate suggestions after multiple attempts');
}

export async function generateWeeklyPriorities() {
  const user = await getCurrentUser();

  // Fetch user's goals, monthly priorities, and previous weekly priorities
  const [goalsResponse, monthlyResponse, weeklyResponse] = await Promise.all([
    supabase.from('goals').select('*').eq('user_id', user.id),
    supabase.from('monthly_priorities').select('*').eq('user_id', user.id),
    supabase.from('weekly_priorities').select('*').eq('user_id', user.id).order('week_of', { ascending: false }).limit(4)
  ]);

  const goals = goalsResponse.data || [];
  const monthlyPriorities = monthlyResponse.data || [];
  const weeklyPriorities = weeklyResponse.data || [];

  // Format the context
  const context = {
    yearlyGoals: goals.filter(g => g.timeframe === 'yearly').map(g => ({
      title: g.title || '',
      category: g.category || '',
      progress: g.progress || 0,
      completed: g.completed || false,
    })),
    monthlyPriorities: monthlyPriorities.map(mp => ({
      priorities: mp.priorities || [],
      monthOf: mp.month_of || '',
    })),
    previousWeeklyPriorities: weeklyPriorities.map(wp => ({
      priorities: wp.priorities || [],
      weekOf: wp.week_of || '',
    })),
  };

  // Retry logic for OpenAI API calls
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI Priority Coach helping users plan their weekly priorities. Your suggestions should be:
1. Highly aligned with their current monthly priorities
2. Build on successful patterns from previous weekly priorities
3. Consider yearly goals but with less weight
4. Be specific, actionable, and achievable within a week`
          },
          {
            role: "user",
            content: `Based on the user's context, suggest 3 strategic weekly priorities that will help them make progress:

Monthly Priorities (Primary Focus):
${context.monthlyPriorities[0]?.priorities.map(p => `- ${p.text || ''}`).join('\n') || 'No current monthly priorities set'}

Previous Weekly Priorities (For Context):
${context.previousWeeklyPriorities.map(wp => 
  `Week of ${wp.weekOf}:\n${wp.priorities.map(p => `- ${p.text || ''}`).join('\n')}`
).join('\n\n')}

Yearly Goals (Secondary Consideration):
${context.yearlyGoals.map(g => `- ${g.title} (${g.category})`).join('\n')}

Format each suggestion as a clear, actionable priority statement that can be accomplished this week.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const suggestions = completion.choices[0]?.message?.content
        ?.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 3) || [];

      return suggestions;

    } catch (err: any) {
      if (err?.error?.code === 'rate_limit_exceeded' && attempt < 2) {
        await delay((attempt + 1) * 2000);
        continue;
      }
      throw err;
    }
  }

  throw new Error('Failed to generate suggestions after multiple attempts');
}

export async function generateDailyPriorities() {
  const user = await getCurrentUser();

  // Fetch user's goals, weekly priorities, and previous daily priorities
  const [goalsResponse, weeklyResponse, dailyResponse] = await Promise.all([
    supabase.from('goals').select('*').eq('user_id', user.id),
    supabase.from('weekly_priorities').select('*').eq('user_id', user.id).order('week_of', { ascending: false }).limit(1),
    supabase.from('daily_priorities').select('*').eq('user_id', user.id).order('date_of', { ascending: false }).limit(7)
  ]);

  const goals = goalsResponse.data || [];
  const weeklyPriorities = weeklyResponse.data || [];
  const dailyPriorities = dailyResponse.data || [];

  // Format the context
  const context = {
    goals: goals.map(g => ({
      title: g.title || '',
      category: g.category || '',
      progress: g.progress || 0,
      completed: g.completed || false,
    })),
    weeklyPriorities: weeklyPriorities[0]?.priorities || [],
    recentDailyPriorities: dailyPriorities.map(dp => ({
      priorities: dp.priorities || [],
      dateOf: dp.date_of || '',
    })),
  };

  // Retry logic for OpenAI API calls
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI Priority Coach helping users plan their daily priorities. Your suggestions should be:
1. Highly aligned with their current weekly priorities
2. Build on successful patterns from recent daily priorities
3. Consider their goals for context
4. Be specific, actionable, and achievable within a day`
          },
          {
            role: "user",
            content: `Based on the user's context, suggest 7 daily priorities that will help them make progress:

Weekly Priorities (Primary Focus):
${context.weeklyPriorities.map((p: { text: string }) => `- ${p.text || ''}`).join('\n') || 'No current weekly priorities set'}

Recent Daily Priorities (For Context):
${context.recentDailyPriorities.map(dp => 
  `${dp.dateOf}:\n${dp.priorities.map((p: { text: string }) => `- ${p.text || ''}`).join('\n')}`
).join('\n\n')}

Goals (Secondary Consideration):
${context.goals.map(g => `- ${g.title} (${g.category})`).join('\n')}

Format each suggestion as a clear, actionable priority statement that can be accomplished today.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const suggestions = completion.choices[0]?.message?.content
        ?.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 7) || [];

      return suggestions;

    } catch (err: any) {
      if (err?.error?.code === 'rate_limit_exceeded' && attempt < 2) {
        await delay((attempt + 1) * 2000);
        continue;
      }
      throw err;
    }
  }

  throw new Error('Failed to generate suggestions after multiple attempts');
} 