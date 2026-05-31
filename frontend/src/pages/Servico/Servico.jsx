import Table from "../../components/Table/Table.jsx";
import { useEffect } from "react";
import { useServicoStore } from "../../store/useServicoStore.js";
import { SERVICO_ENDPOINT } from "../../constants/apiUrl.constants.js";

const sortKeyMap = {
    data_inscricao: 'date',
    nome_item: 'name',
};

const Servico = () => {
    const { servicos, fetchServicos } = useServicoStore();

    useEffect(() => {
        if (servicos.length === 0) fetchServicos();
        
    }, [fetchServicos, servicos.length]);

    const columns = Object.keys(servicos[0] || {})
        .filter(key => key !== 'id_registro_servico')
        .map(key => ({
            header: key.replaceAll('_', ' ').charAt(0).toUpperCase() + key.replaceAll('_', ' ').slice(1),
            accessor: key === 'data'
                ? (row) => {
                    const [year, month, day] = row.data.split('T')[0].split('-');
                    return `${day}/${month}/${year}`;
                }
                : key,
            ...(sortKeyMap[key] && { sortKey: sortKeyMap[key] }),
        }));

    return (
        <div style={{ paddingRight: '15px' }}>
            <Table columns={columns} data={servicos} onRefresh={fetchServicos} url={SERVICO_ENDPOINT} />
        </div>
    );
}

export default Servico;