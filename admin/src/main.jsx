import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme using Material-UI's createTheme function
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Define the primary color
    },
    background: {
      default: '#f5f5f5', // Define the default background color
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','), // Define the font family
  },
});

// Render the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the application with BrowserRouter for routing */}
    <BrowserRouter>
      {/* Provide the custom theme to the application */}
      <ThemeProvider theme={theme}>
        {/* Apply global CSS reset */}
        <CssBaseline />
        {/* Render the main App component */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
