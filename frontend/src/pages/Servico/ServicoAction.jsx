import { useCallback, useEffect, useState } from "react";
import { useEntityActions } from "../../hooks/useEntityActions.js";
import { useServicoStore } from "../../store/useServicoStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import style from "./Servico.module.css"
import { SERVICO_ENDPOINT } from "../../constants/apiUrl.constants.js";
import { formatBRL, formatDataBR, dataISO, hojeISO } from "../../utils/formatters.js";
import {
    listarPecas, adicionarPeca, alterarQuantidadePeca, removerPeca
} from "../../services/servicoPecasService.js";
import { marcarComoPago, desfazerPagamento } from "../../services/pagamentoService.js";
import PecasServico from "./PecasServico.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { documentoServicoUrl } from "../../constants/routes.constants.js";

const ServicoAction = ({ servico }) => {
    const { fetchServicos } = useServicoStore();
    const fetchEstoque = useEstoqueStore((state) => state.fetchEstoque);
    const idServico = servico.id_registro_servico;

    const {
        isEditing, isSaving, formData,
        toggleEditing, handleChange, handleDelete, handleEdit
    } = useEntityActions(
        {
            contratante: servico.contratante,
            // O banco devolve "2026-11-20T03:00:00.000Z"; o MySQL só aceita "2026-11-20" de volta.
            data: servico.data?.split('T')[0],
            valor: servico.valor,
            tipo: servico.tipo
        },
        "Servico"
    );

    // Peças do serviço: cada ação é gravada no banco na hora e ajusta o estoque.
    const [pecas, setPecas] = useState([]);
    const [pecasOcupado, setPecasOcupado] = useState(false);

    const carregarPecas = useCallback(async () => {
        try {
            setPecas(await listarPecas(idServico));
        } catch (error) {
            alert("Não foi possível carregar as peças: " + error.message);
        }
    }, [idServico]);

    // Carga inicial. "ativo" evita atualizar o estado se o modal fechar antes da resposta.
    useEffect(() => {
        let ativo = true;
        listarPecas(idServico)
            .then((dados) => { if (ativo) setPecas(dados); })
            .catch((error) => alert("Não foi possível carregar as peças: " + error.message));
        return () => { ativo = false; };
    }, [idServico]);

    // Executa uma ação de peça e, com sucesso ou erro, recarrega a lista e o estoque.
    const executarAcaoPeca = async (acao) => {
        setPecasOcupado(true);
        try {
            await acao();
            return true;
        } catch (error) {
            alert(error.message);
            return false;
        } finally {
            await carregarPecas();
            fetchEstoque({ silent: true });
            fetchServicos(); // atualiza "Custo peças" e "Lucro" na tabela
            setPecasOcupado(false);
        }
    };

    const onAddPeca = (idItem, quantidade) =>
        executarAcaoPeca(() => adicionarPeca(idServico, idItem, quantidade));

    const onChangeQtdPeca = (idItem, quantidade) =>
        executarAcaoPeca(() => alterarQuantidadePeca(idServico, idItem, quantidade));

    const onRemovePeca = (idItem) => {
        if (!window.confirm("Remover esta peça do serviço? A quantidade volta para o estoque.")) return;
        executarAcaoPeca(() => removerPeca(idServico, idItem));
    };

    // Pagamento: guardado localmente para a tela atualizar logo após marcar/desfazer.
    const [pagamento, setPagamento] = useState({
        status: servico.status,
        data_pagamento: servico.data_pagamento,
    });
    const [dataRecebimento, setDataRecebimento] = useState(hojeISO());
    const [salvandoPagamento, setSalvandoPagamento] = useState(false);
    const pago = pagamento.status === 'Pago';

    const alterarPagamento = async (acao) => {
        setSalvandoPagamento(true);
        try {
            const resultado = await acao();
            setPagamento({ status: resultado.status, data_pagamento: resultado.data_pagamento });
            fetchServicos();
        } catch (error) {
            alert(error.message);
        } finally {
            setSalvandoPagamento(false);
        }
    };

    const onMarcarPago = () =>
        alterarPagamento(() => marcarComoPago(idServico, dataRecebimento));

    const onDesfazerPagamento = () => {
        if (!window.confirm("Desfazer o pagamento? O serviço volta a ficar pendente.")) return;
        alterarPagamento(() => desfazerPagamento(idServico));
    };

    const onSave = async (e) => {
        e.preventDefault();

        await handleEdit(SERVICO_ENDPOINT, idServico, fetchServicos);
    };

    // Excluir o serviço devolve as peças ao estoque.
    const refreshAposExcluir = async () => {
        await fetchServicos();
        fetchEstoque({ silent: true });
    };

    const formatarDataBR = (dataStr) => {
        if (!dataStr) return "Sem data";

        // Se a data já vier com '-' do banco, o Date() aceita direto
        if (dataStr.includes('-')) return new Date(dataStr).toLocaleDateString('pt-BR');

        // Se vier com '/', fazemos o swap manual
        const [dia, mes, ano] = dataStr.split('/');
        const data = new Date(`${ano}-${mes}-${dia}T03:00:00`); // T03:00 evita problemas de fuso horário
        return data.toLocaleDateString('pt-BR');
    };

    return(
        <div className={style.card}>
            {isEditing ? (
                <form id="edit-item-form" onSubmit={onSave} className={style.form}>
                    <h1 className={style.titulo}>
                        Editando: {servico.contratante}
                    </h1>

                    <label className={style.label}>Nome:</label>
                    <input
                        name="contratante"
                        type="text"
                        value={formData.contratante}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Nome"
                        required
                    />

                    <label className={style.label}>Data:</label>
                    <input
                        name="data"
                        type="date"
                        value={
                            formData.data?.includes('/')
                                ? formData.data.split('/').reverse().join('-')
                                : formData.data
                        }
                        onChange={handleChange}
                        className={style.input}
                    />

                    <label className={style.label}>Valor cobrado (R$):</label>
                    <input
                        name="valor"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.valor}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Valor"
                    />

                    <label className={style.label}>Tipo:</label>
                    <input
                        name="tipo"
                        type="text"
                        value={formData.tipo}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Tipo"
                    />
                </form>
            ) : (
                <>
                    <div className={style.info}>
                        <h1 className={style.titulo}>{servico.contratante}</h1>

                        <label className={style.label}>Data:</label>
                        <p className={style.tipo}>{formatarDataBR(servico.data)}</p>

                        <label className={style.label}>Valor cobrado:</label>
                        <p className={style.tipo}>{formatBRL(servico.valor)}</p>

                        <label className={style.label}>Tipo:</label>
                        <p className={style.tipo}>{servico.tipo || "N/A"}</p>
                    </div>

                    <section className={style.pagamento}>
                        <h3 className={style.pagamentoTitulo}>
                            <span className="material-symbols-rounded">payments</span>
                            Pagamento
                        </h3>

                        <div className={style.pagamentoLinha}>
                            <StatusBadge servico={{ ...servico, ...pagamento }} />
                            {pago && <span>Recebido em {formatDataBR(pagamento.data_pagamento)}</span>}
                        </div>

                        {pago ? (
                            <div className={style.pagamentoAcoes}>
                                <button
                                    type="button"
                                    className={style.desfazerBtn}
                                    onClick={onDesfazerPagamento}
                                    disabled={salvandoPagamento}
                                >
                                    Desfazer pagamento
                                </button>
                            </div>
                        ) : (
                            <div className={style.pagamentoAcoes}>
                                <input
                                    type="date"
                                    value={dataRecebimento}
                                    min={dataISO(servico.data)}
                                    max={hojeISO()}
                                    onChange={(e) => setDataRecebimento(e.target.value)}
                                    aria-label="Data do recebimento"
                                    disabled={salvandoPagamento}
                                />
                                <button
                                    type="button"
                                    className={style.pagarBtn}
                                    onClick={onMarcarPago}
                                    disabled={salvandoPagamento || !dataRecebimento}
                                >
                                    {salvandoPagamento ? "Salvando..." : "Marcar como pago"}
                                </button>
                            </div>
                        )}
                    </section>

                    <PecasServico
                        pecas={pecas}
                        onAdd={onAddPeca}
                        onChangeQtd={onChangeQtdPeca}
                        onRemove={onRemovePeca}
                        busy={pecasOcupado}
                        valorCobrado={servico.valor}
                    />
                </>
            )}

            <div className={`${style.actionsContainer} ${isEditing ? style.isEditing : style.isViewing}`}>
                {!isEditing && (
                    // Recibo (pago) ou orçamento (pendente), aberto em outra aba
                    <button
                        type="button"
                        className={style.docBtnAction}
                        onClick={() => window.open(documentoServicoUrl(idServico), '_blank')}
                    >
                        <span className="material-symbols-rounded">description</span>
                        {pago ? "Ver recibo" : "Ver orçamento"}
                    </button>
                )}

                <button onClick={toggleEditing} className={style.editBtnAction}>
                    {isEditing ? "Cancelar" : "Editar"}
                </button>

                {!isEditing && (
                    <button
                        className={style.deleteBtnAction}
                        onClick={() => handleDelete(SERVICO_ENDPOINT, idServico, servico.contratante, refreshAposExcluir)}
                        disabled={isSaving || pecasOcupado}
                    >
                        Excluir
                    </button>
                )}

                {isEditing && (
                    <button
                        className={style.saveBtnAction}
                        type="submit"
                        disabled={isSaving}
                        form="edit-item-form"
                    >
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ServicoAction;
