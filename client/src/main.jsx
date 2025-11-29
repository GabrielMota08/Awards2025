import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Provider from './context/Provider.jsx';

import App from './App.jsx'
import Home from './pages/Home/Home.jsx';
import Auth from './pages/Auth/Auth.jsx';
import Indicados from './pages/Indicados/Indicados.jsx';
import Categoria from './pages/Categoria/Categoria.jsx';
import AppContext from './context/AppContext.js';

import './index.css';
import Winners from './pages/Winners/Winners.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

const AppRoutes = () => {
  const { targetDate } = useContext(AppContext);

  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="/nominees/:id" element={<Indicados />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {new Date() > targetDate && <Route path="/winners/:id" element={<Winners />} />}
        <Route path="/categories" element={<Categoria />} />
      </Route>
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <AppRoutes />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
