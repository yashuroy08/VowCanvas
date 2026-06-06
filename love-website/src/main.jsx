import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, useSearchParams } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Builder from './pages/Builder.jsx'
import LandingPage from './pages/LandingPage.jsx'

function HomeRoute() {
  const [searchParams] = useSearchParams();
  if (searchParams.has('d')) {
    return <App />;
  }
  return <LandingPage />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
  },
  {
    path: "/create",
    element: <Builder />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

// Register Service Worker for client-side image/asset caching and offline loading
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('ServiceWorker registered successfully:', reg.scope))
      .catch(err => console.error('ServiceWorker registration failed:', err));
  });
}


