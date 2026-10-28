export default function ListaUsuarios({
    usuarios,
    carregandoId,
    aoEditar,
    aoExcluir,
    mostrarEditar = false,
}) {
    if (usuarios.length === 0) {
        return <p>Nenhum usuário para mostrar.</p>;
    }

    return (
        <ul className="lista-usuarios">
            {usuarios.map((usuario) => (
                <li key={usuario.id}>
                    <div>
                        <strong>{usuario.name}</strong>
                        <span>{usuario.email}</span>
                    </div>

                    <div className="acoes">
                        {mostrarEditar && (
                            <button
                                type="button"
                                onClick={() => aoEditar(usuario)}
                            >
                                Editar
                            </button>
                        )}
                        {aoExcluir && (
                            <button
                                type="button"
                                className="botao-perigo"
                                disabled={carregandoId === usuario.id}
                                onClick={() => aoExcluir(usuario.id, usuario.name)}
                            >
                                {carregandoId === usuario.id ? "Excluindo..." : "Excluir"}
                            </button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}
