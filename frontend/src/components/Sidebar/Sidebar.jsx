import styles from './Sidebar.module.css'
import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants.js';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const routes = Object.keys(ROUTES);
    const noRoutes = ['LOGIN', 'REGISTER'];
    const sidebarRef = useRef(null);
    const location = useLocation();

    const activeItem = Object.values(ROUTES).find(
        route => {
            if (route.path === ROUTES.HOME.path) {
                return location.pathname === ROUTES.HOME.path;
            }
            return location.pathname.startsWith(route.path);
        }
    ) || ROUTES.HOME;

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isMobile = window.innerWidth <= 700;

            if (isMobile && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsCollapsed(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsCollapsed]);

    return (
        <aside ref={sidebarRef} className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <header className={styles.sidebarHeader}>
                <h1 className={styles.logo}>FS</h1>
                <button onClick={toggleSidebar} className={`${styles.sidebarToggler} ${styles.toggler}`}>
                    <span className="material-symbols-rounded">chevron_left</span>
                </button>
            </header>

            <nav className={styles.sidebarNav}>
                <ul className={`${styles.navList} ${styles.primaryNav}`}>
                    {routes
                        .filter(key => !noRoutes.includes(key))
                        .map(key => {
                            const route = ROUTES[key];
                            return (
                                <li key={route.path} className={`${styles.navItem} ${activeItem === route ? styles.active : ''}`}>
                                    <Link to={route.path} className={styles.navLink}>
                                        <span className={`${styles.navIcon} material-symbols-rounded`}>{route.icon}</span>
                                        <span className={styles.navLabel}>{route.name}</span>
                                    </Link>
                                    <span className={styles.navTooltip}>{route.name}</span>
                                </li>
                            );
                        })}
                    <li className={`${styles.navItem} ${activeItem === ROUTES.LOGIN ? styles.active : ''}`}>
                        <Link to={ROUTES.LOGIN.path} className={styles.navLink}>
                            <span className={`${styles.navIcon} material-symbols-rounded`}>logout</span>
                            <span className={styles.navLabel}>Sair</span>
                        </Link>
                        <span className={styles.navTooltip}>Sair</span>
                    </li>
                </ul>

            </nav>
        </aside>
    );
};

export default Sidebar;