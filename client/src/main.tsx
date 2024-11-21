import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './pages/MainPage/App.tsx';
import './index.scss';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Authorization from './pages/Authorization/Authorization.tsx';
import Forgot from './pages/Forgot/Forgot.tsx';
import EmailConfirm from './pages/EmailConfirm/EmailConfirm.tsx';
import {Provider} from 'react-redux'
import {store} from "./store/store.ts";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
  },
  {
    path: '/auth',
    element: <Authorization/>,
  },
  {
    path: '/forgot',
    element: <Forgot/>,
  },
  {
    path: '/emailConfirm',
    element: <EmailConfirm/>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
);
