import { ROUTES } from '../constants/routes.constants.js';
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useModalStore } from '../store/useModalStore.js';

import styles from './MainLayout.module.css';

import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Header from '../components/Header/Header.jsx';
import Modal from '../components/Modal/Modal.jsx';

import ItemModal from '../pages/Item/ItemModal.jsx';
import EstoqueModal from '../pages/Estoque/EstoqueModal.jsx';
import DespesaModal from '../pages/Despesa/DespesaModal.jsx';
import ServicoModal from '../pages/Servico/ServicoModal.jsx';

import TableActions from '../components/Table/TableActions.jsx';

const MainLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const {
        isItemOpen, closeItem,
        isEstoqueOpen, closeEstoque,
        isDespesaOpen, closeDespesa,
        isActionsOpen, closeActions,
        isServicoOpen, closeServico
    } = useModalStore();

    const title = Object.values(ROUTES).find(
        route => route.path === location.pathname
    )?.name || 'Page Not Found';

    return (
        <div className={styles.mainLayout}>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className={`${styles.content} ${isCollapsed ? styles.contentCollapsed : styles.contentExpanded}`}>
                <Header title={title} setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
                <main className={styles.mainInner}>
                    <Outlet />
                </main>
            </div>

            <Modal isOpen={isActionsOpen} onClose={closeActions}>
                <TableActions page={location.pathname} />
            </Modal>

            <Modal isOpen={isItemOpen} onClose={closeItem}>
                <ItemModal />
            </Modal>

            <Modal isOpen={isEstoqueOpen} onClose={closeEstoque}>
                <EstoqueModal />
            </Modal>

            <Modal isOpen={isDespesaOpen} onClose={closeDespesa}>
                <DespesaModal />
            </Modal>

            <Modal isOpen={isServicoOpen} onClose={closeServico}>
                <ServicoModal />
            </Modal>
        </div>
    );
};

export default MainLayout;