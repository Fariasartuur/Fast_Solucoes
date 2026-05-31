import { useEntityActions } from "../../hooks/useEntityActions";
import { useEstoqueStore } from "../../store/useEstoqueStore.js";
import { useItemStore } from "../../store/useItemStore.js";
import style from "./Estoque.module.css"
import { ESTOQUE_ENDPOINT } from "../../constants/apiUrl.constants.js";

const EstoqueAction = ({ estoque }) => {
    const { fetchEstoque } = useEstoqueStore();
    const { items } = useItemStore();

    const {
        isEditing, isSaving, formData,
        toggleEditing, handleChange, handleDelete, handleEdit
    } = useEntityActions(
        {
            id_item: estoque.id_item,
            quantidade: estoque.quantidade
        },
        "Estoque"
    );

    const onSave = async (e) => {
        e.preventDefault();

        await handleEdit(ESTOQUE_ENDPOINT, estoque.id_estoque, fetchEstoque);
    };

    const itemAtual = items.find(i => i.id_item === formData.id_item);
    return(
        <div className={style.card}>
            {isEditing ? (
                <form id="edit-estoque-form" onSubmit={onSave} className={style.form}>
                    <h1 className={style.titulo}>
                        Editando: {itemAtual ? itemAtual.nome_item : "Selecionando..."}
                    </h1>

                    <label className={style.label}>Quantidade:</label>
                    <input
                        name="quantidade"
                        type="number"
                        value={formData.quantidade}
                        onChange={handleChange}
                        className={style.input}
                        placeholder="Quantidade"
                        required
                    />
                </form>
            ) : (
                <div className={style.info}>
                    <h1 className={style.titulo}>{estoque.produto || estoque.nome_item}</h1>

                    <label className={style.label}>ID do Registro:</label>
                    <p className={style.tipo}>{estoque.id_estoque}</p>

                    <label className={style.label}>Quantidade em Estoque:</label>
                    <p className={style.quantidade}>{estoque.quantidade} unidades</p>
                </div>
            )}

            <div className={`${style.actionsContainer} ${isEditing ? style.isEditing : style.isViewing}`}>
                <button onClick={toggleEditing} className={style.editBtn}>
                    {isEditing ? "Cancelar" : "Editar"}
                </button>

                {!isEditing && (
                    <button
                        className={style.deleteBtn}
                        onClick={() => handleDelete(ESTOQUE_ENDPOINT, estoque.id_estoque, estoque.nome_item, fetchEstoque)}
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
                        form="edit-estoque-form"
                    >
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default EstoqueAction;