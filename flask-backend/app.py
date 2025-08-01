from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import datetime
import pickle
import base64
from email.message import EmailMessage
import json

from langchain_openai import AzureChatOpenAI
from langchain_core.tools import tool
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.prompts import ChatPromptTemplate

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

app = Flask(__name__)
CORS(app, origins=['*'])  # Allow all origins for production

# --- PERMISSIONS (SCOPES) ---
SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
]

# --- AUTHENTICATION & SERVICE SETUP ---

def get_google_service():
    """
    Handles the OAuth2 flow and returns a Google API service object.
    """
    # For production, use environment variables for credentials
    creds_info = {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "refresh_token": os.getenv("GOOGLE_REFRESH_TOKEN"),
        "token_uri": "https://oauth2.googleapis.com/token"
    }
    
    creds = Credentials.from_authorized_user_info(creds_info, SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
    
    # Return services for both Gmail and Calendar
    return build('gmail', 'v1', credentials=creds), build('calendar', 'v3', credentials=creds)

# --- TOOL DEFINITIONS ---

@tool
def schedule_calendar_event(title: str, start_time: str, end_time: str, attendees: list = None, description: str = None) -> str:
    """
    Schedules an event on Google Calendar and optionally invites attendees.

    Args:
        title (str): The title of the event.
        start_time (str): The start time in ISO 8601 format (e.g., '2025-07-27T10:00:00').
        end_time (str): The end time in ISO 8601 format (e.g., '2025-07-27T11:00:00').
        attendees (list, optional): A list of attendee email addresses. Defaults to None.
        description (str, optional): A description for the event. Defaults to None.
    
    Returns:
        str: A confirmation message with the event details and link.
    """
    try:
        _, calendar_service = get_google_service()
        event = {
            'summary': title,
            'start': {'dateTime': start_time, 'timeZone': 'Asia/Kolkata'},
            'end': {'dateTime': end_time, 'timeZone': 'Asia/Kolkata'},
            'description': description,
            'conferenceData': {
                'createRequest': {'requestId': "sample123"}
            }
        }
        if attendees:
            event['attendees'] = [{'email': email} for email in attendees]
        
        created_event = calendar_service.events().insert(calendarId='primary', body=event, sendUpdates='all', conferenceDataVersion=1).execute()
        return f"Event created successfully! I have sent an invitation to all attendees. View it here: {created_event.get('htmlLink')}"
    except Exception as e:
        return f"An error occurred: {e}"

@tool
def find_free_time_slots(duration_minutes: int, day: str) -> str:
    """
    Finds available time slots of a specific duration on a given day in your primary calendar.

    Args:
        duration_minutes (int): The desired duration of the meeting in minutes.
        day (str): The day to check for free slots, e.g., 'today', 'tomorrow', or a date like '2025-07-28'.
    
    Returns:
        str: A list of available start times for the meeting.
    """
    today = datetime.date.today()
    if day.lower() == 'today':
        check_date = today
    elif day.lower() == 'tomorrow':
        check_date = today + datetime.timedelta(days=1)
    else:
        try:
            check_date = datetime.datetime.strptime(day, '%Y-%m-%d').date()
        except ValueError:
            return "Invalid day format. Please use 'today', 'tomorrow', or 'YYYY-MM-DD'."

    time_min = datetime.datetime.combine(check_date, datetime.time(9, 0)).isoformat() + 'Z'
    time_max = datetime.datetime.combine(check_date, datetime.time(18, 0)).isoformat() + 'Z'

    try:
        _, calendar_service = get_google_service()
        freebusy_query = {
            "timeMin": time_min,
            "timeMax": time_max,
            "timeZone": "Asia/Kolkata",
            "items": [{"id": "primary"}]
        }
        result = calendar_service.freebusy().query(body=freebusy_query).execute()
        busy_slots = result['calendars']['primary']['busy']
        
        if not busy_slots:
            return f"The entire day ({check_date.isoformat()} from 9 AM to 6 PM) is free."
        return f"Here are the busy slots for {check_date.isoformat()}: {busy_slots}. Find a gap of {duration_minutes} minutes and propose it to the user."
    except Exception as e:
        return f"An error occurred while checking free time: {e}"

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Sends an email to a recipient."""
    try:
        gmail_service, _ = get_google_service()
        message = EmailMessage()
        message.set_content(body)
        message["To"] = to
        message["Subject"] = subject
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {'raw': encoded_message}
        send_message = gmail_service.users().messages().send(userId="me", body=create_message).execute()
        return f"Email sent successfully! Message ID: {send_message['id']}"
    except Exception as e:
        return f"An error occurred: {e}"

@tool
def create_email_draft(to: str, subject: str, body: str) -> str:
    """Creates a draft email in your Gmail account."""
    try:
        gmail_service, _ = get_google_service()
        message = EmailMessage()
        message.set_content(body)
        message["To"] = to
        message["Subject"] = subject
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {'message': {'raw': encoded_message}}
        draft = gmail_service.users().drafts().create(userId="me", body=create_message).execute()
        return f"Draft created successfully! Draft ID: {draft['id']}"
    except Exception as e:
        return f"An error occurred: {e}"

@tool
def list_emails(query: str = 'is:unread in:inbox', max_results: int = 5) -> str:
    """Lists emails from your Gmail inbox based on a search query."""
    try:
        gmail_service, _ = get_google_service()
        results = gmail_service.users().messages().list(userId='me', q=query, maxResults=max_results).execute()
        messages = results.get('messages', [])
        if not messages:
            return "No emails found matching the query."
        email_summaries = []
        for msg in messages:
            msg_data = gmail_service.users().messages().get(userId='me', id=msg['id']).execute()
            headers = msg_data['payload']['headers']
            subject = next(header['value'] for header in headers if header['name'] == 'Subject')
            sender = next(header['value'] for header in headers if header['name'] == 'From')
            email_summaries.append(f"ID: {msg['id']}, From: {sender}, Subject: '{subject}', Snippet: {msg_data['snippet']}")
        return "\n".join(email_summaries)
    except Exception as e:
        return f"An error occurred: {e}"

# --- AGENT SETUP ---
tools = [
    schedule_calendar_event,
    find_free_time_slots,
    send_email,
    create_email_draft,
    list_emails
]

llm = AzureChatOpenAI(
    azure_deployment=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
    openai_api_version=os.getenv("OPENAI_API_VERSION", "2024-12-01-preview"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    temperature=0
)

prompt = ChatPromptTemplate.from_messages([
    ("system", f"You are a powerful assistant. The current date is {datetime.date.today().strftime('%B %d, %Y')}. "
               "When asked to schedule a meeting, your primary goal is to get it on the calendar with all correct details. "
               "Follow this logic: "
               "1. **Analyze the Request:** Does the user provide a specific time (e.g., 'at 11 am')? "
               "2. **If a time IS provided:** Do NOT use the `find_free_time_slots` tool. Directly use the `schedule_calendar_event` tool. Make sure to include the title, time, and any attendees mentioned. "
               "3. **If a time IS NOT provided:** THEN use the `find_free_time_slots` tool to find available slots and propose them to the user. "
               "4. **Memory:** Remember all details from the user's original request (like attendee names and emails) throughout the conversation, even if you have to ask for clarification on the time. "
               "5. **Confirmation:** After scheduling, confirm with the user that the event has been created and that invitations have been sent."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_openai_tools_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# --- API ROUTES ---

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "AI Agent API is running"})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400
        
        user_message = data['message']
        user_id = data.get('user_id')  # Optional for logging
        
        print(f"Received message from user {user_id}: {user_message}")
        
        # Process message with LangChain agent
        result = agent_executor.invoke({"input": user_message})
        
        response = {
            "message": result['output'],
            "success": True,
            "user_id": user_id
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            "error": "Failed to process request",
            "details": str(e),
            "success": False
        }), 500

@app.route('/test-tools', methods=['GET'])
def test_tools():
    """Test endpoint to verify tools are working"""
    try:
        # Test calendar service
        _, calendar_service = get_google_service()
        
        return jsonify({
            "status": "success",
            "message": "All tools initialized successfully",
            "tools": [tool.name for tool in tools]
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Tool initialization failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Check required environment variables
    required_vars = [
        'AZURE_OPENAI_ENDPOINT',
        'AZURE_OPENAI_API_KEY', 
        'AZURE_OPENAI_CHAT_DEPLOYMENT_NAME',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_REFRESH_TOKEN'
    ]
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        print(f"Missing required environment variables: {missing_vars}")
        exit(1)
    
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)