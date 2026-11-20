import { formatDocumento, formatTelefone } from "../../utils/formatters.js";
import { preenchido, temDadosPrestador } from "../../utils/prestador.js";
import style from "./DadosPrestador.module.css";

/**
 * Bloco com os dados do prestador, como aparecem no recibo/orçamento.
 * Mostra apenas os campos preenchidos. Não exibe nada se todos estiverem vazios.
 */
const DadosPrestador = ({ dados }) => {
    if (!temDadosPrestador(dados)) return null;

    const contato = [preenchido(dados.telefone) ? formatTelefone(dados.telefone) : null, dados.email]
        .filter(preenchido)
        .join(' · ');

    return (
        <div className={style.bloco}>
            {preenchido(dados.nome) && <strong className={style.nome}>{dados.nome}</strong>}
            {preenchido(dados.documento) && (
                <span>{String(dados.documento).replace(/\D/g, '').length > 11 ? 'CNPJ' : 'CPF'}: {formatDocumento(dados.documento)}</span>
            )}
            {contato && <span>{contato}</span>}
            {preenchido(dados.cidade) && <span>{dados.cidade}</span>}
            {preenchido(dados.chave_pix) && <span>Chave PIX: {dados.chave_pix}</span>}
        </div>
    );
};

export default DadosPrestador;
