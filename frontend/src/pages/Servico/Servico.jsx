import Table from "../../components/Table/Table.jsx";
import { useEffect } from "react";
import { useServicoStore } from "../../store/useServicoStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import { SERVICO_ENDPOINT } from "../../constants/apiUrl.constants.js";
import { formatBRL, formatDataBR } from "../../utils/formatters.js";
import StatusBadge from "./StatusBadge.jsx";
import { documentoServicoUrl } from "../../constants/routes.constants.js";
import style from "./Servico.module.css";

const formatarData = (valor) => formatDataBR(valor);

const STATUS_OPTIONS = [
    { value: 'Pendente', label: 'Pendentes' },
    { value: 'Pago', label: 'Pagos' },
];

// Ícone na coluna "Ações": abre o recibo (pago) ou orçamento (pendente) em outra aba.
const EXTRA_ACTIONS = [
    {
        icon: 'description',
        title: (row) => (row.status === 'Pago' ? 'Ver recibo' : 'Ver orçamento'),
        onClick: (row) => window.open(documentoServicoUrl(row.id_registro_servico), '_blank'),
    },
];

// Colunas exibidas, na ordem. Campos que o backend devolver e não estiverem
// aqui (ex.: colunas futuras) aparecem no fim com o nome gerado automaticamente.
const colunas = {
    contratante: { header: 'Contratante' },
    data: { header: 'Data', accessor: (row) => formatarData(row.data), sortKey: 'date' },
    tipo: { header: 'Tipo' },
    valor: { header: 'Valor cobrado', accessor: (row) => formatBRL(row.valor), sortKey: 'value' },
    custo_pecas: { header: 'Custo peças', accessor: (row) => formatBRL(row.custo_pecas, 'R$ 0,00'), sortKey: 'custo_pecas' },
    lucro: {
        header: 'Lucro',
        sortKey: 'lucro',
        accessor: (row) => (
            <span className={Number(row.lucro) < 0 ? style.prejuizo : style.lucro}>
                {formatBRL(row.lucro, 'R$ 0,00')}
            </span>
        ),
    },
    status: { header: 'Status', accessor: (row) => <StatusBadge servico={row} /> },
    data_pagamento: { header: 'Pago em', accessor: (row) => formatDataBR(row.data_pagamento) },
};

const Servico = () => {
    const { servicos, fetchServicos } = useServicoStore();
    const fetchEstoque = useEstoqueStore((state) => state.fetchEstoque);

    // Excluir um serviço devolve as peças ao estoque, então o estoque também é atualizado.
    const refresh = async () => {
        await fetchServicos();
        fetchEstoque({ silent: true });
    };

    useEffect(() => {
        if (servicos.length === 0) fetchServicos();

    }, [fetchServicos, servicos.length]);

    const chaves = Object.keys(servicos[0] || {}).filter(key => key !== 'id_registro_servico');
    const ordenadas = [
        ...Object.keys(colunas).filter(key => chaves.includes(key)),
        ...chaves.filter(key => !colunas[key]),
    ];

    const columns = ordenadas.map(key => ({
        header: colunas[key]?.header
            ?? key.replaceAll('_', ' ').charAt(0).toUpperCase() + key.replaceAll('_', ' ').slice(1),
        accessor: colunas[key]?.accessor ?? key,
        ...(colunas[key]?.sortKey && { sortKey: colunas[key].sortKey }),
    }));

    return (
        <div style={{ paddingRight: '15px' }}>
            <Table columns={columns} data={servicos} onRefresh={refresh} url={SERVICO_ENDPOINT} statusOptions={STATUS_OPTIONS} extraActions={EXTRA_ACTIONS} />
        </div>
    );
}

export default Servico;
