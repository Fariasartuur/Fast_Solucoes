import Table from "../../components/Table/Table.jsx";
import { useEffect } from "react";
import { useItemStore } from "../../store/useItemStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import { ESTOQUE_ENDPOINT } from "../../constants/apiUrl.constants.js";

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
        { header: "Nome Item",   accessor: "nome_item",  sortKey: "name"     },
        { header: "Produto",     accessor: "produto"                          },
        { header: "Quantidade",  accessor: "quantidade", sortKey: "quantity"  },
    ];

    return (
        <div style={{ paddingRight: '15px' }}>
            <Table columns={columns} data={dadosFormatados} onRefresh={fetchEstoque} url={ESTOQUE_ENDPOINT} />
        </div>
    );
}

export default Estoque;