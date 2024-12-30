import { serve } from 'https://deno.fresh.dev/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@4.28.0';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  })
);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Fetch all required data
    const [goalsData, aiCoachData, prioritiesData] = await Promise.all([
      supabase.from('goals').select('*').eq('user_id', user.id),
      supabase.from('ai_coach_goals').select('*').eq('user_id', user.id),
      supabase.from('weekly_priorities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
    ]);

    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Generate motivation using OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert AI coach specializing in goal achievement and personal development. Your tone is encouraging, insightful, and action-oriented."
        },
        {
          role: "user",
          content: `Create a motivational message for someone working on these goals:
            
            Goals: ${JSON.stringify(goalsData.data)}
            Long-term Goals: ${JSON.stringify(aiCoachData.data)}
            Weekly Priorities: ${JSON.stringify(prioritiesData.data)}
            
            Make it personal, encouraging, and actionable. Focus on their progress and provide specific suggestions based on their goals.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const motivationalContent = completion.choices[0].message?.content;

    // Save motivation to database
    await supabase.from('weekly_motivation').insert({
      user_id: user.id,
      content: motivationalContent,
    });

    return new Response(
      JSON.stringify({ content: motivationalContent }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate motivation' }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});