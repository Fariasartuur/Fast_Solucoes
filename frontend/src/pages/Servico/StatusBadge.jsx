import { diasDesde, textoDias } from "../../utils/formatters.js";
import style from "./Servico.module.css";

// Etiqueta colorida do status de pagamento do serviço.
// Pendentes mostram há quantos dias o serviço foi feito (tempo em aberto).
const StatusBadge = ({ servico }) => {
    if (servico.status === 'Pago') {
        return <span className={`${style.badge} ${style.badgePago}`}>Pago</span>;
    }
    return (
        <span className={`${style.badge} ${style.badgePendente}`}>
            Pendente · {textoDias(diasDesde(servico.data))}
        </span>
    );
};

export default StatusBadge;
