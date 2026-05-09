import style from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // Fecha o modal ao clicar no fundo escuro (Overlay)
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={style.modalOverlay} onClick={handleOverlayClick}>
            <div className={style.modalBox}>
                <button 
                    onClick={onClose} 
                    className={style.closeBtn}
                    aria-label="Fechar modal"
                >
                    &times;
                </button>
                
                <div className={style.modalContent}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;