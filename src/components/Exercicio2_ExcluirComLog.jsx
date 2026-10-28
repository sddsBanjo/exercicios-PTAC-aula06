import { useEffect, useState } from "react";
import { buscarUsuarios, excluirUsuario as excluirNaApi } from "../api/usuarios";
import ListaUsuarios from "./ListaUsuarios";

export default function Exercicio2ExcluirComLog() {
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

    if (carregando) return <p>Carregando usuários...</p>;

    return (
        <section>
            <h2>Exercício 2 — Excluir com mensagem no console</h2>
            <p>Abra o DevTools para ver a mensagem após a resposta de sucesso.</p>
            {erro && <p className="erro">Erro: {erro}</p>}
            <ListaUsuarios usuarios={usuarios} carregandoId={carregandoId} aoExcluir={excluirUsuario} />
        </section>
    );
}
