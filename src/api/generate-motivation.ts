import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const openai = new OpenAIApi(
  new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  })
);

export async function generateMotivation(data: {
  goals: any[];
  aiCoachGoals: any[];
  weeklyPriorities: any;
  dayOfWeek: 'Sunday' | 'Wednesday';
}) {
  try {
    const { goals, aiCoachGoals, weeklyPriorities, dayOfWeek } = data;

    // Format goals data for better context
    const formattedGoals = goals.map(goal => {
      let progress = '';
      if (goal.type === 'simple') {
        progress = goal.completed ? 'Completed' : 'In Progress';
      } else if (goal.type === 'quantifiable') {
        progress = `${goal.progress}/${goal.target} ${goal.unit}`;
      } else if (goal.type === 'monthly') {
        const completedMonths = Object.values(goal.monthly_progress || {}).filter(Boolean).length;
        progress = `${completedMonths}/12 months`;
      }
      return `${goal.title}: ${progress}`;
    });

    // Create prompt for OpenAI
    const prompt = `You are an enthusiastic and motivational AI coach. Create a personalized weekly review and motivation message. Today is ${dayOfWeek}.

Context:
- Goals Progress: ${formattedGoals.join('\n')}
- Weekly Priorities: ${weeklyPriorities?.priorities?.map((p: any) => 
    `${p.text} (${p.completed ? 'Completed' : 'In Progress'})`
  ).join('\n')}
- Long-term Vision: ${aiCoachGoals.map(g => 
    `${g.timeframe}: ${g.goals.join(', ')} (Why: ${g.importance})`
  ).join('\n')}

Write a motivational message that:
1. Acknowledges progress and celebrates wins
2. Provides gentle accountability for incomplete tasks
3. Connects current actions to long-term goals
4. ${dayOfWeek === 'Sunday' 
    ? 'Helps set intentions for the week ahead' 
    : 'Provides mid-week encouragement and focus'}
5. Includes specific suggestions based on their goals and priorities

Make it personal, encouraging, and actionable. Use a friendly, conversational tone.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert AI coach specializing in goal achievement and personal development. Your tone is encouraging, insightful, and action-oriented."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.data.choices[0].message?.content || 
      "Unable to generate motivation message. Please try again later.";

  } catch (error) {
    console.error('Error generating motivation:', error);
    throw new Error('Failed to generate motivation message');
  }
}