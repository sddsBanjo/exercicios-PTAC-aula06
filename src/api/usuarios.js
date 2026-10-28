const API_URL = "https://jsonplaceholder.typicode.com/users";

async function verificarResposta(resposta) {
    if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status}`);
    }
    return resposta;
}

export async function buscarUsuarios(signal) {
    const resposta = await fetch(API_URL, { signal });
    await verificarResposta(resposta);
    return resposta.json();
}

export async function excluirUsuario(id, signal) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        signal,
    });
    await verificarResposta(resposta);
    return resposta;
}

export async function atualizarUsuario(id, usuario, signal) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
        signal,
    });
    await verificarResposta(resposta);
    return resposta.json();
}

export async function criarUsuario(usuario, signal) {
    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
        signal,
    });
    await verificarResposta(resposta);
    return resposta.json();
}
