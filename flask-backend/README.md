# Flask AI Agent Backend

This Flask API provides LangChain-powered AI agent functionality with Google Calendar and Gmail integration.

## Features

- **LangChain Agent**: Uses Azure OpenAI with tool calling capabilities
- **Google Calendar**: Schedule events, find free time slots
- **Gmail Integration**: Send emails, create drafts, list emails
- **CORS Enabled**: Works with frontend applications

## Setup

### 1. Install Dependencies

```bash
cd flask-backend
pip install -r requirements.txt
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_CHAT_DEPLOYMENT_NAME`: Your deployment name (e.g., gpt-35-turbo)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REFRESH_TOKEN`: Google OAuth refresh token

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail and Calendar APIs
4. Create OAuth 2.0 credentials
5. Get refresh token using OAuth flow

### 4. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /chat
Main chat endpoint for AI agent interactions.

**Request:**
```json
{
  "message": "Schedule a meeting tomorrow at 2pm",
  "user_id": "optional-user-id"
}
```

**Response:**
```json
{
  "message": "Event created successfully! I have sent an invitation to all attendees.",
  "success": true,
  "user_id": "optional-user-id"
}
```

### GET /health
Health check endpoint.

### GET /test-tools
Test endpoint to verify Google services are working.

## Available Agent Tools

1. **schedule_calendar_event**: Create calendar events with attendees
2. **find_free_time_slots**: Find available time slots
3. **send_email**: Send emails via Gmail
4. **create_email_draft**: Create email drafts
5. **list_emails**: List emails from inbox

## Deployment

### Using Docker

```bash
docker build -t flask-ai-agent .
docker run -p 5000:5000 --env-file .env flask-ai-agent
```

### Deploy to Cloud

This Flask app can be deployed to:
- Railway
- Render
- Heroku
- Google Cloud Run
- AWS ECS

Make sure to set environment variables in your deployment platform.

## Integration with Frontend

Update your frontend to call the Flask API instead of Supabase edge functions:

```javascript
const response = await fetch('http://localhost:5000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: userMessage,
    user_id: userId
  })
});
```

For production, replace `localhost:5000` with your deployed API URL.