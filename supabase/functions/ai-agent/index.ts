import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, user_id } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received message:', message);

    // Get Azure OpenAI configuration
    const azureEndpoint = Deno.env.get('AZURE_OPENAI_ENDPOINT');
    const azureApiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
    const deploymentName = 'gpt-35-turbo'; // Hardcoded for now

    console.log('Azure config check:', {
      hasEndpoint: !!azureEndpoint,
      hasApiKey: !!azureApiKey,
      deploymentName,
      endpoint: azureEndpoint
    });

    if (!azureEndpoint || !azureApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Azure OpenAI configuration missing',
          debug: {
            hasEndpoint: !!azureEndpoint,
            hasApiKey: !!azureApiKey
          }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Azure OpenAI
    const systemPrompt = `You are a powerful assistant. The current date is ${new Date().toLocaleDateString()}. 
When asked to schedule a meeting, your primary goal is to get it on the calendar with all correct details. 
Follow this logic: 
1. **Analyze the Request:** Does the user provide a specific time (e.g., 'at 11 am')? 
2. **If a time IS provided:** Directly use the schedule_calendar_event tool. 
3. **If a time IS NOT provided:** Use the find_free_time_slots tool to find available slots and propose them to the user. 
4. **Memory:** Remember all details from the user's original request throughout the conversation. 
5. **Confirmation:** After scheduling, confirm with the user that the event has been created and that invitations have been sent.

Note: Gmail and Calendar tools are currently not available, so focus on general assistance for now.`;

    const requestBody = {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0,
      max_tokens: 1000
    };

    console.log('Making request to Azure OpenAI...');

    const response = await fetch(
      `${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-12-01-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey
        },
        body: JSON.stringify(requestBody)
      }
    );

    console.log('Azure OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure OpenAI error:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get AI response',
          details: errorText,
          status: response.status
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Azure OpenAI success:', data);

    const aiMessage = data.choices?.[0]?.message?.content || "I couldn't process that request.";

    return new Response(JSON.stringify({
      message: aiMessage,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-agent function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});