import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { supabase } from '../../lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, weekStart } = req.body;

    if (!userId || !weekStart) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Fetch user's goals and recent progress
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);

    if (goalsError) throw goalsError;

    // Generate the focus message using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI coach helping users stay motivated and focused on their goals. Your responses should be encouraging, specific to their goals, and actionable. Keep responses concise (2-3 sentences) but impactful."
        },
        {
          role: "user",
          content: `Generate a motivational weekly focus message for a user with these goals: ${JSON.stringify(goals?.map(g => g.title))}. The message should be encouraging and specific to their goals.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const focus = completion.choices[0]?.message?.content;

    if (!focus) {
      throw new Error('Failed to generate focus message');
    }

    return res.status(200).json({ focus });
  } catch (error) {
    console.error('Error generating weekly focus:', error);
    return res.status(500).json({ error: 'Failed to generate weekly focus' });
  }
} 