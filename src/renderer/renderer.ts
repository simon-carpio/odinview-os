// This file handles the logic for the main chat interface.

// --- Type Declarations for our API ---
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
declare global {
  interface Window {
    electronAPI: {
      sendPrompt: (messages: ChatMessage[]) => Promise<ChatMessage>;
    }
  }
}

// --- DOM Elements ---
const messagesDiv = document.getElementById('messages');
const promptInput = document.getElementById('prompt-input') as HTMLInputElement;
const sendBtn = document.getElementById('send-btn');

// This will hold the state of our conversation
const conversationHistory: ChatMessage[] = [];

// --- Functions ---
function addMessageToUI(message: ChatMessage) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', message.role);
  messageElement.textContent = message.content;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
}

async function handleSendPrompt() {
  const content = promptInput.value.trim();
  if (!content) return;

  const userMessage: ChatMessage = { role: 'user', content };
  addMessageToUI(userMessage);
  conversationHistory.push(userMessage);
  promptInput.value = '';
  promptInput.disabled = true;
  sendBtn.disabled = true;

  try {
    const assistantMessage = await window.electronAPI.sendPrompt(conversationHistory);
    addMessageToUI(assistantMessage);
    conversationHistory.push(assistantMessage);
  } catch (error) {
    const errorMessage: ChatMessage = { role: 'assistant', content: `Error: ${error.message}` };
    addMessageToUI(errorMessage);
  } finally {
    promptInput.disabled = false;
    sendBtn.disabled = false;
    promptInput.focus();
  }
}

// --- Event Listeners ---
sendBtn.addEventListener('click', handleSendPrompt);
promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSendPrompt();
  }
});