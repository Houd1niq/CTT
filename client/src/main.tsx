import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Authorization from './Authorization.tsx';
import Forgot from './Forgot.tsx';
import EmailConfirm from './EmailConfirm.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/auth',
    element: <Authorization />,
  },
  {
    path: '/forgot',
    element: <Forgot />,
  },
  {
    path: '/emailConfirm',
    element: <EmailConfirm />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/*<App />*/}
  </StrictMode>,
);
