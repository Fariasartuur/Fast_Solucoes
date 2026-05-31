import { useState } from "react";
import { useModalStore } from "../../store/useModalStore.js";
import { useServicoStore } from "../../store/useServicoStore.js";
import style from "./Servico.module.css";

const ServicoModal = () => {
    const [loading, setLoading] = useState(false);
    const closeServico = useModalStore((state) => state.closeServico);
    const { fetchServicos, addServico } = useServicoStore();

    const [formData, setFormData] = useState({
        contratante: "",
        data: "",
        valor: "",
        tipo: ""
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

        addServico(formData)
            .then(() => {
                alert("Serviço criado com sucesso!");
                fetchServicos();
                closeServico();
            })
            .catch((error) => {
                console.error("Erro ao criar serviço:", error);
                alert("Ocorreu um erro ao salvar. Tente novamente.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h2 className={style.title}>Cadastrar Serviço</h2>
            </div>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.grid}>
                    <input
                        type="text"
                        name="contratante"
                        value={formData.contratante}
                        onChange={handleChange}
                        placeholder="Nome do Contratante"
                        className={style.input}
                        required
                    />
                    <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        placeholder="Data"
                        className={style.input}
                        required
                    />
                    <input
                        type="number"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        placeholder="Valor"
                        className={style.input}
                        required
                    />
                    <input
                        type="text"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        placeholder="Tipo"
                        className={style.input}
                        required
                    />
                </div>

                <button className={style.saveBtn} type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </div>
    );

};

export default ServicoModal;