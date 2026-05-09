import { useState } from "react";
import { useLocation } from "react-router-dom";
import style from './Table.module.css'
import { ROUTES } from "../../constants/routes.constants";

import { useModalStore } from '../../store/useModalStore.js';
import { useDespesaStore } from "../../store/useDespesaStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import { useItemStore } from "../../store/useItemStore.js";

const Table = ({ columns, data }) => {
    const location = useLocation();
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const openActions = useModalStore((state) => state.openActions);
    const openItem = useModalStore((state) => state.openItem);
    const openEstoque = useModalStore((state) => state.openEstoque);
    const openDespesa = useModalStore((state) => state.openDespesa);

    const despesaLoad = useDespesaStore((state) => state.loading);
    const estoqueLoad = useEstoqueStore((state) => state.loading);
    const itemLoad = useItemStore((state) => state.loading);

    if(despesaLoad || estoqueLoad || itemLoad) {
        return <div className={style.loading}>Carregando...</div>;
    }

    const headerButton = {
        [ROUTES.ITEMS.path]: <button onClick={openItem} className={style.addBtn}>Novo Item</button>,
        [ROUTES.ESTOQUE.path]: <button onClick={openEstoque} className={style.addBtn}>Novo Estoque</button>,
        [ROUTES.DESPESAS.path]: <button onClick={openDespesa} className={style.addBtn}>Nova Despesa</button>,
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
        if (activeFilters.sort === 'name') {
            const nameA = a.nome_item || a.nome_despesa || a.nome || "";
            const nameB = b.nome_item || b.nome_despesa || b.nome || "";
            return nameA.localeCompare(nameB);
        }

        if (activeFilters.sort === 'date') {
            const dateA = new Date(a.data_inscricao || a.data || 0);
            const dateB = new Date(b.data_inscricao || b.data || 0);
            return dateB - dateA;
        }

        if (activeFilters.sort === 'value') {
            return (a.valor || 0) - (b.valor || 0);
        }

        if(activeFilters.sort === 'quantity') {
            return (a.quantidade || 0) - (b.quantidade || 0);
        }

        return 0;
    });

    const uniqueStatus = [...new Set(data.map(item => item.status || item.active).filter(Boolean))];
    const uniqueCategories = [...new Set(data.map(item => item.categoria).filter(Boolean))];

    return (
        <div className="overflow-x-auto rounded-lg border border-emerald-600 shadow-sm">
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
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={style.filterButton}
                    >
                        Filtros
                    </button>

                    {headerButton[location.pathname] && (
                        <div>
                            {headerButton[location.pathname]}
                        </div>
                    )}

                </div>
            </div>

            {isFilterOpen && (
                <div className={style.filterBar}>
                    {uniqueStatus.length > 0 &&
                        <div className={style.filterGroup}>
                            <label className={style.label}>Status</label>
                            <select
                                value={activeFilters.status || ""}
                                onChange={(e) => setActiveFilters({ ...activeFilters, status: e.target.value })}
                                className={style.select}
                            >
                                <option value="">Todos</option>
                                {uniqueStatus.map((status, index) => (
                                    <option key={index} value={status}>
                                        {String(status).charAt(0).toUpperCase() + String(status).slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }

                    {uniqueCategories.length > 0 && (
                        <div className={style.filterGroup}>
                            <label className={style.label}>Categoria</label>
                            <select
                                value={activeFilters.categoria || ""}
                                onChange={(e) => setActiveFilters({ ...activeFilters, categoria: e.target.value })}
                                className={style.select}
                            >
                                <option value="">Todas</option>
                                {uniqueCategories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {String(cat)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}


                    <div className={style.filterGroup}>
                        <label className={style.label}>Ordenar por</label>
                        <select
                            value={activeFilters.sort || "name"}
                            onChange={(e) => setActiveFilters({ ...activeFilters, sort: e.target.value })}
                            className={style.select}
                        >
                            <option value="name">Nome (A-Z)</option>
                            <option value="date">Data Recente</option>
                            <option value="quantity">Quantidade</option>
                        </select>
                    </div>

                    <div className={style.filterActions}>
                        <button
                            onClick={() => { setSearchTerm(""); setActiveFilters({ status: "", sort: "name" }) }}
                            className={style.clearButton}
                        >
                            Limpar tudo
                        </button>

                        <button onClick={() => setIsFilterOpen(false)} className={style.closeButton}>
                            <span className="material-symbols-rounded">close</span>
                        </button>
                    </div>
                </div>
            )}

            <br />

            <table className={style.table}>
                <thead className={style.thead}>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={style.th}>
                                {col.header}
                            </th>
                        ))}
                        <th className={style.th}>Ações</th>
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
                                <td className={style.actionsTd} onClick={() => openActions(row)}>
                                    <span className="material-symbols-rounded">more_horiz</span>
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