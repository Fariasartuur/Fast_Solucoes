import Table from "../../components/Table/Table.jsx";
import { useEffect } from "react";
import { useItemStore } from "../../store/useItemStore.js";

const Item = () => {
    const { items, fetchItems } = useItemStore();

    useEffect(() => {
        if (items.length === 0) fetchItems
        
    }, [fetchItems, items.length]);

    const columns = Object.keys(items[0] || {})
    .filter(key => key !== 'id_item')
    .map(key => ({
        header: key.replaceAll('_', ' ').charAt(0).toUpperCase() + key.replaceAll('_', ' ').slice(1),
        accessor: key
    }));

    const formatedItems = items.map(item => ({
        ...item,
        data_inscricao: new Date(item.data_inscricao).toLocaleDateString('pt-BR'),
    }))

    return (
        <div style={{ paddingRight: '15px' }}>
            <Table columns={columns} data={formatedItems} />
        </div>
    );
}

export default Item;