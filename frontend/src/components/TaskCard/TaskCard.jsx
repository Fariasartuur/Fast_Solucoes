import { useState } from 'react';
import styles from './TaskCard.module.css';

const TaskCard = () => {
    const [tasks, setTasks] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const toggleInput = () => {
        setShowInput(!showInput);
        setInputValue('');
    };

    const addTask = () => {
        const text = inputValue.trim();
        if (!text) return;
        setTasks([...tasks, { id: Date.now(), text, done: false }]);
        setInputValue('');
        setShowInput(false);
    };

    const handleKey = (e) => {
        if (e.key === 'Enter') addTask();
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const pending = tasks.filter(t => !t.done).length;

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Tarefas</h2>
                <div className={styles.headerRight}>
                    <span className={styles.badge}>{pending}</span>
                    <button className={styles.btnAdd} onClick={toggleInput}>
                        <span className="material-symbols-rounded">add</span>
                        Nova tarefa
                    </button>
                </div>
            </div>

            <div className={styles.cardBody}>
                {showInput && (
                    <div className={styles.inputArea}>
                        <input
                            className={styles.taskInput}
                            type="text"
                            placeholder="Digite uma tarefa..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKey}
                            autoFocus
                        />
                        <button className={styles.btnConfirm} onClick={addTask}>
                            Adicionar
                        </button>
                    </div>
                )}

                {tasks.length === 0 ? (
                    <div className={styles.empty}>
                        <span className="material-symbols-rounded">check_circle</span>
                        Nenhuma tarefa
                    </div>
                ) : (
                    tasks.map(t => (
                        <div key={t.id} className={styles.taskItem}>
                            <div
                                className={`${styles.taskCheck} ${t.done ? styles.checked : ''}`}
                                onClick={() => toggleTask(t.id)}
                            />
                            <span className={`${styles.taskLabel} ${t.done ? styles.done : ''}`}>
                                {t.text}
                            </span>
                            <button className={styles.taskDelete} onClick={() => deleteTask(t.id)}>
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskCard;