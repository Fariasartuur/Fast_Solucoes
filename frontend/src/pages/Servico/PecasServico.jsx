import { useEffect, useMemo, useState } from "react";
import { useItemStore } from "../../store/useItemStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import { formatBRL } from "../../utils/formatters.js";
import style from "./PecasServico.module.css";

const nomeCompleto = (peca) => peca.modelo ? `${peca.nome_item} (${peca.modelo})` : peca.nome_item;

/**
 * Seção "Peças usadas" de um serviço.
 *
 * Não grava nada sozinha: avisa o componente pai por meio de onAdd,
 * onChangeQtd e onRemove. Assim o mesmo visual serve para:
 *  - o cadastro de serviço (lista local, enviada junto com o serviço);
 *  - um serviço já existente (cada ação grava no banco na hora).
 *
 * props:
 *  - pecas: [{ id_item, nome_item, modelo, quantidade, custo_unitario }]
 *  - reservado: { [id_item]: quantidade } já escolhida mas ainda não descontada
 *    do estoque (usado no cadastro, para não oferecer mais do que existe).
 *  - busy: desabilita os botões enquanto uma ação está em andamento.
 *  - valorCobrado: quando informado, exibe o lucro (valor cobrado - custo das peças).
 */
const PecasServico = ({ pecas, reservado = {}, onAdd, onChangeQtd, onRemove, busy = false, valorCobrado }) => {
    const items = useItemStore((state) => state.items);
    const fetchItems = useItemStore((state) => state.fetchItems);
    const estoque = useEstoqueStore((state) => state.estoque);
    const fetchEstoque = useEstoqueStore((state) => state.fetchEstoque);

    const [idItem, setIdItem] = useState("");
    const [quantidade, setQuantidade] = useState(1);

    // Sempre busca peças e estoque atualizados ao abrir a seção.
    useEffect(() => {
        fetchItems({ silent: true });
        fetchEstoque({ silent: true });
    }, [fetchItems, fetchEstoque]);

    // Saldo total por peça (uma peça pode ter mais de um registro de estoque).
    const saldo = useMemo(() => estoque.reduce((acc, registro) => {
        acc[registro.id_item] = (acc[registro.id_item] || 0) + Number(registro.quantidade || 0);
        return acc;
    }, {}), [estoque]);

    const disponivel = (id) => (saldo[id] || 0) - (reservado[id] || 0);

    const opcoes = items
        .filter((item) => disponivel(item.id_item) > 0)
        .sort((a, b) => a.nome_item.localeCompare(b.nome_item));

    const disponivelSelecionada = idItem ? disponivel(Number(idItem)) : 0;
    const quantidadeValida = Number.isInteger(quantidade) && quantidade >= 1;
    const excedeEstoque = Boolean(idItem) && quantidadeValida && quantidade > disponivelSelecionada;
    const podeAdicionar = Boolean(idItem) && quantidadeValida && !excedeEstoque && !busy;

    const custoTotal = pecas.reduce(
        (total, peca) => total + peca.quantidade * Number(peca.custo_unitario || 0), 0
    );

    const temValor = valorCobrado !== undefined && valorCobrado !== null && valorCobrado !== '';
    const lucro = temValor ? Number(valorCobrado) - custoTotal : null;

    const adicionar = async () => {
        if (!podeAdicionar) return;
        const ok = await onAdd(Number(idItem), quantidade);
        if (ok !== false) {
            setIdItem("");
            setQuantidade(1);
        }
    };

    return (
        <section className={style.secao}>
            <h3 className={style.titulo}>
                <span className="material-symbols-rounded">build</span>
                Peças usadas
            </h3>

            {pecas.length === 0 ? (
                <p className={style.vazio}>Nenhuma peça registrada neste serviço.</p>
            ) : (
                <ul className={style.lista}>
                    {pecas.map((peca) => (
                        <li key={peca.id_item} className={style.linha}>
                            <div className={style.info}>
                                <span className={style.nome}>{nomeCompleto(peca)}</span>
                                <span className={style.detalhe}>
                                    {formatBRL(peca.custo_unitario, "R$ 0,00")} un. · subtotal{" "}
                                    {formatBRL(peca.quantidade * Number(peca.custo_unitario || 0), "R$ 0,00")}
                                </span>
                            </div>

                            <div className={style.qtd}>
                                <button
                                    type="button"
                                    onClick={() => onChangeQtd(peca.id_item, peca.quantidade - 1)}
                                    disabled={busy || peca.quantidade <= 1}
                                    aria-label="Diminuir quantidade"
                                >−</button>
                                <span>{peca.quantidade}</span>
                                <button
                                    type="button"
                                    onClick={() => onChangeQtd(peca.id_item, peca.quantidade + 1)}
                                    disabled={busy || disponivel(peca.id_item) <= 0}
                                    aria-label="Aumentar quantidade"
                                    title={disponivel(peca.id_item) <= 0 ? "Sem estoque disponível" : undefined}
                                >+</button>
                            </div>

                            <button
                                type="button"
                                className={style.remover}
                                onClick={() => onRemove(peca.id_item)}
                                disabled={busy}
                                title="Remover peça do serviço"
                                aria-label="Remover peça do serviço"
                            >
                                <span className="material-symbols-rounded">delete</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className={style.adicionar}>
                <select
                    value={idItem}
                    onChange={(e) => setIdItem(e.target.value)}
                    className={style.select}
                    disabled={busy}
                    aria-label="Peça"
                >
                    <option value="">
                        {opcoes.length ? "Selecione uma peça..." : "Nenhuma peça com estoque disponível"}
                    </option>
                    {opcoes.map((item) => (
                        <option key={item.id_item} value={item.id_item}>
                            {nomeCompleto(item)} — disp. {disponivel(item.id_item)}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value === "" ? "" : Math.floor(Number(e.target.value)))}
                    className={style.qtdInput}
                    disabled={busy}
                    aria-label="Quantidade"
                />
                <button type="button" onClick={adicionar} disabled={!podeAdicionar} className={style.addBtn}>
                    Adicionar
                </button>
            </div>

            {excedeEstoque && (
                <p className={style.aviso}>Só há {disponivelSelecionada} unidade(s) disponível(is) desta peça.</p>
            )}

            <div className={style.total}>
                <span>Custo total das peças</span>
                <strong>{formatBRL(custoTotal, "R$ 0,00")}</strong>
            </div>

            {temValor && (
                <div className={`${style.total} ${lucro < 0 ? style.totalPrejuizo : style.totalLucro}`}>
                    <span>Lucro do serviço (valor cobrado − peças)</span>
                    <strong>{formatBRL(lucro, "R$ 0,00")}</strong>
                </div>
            )}
        </section>
    );
};

export default PecasServico;
