import type {Meta, StoryObj} from '@storybook/react';
import {Pagination} from './Pagination';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {searchReducer} from '@features/patentSearch/model/searchSlice';
import {SearchSliceState} from '@features/patentSearch/model/types';

const initialState: SearchSliceState = {
  patentTypeFilters: [],
  technologyFieldFilters: [],
  instituteFilters: [],
  page: 1,
  totalPages: 5,
  searchQuery: '',
  patentSort: ''
};

const store = configureStore({
  reducer: {
    searchReducer
  },
  preloadedState: {
    searchReducer: initialState
  }
});

const meta: Meta<typeof Pagination> = {
  title: 'Features/Pagination',
  component: Pagination,
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
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {},
};
