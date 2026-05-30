import styles from './Register.module.css';

const Register = () => {

    const toggleSenha = () => {
        const input = document.getElementById('senha');
        const icon = document.getElementById('olho');
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility_off';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility';
        }
    };

    const mascaraCNPJ = (e) => {
        let v = e.target.value.replace(/\D/g, '');
        v = v.replace(/^(\d{2})(\d)/, '$1.$2');
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
        e.target.value = v;
    };

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
                <div className={styles.formBox}>
                    <div className={styles.formTitle}>Crie sua conta</div>
                    <div className={styles.formDesc}>Preencha os dados abaixo para começar</div>

                    <div className={styles.field}>
                        <label className={styles.label}>Nome</label>
                        <input className={styles.input} type="text" placeholder="Nome completo" />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>CNPJ</label>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                            onChange={mascaraCNPJ}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>E-mail</label>
                        <input className={styles.input} type="email" placeholder="seu@email.com" />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Senha</label>
                        <div className={styles.inputWrapper}>
                            <input
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                type="password"
                                id="senha"
                                placeholder="••••••••"
                            />
                            <span
                                id="olho"
                                className={`${styles.inputIcon} material-symbols-rounded`}
                                onClick={toggleSenha}
                            >
                                visibility
                            </span>
                        </div>
                    </div>

                    <button className={styles.btn}>Criar conta</button>

                    <div className={styles.loginLink}>
                        Já possui uma conta? <a href="/login">Entrar</a>
                    </div>

                    <div className={styles.footer}>
                        Fast Soluções &copy; 2025 — Uso interno
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;