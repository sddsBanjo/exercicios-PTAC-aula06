import { useState } from "react";
import Exercicio1 from "./components/Exercicio1_ExcluirUsuario";
import Exercicio2 from "./components/Exercicio2_ExcluirComLog";
import Exercicio3 from "./components/Exercicio3_EditarUsuario";
import Exercicio4 from "./components/Exercicio4_TratamentoErro";
import Exercicio5 from "./components/Exercicio5_CrudCompleto";

const EXERCICIOS = [
    { id: "1", titulo: "1. Excluir usuário", componente: Exercicio1 },
    { id: "2", titulo: "2. Excluir com log", componente: Exercicio2 },
    { id: "3", titulo: "3. Editar usuário", componente: Exercicio3 },
    { id: "4", titulo: "4. Erros e rollback", componente: Exercicio4 },
    { id: "5", titulo: "5. Mini-CRUD completa", componente: Exercicio5 },
];

export default function App() {
    const [exercicioSelecionado, setExercicioSelecionado] = useState("1");
    const exercicioAtual = EXERCICIOS.find(
        (exercicio) => exercicio.id === exercicioSelecionado
    );
    const ExercicioAtual = exercicioAtual?.componente ?? EXERCICIOS[0].componente;

    return (
        <main className="aplicacao">
            <header className="cabecalho">
                <p className="sobretitulo">PTAC · Aula 06</p>
                <h1>Operações com Fetch</h1>
                <p>Prática de GET, PUT, DELETE e POST usando JSONPlaceholder.</p>
            </header>

            <nav className="seletor-exercicios" aria-label="Selecionar exercício">
                {EXERCICIOS.map((exercicio) => (
                    <button
                        key={exercicio.id}
                        type="button"
                        className={exercicioSelecionado === exercicio.id ? "selecionado" : ""}
                        aria-pressed={exercicioSelecionado === exercicio.id}
                        onClick={() => setExercicioSelecionado(exercicio.id)}
                    >
                        {exercicio.titulo}
                    </button>
                ))}
            </nav>

            <ExercicioAtual />

            <footer>
                <p>
                    API de testes: JSONPlaceholder. As operações de escrita são simuladas
                    e não ficam salvas permanentemente no servidor.
                </p>
            </footer>
        </main>
    );
}
