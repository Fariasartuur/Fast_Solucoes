import styles from './Login.module.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const toggleSenha = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(ROUTES.HOME.path);
    }

    return (
        <div className={styles.root}>
            <div className={styles.left}>
                <div className={styles.gridBg}></div>
                <div className={styles.brand}>
                    <div className={styles.logoMark}>
                        <svg viewBox="0 0 40 40" fill="none">
                            <path d="M8 20L16 12L24 20L32 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 28L16 20L24 28L32 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                        </svg>
                    </div>
                    <div className={styles.brandName}>FAST <span>SOLUÇÕES</span></div>
                    <div className={styles.brandSub}>Sistema de Gestão</div>
                    <div className={styles.divider}></div>
                    <div className={styles.tagline}>
                        Manutenção e controle de equipamentos de academia em um só lugar.
                    </div>
                </div>
            </div>

            <div className={styles.right}>
                <form className={styles.formBox} onSubmit={handleSubmit}>
                    <div className={styles.formTitle}>Bem-vindo de volta</div>
                    <div className={styles.formDesc}>Acesse sua conta para continuar</div>

                    <div className={styles.field}>
                        <label className={styles.label}>E-mail</label>
                        <input className={styles.input} type="email" placeholder="seu@email.com" />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Senha</label>
                        <div className={styles.inputWrapper}>
                            <input className={`${styles.input} ${styles.inputWithIcon}`} type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                            <span className={`${styles.inputIcon} material-symbols-rounded`} onClick={toggleSenha}>
                                visibility
                            </span>
                        </div>
                        <div className={styles.forgot}>
                            <a href="#">Esqueci minha senha</a>
                        </div>
                    </div>

                    <button type='submit' className={styles.btn}>Entrar</button>

                    <div className={styles.registerLink}>
                        Ainda não possui conta? <Link to={ROUTES.REGISTER.path}>Clique aqui</Link>
                    </div>
                    
                    <div className={styles.footer}>
                        Fast Soluções &copy; 2025 — Uso interno
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
