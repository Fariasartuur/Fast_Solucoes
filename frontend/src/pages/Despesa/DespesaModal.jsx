import { useState } from "react";
import { useModalStore } from "../../store/useModalStore.js";
import { useDespesaStore } from "../../store/useDespesaStore.js";
import style from "../Item/Item.module.css";

const DespesaModal = () => {
    const [loading, setLoading] = useState(false);
    const closeDespesa = useModalStore((state) => state.closeDespesa);
    const { addDespesa, fetchDespesas } = useDespesaStore();

    const [formData, setFormData] = useState({
        nome_despesa: "",
        tipo_despesa: "",
        valor: "",
        data: "",
        status: ""
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

        addDespesa(formData)
            .then(() => {
                fetchDespesas();
                alert("Despesa adicionada com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao adicionar despesa:", error);
                alert("Ocorreu um erro ao salvar. Tente novamente.");
            })
            .finally(() => {
                setLoading(false);
                closeDespesa();
            });
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h2 className={style.title}>Cadastrar Despesa</h2>
            </div>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.grid}>
                    <input
                        type="text"
                        name="nome_despesa"
                        value={formData.nome_despesa}
                        onChange={handleChange}
                        placeholder="Nome da Despesa"
                        className={style.input}
                    />
                    <input
                        type="text"
                        name="tipo_despesa"
                        value={formData.tipo_despesa}
                        onChange={handleChange}
                        placeholder="Tipo da Despesa"
                        className={style.input}
                    />
                    <input
                        type="number"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        placeholder="Valor"
                        className={style.input}
                    />
                    <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        placeholder="Data"
                        className={style.input}
                    />
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        placeholder="Status"
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

export default DespesaModal;