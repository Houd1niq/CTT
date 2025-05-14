import {render as rtlRender} from '@testing-library/react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {BrowserRouter} from 'react-router-dom';
import {PropsWithChildren, ReactElement} from 'react';

// Import your reducers here
import notificationReducer from '@shared/model/notification/notificationSlice';
import {searchReducer} from "@features/patentSearch";

// Combine all reducers
const rootReducer = {
  notificationReducer,
  searchReducer,
  // Add other reducers as needed
};

function render(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({children}: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions});
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export {render};
