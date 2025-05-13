import type {Meta, StoryObj} from '@storybook/react';
import {Notification} from './Notification';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import notificationReducer, {setNotificationState} from '@shared/model/notification/notificationSlice';

const store = configureStore({
  reducer: {
    notificationReducer
  }
});

const meta: Meta<typeof Notification> = {
  title: 'Features/Notification',
  component: Notification,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story/>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Success: Story = {
  args: {},
  play: async () => {
    store.dispatch(setNotificationState({
      type: 'success',
      message: 'Операция успешно выполнена'
    }));
  }
};

export const Error: Story = {
  args: {},
  play: async () => {
    store.dispatch(setNotificationState({
      type: 'error',
      message: 'Произошла ошибка при выполнении операции'
    }));
  }
};
