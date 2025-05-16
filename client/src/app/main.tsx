import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '../pages/MainPage/App.tsx';
import './index.scss';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Authorization from '../pages/Authorization/Authorization.tsx';
import Forgot from '../pages/Forgot/Forgot.tsx';
import EmailConfirm from '../pages/EmailConfirm/EmailConfirm.tsx';
import {Provider} from 'react-redux'
import {store} from "./store/store.ts";
import {Notification} from "@features/notifications/ui/Notification.tsx";
import Reset from "../pages/Reset/Reset.tsx";
import Admin from "../pages/Admin/Admin.tsx";
import {AdminRequired} from "@app/router/AdminRequired.tsx";

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
    path: '/reset',
    element: <Reset/>,
  },
  {
    path: '/forgot',
    element: <Forgot/>,
  },
  {
    path: '/confirm',
    element: <EmailConfirm/>,
  },
  {
    path: '/admin',
    element: <AdminRequired><Admin/></AdminRequired>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Notification/>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
);
