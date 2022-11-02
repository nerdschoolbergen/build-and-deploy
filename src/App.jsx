import React, { Fragment } from 'react';
import PosterCarousel from './PosterCarousel';
import AppBar from './AppBar';

// This is the outermost component for our app.
// It's responsible for the app layout and other global, non-visual elements
function App() {
  return (
    <>
      <AppBar />
      <PosterCarousel />
    </>
  );
}

export default App;
