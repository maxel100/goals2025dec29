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

serve(async () => {
  try {
    // Get all users
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    // For each user, generate and save motivation
    for (const user of users.users) {
      // Fetch user's data
      const [goals, priorities, debrief, mission] = await Promise.all([
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('weekly_priorities').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('yearly_debrief').select('*').eq('user_id', user.id).single(),
        supabase.from('life_mission').select('*').eq('user_id', user.id).single()
      ]);

      // Generate motivation using OpenAI
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a clear, direct mentor focused on execution and integrity. Write like Naval/Matt Mochary - concise and impactful."
          },
          {
            role: "user",
            content: `Context:
Goals: ${JSON.stringify(goals.data)}
Weekly Focus: ${JSON.stringify(priorities.data?.[0]?.priorities)}
Vision: ${mission.data?.vision}

Write a clear, actionable message reviewing progress and suggesting next steps. Focus on execution and occasionally reference their vision. Keep it concise and direct.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const motivationalContent = completion.choices[0].message?.content;

      // Save to weekly_motivation table
      await supabase.from('weekly_motivation').insert({
        user_id: user.id,
        content: motivationalContent,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});