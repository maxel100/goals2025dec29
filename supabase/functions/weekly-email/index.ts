import { serve } from 'https://deno.fresh.dev/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Resend } from 'https://esm.sh/resend@3.2.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's email preferences
    const { data: preferences } = await supabaseClient
      .from('user_preferences')
      .select('email')
      .eq('user_id', user.id)
      .single();

    if (!preferences?.email) {
      throw new Error('Email notifications are disabled');
    }

    // Get the current week's motivation
    const weekStart = startOfWeek(new Date()).toISOString();
    const { data: motivation } = await supabaseClient
      .from('weekly_motivation')
      .select('content')
      .eq('user_id', user.id)
      .eq('week_of', weekStart)
      .single();

    if (!motivation?.content) {
      throw new Error('No weekly motivation found for this week');
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Send email with the weekly motivation
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Weekly Focus <focus@resend.dev>',
      to: user.email,
      subject: '🎯 Your Weekly Focus Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #738440; margin-bottom: 20px;">Your Weekly Focus</h1>
          <div style="background: #f6f7f1; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            ${motivation.content.split('\n').map(line => 
              line.trim() ? `<p style="margin: 0 0 15px 0; line-height: 1.6;">${line}</p>` : ''
            ).join('')}
          </div>
          <p style="color: #666; font-size: 14px;">You're receiving this because you've enabled weekly focus updates.</p>
        </div>
      `
    });

    if (emailError) {
      throw emailError;
    }

    return new Response(
      JSON.stringify({ success: true, data: emailData }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error:', errorMessage);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});