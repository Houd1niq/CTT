import type {Meta, StoryObj} from '@storybook/react';
import {SortContainer} from './SortContainer';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {searchReducer} from '@features/patentSearch/model/searchSlice';

const store = configureStore({
  reducer: {
    searchReducer
  }
});

const meta: Meta<typeof SortContainer> = {
  title: 'Features/SortContainer',
  component: SortContainer,
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
type Story = StoryObj<typeof SortContainer>;

export const Default: Story = {
  args: {},
};
