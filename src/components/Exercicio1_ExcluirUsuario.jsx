import { useEffect, useState } from "react";
import { buscarUsuarios, excluirUsuario as excluirNaApi } from "../api/usuarios";
import ListaUsuarios from "./ListaUsuarios";

export default function Exercicio1ExcluirUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoId, setCarregandoId] = useState(null);
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

    async function excluirUsuario(id) {
        const listaAnterior = usuarios;
        setErro("");
        setCarregandoId(id);
        setUsuarios((atuais) => atuais.filter((usuario) => usuario.id !== id));

        try {
            await excluirNaApi(id);
        } catch (erroRequisicao) {
            setErro(erroRequisicao.message);
            setUsuarios(listaAnterior);
        } finally {
            setCarregandoId(null);
        }
    }

    if (carregando) return <p>Carregando usuários...</p>;

    return (
        <section>
            <h2>Exercício 1 — Excluir usuário</h2>
            <p>Clique em Excluir. A lista usa filter para remover o usuário.</p>
            {erro && <p className="erro">Erro: {erro}</p>}
            <ListaUsuarios usuarios={usuarios} carregandoId={carregandoId} aoExcluir={excluirUsuario} />
        </section>
    );
}
