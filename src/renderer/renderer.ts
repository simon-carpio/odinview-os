// This file handles the logic for our settings page (the renderer process).

// We need to declare this global variable to TypeScript
declare global {
  interface Window {
    electronAPI: {
      saveApiKeys: (keys: { openai: string; gemini: string }) => Promise<void>;
      getApiKeys: () => Promise<{ openai: string | null; gemini: string | null }>;
    }
  }
}

const openaiKeyInput = document.getElementById('openai-key') as HTMLInputElement;
const geminiKeyInput = document.getElementById('gemini-key') as HTMLInputElement;
const saveBtn = document.getElementById('save-btn');
const statusMessage = document.getElementById('status-message');

saveBtn.addEventListener('click', async () => {
  const keys = {
    openai: openaiKeyInput.value,
    gemini: geminiKeyInput.value,
  };
  await window.electronAPI.saveApiKeys(keys);
  statusMessage.textContent = 'API keys saved successfully!';
  setTimeout(() => (statusMessage.textContent = ''), 3000);
});

// On page load, get existing keys and populate the fields
async function loadApiKeys() {
  const keys = await window.electronAPI.getApiKeys();
  if (keys.openai) {
    openaiKeyInput.value = keys.openai;
  }
  if (keys.gemini) {
    geminiKeyInput.value = keys.gemini;
  }
}

loadApiKeys();