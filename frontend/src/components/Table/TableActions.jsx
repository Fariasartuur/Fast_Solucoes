import { ROUTES } from "../../constants/routes.constants";
import { useModalStore } from '../../store/useModalStore.js';

import DespesaAction from "../../pages/Despesa/DespesaAction";
import EstoqueAction from "../../pages/Estoque/EstoqueAction.jsx";
import ItemAction from "../../pages/Item/ItemAction.jsx";

const TableActions = ({page}) => {
    const selectedItem = useModalStore((state) => state.selectedItem);

    const renderContent = () => {
        switch (page) {
            case ROUTES.ITEMS.path: return <ItemAction item={selectedItem}/>;
            case ROUTES.DESPESAS.path: return <DespesaAction despesa={selectedItem}/>;
            case ROUTES.ESTOQUE.path: return <EstoqueAction estoque={selectedItem}/>;

            default: return <p>Conteúdo não mapeado.</p>;
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {renderContent()}
        </div>
    );
};

export default TableActions;