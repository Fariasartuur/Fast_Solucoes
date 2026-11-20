import styles from './Home.module.css';
import TaskCard from '../../components/TaskCard/TaskCard.jsx';
import DespesaChart from '../../components/DespesaChart/DespesaChart.jsx';
import ListWidget from '../../components/ListWidget/ListWidget.jsx';
import { useEffect } from 'react';
import { useDespesaStore } from '../../store/useDespesaStore.js';
import { useItemStore } from '../../store/useItemStore.js';
import { useEstoqueStore } from '../../store/useEstoqueStore.js';
import { useServicoStore } from '../../store/useServicoStore.js';
import { ROUTES } from '../../constants/routes.constants.js';
import CalendarWidget from '../../components/CalendarWidget/CalendarWidget.jsx';

import logo from '../../../public/logo.png';

const Home = () => {
    const { despesas, fetchDespesas } = useDespesaStore();
    const { items, fetchItems } = useItemStore();
    const { estoque, fetchEstoque } = useEstoqueStore();
    const { servicos, fetchServicos } = useServicoStore();

    useEffect(() => {
        if (despesas.length === 0) fetchDespesas();
        if (items.length === 0) fetchItems();
        if (estoque.length === 0) fetchEstoque();
        if (servicos.length === 0) fetchServicos();
    }, []);

    const totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor || 0), 0);
    const totalPagas = despesas
        .filter(d => d.status === 'Paga')
        .reduce((acc, d) => acc + Number(d.valor || 0), 0);
    const totalPendentes = despesas
        .filter(d => d.status === 'Pendente')
        .reduce((acc, d) => acc + Number(d.valor || 0), 0);

    return (
        <main className={styles.container}>

            <section className={styles.welcome}>
                <div>
                    <h1>Bem-vindo de volta, <span className={styles.userName}>Usuário!</span></h1>
                    <p>Confira um resumo do seu desempenho financeiro e suas próximas tarefas.</p>
                </div>
                <div className={styles.logoMark}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </div>
            </section>

            <section className={styles.desempenho}>
                <DespesaChart despesas={despesas} />

                <div className={styles.cardsWrapper}>
                    <div className={styles.card}>
                        <h3>Despesa Total</h3>
                        <p className={`${styles.valor} ${styles.vermelho}`}>
                            R$ {totalDespesas.toFixed(2)}
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3>Despesas Pagas</h3>
                        <p className={`${styles.valor} ${styles.verde}`}>
                            R$ {totalPagas.toFixed(2)}
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3>Despesas Pendentes</h3>
                        <p className={`${styles.valor} ${styles.laranja}`}>
                            R$ {totalPendentes.toFixed(2)}
                        </p>
                    </div>
                    <div className={styles.card}>
                        <h3>Qtd. de Despesas</h3>
                        <p className={`${styles.valor} ${styles.azul}`}>{despesas.length}</p>
                    </div>
                </div>
            </section>

            <section className={styles.atualizacoes}>

                <ListWidget
                    title="Itens"
                    icon="inventory"
                    items={items}
                    route={ROUTES.ITEMS.path}
                    emptyText="Nenhum item"
                    renderItem={(item) => (
                        <>
                            <span className={styles.itemNome}>{item.nome_item}</span>
                            <span className={styles.itemInfo}>{item.categoria}</span>
                        </>
                    )}
                />

                <ListWidget
                    title="Estoque"
                    icon="store"
                    items={estoque}
                    route={ROUTES.ESTOQUE.path}
                    emptyText="Nenhum registro de estoque"
                    renderItem={(item) => (
                        <>
                            <span className={styles.itemNome}>{item.nome_item}</span>
                            <span className={styles.itemInfo}>Qtd: {item.quantidade}</span>
                        </>
                    )}
                />

                <ListWidget
                    title="Serviços"
                    icon="build"
                    items={servicos}
                    route={ROUTES.SERVICOS.path}
                    emptyText="Nenhum serviço"
                    renderItem={(item) => (
                        <>
                            <span className={styles.itemNome}>{item.contratante}</span>
                            <span className={styles.itemInfo}>{item.tipo}</span>
                        </>
                    )}
                />

            </section>

            <section className={styles.calendario}>
                <CalendarWidget />
            </section>

        </main>
    );
};

export default Home;