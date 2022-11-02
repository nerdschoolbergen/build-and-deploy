import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

import PosterCarousel from './PosterCarousel';
import AppBar from './AppBar';

const theme = createTheme();

// This is the outermost component for our app.
// It's responsible for the app layout and other global, non-visual elements
function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar />
      <PosterCarousel />
    </ThemeProvider>
  );
}

export default App;
