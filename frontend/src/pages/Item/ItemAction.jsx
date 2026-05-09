import { useEntityActions } from "../../hooks/useEntityActions";
import { useItemStore } from "../../store/useItemStore.js";
import style from "./Item.module.css"

const ItemAction = ({ item }) => {
    const { items, fetchItems } = useItemStore();

    const {
        isEditing, isSaving, formData,
        toggleEditing, handleChange, handleDelete, handleEdit
    } = useEntityActions(
        {
            categoria: item.categoria,
            nome_item: item.nome_item,
            data_inscricao: item.data_inscricao,
            modelo: item.modelo
        },
        "Item"
    );

    const onSave = async (e) => {
        e.preventDefault();

        await handleEdit("http://localhost:3333/item", item.id_item, fetchItems);
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
                        Editando: {item.nome_item}
                    </h1>

                    <label className={style.label}>Nome:</label>
                    <input
                        name="nome_item"
                        type="text"
                        value={formData.nome_item}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Nome"
                        required
                    />

                    <label className={style.label}>Categoria:</label>
                    <input
                        name="categoria"
                        type="text"
                        value={formData.categoria}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Categoria"
                        required
                    />

                    <label className={style.label}>Modelo:</label>
                    <input
                        name="modelo"
                        type="text"
                        value={formData.modelo}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Modelo"
                    />

                    <label className={style.label}>Data de Inscrição:</label>
                    <input
                        name="data_inscricao"
                        type="date"
                        value={formData.data_inscricao ? formData.data_inscricao.split('T')[0] : ''}
                        onChange={handleChange}
                        className={style.input}
                    />
                </form>
            ) : (
                <div className={style.info}>
                    <h1 className={style.titulo}>{item.nome_item}</h1>

                    <label className={style.label}>ID do Registro:</label>
                    <p className={style.tipo}>{item.id_item}</p>

                    <label className={style.label}>Categoria:</label>
                    <p className={style.tipo}>{item.categoria}</p>

                    <label className={style.label}>Modelo:</label>
                    <p className={style.tipo}>{item.modelo || "N/A"}</p>

                    <label className={style.label}>Data de Inscrição:</label>
                    <p className={style.tipo}>{formatarDataBR(item.data_inscricao)}</p>
                </div>
            )}

            <div className={`${style.actionsContainer} ${isEditing ? style.isEditing : style.isViewing}`}>
                <button onClick={toggleEditing} className={style.editBtnAction}>
                    {isEditing ? "Cancelar" : "Editar"}
                </button>

                {!isEditing && (
                    <button
                        className={style.deleteBtnAction}
                        onClick={() => handleDelete("http://localhost:3333/item", item.id_item, item.nome_item, fetchItems)}
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

export default ItemAction;