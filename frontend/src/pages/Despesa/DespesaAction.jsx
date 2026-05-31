import { useEntityActions } from "../../hooks/useEntityActions";
import { useDespesaStore } from "../../store/useDespesaStore";
import style from "./Despesa.module.css"
import { DESPESAS_ENDPOINT } from "../../constants/apiUrl.constants.js";

const DespesaAction = ({ despesa }) => {
    const { fetchDespesas } = useDespesaStore();

    const {
        isEditing, isSaving, formData,
        toggleEditing, handleChange, handleDelete, handleEdit
    } = useEntityActions(
        {
            nome_despesa: despesa.nome_despesa,
            tipo_despesa: despesa.tipo_despesa,
            valor: despesa.valor,
            data: despesa.data,
            status: despesa.status
        },
        "Despesa"
    );

    const onSave = async (e) => {
        e.preventDefault();

        await handleEdit(DESPESAS_ENDPOINT, despesa.id_despesa_variada, fetchDespesas);
    };

    const formatarDataBR = (dataStr) => {
        if (!dataStr) return "Sem data";
        
        // Se a data já vier com '-' do banco, o Date() aceita direto
        if (dataStr.includes('-')) return new Date(dataStr).toLocaleDateString('pt-BR');

        // Se vier com '/', fazemos o swap manual
        const [dia, mes, ano] = dataStr.split('/');
        const data = new Date(`${ano}-${mes}-${dia}T03:00:00`); // T03:00 evita problemas de fuso horário
        return data.toLocaleDateString('pt-BR');
    };

    return(
        <div className={style.card}>
            {isEditing ? (
                <form id="edit-despesa-form" onSubmit={onSave} className={style.form}>
                    <p className={style.titulo}>Editando: {despesa.nome_despesa}</p>

                    <label className={style.label}>Nome da Despesa:</label>
                    <input
                        name="nome_despesa"
                        value={formData.nome_despesa}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Nome"
                    />

                    
                    <label className={style.label}>Tipo de Despesa:</label>
                    <input 
                        name="tipo_despesa"
                        value={formData.tipo_despesa}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Tipo"
                    />

                    <label className={style.label}>Valor:</label>
                    <input
                        name="valor"
                        type="number"
                        value={formData.valor}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Valor"
                        required
                    />

                    <label className={style.label}>Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={style.select}
                    >
                        <option value="Pendente">Pendente</option>
                        <option value="Paga">Paga</option>
                    </select>

                    <label className={style.label}>Data:</label>
                    <input
                        name="data"
                        type="date"
                        value={
                            formData.data?.includes('/')
                                ? formData.data.split('/').reverse().join('-')
                                : formData.data
                        }
                        onChange={handleChange}
                        className={style.input}
                    />
                </form>
            ) : (
                <div className={style.info}>
                    <h1 className={style.titulo}>{despesa.nome_despesa}</h1>

                    <label className={style.label}>Tipo de Despesa:</label>
                    <p className={style.tipo}>{despesa.tipo_despesa}</p>

                    <label className={style.label}>Valor:</label>
                    <p className={style.valor}>R$ {despesa.valor}</p>

                    <label className={style.label}>Data:</label>
                    <p className={style.data}>
                        {formatarDataBR(despesa.data)}
                    </p>

                    <label className={style.label}>Status:</label>
                    <p className={`${style.status} ${style[despesa.status?.toLowerCase()]}`}>
                        {despesa.status}
                    </p>
                </div>
            )}

            <div className={`${style.actionsContainer} ${isEditing ? style.isEditing : style.isViewing}`}>
                <button onClick={toggleEditing} className={style.editBtn}>
                    {isEditing ? "Cancelar" : "Editar"}
                </button>

                {!isEditing && (
                    <button
                        className={style.deleteBtn}
                        onClick={() => handleDelete(DESPESAS_ENDPOINT, despesa.id_despesa_variada, despesa.nome_despesa, fetchDespesas)}
                        disabled={isSaving}
                    >
                        Excluir
                    </button>
                )}

                {isEditing && (
                    <button
                        className={style.saveBtn}
                        type="submit"
                        disabled={isSaving}
                        form="edit-despesa-form"
                    >
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DespesaAction;