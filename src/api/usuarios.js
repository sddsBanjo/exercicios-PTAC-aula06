import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export async function buscarUsuarios(signal) {
    return apiGet("/users", { signal });
}

export async function excluirUsuario(id, signal) {
    await apiDelete(`/users/${id}`, { signal });
}

export async function atualizarUsuario(id, usuario, signal) {
    return apiPut(`/users/${id}`, usuario, { signal });
}

export async function criarUsuario(usuario, signal) {
    return apiPost("/users", usuario, { signal });
}