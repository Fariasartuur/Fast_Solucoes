import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes.constants.js';
import './App.css'

import MainLayout from './layout/MainLayout.jsx';
import Login from './pages/Login/Login.jsx';
import Home from './pages/Home/Home.jsx';
import Register from './pages/Register/Register.jsx';
import Item from './pages/Item/Item.jsx';
import Estoque from './pages/Estoque/Estoque.jsx';
import Despesa from './pages/Despesa/Despesa.jsx';
import Servico from './pages/Servico/Servico.jsx';

function App() {

  return (
    <Routes>
      <Route path={ROUTES.LOGIN.path} element={<Login />} />
      <Route path={ROUTES.REGISTER.path} element={<Register />} />

        <Route path={ROUTES.HOME.path} element={<MainLayout />} >
          <Route index element={<Home />} />
          <Route path={ROUTES.ITEMS.path} element={<Item />} />
          <Route path={ROUTES.ESTOQUE.path} element={<Estoque />} />
          <Route path={ROUTES.DESPESAS.path} element={<Despesa />} />
          <Route path={ROUTES.SERVICOS.path} element={<Servico />} />
        </Route>
    </Routes>

  );
};

export default App
