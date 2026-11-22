import { PRESTADOR_ENDPOINT } from "../constants/apiUrl.constants.js";
import { request } from "./api.js";

// Dados do prestador (o próprio técnico) usados nos recibos e orçamentos.
export const buscarPrestador = () => request(PRESTADOR_ENDPOINT);

export const salvarPrestador = (dados) =>
    request(PRESTADOR_ENDPOINT, { method: 'PUT', body: JSON.stringify(dados) });
