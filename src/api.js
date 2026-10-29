const BASE_URL = "https://jsonplaceholder.typicode.com";

export class ApiError extends Error {
    constructor(status, statusText, message) {
        super(message || `${status} ${statusText}`);
        this.name = "ApiError";
        this.status = status;
        this.statusText = statusText;
    }
}

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
        throw new ApiError(resposta.status, resposta.statusText);
    }

    if (resposta.status === 204) return null;

    return await resposta.json();
}

export async function apiGet(caminho, opcoes = {}) {
    return requisicao(caminho, { method: "GET", ...opcoes });
}

export async function apiPost(caminho, body, opcoes = {}) {
    return requisicao(caminho, { method: "POST", body, ...opcoes });
}

export async function apiPut(caminho, body, opcoes = {}) {
    return requisicao(caminho, { method: "PUT", body, ...opcoes });
}

export async function apiDelete(caminho, opcoes = {}) {
    return requisicao(caminho, { method: "DELETE", ...opcoes });
}