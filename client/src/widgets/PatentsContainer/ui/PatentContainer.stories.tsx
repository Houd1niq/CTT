import type {Meta, StoryObj} from '@storybook/react';
import {PatentContainer} from './PatentContainer';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {searchReducer} from '@features/patentSearch/model/searchSlice';
import {SearchSliceState} from '@features/patentSearch/model/types';
import {patentsApiSlice} from '@entities/patent/api/patentsApiSlice';
import {authReducer} from '@features/auth';
import {http, HttpResponse} from 'msw';

const initialState: SearchSliceState = {
  patentTypeFilters: [],
  technologyFieldFilters: [],
  page: 1,
  totalPages: 5,
  searchQuery: '',
  patentSort: ''
};

const store = configureStore({
  reducer: {
    searchReducer,
    [patentsApiSlice.reducerPath]: patentsApiSlice.reducer,
    authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(patentsApiSlice.middleware),
  preloadedState: {
    searchReducer: initialState
  }
});

const meta: Meta<typeof PatentContainer> = {
  title: 'Widgets/PatentContainer',
  component: PatentContainer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story/>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('http://localhost:5000/patents', () => {
          return HttpResponse.json({
            patents: [],
            totalPages: 0
          });
        }),
        http.get('http://localhost:5000/technology-fields', () => {
          return HttpResponse.json([]);
        }),
        http.get('http://localhost:5000/patent-types', () => {
          return HttpResponse.json([]);
        })
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PatentContainer>;
export const WithData: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Контейнер с патентами, содержащий список патентов'
      }
    },
    msw: {
      handlers: [
        http.get('http://localhost:5000/patent?page=1', () => {
          return HttpResponse.json({
            patents: [
              {
                id: 1,
                patentNumber: 'RU123456',
                name: 'Тестовый патент 1',
                dateOfRegistration: '2024-01-01',
                dateOfExpiration: '2034-01-01',
                contact: 'test@example.com',
                isPrivate: false,
                patentLink: 'patent1.pdf',
                patentType: {id: 1, name: 'Изобретение'},
                technologyField: {id: 1, name: 'Нанотехнологии'}
              },
              {
                id: 2,
                patentNumber: 'RU789012',
                name: 'Тестовый патент 2',
                dateOfRegistration: '2024-02-01',
                dateOfExpiration: '2034-02-01',
                contact: 'test2@example.com',
                isPrivate: true,
                patentLink: 'patent2.pdf',
                patentType: {id: 2, name: 'Полезная модель'},
                technologyField: {id: 2, name: 'Информационные технологии'}
              }
            ],
            totalPages: 1
          });
        }),
        http.get('http://localhost:5000/technology-field', () => {
          return HttpResponse.json([
            {id: 1, name: 'Нанотехнологии'},
            {id: 2, name: 'Информационные технологии'}
          ]);
        }),
        http.get('http://localhost:5000/patent-type', () => {
          return HttpResponse.json([
            {id: 1, name: 'Изобретение'},
            {id: 2, name: 'Полезная модель'}
          ]);
        })
      ],
    },
  }
};
