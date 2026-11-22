import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants.js';
import { formatBRL, textoDias } from '../../utils/formatters.js';
import { resumoRecebimentos } from '../../utils/recebimentos.js';
import styles from './RecebimentosWidget.module.css';

const MAX_DEVEDORES = 5;

// Bloco da Home com o controle de contas a receber:
// cards "A receber" e "Recebido no mês" + lista "Quem está devendo".
const RecebimentosWidget = ({ servicos }) => {
    const navigate = useNavigate();
    const resumo = resumoRecebimentos(servicos);
    const devedores = resumo.devedores.slice(0, MAX_DEVEDORES);
    const ocultos = resumo.devedores.length - devedores.length;

    return (
        <div className={styles.wrapper}>
            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>A receber</h3>
                    <p className={`${styles.valor} ${styles.laranja}`}>{formatBRL(resumo.aReceber, 'R$ 0,00')}</p>
                    <span className={styles.sub}>
                        {resumo.qtdPendentes === 1 ? '1 serviço pendente' : `${resumo.qtdPendentes} serviços pendentes`}
                    </span>
                </div>
                <div className={styles.card}>
                    <h3>Recebido no mês</h3>
                    <p className={`${styles.valor} ${styles.verde}`}>{formatBRL(resumo.recebidoMes, 'R$ 0,00')}</p>
                    <span className={styles.sub}>
                        {resumo.nomeMes} · {resumo.qtdRecebidosMes === 1 ? '1 serviço' : `${resumo.qtdRecebidosMes} serviços`}
                    </span>
                </div>
            </div>

            <div className={styles.display}>
                <div className={styles.displayHeader}>
                    <h2>Quem está devendo</h2>
                    <span className={styles.displayBadge}>{resumo.devedores.length}</span>
                </div>

                <div className={styles.displayBody}>
                    {devedores.length === 0 ? (
                        <div className={styles.displayEmpty}>
                            <span className="material-symbols-rounded">task_alt</span>
                            Nenhum pagamento pendente
                        </div>
                    ) : (
                        <ul className={styles.list}>
                            {devedores.map((d) => (
                                <li key={d.contratante} className={styles.listItem}>
                                    <div className={styles.info}>
                                        <span className={styles.nome}>{d.contratante}</span>
                                        <span className={styles.detalhe}>
                                            {d.quantidade === 1 ? '1 serviço' : `${d.quantidade} serviços`}
                                            {' · '}mais antigo: {textoDias(d.diasMaisAntigo)}
                                        </span>
                                    </div>
                                    <span className={styles.total}>{formatBRL(d.total)}</span>
                                </li>
                            ))}
                            {ocultos > 0 && (
                                <li className={styles.mais}>
                                    + {ocultos} {ocultos === 1 ? 'academia' : 'academias'}
                                </li>
                            )}
                        </ul>
                    )}

                    <button className={styles.btnVer} onClick={() => navigate(ROUTES.SERVICOS.path)}>
                        Ver serviços
                        <span className="material-symbols-rounded">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecebimentosWidget;
