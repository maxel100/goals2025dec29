import { serve } from 'https://deno.fresh.dev/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { SendGridClient } from 'https://deno.land/x/sendgrid@v2.0.0/mod.ts';

const sendgrid = new SendGridClient(Deno.env.get('SENDGRID_API_KEY') || '');
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  try {
    // Get your goals
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*');
    
    if (goalsError) throw goalsError;

    // Calculate total progress
    const totalProgress = goals.reduce((sum, goal) => {
      if (goal.type === 'simple') return sum + (goal.completed ? 100 : 0);
      if (goal.type === 'quantifiable') return sum + ((goal.progress / goal.target) * 100);
      if (goal.type === 'monthly') {
        const completedMonths = Object.values(goal.monthly_progress || {}).filter(Boolean).length;
        return sum + ((completedMonths / 12) * 100);
      }
      return sum;
    }, 0) / goals.length;

    // Generate inspiring message
    const progressMessage = totalProgress > 50 
      ? "You're making excellent progress! Keep up the great work!" 
      : "Every step forward counts. Let's make this week count!";

    // Create email content
    const emailContent = `
      <h1>Your Weekly Goals Review 🎯</h1>
      <p><strong>Overall Progress: ${Math.round(totalProgress)}%</strong></p>
      <p>${progressMessage}</p>
      
      <h2>Your Goals Progress:</h2>
      ${goals.map(goal => `
        <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
          <h3>${goal.title}</h3>
          <p>Status: ${
            goal.type === 'simple' ? (goal.completed ? '✅ Complete' : '🔄 In Progress') :
            goal.type === 'quantifiable' ? `📊 ${goal.progress}/${goal.target} ${goal.unit}` :
            `📅 ${Object.values(goal.monthly_progress || {}).filter(Boolean).length}/12 months`
          }</p>
        </div>
      `).join('')}
    `;

    // Send email
    await sendgrid.send({
      to: Deno.env.get('RECIPIENT_EMAIL') || '',
      from: Deno.env.get('SENDER_EMAIL') || '',
      subject: '🎯 Your Weekly Goals Review',
      html: emailContent,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});