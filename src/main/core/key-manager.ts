import keytar from 'keytar';

const SERVICE_NAME = 'OdinView';

// This class handles all secure key storage and retrieval using the OS keychain.
export class KeyManager {
  private static instance: KeyManager;

  private constructor() {}

  public static getInstance(): KeyManager {
    if (!KeyManager.instance) {
      KeyManager.instance = new KeyManager();
    }
    return KeyManager.instance;
  }

  async saveApiKeys(keys: { openai: string; gemini: string }): Promise<void> {
    console.log('Saving API keys to keychain...');
    if (keys.openai) await keytar.setPassword(SERVICE_NAME, 'openai', keys.openai);
    if (keys.gemini) await keytar.setPassword(SERVICE_NAME, 'gemini', keys.gemini);
    console.log('API keys saved successfully.');
  }

  async getApiKeys(): Promise<{ openai: string | null; gemini: string | null }> {
    console.log('Retrieving API keys from keychain...');
    const openai = await keytar.getPassword(SERVICE_NAME, 'openai');
    const gemini = await keytar.getPassword(SERVICE_NAME, 'gemini');
    return { openai, gemini };
  }
}