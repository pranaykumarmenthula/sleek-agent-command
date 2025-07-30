import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailTool {
  name: 'send_email';
  arguments: {
    to: string;
    subject: string;
    body: string;
  };
}

interface CalendarTool {
  name: 'schedule_calendar_event';
  arguments: {
    title: string;
    start_time: string;
    end_time: string;
    attendees?: string[];
    description?: string;
  };
}

interface FindFreeTool {
  name: 'find_free_time_slots';
  arguments: {
    duration_minutes: number;
    day: string;
  };
}

type ToolCall = EmailTool | CalendarTool | FindFreeTool;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, user_id } = await req.json();
    
    if (!message || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Message and user_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's connected accounts for Google OAuth
    const { data: accounts } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', user_id)
      .eq('provider', 'google');

    let googleAccessToken = null;
    if (accounts && accounts.length > 0) {
      // Decrypt and refresh Google token if needed
      googleAccessToken = await refreshGoogleToken(accounts[0].encrypted_token_data);
    }

    // Call Azure OpenAI with function calling
    const response = await callAzureOpenAI(message, googleAccessToken);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-agent function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function callAzureOpenAI(message: string, googleAccessToken: string | null) {
  const azureEndpoint = Deno.env.get('AZURE_OPENAI_ENDPOINT');
  const azureApiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
  const deploymentName = Deno.env.get('AZURE_OPENAI_CHAT_DEPLOYMENT_NAME');

  const tools = [
    {
      type: "function",
      function: {
        name: "schedule_calendar_event",
        description: "Schedules an event on Google Calendar and optionally invites attendees",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string", description: "The title of the event" },
            start_time: { type: "string", description: "Start time in ISO 8601 format" },
            end_time: { type: "string", description: "End time in ISO 8601 format" },
            attendees: { type: "array", items: { type: "string" }, description: "List of attendee emails" },
            description: { type: "string", description: "Event description" }
          },
          required: ["title", "start_time", "end_time"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "find_free_time_slots",
        description: "Finds available time slots of a specific duration on a given day",
        parameters: {
          type: "object",
          properties: {
            duration_minutes: { type: "number", description: "Duration in minutes" },
            day: { type: "string", description: "Day to check: 'today', 'tomorrow', or 'YYYY-MM-DD'" }
          },
          required: ["duration_minutes", "day"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "send_email",
        description: "Sends an email to a recipient",
        parameters: {
          type: "object",
          properties: {
            to: { type: "string", description: "Recipient email address" },
            subject: { type: "string", description: "Email subject" },
            body: { type: "string", description: "Email body content" }
          },
          required: ["to", "subject", "body"]
        }
      }
    }
  ];

  const systemPrompt = `You are a powerful assistant. The current date is ${new Date().toLocaleDateString()}. 
When asked to schedule a meeting, your primary goal is to get it on the calendar with all correct details. 
Follow this logic: 
1. **Analyze the Request:** Does the user provide a specific time (e.g., 'at 11 am')? 
2. **If a time IS provided:** Do NOT use the find_free_time_slots tool. Directly use the schedule_calendar_event tool. 
3. **If a time IS NOT provided:** THEN use the find_free_time_slots tool to find available slots and propose them to the user. 
4. **Memory:** Remember all details from the user's original request throughout the conversation. 
5. **Confirmation:** After scheduling, confirm with the user that the event has been created and that invitations have been sent.`;

  const requestBody = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    tools: tools,
    tool_choice: "auto",
    temperature: 0
  };

  const response = await fetch(
    `${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-12-01-preview`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureApiKey!
      },
      body: JSON.stringify(requestBody)
    }
  );

  const data = await response.json();
  
  if (data.choices?.[0]?.message?.tool_calls) {
    // Execute tool calls
    const toolResults = [];
    for (const toolCall of data.choices[0].message.tool_calls) {
      const result = await executeToolCall(toolCall, googleAccessToken);
      toolResults.push(result);
    }
    
    // Return response with tool results
    return {
      message: data.choices[0].message.content || "I've executed the requested actions.",
      tool_results: toolResults,
      needs_google_auth: !googleAccessToken
    };
  }

  return {
    message: data.choices?.[0]?.message?.content || "I couldn't process that request.",
    needs_google_auth: !googleAccessToken
  };
}

