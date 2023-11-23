import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ActionProvider } from './contexts/useActionContext'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <ActionProvider>
            <App />
        </ActionProvider>
    </React.StrictMode>
)
