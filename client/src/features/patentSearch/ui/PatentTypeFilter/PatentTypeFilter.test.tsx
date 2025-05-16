import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {PatentTypeFilter} from './PatentTypeFilter';
import {searchReducer} from '@features/patentSearch/model/searchSlice';

// Мокаем RTK Query хуки
vi.mock('@entities/patentType', () => ({
  patentTypeApiSlice: {
    useGetPatentTypesQuery: () => ({
      data: [
        {id: 1, name: 'Изобретение'},
        {id: 2, name: 'Полезная модель'},
        {id: 3, name: 'Промышленный образец'}
      ],
      isLoading: false
    }),
    useAddPatentTypeMutation: () => [
      vi.fn(),
      {isLoading: false, isSuccess: false, isError: false}
    ],
    useEditPatentTypeMutation: () => [
      vi.fn(),
      {isLoading: false, isSuccess: false, isError: false}
    ],
    useDeletePatentTypeMutation: () => [
      vi.fn(),
      {isLoading: false, isSuccess: false, isError: false}
    ],
    useLazyGetDeletablePatentTypesQuery: () => [
      vi.fn(),
      {data: [1, 2], isLoading: false}
    ]
  }
}));

vi.mock('@entities/user/api/userApiSlice', () => ({
  userApiSlice: {
    useGetMeQuery: () => ({
      data: {id: 1, name: 'Test User', role: {name: 'admin'}}
    })
  }
}));

describe('PatentTypeFilter', () => {
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

  it('renders filter with title and patent types', () => {
    renderWithProvider(<PatentTypeFilter/>);

    expect(screen.getByText('По видам')).toBeInTheDocument();
    expect(screen.getByText('Изобретение')).toBeInTheDocument();
    expect(screen.getByText('Полезная модель')).toBeInTheDocument();
    expect(screen.getByText('Промышленный образец')).toBeInTheDocument();
  });

  it('opens add modal when add button is clicked', async () => {
    renderWithProvider(<PatentTypeFilter/>);

    fireEvent.click(screen.getByTestId('add'));

    await waitFor(() => {
      expect(screen.getByText('Введите вид патента')).toBeInTheDocument();
    });
  });

  it('dispatches filter action when patent type is selected', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderWithProvider(<PatentTypeFilter/>);

    fireEvent.click(screen.getByText('Изобретение'));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'search/setPatentTypeFilter',
      payload: 1
    });
  });

  it('dispatches remove filter action when patent type is deselected', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderWithProvider(<PatentTypeFilter/>);

    // Сначала выбираем тип
    fireEvent.click(screen.getByText('Изобретение'));
    // Затем снимаем выбор
    fireEvent.click(screen.getByText('Изобретение'));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'search/removePatentTypeFilter',
      payload: 1
    });
  });
});
