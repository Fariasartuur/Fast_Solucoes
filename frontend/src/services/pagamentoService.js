import { SERVICO_ENDPOINT } from "../constants/apiUrl.constants.js";
import { request } from "./api.js";

// Marca o serviço como pago. Sem data, o backend usa a data de hoje.
// Devolve { id_registro_servico, status, data_pagamento }.
export const marcarComoPago = (idServico, dataPagamento) =>
    request(`${SERVICO_ENDPOINT}/${idServico}/pagamento`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Pago', ...(dataPagamento && { data_pagamento: dataPagamento }) }),
    });

// Desfaz o pagamento: o serviço volta a ficar pendente.
export const desfazerPagamento = (idServico) =>
    request(`${SERVICO_ENDPOINT}/${idServico}/pagamento`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Pendente' }),
    });
