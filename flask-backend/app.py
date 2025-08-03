from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from agent import run_agent_once

app = Flask(__name__)
CORS(app, origins=['*'])  # Allow all origins for production

def verify_api_key():
    """Verify the API key from the Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return False
    
    token = auth_header.split(' ')[1]
    expected_key = os.getenv('AGENT_API_SECRET_KEY')
    
    if not expected_key:
        print("ERROR: AGENT_API_SECRET_KEY not set in environment")
        return False
    
    return token == expected_key

# --- API ROUTES ---

@app.route('/invoke', methods=['POST'])
def invoke_agent():
    """Main endpoint to invoke the AI agent"""
    
    # Verify API key
    if not verify_api_key():
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON body provided"}), 400
        
        if 'input' not in data:
            return jsonify({"error": "Missing 'input' field"}), 400
            
        if 'token' not in data:
            return jsonify({"error": "Missing 'token' field"}), 400
        
        user_input = data['input']
        google_token_data = data['token']
        
        print(f"Processing request: {user_input}")
        
        # Call the agent
        result = run_agent_once(user_input, google_token_data)
        
        return jsonify({
            "success": True,
            "result": result
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            "error": "Failed to process request",
            "details": str(e),
            "success": False
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "AI Agent API is running"})

if __name__ == '__main__':
    # Check required environment variables
    required_vars = [
        'AZURE_OPENAI_ENDPOINT',
        'AZURE_OPENAI_API_KEY', 
        'AZURE_OPENAI_CHAT_DEPLOYMENT_NAME',
        'AGENT_API_SECRET_KEY'
    ]
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        print(f"Missing required environment variables: {missing_vars}")
        exit(1)
    
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)