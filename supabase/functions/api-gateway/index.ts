import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple encryption/decryption functions
function encrypt(text: string, key: string): string {
  // Simple XOR encryption for demo - use proper encryption in production
  const keyBytes = new TextEncoder().encode(key);
  const textBytes = new TextEncoder().encode(text);
  const encrypted = new Uint8Array(textBytes.length);
  
  for (let i = 0; i < textBytes.length; i++) {
    encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return btoa(String.fromCharCode(...encrypted));
}

function decrypt(encryptedText: string, key: string): string {
  try {
    const keyBytes = new TextEncoder().encode(key);
    const encryptedBytes = new Uint8Array(atob(encryptedText).split('').map(char => char.charCodeAt(0)));
    const decrypted = new Uint8Array(encryptedBytes.length);
    
    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt token data');
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
    const pythonAgentUrl = Deno.env.get('PYTHON_AGENT_URL');
    const agentApiSecretKey = Deno.env.get('AGENT_API_SECRET_KEY');

    // Validate required environment variables
    if (!encryptionKey) {
      console.error('ENCRYPTION_KEY not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: ENCRYPTION_KEY not set' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!pythonAgentUrl) {
      console.error('PYTHON_AGENT_URL not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: PYTHON_AGENT_URL not set' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!agentApiSecretKey) {
      console.error('AGENT_API_SECRET_KEY not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: AGENT_API_SECRET_KEY not set' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user from authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { authorization: authHeader },
      },
    });

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Authenticated user:', user.id);

    // Retrieve encrypted token from connected_accounts table
    const { data: accounts, error: accountError } = await supabase
      .from('connected_accounts')
      .select('encrypted_token_data')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single();

    if (accountError || !accounts) {
      console.error('No Google account connected:', accountError);
      return new Response(
        JSON.stringify({ 
          error: 'No Google account connected. Please connect your Google account first.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Found connected Google account');

    // Decrypt token data
    let decryptedTokenData;
    try {
      const decryptedString = decrypt(accounts.encrypted_token_data, encryptionKey);
      decryptedTokenData = JSON.parse(decryptedString);
    } catch (error) {
      console.error('Token decryption failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to decrypt Google token. Please reconnect your Google account.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Token decrypted successfully');

    // Call Python Flask API
    const pythonResponse = await fetch(`${pythonAgentUrl}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${agentApiSecretKey}`,
      },
      body: JSON.stringify({
        input: message,
        token: decryptedTokenData
      })
    });

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.text();
      console.error('Python API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'AI agent service error',
          details: errorData 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await pythonResponse.json();
    console.log('Python API response received');

    // Return the response from Python API
    return new Response(
      JSON.stringify({
        message: result.result || result.message,
        success: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Gateway error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});