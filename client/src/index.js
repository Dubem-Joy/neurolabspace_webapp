import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import ProjectProvider from './context/projectProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ProjectProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ProjectProvider>
);

