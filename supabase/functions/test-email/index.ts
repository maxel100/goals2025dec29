import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    // Log request details for debugging
    console.log('Request received:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnonKey: !!supabaseAnonKey,
      hasResendApiKey: !!resendApiKey
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          success: false 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Email service configuration error',
          success: false 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ 
          error: 'No authorization header provided',
          success: false 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Creating Supabase client...');
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    console.log('Getting user...');
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ 
          error: 'Authentication failed',
          details: authError.message,
          success: false 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!user) {
      console.error('No user found');
      return new Response(
        JSON.stringify({ 
          error: 'No user found',
          success: false 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('User authenticated:', user.email);

    console.log('Initializing Resend...');
    const resend = new Resend(resendApiKey);

    console.log('Sending test email...');
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Weekly Focus <focus@resend.dev>',
      to: user.email,
      subject: '🎯 Your Weekly AI Coach Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #738440; margin-bottom: 20px;">Your Weekly AI Coach</h1>
          <div style="background: #f6f7f1; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 15px 0; line-height: 1.6;">
              Reviewing your progress, it's clear that you're making strides in each category. Congratulations on completing the goal of speaking conversational Swedish and holding a handstand for 30 seconds. These show dedication and perseverance.
            </p>
            <p style="margin: 0 0 15px 0; line-height: 1.6;">
              For the upcoming week, focus on the immediate tasks at hand. Finish Michel Thomas lesson 3,4, track your macros strictly, and do mobility training two times. Each completed task will bring you closer to your larger goals, like reaching 85kg with 11% body fat and enhancing your mobility.
            </p>
            <p style="margin: 0 0 15px 0; line-height: 1.6;">
              Pay attention to your business goals too. Keep working towards your target of $500k across all projects. Remember, every step counts.
            </p>
            <p style="margin: 0 0 15px 0; line-height: 1.6;">
              Relate your weekly actions to your long-term vision. Your mobility training contributes to a pain-free, fantastic shape body. Every business project you complete is a step towards your goal of $2.5mil/yr.
            </p>
            <p style="margin: 0 0 15px 0; line-height: 1.6;">
              Remember to live with integrity, practice gratitude, and radiate passion and clarity for your vision. These qualities will not only help you reach your goals but also make the journey more fulfilling. Keep going.
            </p>
          </div>
          <p style="color: #666; font-size: 14px;">
            You're receiving this because you requested a test email from Weekly Focus.
          </p>
        </div>
      `
    });

    if (emailError) {
      console.error('Email error:', emailError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: emailError.message,
          success: false 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Email sent successfully');
    return new Response(
      JSON.stringify({ success: true, data: emailData }), 
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 