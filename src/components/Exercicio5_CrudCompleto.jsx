import { useEffect, useRef, useState } from "react";
import {
    atualizarUsuario,
    buscarUsuarios,
    criarUsuario,
    excluirUsuario as excluirNaApi,
} from "../api/usuarios";
import ListaUsuarios from "./ListaUsuarios";
import FormularioUsuario from "./FormularioUsuario";
import { ApiError } from "../api";

const FORM_VAZIO = { name: "", email: "" };

function mensagemErro(erro) {
    if (erro instanceof ApiError && erro.status === 404) {
        return "Recurso não encontrado";
    }

    if (erro instanceof ApiError && erro.status >= 500) {
        return "Erro no servidor";
    }

    if (erro instanceof TypeError) {
        return "Falha de rede";
    }

    return erro.message;
}

export default function Exercicio5CrudCompleto() {
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [carregandoId, setCarregandoId] = useState(null);
    const [erro, setErro] = useState("");
    const [formVisivel, setFormVisivel] = useState(false);
    const [idEmEdicao, setIdEmEdicao] = useState(null);
    const [form, setForm] = useState(FORM_VAZIO);
    const controllersAtivos = useRef(new Set());

    function novoController() {
        const controller = new AbortController();
        controllersAtivos.current.add(controller);
        return controller;
    }

    function liberarController(controller) {
        controllersAtivos.current.delete(controller);
    }

    useEffect(() => {
        const controller = new AbortController();
        controllersAtivos.current.add(controller);

        async function carregar() {
            try {
                setUsuarios(await buscarUsuarios(controller.signal));
            } catch (erroRequisicao) {
                if (erroRequisicao.name !== "AbortError") {
                    setErro(mensagemErro(erroRequisicao));
                }
            } finally {
                controllersAtivos.current.delete(controller);
                if (!controller.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        carregar();

        return () => {
            controllersAtivos.current.forEach((ativo) => ativo.abort());
            controllersAtivos.current.clear();
        };
    }, []);

    function abrirNovo() {
        setIdEmEdicao(null);
        setForm(FORM_VAZIO);
        setErro("");
        setFormVisivel(true);
    }

    function abrirEdicao(usuario) {
        setIdEmEdicao(usuario.id);
        setForm({ name: usuario.name, email: usuario.email });
        setErro("");
        setFormVisivel(true);
    }

    function fecharForm() {
        setFormVisivel(false);
        setIdEmEdicao(null);
        setForm(FORM_VAZIO);
    }

    function alterarCampo(campo, valor) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    }

    async function salvarForm(evento) {
        evento.preventDefault();
        const listaAnterior = usuarios;
        const editando = idEmEdicao !== null;
        const controller = novoController();
        setErro("");
        setSalvando(true);

        try {
            const usuarioSalvo = editando
                ? await atualizarUsuario(
                    idEmEdicao,
                    { id: idEmEdicao, ...form },
                    controller.signal
                )
                : await criarUsuario(form, controller.signal);

            if (editando) {
                setUsuarios((atuais) =>
                    atuais.map((usuario) =>
                        usuario.id === idEmEdicao
                            ? { ...usuario, ...usuarioSalvo }
                            : usuario
                    )
                );
            } else {
                setUsuarios((atuais) => {
                    const idExiste = atuais.some(
                        (usuario) => usuario.id === usuarioSalvo.id
                    );
                    const novoUsuario = {
                        ...usuarioSalvo,
                        id: idExiste ? Date.now() : usuarioSalvo.id,
                    };
                    return [...atuais, novoUsuario];
                });
            }
            fecharForm();
        } catch (erroRequisicao) {
            if (erroRequisicao.name !== "AbortError") {
                setErro(mensagemErro(erroRequisicao));
                setUsuarios(listaAnterior);
            }
        } finally {
            liberarController(controller);
            setSalvando(false);
        }
    }

    async function excluirUsuario(id, nome) {
        const listaAnterior = usuarios;
        const controller = novoController();
        setErro("");
        setCarregandoId(id);
        setUsuarios((atuais) => atuais.filter((usuario) => usuario.id !== id));

        try {
            await excluirNaApi(id, controller.signal);
            console.log(`Usuário ${nome} excluído`);
        } catch (erroRequisicao) {
            if (erroRequisicao.name !== "AbortError") {
                setErro(mensagemErro(erroRequisicao));
                setUsuarios(listaAnterior);
            }
        } finally {
            liberarController(controller);
            setCarregandoId(null);
        }
    }

    if (carregando) return <p>Carregando usuários...</p>;

    return (
        <section>
            <h2>Exercício 5 — Mini-CRUD completa</h2>
            <p>Crie, edite e exclua usuários. As requisições são canceladas ao sair deste exercício.</p>

            {erro && <p className="erro">Erro: {erro}</p>}
            <button type="button" onClick={abrirNovo}>Novo usuário</button>

            <ListaUsuarios
                usuarios={usuarios}
                carregandoId={carregandoId}
                mostrarEditar
                aoEditar={abrirEdicao}
                aoExcluir={excluirUsuario}
            />

            {formVisivel && (
                <>
                    <h3>{idEmEdicao === null ? "Novo usuário" : `Editando usuário #${idEmEdicao}`}</h3>
                    <FormularioUsuario
                        usuario={form}
                        carregando={salvando}
                        aoAlterar={alterarCampo}
                        aoSalvar={salvarForm}
                        aoCancelar={fecharForm}
                    />
                </>
            )}
        </section>
    );
}
