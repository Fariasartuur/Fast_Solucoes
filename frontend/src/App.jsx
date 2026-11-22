import { Routes, Route } from 'react-router-dom';
import { ROUTES, DOCUMENTO_SERVICO_PATH } from './constants/routes.constants.js';
import './App.css'

import MainLayout from './layout/MainLayout.jsx';
import Login from './pages/Login/Login.jsx';
import Home from './pages/Home/Home.jsx';
import Register from './pages/Register/Register.jsx';
import Item from './pages/Item/Item.jsx';
import Estoque from './pages/Estoque/Estoque.jsx';
import Despesa from './pages/Despesa/Despesa.jsx';
import Servico from './pages/Servico/Servico.jsx';
import Prestador from './pages/Prestador/Prestador.jsx';
import DocumentoServico from './pages/DocumentoServico/DocumentoServico.jsx';

function App() {

  return (
    <Routes>
      <Route path={ROUTES.LOGIN.path} element={<Login />} />
      <Route path={ROUTES.REGISTER.path} element={<Register />} />
      {/* Recibo/orçamento: fora do MainLayout (sem menu), pronto para imprimir */}
      <Route path={DOCUMENTO_SERVICO_PATH} element={<DocumentoServico />} />

        <Route path={ROUTES.HOME.path} element={<MainLayout />} >
          <Route index element={<Home />} />
          <Route path={ROUTES.ITEMS.path} element={<Item />} />
          <Route path={ROUTES.ESTOQUE.path} element={<Estoque />} />
          <Route path={ROUTES.DESPESAS.path} element={<Despesa />} />
          <Route path={ROUTES.SERVICOS.path} element={<Servico />} />
          <Route path={ROUTES.PRESTADOR.path} element={<Prestador />} />
        </Route>
    </Routes>

  );
};

export default App
