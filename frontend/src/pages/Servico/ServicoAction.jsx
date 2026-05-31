import { useEntityActions } from "../../hooks/useEntityActions.js";
import { useServicoStore } from "../../store/useServicoStore.js";
import style from "./Servico.module.css"
import { SERVICO_ENDPOINT } from "../../constants/apiUrl.constants.js";

const ServicoAction = ({ servico }) => {
    const { fetchServicos } = useServicoStore();

    const {
        isEditing, isSaving, formData,
        toggleEditing, handleChange, handleDelete, handleEdit
    } = useEntityActions(
        {
            contratante: servico.contratante,
            data: servico.data,
            valor: servico.valor,
            tipo: servico.tipo
        },
        "Servico"
    );

    const onSave = async (e) => {
        e.preventDefault();

        await handleEdit(SERVICO_ENDPOINT, servico.id_registro_servico, fetchServicos);
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
                <form id="edit-item-form" onSubmit={onSave} className={style.form}>
                    <h1 className={style.titulo}>
                        Editando: {servico.nome_item}
                    </h1>

                    <label className={style.label}>Nome:</label>
                    <input
                        name="contratante"
                        type="text"
                        value={formData.contratante}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Nome"
                        required
                    />

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

                    <label className={style.label}>Valor:</label>
                    <input
                        name="valor"
                        type="number"
                        value={formData.valor}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Valor"
                    />

                    <label className={style.label}>Tipo:</label>
                    <input
                        name="tipo"
                        type="text"
                        value={formData.tipo}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Tipo"
                    />
                </form>
            ) : (
                <div className={style.info}>
                    <h1 className={style.titulo}>{servico.contratante}</h1>

                    <label className={style.label}>ID do Registro:</label>
                    <p className={style.tipo}>{servico.id_registro_servico}</p>

                    <label className={style.label}>Data:</label>
                    <p className={style.tipo}>{formatarDataBR(servico.data)}</p>

                    <label className={style.label}>Valor:</label>
                    <p className={style.tipo}>{servico.valor}</p>

                    <label className={style.label}>Tipo:</label>
                    <p className={style.tipo}>{servico.tipo || "N/A"}</p>
                </div>
            )}

            <div className={`${style.actionsContainer} ${isEditing ? style.isEditing : style.isViewing}`}>
                <button onClick={toggleEditing} className={style.editBtnAction}>
                    {isEditing ? "Cancelar" : "Editar"}
                </button>

                {!isEditing && (
                    <button
                        className={style.deleteBtnAction}
                        onClick={() => handleDelete(SERVICO_ENDPOINT, servico.id_registro_servico, servico.contratante, fetchServicos)}
                        disabled={isSaving}
                    >
                        Excluir
                    </button>
                )}

                {isEditing && (
                    <button
                        className={style.saveBtnAction}
                        type="submit"
                        disabled={isSaving}
                        form="edit-item-form"
                    >
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ServicoAction;