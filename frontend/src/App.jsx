import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes.constants.js';
import './App.css'

import MainLayout from './layout/MainLayout.jsx';

function App() {

  return (
    <Routes>
      <Route path={ROUTES.LOGIN.path} element={<p>Login</p>} />

        <Route path={ROUTES.HOME.path} element={<MainLayout />} >
          <Route index element={<p>Home</p>} />
          <Route path={ROUTES.SETTINGS.path} element={<p>Settings</p>} />
        </Route>
    </Routes>

  );
};

export default App
