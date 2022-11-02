import 'typeface-roboto';
import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';

// This is the app's entry point (the "static void main" equivalent of other languages).
// You'll find the "root" element in "public/index.html"
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App tab="home" />);
