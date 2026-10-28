import { useEffect, useState } from "react";
import {
    atualizarUsuario,
    buscarUsuarios,
    excluirUsuario as excluirNaApi,
} from "../api/usuarios";
import ListaUsuarios from "./ListaUsuarios";
import FormularioUsuario from "./FormularioUsuario";

export default function Exercicio4TratamentoErro() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [carregandoId, setCarregandoId] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            try {
                setUsuarios(await buscarUsuarios());
            } catch (erroRequisicao) {
                setErro(erroRequisicao.message);
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    async function excluirUsuario(id, nome) {
        const listaAnterior = usuarios;
        setErro("");
        setCarregandoId(id);
        setUsuarios((atuais) => atuais.filter((usuario) => usuario.id !== id));

        try {
            await excluirNaApi(id);
            console.log(`Usuário ${nome} excluído`);
        } catch (erroRequisicao) {
            setErro(erroRequisicao.message);
            setUsuarios(listaAnterior);
        } finally {
            setCarregandoId(null);
        }
    }

    function alterarCampo(campo, valor) {
        setUsuarioEmEdicao((atual) => ({ ...atual, [campo]: valor }));
    }

    async function salvarEdicao(evento) {
        evento.preventDefault();
        const listaAnterior = usuarios;
        const usuarioEnviado = { ...usuarioEmEdicao };
        setErro("");
        setSalvando(true);

        setUsuarios((atuais) =>
            atuais.map((usuario) =>
                usuario.id === usuarioEnviado.id
                    ? { ...usuario, ...usuarioEnviado }
                    : usuario
            )
        );

        try {
            const usuarioAtualizado = await atualizarUsuario(
                usuarioEnviado.id,
                usuarioEnviado
            );
            setUsuarios((atuais) =>
                atuais.map((usuario) =>
                    usuario.id === usuarioAtualizado.id
                        ? { ...usuario, ...usuarioAtualizado }
                        : usuario
                )
            );
            setUsuarioEmEdicao(null);
        } catch (erroRequisicao) {
            setErro(erroRequisicao.message);
            setUsuarios(listaAnterior);
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) return <p>Carregando usuários...</p>;

    return (
        <section>
            <h2>Exercício 4 — Erros e rollback</h2>
            <p>Em caso de falha, a lista volta ao estado anterior.</p>
            {erro && <p className="erro">Erro: {erro}</p>}
            <ListaUsuarios
                usuarios={usuarios}
                carregandoId={carregandoId}
                mostrarEditar
                aoEditar={(usuario) => setUsuarioEmEdicao({ ...usuario })}
                aoExcluir={excluirUsuario}
            />
            {usuarioEmEdicao && (
                <>
                    <h3>Editando usuário #{usuarioEmEdicao.id}</h3>
                    <FormularioUsuario
                        usuario={usuarioEmEdicao}
                        carregando={salvando}
                        aoAlterar={alterarCampo}
                        aoSalvar={salvarEdicao}
                        aoCancelar={() => setUsuarioEmEdicao(null)}
                    />
                </>
            )}
        </section>
    );
}
