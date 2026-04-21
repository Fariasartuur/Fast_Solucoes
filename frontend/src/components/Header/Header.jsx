import styles from './Header.module.css';

const Header = ({ title, setIsCollapsed, isCollapsed }) => {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.leftSection}>
                    
                    <button 
                        className={`${styles.menuButton} ${!isCollapsed ? styles.menuButtonHidden : ''}`} 
                        onClick={() => setIsCollapsed(false)}
                    >
                        <span className="material-symbols-rounded">menu</span>
                    </button>

                    <h1 className={styles.title}>{title}</h1>

                </div>
            </header>

            <div className={styles.borderBottom} />
        </>

    );
};

export default Header;