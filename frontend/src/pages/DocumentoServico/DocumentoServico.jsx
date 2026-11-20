import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { carregarDocumentoServico } from "../../services/documentoService.js";
import { formatBRL, formatDataBR, hojeISO } from "../../utils/formatters.js";
import { valorPorExtenso, dataPorExtenso } from "../../utils/extenso.js";
import { temDadosPrestador, preenchido } from "../../utils/prestador.js";
import DadosPrestador from "../Prestador/DadosPrestador.jsx";
import style from "./DocumentoServico.module.css";

const numeroDocumento = (id) => String(id).padStart(6, '0');

/**
 * Recibo (serviço pago) ou Orçamento (serviço pendente) de um serviço.
 * Abre em uma aba própria, fora do layout do sistema, para ser impresso
 * ou salvo em PDF. O custo das peças NÃO é exibido (é informação interna do
 * técnico); as peças aparecem só com nome e quantidade.
 */
const DocumentoServico = () => {
    const { id } = useParams();
    const [dados, setDados] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        let ativo = true;
        carregarDocumentoServico(id)
            .then((resultado) => ativo && setDados(resultado))
            .catch((error) => ativo && setErro(error.message));
        return () => { ativo = false; };
    }, [id]);

    const servico = dados?.servico;
    const recibo = servico?.status === 'Pago';
    const titulo = recibo ? 'Recibo' : 'Orçamento';

    // Título da aba (também vira o nome sugerido do arquivo ao salvar em PDF).
    useEffect(() => {
        if (servico) document.title = `${titulo} ${numeroDocumento(servico.id_registro_servico)} - ${servico.contratante}`;
    }, [servico, titulo]);

    if (erro) {
        return <div className={style.fundo}><div className={style.aviso}>Não foi possível abrir o documento: {erro}</div></div>;
    }
    if (!dados) {
        return <div className={style.fundo}><div className={style.aviso}>Carregando documento...</div></div>;
    }

    const { pecas, prestador } = dados;
    const mostrarPrestador = prestador.exibir_nos_documentos && temDadosPrestador(prestador);
    const mostrarPix = mostrarPrestador && preenchido(prestador.chave_pix);
    const dataEmissao = hojeISO();

    return (
        <div className={style.fundo}>
            {/* Barra de ações: aparece só na tela, nunca na impressão/PDF */}
            <div className={style.barra}>
                <div className={style.barraTexto}>
                    <strong>{titulo} Nº {numeroDocumento(servico.id_registro_servico)}</strong>
                    <span>Para gerar o PDF, clique em "Imprimir / Salvar PDF" e escolha <b>Salvar como PDF</b> no destino.</span>
                </div>
                <div className={style.barraBotoes}>
                    <button type="button" className={style.botaoSecundario} onClick={() => window.close()}>
                        Fechar
                    </button>
                    <button type="button" className={style.botaoPrincipal} onClick={() => window.print()}>
                        <span className="material-symbols-rounded">print</span>
                        Imprimir / Salvar PDF
                    </button>
                </div>
            </div>

            <article className={style.folha}>
                {/* Cabeçalho: prestador (se houver) + título e número */}
                <header className={`${style.cabecalho} ${mostrarPrestador ? '' : style.cabecalhoSemPrestador}`}>
                    {mostrarPrestador && <DadosPrestador dados={prestador} />}
                    <div className={style.identificacao}>
                        <h1 className={style.titulo}>{titulo}</h1>
                        <span>Nº {numeroDocumento(servico.id_registro_servico)}</span>
                        <span>Emitido em {formatDataBR(dataEmissao)}</span>
                    </div>
                </header>

                <section className={style.bloco}>
                    <h2>Cliente</h2>
                    <p className={style.cliente}>{servico.contratante}</p>
                </section>

                <section className={style.bloco}>
                    <h2>Serviço</h2>
                    <table className={style.tabela}>
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Data</th>
                                <th className={style.direita}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{servico.tipo || 'Serviço de manutenção'}</td>
                                <td>{formatDataBR(servico.data)}</td>
                                <td className={style.direita}>{formatBRL(servico.valor)}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {pecas.length > 0 && (
                    <section className={style.bloco}>
                        <h2>Peças utilizadas</h2>
                        <table className={style.tabela}>
                            <thead>
                                <tr>
                                    <th>Peça</th>
                                    <th className={style.direita}>Quantidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pecas.map((peca) => (
                                    <tr key={peca.id_item}>
                                        <td>{peca.modelo ? `${peca.nome_item} (${peca.modelo})` : peca.nome_item}</td>
                                        <td className={style.direita}>{peca.quantidade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className={style.nota}>Peças incluídas no valor do serviço.</p>
                    </section>
                )}

                <section className={style.total}>
                    <div className={style.totalLinha}>
                        <span>{recibo ? 'Valor recebido' : 'Valor a pagar'}</span>
                        <strong>{formatBRL(servico.valor)}</strong>
                    </div>
                    <span className={style.extenso}>({valorPorExtenso(servico.valor)})</span>
                </section>

                {recibo ? (
                    // Declaração e assinatura ficam sempre juntas na mesma página ao imprimir
                    <div className={style.fechamento}>
                        <p className={style.declaracao}>
                            Recebi de <strong>{servico.contratante}</strong> a importância de{' '}
                            <strong>{formatBRL(servico.valor)}</strong> ({valorPorExtenso(servico.valor)}),
                            referente ao serviço de <strong>{servico.tipo || 'manutenção'}</strong> realizado
                            em {formatDataBR(servico.data)}, pago em {formatDataBR(servico.data_pagamento)}.
                            Para maior clareza, firmo o presente recibo.
                        </p>

                        <div className={style.assinatura}>
                            <span className={style.localData}>
                                {mostrarPrestador && preenchido(prestador.cidade) ? `${prestador.cidade}, ` : ''}
                                {dataPorExtenso(dataEmissao)}
                            </span>
                            <div className={style.linhaAssinatura} />
                            <span>{mostrarPrestador && preenchido(prestador.nome) ? prestador.nome : 'Assinatura do prestador'}</span>
                        </div>
                    </div>
                ) : (
                    <section className={style.pagamento}>
                        <h2>Pagamento</h2>
                        <p>Situação: <strong>pendente</strong>.</p>
                        {mostrarPix && (
                            <p>Pagamento via PIX — chave: <strong>{prestador.chave_pix}</strong></p>
                        )}
                    </section>
                )}

                <footer className={style.rodape}>
                    Documento gerado em {formatDataBR(dataEmissao)}.
                </footer>
            </article>
        </div>
    );
};

export default DocumentoServico;
