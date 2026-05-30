import Table from "../../components/Table/Table.jsx";
import { useEffect } from "react";
import { useItemStore } from "../../store/useItemStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";

const Estoque = () => {
    const { items, fetchItems } = useItemStore();
    const { estoque, fetchEstoque } = useEstoqueStore();

    useEffect(() => {
        if (items.length === 0) fetchItems();
        fetchEstoque();
    }, [fetchItems, fetchEstoque, items.length]);

    const dadosFormatados = estoque.map(reg => {
        const produto = items.find(i => i.id_item === reg.id_item);
        return {
            ...reg,
            produto: produto ? `${produto.nome_item} (${produto.modelo})` : "Carregando..."
        };
    });

    const columns = [
        { header: "Nome Item", accessor: "nome_item" },
        { header: "Produto", accessor: "produto" },
        { header: "Quantidade", accessor: "quantidade" }
    ];

    return (
        <div style={{ paddingRight: '15px' }}>
            <Table columns={columns} data={dadosFormatados} />
        </div>
    );
}

export default Estoque;