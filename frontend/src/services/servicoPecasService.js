import { SERVICO_ENDPOINT } from "../constants/apiUrl.constants.js";
import { request } from "./api.js";

const pecasUrl = (idServico, idItem) =>
    `${SERVICO_ENDPOINT}/${idServico}/pecas${idItem ? `/${idItem}` : ''}`;

export const listarPecas = (idServico) =>
    request(pecasUrl(idServico));

export const adicionarPeca = (idServico, idItem, quantidade) =>
    request(pecasUrl(idServico), {
        method: 'POST',
        body: JSON.stringify({ id_item: idItem, quantidade }),
    });

export const alterarQuantidadePeca = (idServico, idItem, quantidade) =>
    request(pecasUrl(idServico, idItem), {
        method: 'PUT',
        body: JSON.stringify({ quantidade }),
    });

export const removerPeca = (idServico, idItem) =>
    request(pecasUrl(idServico, idItem), { method: 'DELETE' });
