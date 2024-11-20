import { extendTheme } from '@chakra-ui/react';

// Define a custom theme
const customTheme = extendTheme({
  colors: {
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3', // Default primary color
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    secondary: {
      50: '#ffe6eb',
      100: '#ffccd6',
      200: '#ff99ad',
      300: '#ff6683',
      400: '#ff335a',
      500: '#ff0030',
      600: '#cc0026',
      700: '#99001d',
      800: '#660013',
      900: '#33000a',
    },
  },
  fonts: {
    heading: 'Arial, sans-serif',
    body: 'Roboto, sans-serif',
  },
});

export default customTheme;