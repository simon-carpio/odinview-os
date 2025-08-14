import { KeyManager } from '../../src/core/key-manager'

// Mock the keytar module
jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest.fn(),
  deletePassword: jest.fn(),
}))

import * as keytar from 'keytar'

const mockedKeytar = keytar as jest.Mocked<typeof keytar>

describe('KeyManager', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    
    // Reset the singleton instance before each test
    // @ts-ignore - Access private property for testing
    KeyManager['instance'] = undefined
  })

  describe('getInstance()', () => {
    it('should return the same instance when called multiple times (singleton pattern)', () => {
      const instance1 = KeyManager.getInstance()
      const instance2 = KeyManager.getInstance()
      
      expect(instance1).toBe(instance2)
      expect(instance1).toBeInstanceOf(KeyManager)
    })
  })

  describe('saveApiKey()', () => {
    it('should successfully save a key for a new service', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'openai'
      const apiKey = 'sk-test123456789'
      
      mockedKeytar.setPassword.mockResolvedValue()
      
      await keyManager.saveApiKey(service, apiKey)
      
      expect(mockedKeytar.setPassword).toHaveBeenCalledWith('OdinView', service, apiKey)
    })

    it('should successfully update the key for an existing service', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'gemini'
      const oldApiKey = 'old-key-123'
      const newApiKey = 'new-key-456'
      
      mockedKeytar.setPassword.mockResolvedValue()
      
      // Save the old key
      await keyManager.saveApiKey(service, oldApiKey)
      expect(mockedKeytar.setPassword).toHaveBeenCalledWith('OdinView', service, oldApiKey)
      
      // Update with new key
      await keyManager.saveApiKey(service, newApiKey)
      expect(mockedKeytar.setPassword).toHaveBeenCalledWith('OdinView', service, newApiKey)
      
      expect(mockedKeytar.setPassword).toHaveBeenCalledTimes(2)
    })

    it('should throw an error if keytar.setPassword fails', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'openai'
      const apiKey = 'sk-test123456789'
      const error = new Error('Keychain access denied')
      
      mockedKeytar.setPassword.mockRejectedValue(error)
      
      await expect(keyManager.saveApiKey(service, apiKey)).rejects.toThrow('Keychain access denied')
      expect(mockedKeytar.setPassword).toHaveBeenCalledWith('OdinView', service, apiKey)
    })
  })

  describe('getApiKey()', () => {
    it('should successfully retrieve a saved key', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'openai'
      const apiKey = 'sk-test123456789'
      
      mockedKeytar.getPassword.mockResolvedValue(apiKey)
      
      const result = await keyManager.getApiKey(service)
      
      expect(result).toBe(apiKey)
      expect(mockedKeytar.getPassword).toHaveBeenCalledWith('OdinView', service)
    })

    it('should return null for a service that has no key', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'nonexistent'
      
      mockedKeytar.getPassword.mockResolvedValue(null)
      
      const result = await keyManager.getApiKey(service)
      
      expect(result).toBeNull()
      expect(mockedKeytar.getPassword).toHaveBeenCalledWith('OdinView', service)
    })

    it('should throw an error if keytar.getPassword fails', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'openai'
      const error = new Error('Keychain access denied')
      
      mockedKeytar.getPassword.mockRejectedValue(error)
      
      await expect(keyManager.getApiKey(service)).rejects.toThrow('Keychain access denied')
      expect(mockedKeytar.getPassword).toHaveBeenCalledWith('OdinView', service)
    })
  })

  describe('deleteApiKey()', () => {
    it('should successfully delete a saved key', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'openai'
      
      mockedKeytar.deletePassword.mockResolvedValue(true)
      
      const result = await keyManager.deleteApiKey(service)
      
      expect(result).toBe(true)
      expect(mockedKeytar.deletePassword).toHaveBeenCalledWith('OdinView', service)
    })

    it('should not throw an error when attempting to delete a non-existent key', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'nonexistent'
      
      mockedKeytar.deletePassword.mockResolvedValue(false)
      
      const result = await keyManager.deleteApiKey(service)
      
      expect(result).toBe(false)
      expect(mockedKeytar.deletePassword).toHaveBeenCalledWith('OdinView', service)
    })

    it('should throw an error if keytar.deletePassword fails', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'openai'
      const error = new Error('Keychain access denied')
      
      mockedKeytar.deletePassword.mockRejectedValue(error)
      
      await expect(keyManager.deleteApiKey(service)).rejects.toThrow('Keychain access denied')
      expect(mockedKeytar.deletePassword).toHaveBeenCalledWith('OdinView', service)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete save -> retrieve -> delete workflow', async () => {
      const keyManager = KeyManager.getInstance()
      const service = 'openai'
      const apiKey = 'sk-test123456789'
      
      // Mock all operations
      mockedKeytar.setPassword.mockResolvedValue()
      mockedKeytar.getPassword.mockResolvedValue(apiKey)
      mockedKeytar.deletePassword.mockResolvedValue(true)
      
      // Save key
      await keyManager.saveApiKey(service, apiKey)
      expect(mockedKeytar.setPassword).toHaveBeenCalledWith('OdinView', service, apiKey)
      
      // Retrieve key
      const retrieved = await keyManager.getApiKey(service)
      expect(retrieved).toBe(apiKey)
      expect(mockedKeytar.getPassword).toHaveBeenCalledWith('OdinView', service)
      
      // Delete key
      const deleted = await keyManager.deleteApiKey(service)
      expect(deleted).toBe(true)
      expect(mockedKeytar.deletePassword).toHaveBeenCalledWith('OdinView', service)
    })

    it('should handle multiple services independently', async () => {
      const keyManager = KeyManager.getInstance()
      const openaiKey = 'sk-openai123'
      const geminiKey = 'gm-gemini456'
      
      mockedKeytar.setPassword.mockResolvedValue()
      mockedKeytar.getPassword
        .mockResolvedValueOnce(openaiKey)
        .mockResolvedValueOnce(geminiKey)
      
      // Save keys for different services
      await keyManager.saveApiKey('openai', openaiKey)
      await keyManager.saveApiKey('gemini', geminiKey)
      
      expect(mockedKeytar.setPassword).toHaveBeenCalledWith('OdinView', 'openai', openaiKey)
      expect(mockedKeytar.setPassword).toHaveBeenCalledWith('OdinView', 'gemini', geminiKey)
      
      // Retrieve keys independently
      const retrievedOpenai = await keyManager.getApiKey('openai')
      const retrievedGemini = await keyManager.getApiKey('gemini')
      
      expect(retrievedOpenai).toBe(openaiKey)
      expect(retrievedGemini).toBe(geminiKey)
    })
  })
})