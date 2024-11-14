import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ChatProvider from './context/ChatProvider.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ChatProvider>
    </AuthProvider>
  </StrictMode>,
)
