import * as keytar from 'keytar'

/**
 * KeyManager is a singleton class that provides secure API key management
 * using the OS keychain via the keytar library.
 */
export class KeyManager {
  private static instance: KeyManager
  private readonly serviceName = 'OdinView'

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Gets the singleton instance of KeyManager
   */
  public static getInstance(): KeyManager {
    if (!KeyManager.instance) {
      KeyManager.instance = new KeyManager()
    }
    return KeyManager.instance
  }

  /**
   * Saves an API key for the specified service
   * @param service The service name (e.g., 'openai', 'gemini')
   * @param apiKey The API key to save
   */
  public async saveApiKey(service: string, apiKey: string): Promise<void> {
    try {
      await keytar.setPassword(this.serviceName, service, apiKey)
    } catch (error) {
      throw error
    }
  }

  /**
   * Retrieves an API key for the specified service
   * @param service The service name (e.g., 'openai', 'gemini')
   * @returns The API key if found, null if not found
   */
  public async getApiKey(service: string): Promise<string | null> {
    try {
      return await keytar.getPassword(this.serviceName, service)
    } catch (error) {
      throw error
    }
  }

  /**
   * Deletes an API key for the specified service
   * @param service The service name (e.g., 'openai', 'gemini')
   * @returns true if the key was deleted, false if it didn't exist
   */
  public async deleteApiKey(service: string): Promise<boolean> {
    try {
      return await keytar.deletePassword(this.serviceName, service)
    } catch (error) {
      throw error
    }
  }
}