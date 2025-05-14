import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {TechnologyFieldFilter} from './TechnologyFieldFilter';
import {searchReducer} from '@features/patentSearch/model/searchSlice';

// Мокаем RTK Query хуки
vi.mock('@entities/technologyField', () => ({
  technologyFieldApiSlice: {
    useGetTechnologyFieldsQuery: () => ({
      data: [
        {id: 1, name: 'Информационные технологии'},
        {id: 2, name: 'Машиностроение'},
        {id: 3, name: 'Химия'}
      ],
      isLoading: false
    }),
    useAddTechnologyFieldMutation: () => [
      vi.fn(),
      {isLoading: false, isSuccess: false, isError: false}
    ],
    useEditTechnologyFieldMutation: () => [
      vi.fn(),
      {isLoading: false, isSuccess: false, isError: false}
    ],
    useDeleteTechnologyFieldMutation: () => [
      vi.fn(),
      {isLoading: false, isSuccess: false, isError: false}
    ],
    useLazyGetDeletableTechnologyFieldsQuery: () => [
      vi.fn(),
      {data: [1, 2], isLoading: false}
    ]
  }
}));

vi.mock('@entities/user/api/userApiSlice', () => ({
  userApiSlice: {
    useGetMeQuery: () => ({
      data: {id: 1, name: 'Test User'}
    })
  }
}));

describe('TechnologyFieldFilter', () => {
  const store = configureStore({
    reducer: {
      searchReducer
    }
  });

  const renderWithProvider = (component: React.ReactNode) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  it('renders filter with title and technology fields', () => {
    renderWithProvider(<TechnologyFieldFilter/>);

    expect(screen.getByText('По области техники')).toBeInTheDocument();
    expect(screen.getByText('Информационные технологии')).toBeInTheDocument();
    expect(screen.getByText('Машиностроение')).toBeInTheDocument();
    expect(screen.getByText('Химия')).toBeInTheDocument();
  });

  it('dispatches filter action when technology field is selected', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderWithProvider(<TechnologyFieldFilter/>);

    fireEvent.click(screen.getByText('Информационные технологии'));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'search/setTechnologyFieldFilter',
      payload: 1
    });
  });

  it('dispatches remove filter action when technology field is deselected', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderWithProvider(<TechnologyFieldFilter/>);

    // Сначала выбираем область
    fireEvent.click(screen.getByText('Информационные технологии'));
    // Затем снимаем выбор
    fireEvent.click(screen.getByText('Информационные технологии'));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'search/removeTechnologyFieldFilter',
      payload: 1
    });
  });
});
