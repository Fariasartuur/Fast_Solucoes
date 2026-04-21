import { ROUTES } from '../constants/routes.constants.js';
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import styles from './MainLayout.module.css';

import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Header from '../components/Header/Header.jsx';

const MainLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

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
        </div>
    );
};

export default MainLayout;