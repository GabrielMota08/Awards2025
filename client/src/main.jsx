import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Provider from './context/Provider.jsx';

import App from './App.jsx'
import Home from './pages/Home/Home.jsx';

import './index.css'
import Auth from './pages/Auth/Auth.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="auth" element={<Auth />} />
        </Route>
      </Routes>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
