import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import { ChakraProvider, ColorModeScript, extendTheme, useColorMode } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

const styles = {
  global: (props) => ({
    body: {
      color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      bg: props.colorMode === 'dark' ? '#101010' : 'gray.100',
    }
  })
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e',
  }
}

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>-
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
