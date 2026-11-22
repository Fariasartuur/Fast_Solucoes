import { useEffect, useState } from "react";
import { buscarPrestador, salvarPrestador } from "../../services/prestadorService.js";
import { formatDocumento } from "../../utils/formatters.js";
import { temDadosPrestador } from "../../utils/prestador.js";
import DadosPrestador from "./DadosPrestador.jsx";
import style from "./Prestador.module.css";

const CAMPOS = [
    { name: 'nome', label: 'Nome ou nome da empresa', placeholder: 'Ex.: João Silva Manutenção de Equipamentos', maxLength: 100 },
    { name: 'documento', label: 'CPF ou CNPJ', placeholder: 'Ex.: 123.456.789-01', maxLength: 18 },
    { name: 'telefone', label: 'Telefone / WhatsApp', placeholder: 'Ex.: (11) 98765-4321', maxLength: 20 },
    { name: 'email', label: 'E-mail', placeholder: 'Ex.: joao@email.com', maxLength: 100, type: 'email' },
    { name: 'cidade', label: 'Cidade', placeholder: 'Ex.: Campinas - SP', maxLength: 100 },
    { name: 'chave_pix', label: 'Chave PIX', placeholder: 'Para a academia fazer o pagamento', maxLength: 100 },
];

const VAZIO = Object.fromEntries(CAMPOS.map((campo) => [campo.name, '']));

// Converte o que veio do backend (null) para o formulário (texto vazio).
const paraFormulario = (dados) => Object.fromEntries(
    CAMPOS.map(({ name }) => [name, name === 'documento' ? formatDocumento(dados[name] ?? '') : (dados[name] ?? '')])
);

const Prestador = () => {
    const [form, setForm] = useState(VAZIO);
    const [exibir, setExibir] = useState(true);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState(null); // { tipo: 'ok' | 'erro', texto }

    useEffect(() => {
        let ativo = true;
        buscarPrestador()
            .then((dados) => {
                if (!ativo) return;
                setForm(paraFormulario(dados));
                setExibir(dados.exibir_nos_documentos);
            })
            .catch((error) => ativo && setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar seus dados: ' + error.message }))
            .finally(() => ativo && setCarregando(false));
        return () => { ativo = false; };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setMensagem(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSalvando(true);
        setMensagem(null);
        try {
            const salvo = await salvarPrestador({ ...form, exibir_nos_documentos: exibir });
            setForm(paraFormulario(salvo));
            setExibir(salvo.exibir_nos_documentos);
            setMensagem({ tipo: 'ok', texto: 'Dados salvos com sucesso.' });
        } catch (error) {
            setMensagem({ tipo: 'erro', texto: error.message });
        } finally {
            setSalvando(false);
        }
    };

    const limpar = () => {
        if (!window.confirm('Apagar todos os campos? Os dados só serão removidos depois de clicar em "Salvar".')) return;
        setForm(VAZIO);
        setMensagem(null);
    };

    if (carregando) {
        return <div className={style.pagina}><div className={style.card}>Carregando...</div></div>;
    }

    return (
        <div className={style.pagina}>
            <form className={style.card} onSubmit={handleSubmit}>
                <h2 className={style.titulo}>Seus dados nos recibos e orçamentos</h2>
                <p className={style.descricao}>
                    Estas informações aparecem no cabeçalho dos recibos e orçamentos enviados às academias.
                    <strong> Todos os campos são opcionais</strong>: preencha só o que quiser mostrar.
                </p>

                <div className={style.grid}>
                    {CAMPOS.map((campo) => (
                        <label key={campo.name} className={style.campo}>
                            <span>{campo.label}</span>
                            <input
                                type={campo.type ?? 'text'}
                                name={campo.name}
                                value={form[campo.name]}
                                onChange={handleChange}
                                placeholder={campo.placeholder}
                                maxLength={campo.maxLength}
                                disabled={salvando}
                            />
                        </label>
                    ))}
                </div>

                <label className={style.exibir}>
                    <input
                        type="checkbox"
                        checked={exibir}
                        onChange={(e) => { setExibir(e.target.checked); setMensagem(null); }}
                        disabled={salvando}
                    />
                    Mostrar meus dados nos recibos e orçamentos
                </label>

                {mensagem && (
                    <p className={mensagem.tipo === 'ok' ? style.ok : style.erro}>{mensagem.texto}</p>
                )}

                <div className={style.acoes}>
                    <button type="button" className={style.limparBtn} onClick={limpar} disabled={salvando}>
                        Limpar campos
                    </button>
                    <button type="submit" className={style.salvarBtn} disabled={salvando}>
                        {salvando ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>

            <aside className={style.card}>
                <h2 className={style.titulo}>Como vai aparecer</h2>
                <div className={style.previa}>
                    {!exibir ? (
                        <p className={style.semDados}>
                            Seus dados <strong>não</strong> serão exibidos nos documentos.
                        </p>
                    ) : temDadosPrestador(form) ? (
                        <DadosPrestador dados={form} />
                    ) : (
                        <p className={style.semDados}>
                            Nenhum dado preenchido. Os documentos serão gerados sem os seus dados.
                        </p>
                    )}
                </div>
                <p className={style.dica}>A prévia muda enquanto você digita. Lembre-se de clicar em "Salvar".</p>
            </aside>
        </div>
    );
};

export default Prestador;
