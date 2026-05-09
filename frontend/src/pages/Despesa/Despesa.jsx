import Table from "../../components/Table/Table.jsx";
import { useEffect } from "react";
import { useDespesaStore } from "../../store/useDespesaStore.js";

const Despesa = () => {
    const { despesas, fetchDespesas } = useDespesaStore();

    useEffect(() => {
        if (despesas.length === 0) fetchDespesas();
    }, [fetchDespesas, despesas.length]);

    const columns = Object.keys(despesas[0] || {})
    .filter(key => key !== 'id_despesa_variada' && key !== 'id_item')
    .map(key => ({
        header: key.replaceAll('_', ' ').charAt(0).toUpperCase() + key.replaceAll('_', ' ').slice(1),
        accessor: key
    }));

    const formatedDespesas = despesas.map(despesa => ({
        ...despesa,
        data: new Date(despesa.data).toLocaleDateString('pt-BR'),
    }))

    return (
        <div style={{ paddingRight: '15px' }}>
            <Table columns={columns} data={formatedDespesas} />
        </div>
    );
}

export default Despesa;