import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
const BREVO_API_URL = 'https://api.brevo.com/v3';
const LIST_ID = 3;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WelcomeEmailData {
  email: string;
  firstName?: string;
}

async function addContactToBrevo(data: WelcomeEmailData) {
  const response = await fetch(`${BREVO_API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      attributes: {
        FIRSTNAME: data.firstName || '',
        REGISTRATION_DATE: new Date().toISOString(),
      },
      listIds: [LIST_ID],
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to add contact: ${error.message}`);
  }

  return response.json();
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, firstName } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Add contact to Brevo and trigger welcome sequence
    await addContactToBrevo({ email, firstName });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    );
  }
}); 