import type {Meta, StoryObj} from '@storybook/react';
import {Header} from './Header';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {userApiSlice} from '@entities/user/api/userApiSlice';
import {authReducer} from "@features/auth";
import {http, HttpResponse} from "msw";

const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware)
});

const meta: Meta<typeof Header> = {
  title: 'Widgets/Header',
  component: Header,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story/>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story/>
      </Provider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Шапка сайта без авторизованного пользователя'
      }
    },
    msw: {
      handlers: [
        http.get('http://localhost:5000/user/info', () => {
          return new HttpResponse(null, {
            status: 401,
          });
        }),
      ],
    }
  }
};

export const WithUser: Story = {
  args: {},
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story/>
      </Provider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Шапка сайта с авторизованным пользователем и кнопкой выхода'
      }
    },
    msw: {
      handlers: [
        http.get('http://localhost:5000/user/info', () => {
          return HttpResponse.json({email: 'test@mail.ru', id: 1});
        }),
      ],
    },
  }
};
