import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Create the root container using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped with Router
root.render(
  <Router>
    <App />
  </Router>
);
