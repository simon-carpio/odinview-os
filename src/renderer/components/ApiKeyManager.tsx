import React, { useState } from 'react'

interface ApiKeyFormData {
  service: 'openai' | 'gemini'
  apiKey: string
}

const ApiKeyManager: React.FC = () => {
  const [formData, setFormData] = useState<ApiKeyFormData>({
    service: 'openai',
    apiKey: ''
  })
  
  const [retrievedKey, setRetrievedKey] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    if (!formData.apiKey.trim()) {
      setStatus('Please enter an API key')
      return
    }

    setIsLoading(true)
    try {
      const response = await window.electronAPI.saveApiKey(formData.service, formData.apiKey)
      if (response.success) {
        setStatus(`✅ API key for ${formData.service} saved successfully`)
        setFormData(prev => ({ ...prev, apiKey: '' }))
      } else {
        setStatus(`❌ Error saving API key: ${response.error}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetrieve = async () => {
    setIsLoading(true)
    try {
      const response = await window.electronAPI.getApiKey(formData.service)
      if (response.success) {
        if (response.data) {
          setRetrievedKey(response.data)
          setStatus(`✅ Retrieved API key for ${formData.service}`)
        } else {
          setRetrievedKey('')
          setStatus(`ℹ️ No API key found for ${formData.service}`)
        }
      } else {
        setStatus(`❌ Error retrieving API key: ${response.error}`)
        setRetrievedKey('')
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setRetrievedKey('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await window.electronAPI.deleteApiKey(formData.service)
      if (response.success) {
        if (response.data === 'deleted') {
          setStatus(`✅ API key for ${formData.service} deleted successfully`)
        } else {
          setStatus(`ℹ️ No API key found for ${formData.service} to delete`)
        }
        setRetrievedKey('')
      } else {
        setStatus(`❌ Error deleting API key: ${response.error}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '500px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h2>API Key Management</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Service:
        </label>
        <select
          name="service"
          value={formData.service}
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          disabled={isLoading}
        >
          <option value="openai">OpenAI</option>
          <option value="gemini">Gemini</option>
        </select>

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          API Key:
        </label>
        <input
          type="text"
          name="apiKey"
          value={formData.apiKey}
          onChange={handleInputChange}
          placeholder={`Enter your ${formData.service} API key`}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '15px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          disabled={isLoading}
        />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={handleRetrieve}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Loading...' : 'Retrieve'}
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {retrievedKey && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>Retrieved API Key:</strong>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            wordBreak: 'break-all',
            marginTop: '5px',
            padding: '5px',
            backgroundColor: '#e9ecef',
            borderRadius: '2px'
          }}>
            {retrievedKey}
          </div>
        </div>
      )}

      {status && (
        <div style={{
          padding: '10px',
          backgroundColor: status.includes('❌') ? '#f8d7da' : 
                          status.includes('✅') ? '#d4edda' : '#d1ecf1',
          border: `1px solid ${status.includes('❌') ? '#f5c6cb' : 
                                status.includes('✅') ? '#c3e6cb' : '#bee5eb'}`,
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {status}
        </div>
      )}
    </div>
  )
}

export default ApiKeyManager