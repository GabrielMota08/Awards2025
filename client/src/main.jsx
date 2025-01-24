import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Provider from './context/Provider.jsx';

import App from './App.jsx'
import Home from './pages/Home/Home.jsx';

import './index.css'
import Auth from './pages/Auth/Auth.jsx';
import Indicados from './pages/Indicados/Indicados.jsx';
import Categoria from './pages/Categoria/Categoria.jsx';

//Eu posso trocar indicados por winners quando o cronômetro acabar
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="/nominees/:id" element={<Indicados />} />
          <Route path="/categories" element={<Categoria />} />
        </Route>
      </Routes>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
