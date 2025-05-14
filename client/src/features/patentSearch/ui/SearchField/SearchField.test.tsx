import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {SearchField} from './SearchField';
import {searchReducer} from '@features/patentSearch/model/searchSlice';

// Мокаем debounce функцию
vi.mock('@shared/utils/debounce', () => ({
  debounce: (fn: Function) => fn
}));

describe('SearchField', () => {
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

  it('renders search field with label and input', () => {
    renderWithProvider(<SearchField/>);

    expect(screen.getByText('Поиск')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите для фильтрации')).toBeInTheDocument();
  });

  it('updates search query on input change', () => {
    renderWithProvider(<SearchField/>);

    const searchInput = screen.getByPlaceholderText('Введите для фильтрации');
    fireEvent.change(searchInput, {target: {value: 'test query'}});

    expect(searchInput).toHaveValue('test query');
  });

  it('dispatches search action on input change', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    renderWithProvider(<SearchField/>);

    const searchInput = screen.getByPlaceholderText('Введите для фильтрации');
    fireEvent.change(searchInput, {target: {value: 'test query'}});

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'search/setSearchQuery',
      payload: 'test query'
    });
  });

  it('clears search input when empty', () => {
    renderWithProvider(<SearchField/>);

    const searchInput = screen.getByPlaceholderText('Введите для фильтрации');
    fireEvent.change(searchInput, {target: {value: 'test query'}});
    fireEvent.change(searchInput, {target: {value: ''}});

    expect(searchInput).toHaveValue('');
  });
});
