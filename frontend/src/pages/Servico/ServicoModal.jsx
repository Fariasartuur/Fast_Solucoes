import { useMemo, useState } from "react";
import { useModalStore } from "../../store/useModalStore.js";
import { useServicoStore } from "../../store/useServicoStore.js";
import { useItemStore } from "../../store/useItemStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import PecasServico from "./PecasServico.jsx";
import { hojeISO } from "../../utils/formatters.js";
import style from "./Servico.module.css";

const ServicoModal = () => {
    const [loading, setLoading] = useState(false);
    const closeServico = useModalStore((state) => state.closeServico);
    const { addServico } = useServicoStore();
    const items = useItemStore((state) => state.items);
    const fetchEstoque = useEstoqueStore((state) => state.fetchEstoque);

    const [formData, setFormData] = useState({
        contratante: "",
        data: "",
        valor: "",
        tipo: ""
    });

    // Peças escolhidas no cadastro. Só são gravadas (e descontadas do estoque)
    // quando o serviço é salvo, tudo em uma única operação no backend.
    const [pecas, setPecas] = useState([]);

    // "Já recebido": a academia pagou na hora; o serviço já nasce como Pago.
    const [recebido, setRecebido] = useState(false);
    const [dataRecebimento, setDataRecebimento] = useState(hojeISO());

    const reservado = useMemo(
        () => Object.fromEntries(pecas.map((peca) => [peca.id_item, peca.quantidade])),
        [pecas]
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : (type === 'number' ? (value === '' ? '' : Number(value)) : value)
        }));
    };

    const adicionarPeca = (idItem, quantidade) => {
        const item = items.find((i) => i.id_item === idItem);
        setPecas((prev) => prev.some((p) => p.id_item === idItem)
            ? prev.map((p) => p.id_item === idItem ? { ...p, quantidade: p.quantidade + quantidade } : p)
            : [...prev, {
                id_item: idItem,
                nome_item: item?.nome_item ?? "Peça",
                modelo: item?.modelo,
                quantidade,
                custo_unitario: item?.preco_custo ?? 0,
            }]
        );
    };

    const alterarQuantidade = (idItem, quantidade) => {
        setPecas((prev) => prev.map((p) => p.id_item === idItem ? { ...p, quantidade } : p));
    };

    const removerPeca = (idItem) => {
        setPecas((prev) => prev.filter((p) => p.id_item !== idItem));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        addServico({
            ...formData,
            pecas: pecas.map(({ id_item, quantidade }) => ({ id_item, quantidade })),
            ...(recebido && { status: 'Pago', data_pagamento: dataRecebimento }),
        })
            .then(() => {
                alert("Serviço criado com sucesso!");
                fetchEstoque({ silent: true });
                closeServico();
            })
            .catch((error) => {
                console.error("Erro ao criar serviço:", error);
                alert(error.message || "Ocorreu um erro ao salvar. Tente novamente.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h2 className={style.title}>Cadastrar Serviço</h2>
            </div>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.grid}>
                    <input
                        type="text"
                        name="contratante"
                        value={formData.contratante}
                        onChange={handleChange}
                        placeholder="Nome do Contratante"
                        className={style.input}
                        required
                    />
                    <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        placeholder="Data"
                        className={style.input}
                        required
                    />
                    <input
                        type="number"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        placeholder="Valor cobrado (R$)"
                        className={style.input}
                        min="0"
                        step="0.01"
                        required
                    />
                    <input
                        type="text"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        placeholder="Tipo"
                        className={style.input}
                        required
                    />
                </div>

                <PecasServico
                    pecas={pecas}
                    reservado={reservado}
                    onAdd={adicionarPeca}
                    onChangeQtd={alterarQuantidade}
                    onRemove={removerPeca}
                    busy={loading}
                    valorCobrado={formData.valor}
                />

                <div className={style.recebido}>
                    <label>
                        <input
                            type="checkbox"
                            checked={recebido}
                            onChange={(e) => setRecebido(e.target.checked)}
                        />
                        Já recebido
                    </label>
                    {recebido && (
                        <>
                            <span>em</span>
                            <input
                                type="date"
                                value={dataRecebimento}
                                min={formData.data || undefined}
                                max={hojeISO()}
                                onChange={(e) => setDataRecebimento(e.target.value)}
                                aria-label="Data do recebimento"
                                required
                            />
                        </>
                    )}
                </div>

                <button className={style.saveBtn} type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </div>
    );

};

export default ServicoModal;
