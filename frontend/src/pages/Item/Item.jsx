import Table from "../../components/Table/Table.jsx";
import { useEffect } from "react";
import { useItemStore } from "../../store/useItemStore.js";
import { ITEM_ENDPOINT } from "../../constants/apiUrl.constants.js";
import { formatBRL } from "../../utils/formatters.js";

const headerMap = {
    preco_custo: 'Preço de custo',
};

const accessorMap = {
    data_inscricao: (row) => {
        const [year, month, day] = row.data_inscricao.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    },
    preco_custo: (row) => formatBRL(row.preco_custo),
};

const sortKeyMap = {
    data_inscricao: 'date',
    nome_item: 'name',
};

const Item = () => {
    const { items, fetchItems } = useItemStore();

    useEffect(() => {
        if (items.length === 0) fetchItems();
        
    }, [fetchItems, items.length]);

    const columns = Object.keys(items[0] || {})
        .filter(key => key !== 'id_item')
        .map(key => ({
            header: headerMap[key] ?? key.replaceAll('_', ' ').charAt(0).toUpperCase() + key.replaceAll('_', ' ').slice(1),
            accessor: accessorMap[key] ?? key,
            ...(sortKeyMap[key] && { sortKey: sortKeyMap[key] }),
        }));

    return (
        <div style={{ paddingRight: '15px' }}>
            <Table columns={columns} data={items} onRefresh={fetchItems} url={ITEM_ENDPOINT} />
        </div>
    );
}

export default Item;