import styles from './Sidebar.module.css'
import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants.js';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
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
                    <li className={`${styles.navItem} ${activeItem === ROUTES.HOME ? styles.active : ''}`}>
                        <Link to={ROUTES.HOME.path} className={styles.navLink}>
                            <span className={`${styles.navIcon} material-symbols-rounded`}>home</span>
                            <span className={styles.navLabel}>Home</span>
                        </Link>
                        <span className={styles.navTooltip}>Home</span>
                    </li>
                </ul>

                <ul className={`${styles.navList} ${styles.secondaryNav}`}>
                    <li className={`${styles.navItem} ${activeItem === ROUTES.SETTINGS ? styles.active : ''}`}>
                        <Link to={ROUTES.SETTINGS.path} className={styles.navLink}>
                            <span className={`${styles.navIcon} material-symbols-rounded`}>settings</span>
                            <span className={styles.navLabel}>Configurações</span>
                        </Link>
                        <span className={styles.navTooltip}>Configurações</span>
                    </li>
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