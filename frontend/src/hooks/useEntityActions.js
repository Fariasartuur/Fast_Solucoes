import { useState } from 'react';
import { useModalStore } from '../store/useModalStore.js';

export const useEntityActions = (initialData, entityName) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const closeActions = useModalStore((state) => state.closeActions);

    const toggleEditing = () => setIsEditing(!isEditing);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue;

        if (type === 'checkbox') {
            finalValue = checked;
        } else if (type === 'number' || name === 'quantidade' || name === 'valor') {
            finalValue = value === '' ? '' : Number(value);
        } else {
            finalValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    // Ideal para lidar com o PUT (Update)
    const handleEdit = async (url, id, refreshFn) => {
        setIsSaving(true);
        try {
            const payload = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => {
                    if (
                        typeof value === 'string' &&
                        /^\d{2}\/\d{2}\/\d{4}$/.test(value)
                    ) {
                        return [key, value.split('/').reverse().join('-')];
                    }

                    return [key, value];
                })
            );
            const response = await fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(`${entityName} atualizado com sucesso!`);
                if (refreshFn) await refreshFn(); // Chama o fetch do Zustand (ex: fetchItems)
                closeActions();
            } else {
                alert("Erro ao atualizar os dados no servidor.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro na requisição: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Ideal para lidar com o DELETE
    const handleDelete = async (url, id, name = "", refreshFn = null) => {
        if (!window.confirm(`Tem certeza que deseja excluir ${entityName}: ${name}?`)) return;

        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Excluído com sucesso!");
                if (refreshFn) await refreshFn(); // Atualiza a tabela instantaneamente
                closeActions();
            } else {
                alert("Erro ao excluir o registro.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir: " + error.message);
        }
    };

    return {
        isEditing, isSaving, formData, 
        toggleEditing, handleChange, handleDelete, handleEdit
    };
}