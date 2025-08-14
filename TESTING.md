# OdinView Manual Testing Guide

## Prerequisites

1. **Get a Gemini API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key for testing

## Running the Application

1. **Start the application**:
   ```bash
   npm run dev
   ```
   This will:
   - Compile TypeScript to JavaScript
   - Launch the Electron application
   - Open the chat interface

2. **Alternative start method**:
   ```bash
   npm run build
   npm start
   ```

## Test Scenarios

### 1. Basic Configuration Test
**Goal**: Verify API key management works

1. App should load with the chat interface
2. Try to send a message without configuring API key
3. **Expected**: Should see error message about missing API key
4. Go to settings (you'll need to manually load `index.html` for now)
5. Enter your Gemini API key
6. Save the key
7. **Expected**: Success message appears

### 2. First Conversation Test
**Goal**: Verify basic AI integration works

1. After configuring API key, go back to chat interface
2. Type a simple message: "Hello, can you tell me what you are?"
3. Click Send or press Enter
4. **Expected**: 
   - Input field and button should disable during API call
   - Response from Gemini should appear
   - Interface should re-enable for next message

### 3. Conversation Memory Test
**Goal**: Verify conversation history is maintained

1. Send: "My name is [YourName]"
2. Wait for response
3. Send: "What is my name?"
4. **Expected**: Gemini should remember your name from the previous message

### 4. Error Handling Test
**Goal**: Verify error scenarios work properly

1. **Invalid API Key Test**:
   - Go to settings and enter invalid API key (e.g., "invalid_key")
   - Try to send a message
   - **Expected**: Clear error message about invalid API key

2. **Network Error Test**:
   - Disconnect internet temporarily
   - Send a message
   - **Expected**: Network error should be handled gracefully

## What to Look For

### ✅ Success Indicators:
- App launches without crashes
- API key can be saved and retrieved
- Messages send successfully
- Responses appear in chat interface
- Conversation history is maintained
- Error messages are user-friendly

### ❌ Issues to Report:
- App crashes or won't start
- API key settings don't save
- Messages don't send
- No responses from AI
- Error messages are unclear
- Interface freezes during API calls

## Console Debugging

Open Developer Tools (F12) to see console logs:
- Look for "Sending prompt to Gemini with X history items..."
- Check for any red error messages
- Database initialization messages should appear

## Troubleshooting

**App won't start**: 
- Check that TypeScript compiled: `npm run build`
- Verify all dependencies: `npm install`

**API calls fail**:
- Verify API key is correct
- Check internet connection
- Look at console for detailed error messages

**Database errors**:
- Check that app has write permissions
- Look for database file in user data directory

## Testing Completion

Once you've verified these scenarios work, the application is ready for commit!