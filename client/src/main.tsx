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
import {Notification} from "./components/Notification/Notification.tsx";
import Reset from "./pages/Reset/Reset.tsx";

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
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Notification/>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
);

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://localhost:3000') {
    console.warn('Непредвиденное сообщение:', event);
    return;
  }

  console.log('Получено сообщение:', event.data);
  console.log(event)

  // Ответное сообщение
  // event.source.postMessage({ action: 'response', payload: 'Hello back!' }, event.origin);
});
