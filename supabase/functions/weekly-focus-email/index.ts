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
    console.log('Starting weekly focus email function...');

    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      console.error('Missing environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        hasResendKey: !!resendApiKey
      });
      throw new Error('Missing environment variables');
    }

    console.log('Environment variables checked successfully');

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all users who have email notifications enabled
    const { data: users, error: usersError } = await supabase
      .from('user_preferences')
      .select('user_id, email')
      .eq('email', true);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    console.log(`Found ${users?.length || 0} users with email notifications enabled`);

    if (!users || users.length === 0) {
      console.log('No users with email notifications enabled');
      return new Response(
        JSON.stringify({ success: true, message: 'No users to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey);
    console.log('Resend client initialized');

    // Send emails to each user
    const results = await Promise.all(
      users.map(async (userPref) => {
        try {
          console.log(`Processing user ${userPref.user_id}...`);

          // Get user's email address from auth.users
          const { data: { users: authUsers }, error: userError } = await supabase.auth.admin.listUsers();
          const userData = authUsers.find(u => u.id === userPref.user_id);

          if (userError || !userData?.email) {
            console.error(`Failed to get email for user ${userPref.user_id}:`, userError);
            throw new Error('Failed to get email for user ' + userPref.user_id);
          }

          console.log(`Found email for user ${userPref.user_id}`);

          // Get user's goals and progress
          const { data: goals, error: goalsError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userPref.user_id);

          if (goalsError) {
            console.error(`Failed to get goals for user ${userPref.user_id}:`, goalsError);
            throw goalsError;
          }

          console.log(`Found ${goals?.length || 0} goals for user ${userPref.user_id}`);

          // Get user's life mission
          const { data: mission, error: missionError } = await supabase
            .from('life_mission')
            .select('*')
            .eq('user_id', userPref.user_id)
            .single();

          if (missionError && missionError.code !== 'PGRST116') {
            console.error(`Failed to get mission for user ${userPref.user_id}:`, missionError);
            throw missionError;
          }

          console.log(`Generated content for user ${userPref.user_id}`);

          // Generate personalized content based on goals and mission
          const content = generateWeeklyContent(goals, mission);

          // Send email
          console.log(`Sending email to ${userData.email}...`);
          const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Weekly Focus <focus@resend.dev>',
            to: userData.email,
            subject: '🎯 Your Weekly AI Coach Update',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #738440; margin-bottom: 20px;">Your Weekly AI Coach</h1>
                <div style="background: #f6f7f1; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  ${content}
                </div>
                <p style="color: #666; font-size: 14px;">
                  You're receiving this because you've enabled weekly focus updates from Weekly Focus.
                  You can manage your email preferences in your account settings.
                </p>
              </div>
            `
          });

          if (emailError) {
            console.error(`Failed to send email to ${userData.email}:`, emailError);
            throw emailError;
          }

          console.log(`Successfully sent email to ${userData.email}`);
          return { userId: userPref.user_id, success: true };
        } catch (error) {
          console.error('Failed to send email to user ' + userPref.user_id + ':', error);
          return { userId: userPref.user_id, success: false, error: error.message };
        }
      })
    );

    console.log('Finished processing all users:', results);

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateWeeklyContent(goals: any[], mission: any): string {
  // Default content if no goals or mission
  if (!goals?.length && !mission) {
    return `
      <p style="margin: 0 0 15px 0; line-height: 1.6;">
        This week, focus on setting clear goals and defining your mission. 
        Take some time to reflect on what you want to achieve and break it down into actionable steps.
      </p>
      <p style="margin: 0 0 15px 0; line-height: 1.6;">
        Remember, every journey begins with a single step. Start small, but start today.
      </p>
    `;
  }

  // Generate content based on goals and mission
  const completedGoals = goals?.filter(g => g.completed) || [];
  const inProgressGoals = goals?.filter(g => !g.completed) || [];

  let content = '';

  // Add progress review
  if (completedGoals.length > 0) {
    content += `
      <p style="margin: 0 0 15px 0; line-height: 1.6;">
        Congratulations on completing ${completedGoals.length} goal${completedGoals.length === 1 ? '' : 's'} this week! 
        Your dedication and perseverance are paying off.
      </p>
    `;
  }

  // Add upcoming focus
  if (inProgressGoals.length > 0) {
    content += `
      <p style="margin: 0 0 15px 0; line-height: 1.6;">
        For the upcoming week, focus on your ${inProgressGoals.length} active goal${inProgressGoals.length === 1 ? '' : 's'}. 
        Each step forward brings you closer to your vision.
      </p>
    `;
  }

  // Add mission alignment
  if (mission?.mission) {
    content += `
      <p style="margin: 0 0 15px 0; line-height: 1.6;">
        Remember your mission: "${mission.mission}". 
        Let this guide your actions and decisions this week.
      </p>
    `;
  }

  // Add closing motivation
  content += `
    <p style="margin: 0 0 15px 0; line-height: 1.6;">
      Stay focused, maintain your momentum, and embrace the journey ahead. 
      You're making progress every day.
    </p>
  `;

  return content;
} 