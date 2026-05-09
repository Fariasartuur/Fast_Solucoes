import { useState } from "react";
import { useModalStore } from "../../store/useModalStore.js";
import { useItemStore } from "../../store/useItemStore.js";
import style from "./Item.module.css";

const ItemModal = () => {
    const [loading, setLoading] = useState(false);
    const closeItem = useModalStore((state) => state.closeItem);
    const { fetchItems, addItem } = useItemStore();

    const [formData, setFormData] = useState({
        nome_item: "",
        modelo: "",
        data_inscricao: "",
        categoria: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        addItem(formData)
            .then(() => {
                alert("Item criado com sucesso!");
                fetchItems();
                closeItem();
            })
            .catch((error) => {
                console.error("Erro ao criar item:", error);
                alert("Ocorreu um erro ao salvar. Tente novamente.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h2 className={style.title}>Cadastrar Item</h2>
            </div>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.grid}>
                    <input
                        type="text"
                        name="nome_item"
                        value={formData.nome_item}
                        onChange={handleChange}
                        placeholder="Nome do Item"
                        className={style.input}
                    />
                    <input
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        placeholder="Modelo"
                        className={style.input}
                    />
                    <input
                        type="date"
                        name="data_inscricao"
                        value={formData.data_inscricao}
                        onChange={handleChange}
                        placeholder="Data de Inscrição"
                        className={style.input}
                    />
                    <input
                        type="text"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        placeholder="Categoria"
                        className={style.input}
                    />
                </div>

                <button className={style.saveBtn} type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </div>
    );

};

export default ItemModal;