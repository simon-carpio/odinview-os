import React from 'react'
import ApiKeyManager from './components/ApiKeyManager'

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>OdinView</h1>
      <p>Local-First AI Companion</p>
      
      <ApiKeyManager />
    </div>
  )
}

export default App