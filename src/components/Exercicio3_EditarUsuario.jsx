import { useEffect, useState } from "react";
import { atualizarUsuario, buscarUsuarios } from "../api/usuarios";
import ListaUsuarios from "./ListaUsuarios";
import FormularioUsuario from "./FormularioUsuario";

export default function Exercicio3EditarUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
    const [carregando, setCarregando] = useState(true);
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

    function alterarCampo(campo, valor) {
        setUsuarioEmEdicao((atual) => ({ ...atual, [campo]: valor }));
    }

    async function salvarEdicao(evento) {
        evento.preventDefault();
        const listaAnterior = usuarios;
        const usuarioEnviado = { ...usuarioEmEdicao };
        setErro("");
        setSalvando(true);

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
            <h2>Exercício 3 — Editar usuário</h2>
            {erro && <p className="erro">Erro: {erro}</p>}
            <ListaUsuarios
                usuarios={usuarios}
                mostrarEditar
                aoEditar={(usuario) => setUsuarioEmEdicao({ ...usuario })}
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
