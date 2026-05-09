import { useState, useEffect } from "react";
import { useModalStore } from "../../store/useModalStore.js";
import { useItemStore } from "../../store/useItemStore.js";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import style from "../Item/Item.module.css";

const EstoqueModal = () => {
    const { fetchEstoque, addEstoque } = useEstoqueStore();
    const { fetchItems, items } = useItemStore();
    const [loading, setLoading] = useState(false);
    const closeEstoque = useModalStore((state) => state.closeEstoque);

    const [formData, setFormData] = useState({
        id_item: "",
        produto: "",
        quantidade: "",
    });

    useEffect(() => {
        if (items.length === 0) {
            fetchItems();
        }
    }, [items, fetchItems]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantidade' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.id_item) {
            alert("Selecione um item!");
            return;
        }

        setLoading(true);

        addEstoque(formData)
            .then(() => {
                fetchEstoque();
                closeEstoque();
            })
            .catch((error) => {
                console.error("Erro ao adicionar estoque:", error);
                alert("Ocorreu um erro ao salvar. Tente novamente.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h2 className={style.title}>Cadastrar Estoque</h2>
            </div>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.grid}>
                    {/* 2. Select dinâmico com os itens do banco */}
                    <select
                        name="id_item"
                        value={formData.id_item}
                        onChange={handleChange}
                        className={style.input}
                        required
                    >
                        <option value="">Selecione um Item</option>
                        {items.map((item) => (
                            <option key={item.id_item} value={item.id_item}>
                                {item.nome_item} {item.modelo ? `- ${item.modelo}` : ''}
                            </option>
                        ))}
                    </select>

                    <input 
                        type="text"
                        name="produto"
                        value={formData.produto}
                        onChange={handleChange}
                        placeholder="Produto"
                        className={style.input}
                        required
                    />

                    <input
                        type="number"
                        name="quantidade"
                        value={formData.quantidade}
                        onChange={handleChange}
                        placeholder="Quantidade"
                        className={style.input}
                        required
                        min="1"
                    />
                </div>

                <button className={style.saveBtn} type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </div>
    );
};

export default EstoqueModal;