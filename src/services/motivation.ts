import { supabase } from '../lib/supabase';
import { openai } from './openai';
import { getCurrentUser } from '../lib/auth';

export async function fetchContextData() {
  const user = await getCurrentUser();
  
  const [
    { data: goals },
    { data: weeklyPriorities },
    { data: monthlyGoals },
    { data: yearlyDebrief },
    { data: lifeMission }
  ] = await Promise.all([
    supabase.from('goals').select('title, type, progress, target, completed, category').eq('user_id', user.id),
    supabase.from('weekly_priorities').select('priorities').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
    supabase.from('monthly_goals').select('goals').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
    supabase.from('yearly_debrief').select('wins, lessons').eq('user_id', user.id).single(),
    supabase.from('life_mission').select('vision').eq('user_id', user.id).single()
  ]);

  return {
    goals: goals?.map(g => ({
      title: g.title,
      progress: g.type === 'quantifiable' ? `${g.progress}/${g.target}` : g.completed ? 'completed' : 'in progress',
      category: g.category
    })),
    priorities: weeklyPriorities?.[0]?.priorities || [],
    monthlyGoals: monthlyGoals?.[0]?.goals || [],
    vision: lifeMission?.vision || '',
    wins: yearlyDebrief?.wins || '',
    lessons: yearlyDebrief?.lessons || ''
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateMotivationalContent(context: any) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a clear, direct mentor focused on execution and integrity. Write like Naval/Matt Mochary - concise and impactful."
          },
          {
            role: "user",
            content: `Context:
Goals: ${JSON.stringify(context.goals)}
Weekly Focus: ${JSON.stringify(context.priorities)}
Vision: ${context.vision}

Write a clear, actionable message reviewing progress and suggesting next steps. Focus on execution and occasionally reference their vision. Keep it concise and direct.`
          }
        ],
        model: "gpt-4",
        temperature: 0.7,
        max_tokens: 300
      });

      return completion.choices[0]?.message?.content || null;
    } catch (err: any) {
      if (err?.error?.code === 'rate_limit_exceeded' && attempt < 2) {
        await delay((attempt + 1) * 2000);
        continue;
      }
      throw err;
    }
  }
  return null;
}