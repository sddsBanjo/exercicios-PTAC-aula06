const BASE_URL = "https://jsonplaceholder.typicode.com";

async function requisicao(caminho, opcoes = {}) {
    const url = `${BASE_URL}${caminho}`;

    const configuracoes = {
        headers: { "Content-Type": "application/json" },
        ...opcoes,
    };

    if (opcoes.body) {
        configuracoes.body = JSON.stringify(opcoes.body);
    }

    const resposta = await fetch(url, configuracoes);

    if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status} ${resposta.statusText}`);
    }

    if (resposta.status === 204) return null;

    return await resposta.json();
}

export async function apiGet(caminho) {
    return requisicao(caminho, { method: "GET" });
}

export async function apiPost(caminho, body) {
    return requisicao(caminho, { method: "POST", body });
}

export async function apiPut(caminho, body) {
    return requisicao(caminho, { method: "PUT", body });
}

export async function apiDelete(caminho) {
    return requisicao(caminho, { method: "DELETE" });
}