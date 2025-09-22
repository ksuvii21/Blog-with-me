import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from '../App';
import store from '../redux/store';

const theme = createTheme();

const renderWithProviders = (component) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(document.body).toBeInTheDocument();
  });

  test('renders main layout components', () => {
    renderWithProviders(<App />);

    // Check if main layout elements are present
    expect(document.querySelector('[data-testid="main-layout"]')).toBeInTheDocument();
  });

  test('renders header component', () => {
    renderWithProviders(<App />);

    // Check if header is rendered (you may need to add data-testid to Header component)
    const headerElement = document.querySelector('header') || screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders footer component', () => {
    renderWithProviders(<App />);

    // Check if footer is rendered
    const footerElement = document.querySelector('footer') || screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });
});
