export default function FormularioUsuario({
    usuario,
    carregando = false,
    aoAlterar,
    aoSalvar,
    aoCancelar,
}) {
    return (
        <form className="formulario" onSubmit={aoSalvar}>
            <label>
                Nome
                <input
                    value={usuario.name}
                    onChange={(evento) => aoAlterar("name", evento.target.value)}
                    required
                />
            </label>

            <label>
                E-mail
                <input
                    type="email"
                    value={usuario.email}
                    onChange={(evento) => aoAlterar("email", evento.target.value)}
                    required
                />
            </label>

            <div className="acoes">
                <button type="submit" disabled={carregando}>
                    {carregando ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" className="botao-secundario" onClick={aoCancelar}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}
