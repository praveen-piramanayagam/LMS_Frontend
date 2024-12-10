// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';  // Import your Tailwind CSS file
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
