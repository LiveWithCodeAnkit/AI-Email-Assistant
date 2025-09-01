import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'  // use 'react-router-dom' for web
import App from './App.jsx'
import EmailAgentPage from './pages/EmailAgentPage.jsx'
import UpworkProposalsPage from './pages/UpworkProposalsPage.jsx'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/agent', element: <EmailAgentPage /> },
  { path: '/upwork', element: <UpworkProposalsPage /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
