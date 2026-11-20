import { SERVICO_ENDPOINT } from "../constants/apiUrl.constants.js";
import { request } from "./api.js";
import { listarPecas } from "./servicoPecasService.js";
import { buscarPrestador } from "./prestadorService.js";

// Tudo o que o recibo/orçamento precisa: o serviço, as peças usadas e os dados do prestador.
export const carregarDocumentoServico = async (idServico) => {
    const [servico, pecas, prestador] = await Promise.all([
        request(`${SERVICO_ENDPOINT}/${idServico}`),
        listarPecas(idServico),
        buscarPrestador(),
    ]);
    return { servico, pecas, prestador };
};
