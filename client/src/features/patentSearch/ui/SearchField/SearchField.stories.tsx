import type {Meta, StoryObj} from '@storybook/react';
import {SearchField} from './SearchField';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {searchReducer} from '@features/patentSearch/model/searchSlice';

const store = configureStore({
  reducer: {
    searchReducer
  }
});

const meta: Meta<typeof SearchField> = {
  title: 'Features/SearchField',
  component: SearchField,
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
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  args: {},
};
