import styles from './Home.module.css';
import TaskCard from '../../components/TaskCard/TaskCard.jsx';

const Home = () => {
    return (
        <main className={styles.container}>

            <section className={styles.welcome}>
                <div>
                    <h1>Bem-vindo de volta, <span className={styles.userName}>Usuário!</span></h1>
                    <p>Confira um resumo do seu desempenho financeiro e suas próximas tarefas.</p>
                </div>
                <div className={styles.logoMark}>
                    <svg viewBox="0 0 40 40" fill="none">
                        <path d="M8 20L16 12L24 20L32 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 28L16 20L24 28L32 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                    </svg>
                </div>
            </section>

            <section className={styles.desempenho}>
                <div className={styles.graficoArea}>
                    <div className={styles.graficoTitle}>Desempenho Financeiro</div>
                    <div className={styles.bars}>
                        {[
                            { mes: 'Jan', receita: 60, despesa: 40 },
                            { mes: 'Fev', receita: 80, despesa: 50 },
                            { mes: 'Mar', receita: 50, despesa: 70 },
                            { mes: 'Abr', receita: 90, despesa: 45 },
                            { mes: 'Mai', receita: 70, despesa: 55 },
                            { mes: 'Jun', receita: 100, despesa: 60 },
                        ].map((item) => (
                            <div key={item.mes} className={styles.barGroup}>
                                <div className={styles.barWrap}>
                                    <div className={`${styles.bar} ${styles.receita}`} style={{ height: `${item.receita}px` }} />
                                    <div className={`${styles.bar} ${styles.despesa}`} style={{ height: `${item.despesa}px` }} />
                                </div>
                                <span className={styles.barLabel}>{item.mes}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendDot} ${styles.dotReceita}`} />
                            Receita
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendDot} ${styles.dotDespesa}`} />
                            Despesa
                        </div>
                    </div>
                </div>

                <div className={styles.cardsWrapper}>
                    <div className={styles.card}>
                        <h3>Receita Total</h3>
                        <p className={`${styles.valor} ${styles.verde}`}>R$ 0,00</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Despesa Total</h3>
                        <p className={`${styles.valor} ${styles.vermelho}`}>R$ 0,00</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Lucro Líquido</h3>
                        <p className={`${styles.valor} ${styles.azul}`}>R$ 0,00</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Margem de Lucro</h3>
                        <p className={`${styles.valor} ${styles.laranja}`}>0%</p>
                    </div>
                </div>
            </section>

            <section className={styles.atualizacoes}>

                {/* Card Compromissos */}
                <div className={styles.display}>
                    <div className={styles.displayHeader}>
                        <h2>Compromissos</h2>
                        <span className={styles.displayBadge}>0</span>
                    </div>
                    <div className={styles.displayBody}>
                        <div className={styles.displayEmpty}>
                            <span className="material-symbols-rounded">event</span>
                            Nenhum compromisso
                        </div>
                    </div>
                </div>

                <TaskCard />

                <div className={styles.display}>
                    <div className={styles.displayHeader}>
                        <h2>Registros</h2>
                        <span className={styles.displayBadge}>0</span>
                    </div>
                    <div className={styles.displayBody}>
                        <div className={styles.displayEmpty}>
                            <span className="material-symbols-rounded">receipt_long</span>
                            Nenhum registro
                        </div>
                    </div>
                </div>

            </section>

        </main>
    );
};

export default Home;