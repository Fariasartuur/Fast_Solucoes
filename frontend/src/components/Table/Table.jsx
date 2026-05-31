import { useState } from "react";
import { useLocation } from "react-router-dom";
import style from './Table.module.css'
import { ROUTES } from "../../constants/routes.constants";

import { useModalStore } from '../../store/useModalStore.js';
import { useDespesaStore } from "../../store/useDespesaStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import { useItemStore } from "../../store/useItemStore.js";
import { useEntityActions } from "../../hooks/useEntityActions.js";

const Table = ({ columns, data, onRefresh, url }) => {
    const location = useLocation();
    const { handleDelete } = useEntityActions({}, "esse registro");

    const [activeFilters, setActiveFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'date', dir: 'desc' });

    const openActions = useModalStore((state) => state.openActions);
    const openItem = useModalStore((state) => state.openItem);
    const openEstoque = useModalStore((state) => state.openEstoque);
    const openDespesa = useModalStore((state) => state.openDespesa);
    const openServico = useModalStore((state) => state.openServico);

    const despesaLoad = useDespesaStore((state) => state.loading);
    const estoqueLoad = useEstoqueStore((state) => state.loading);
    const itemLoad = useItemStore((state) => state.loading);

    if (despesaLoad || estoqueLoad || itemLoad) {
        return <div className={style.loading}>Carregando...</div>;
    }

    const headerButton = {
        [ROUTES.ITEMS.path]: <button onClick={openItem} className={style.addBtn}>Novo Item</button>,
        [ROUTES.ESTOQUE.path]: <button onClick={openEstoque} className={style.addBtn}>Novo Estoque</button>,
        [ROUTES.DESPESAS.path]: <button onClick={openDespesa} className={style.addBtn}>Nova Despesa</button>,
        [ROUTES.SERVICOS.path]: <button onClick={openServico} className={style.addBtn}>Novo Serviço</button>,
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc'
        }));
    };

    const handleDeleteClick = async (row) => {
        const idKey = Object.keys(row).find(key => key.includes('id'));
        if (!idKey) {
            alert("ID do registro não encontrado.");
            return;
        }
        await handleDelete(url, row[idKey],  "Teste", onRefresh);
    };

    const SortIcon = ({ colKey }) => {
        if (sortConfig.key !== colKey) {
            return <span className={style.sortIcon}>↕</span>;
        }
        return (
            <span className={`${style.sortIcon} ${style.sortActive}`}>
                {sortConfig.dir === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    const filteredData = data.filter(row => {
        const searchMatch = Object.entries(row).some(([key, value]) => {
            if (key.includes('id')) return false;
            return String(value)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        });

        const categoryMatch = activeFilters.categoria
            ? String(row.categoria || "").toLowerCase() === activeFilters.categoria.toLowerCase()
            : true;

        const statusMatch = activeFilters.status
            ? String(row.status || "").toLowerCase() === activeFilters.status.toLowerCase()
            : true;

        return searchMatch && statusMatch && categoryMatch;

    }).sort((a, b) => {
        const { key, dir } = sortConfig;
        let result = 0;

        if (key === 'name') {
            const nameA = a.nome_item || a.nome_despesa || a.nome || "";
            const nameB = b.nome_item || b.nome_despesa || b.nome || "";
            result = nameA.localeCompare(nameB);
        } else if (key === 'date') {
            const dateA = new Date(a.data_inscricao || a.data || 0);
            const dateB = new Date(b.data_inscricao || b.data || 0);
            result = dateB - dateA;
        } else if (key === 'value') {
            result = (b.valor || 0) - (a.valor || 0);
        } else if (key === 'quantity') {
            result = (b.quantidade || 0) - (a.quantidade || 0);
        }

        return dir === 'asc' ? result : -result;
    });

    return (
        <div>
            <div className={style.opcoes}>
                <input
                    type="search"
                    className={style.search}
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className={style.botoes}>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setActiveFilters({ status: "", categoria: "" });
                            setSortConfig({ key: 'date', dir: 'desc' });
                        }}
                        className={style.clearButton}
                    >
                        Limpar Filtros &times;
                    </button>

                    {headerButton[location.pathname] && (
                        <div>
                            {headerButton[location.pathname]}
                        </div>
                    )}
                </div>
            </div>

            <br />

            <table className={style.table}>
                <thead className={style.thead}>
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`${style.th} ${col.sortKey ? style.thSortable : ''}`}
                                onClick={() => col.sortKey && handleSort(col.sortKey)}
                            >
                                <span className={style.thInner}>
                                    {col.header}
                                    {col.sortKey && <SortIcon colKey={col.sortKey} />}
                                </span>
                            </th>
                        ))}
                        <th className={style.th}>
                            <span className={style.thInner}>Ações</span>
                        </th>
                    </tr>
                </thead>
                <tbody className={style.tbody}>
                    {filteredData.length > 0 ? (
                        filteredData.map((row, rowIndex) => (
                            <tr key={rowIndex} className={style.tr}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={style.td}>
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(row)
                                            : row[col.accessor]}
                                    </td>
                                ))}
                                <td className={style.actionsTd} >
                                    <span onClick={() => openActions(row)} className={`material-symbols-rounded ${style.actionIcon}`}>more_horiz</span>
                                    <span onClick={() => handleDeleteClick(row)} className={`material-symbols-rounded ${style.deleteIcon}`}>delete</span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className={style.empty}>
                                Nenhum registro encontrado "{searchTerm}".
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;