async function executeToolCall(toolCall: any, googleAccessToken: string | null) {
  const { name, arguments: args } = toolCall.function;
  
  if (!googleAccessToken) {
    return { error: "Google OAuth not configured. Please connect your Google account first." };
  }

  switch (name) {
    case 'schedule_calendar_event':
      return await scheduleCalendarEvent(args, googleAccessToken);
    case 'find_free_time_slots':
      return await findFreeTimeSlots(args, googleAccessToken);
    case 'send_email':
      return await sendEmail(args, googleAccessToken);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

async function scheduleCalendarEvent(args: any, accessToken: string) {
  const { title, start_time, end_time, attendees, description } = args;
  
  const event = {
    summary: title,
    start: { dateTime: start_time, timeZone: 'Asia/Kolkata' },
    end: { dateTime: end_time, timeZone: 'Asia/Kolkata' },
    description: description,
    conferenceData: {
      createRequest: { requestId: `conf_${Date.now()}` }
    }
  };

  if (attendees && attendees.length > 0) {
    event.attendees = attendees.map((email: string) => ({ email }));
  }

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: `Event created successfully! View it here: ${result.htmlLink}`,
        event_id: result.id
      };
    } else {
      return { error: `Failed to create event: ${result.error?.message}` };
    }
  } catch (error) {
    return { error: `Error creating event: ${error.message}` };
  }
}

async function findFreeTimeSlots(args: any, accessToken: string) {
  const { duration_minutes, day } = args;
  
  const today = new Date();
  let checkDate: Date;
  
  if (day.toLowerCase() === 'today') {
    checkDate = today;
  } else if (day.toLowerCase() === 'tomorrow') {
    checkDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  } else {
    checkDate = new Date(day);
  }

  const timeMin = new Date(checkDate);
  timeMin.setHours(9, 0, 0, 0);
  const timeMax = new Date(checkDate);
  timeMax.setHours(18, 0, 0, 0);

  const freeBusyQuery = {
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    timeZone: 'Asia/Kolkata',
    items: [{ id: 'primary' }]
  };

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/freebusy',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(freeBusyQuery)
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      const busySlots = result.calendars?.primary?.busy || [];
      
      if (busySlots.length === 0) {
        return {
          success: true,
          message: `The entire day (${checkDate.toDateString()} from 9 AM to 6 PM) is free.`,
          free_slots: ['09:00-18:00']
        };
      }
      
      return {
        success: true,
        message: `Here are the busy slots for ${checkDate.toDateString()}: ${JSON.stringify(busySlots)}. Find a gap of ${duration_minutes} minutes.`,
        busy_slots: busySlots
      };
    } else {
      return { error: `Failed to check free time: ${result.error?.message}` };
    }
  } catch (error) {
    return { error: `Error checking free time: ${error.message}` };
  }
}

async function sendEmail(args: any, accessToken: string) {
  const { to, subject, body } = args;
  
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body
  ].join('\n');

  const encodedEmail = btoa(email);
  
  try {
    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: encodedEmail
        })
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: `Email sent successfully! Message ID: ${result.id}`,
        message_id: result.id
      };
    } else {
      return { error: `Failed to send email: ${result.error?.message}` };
    }
  } catch (error) {
    return { error: `Error sending email: ${error.message}` };
  }
}

async function refreshGoogleToken(encryptedTokenData: string): Promise<string | null> {
  try {
    const tokenData = JSON.parse(encryptedTokenData);
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      console.error('Google OAuth credentials not configured');
      return null;
    }

    // Refresh the access token using refresh token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokenData.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (response.ok) {
      const newTokenData = await response.json();
      return newTokenData.access_token;
    } else {
      console.error('Failed to refresh Google token:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    return null;
  }
}