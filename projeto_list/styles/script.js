const inputTarefa = document.querySelector("#inputTarefa");
const btnAdicionar = document.querySelector("#btnAdicionar");
const listaTarefas = document.querySelector("#listaTarefas");
const filtros = document.querySelectorAll(".filtro");
const menuItens = document.querySelectorAll(".menu-item");
const contadorTodas = document.querySelector("#contadorTodas");
const contadorPendentes = document.querySelector("#contadorPendentes");
const contadorConcluidas = document.querySelector("#contadorConcluidas");
const progresso = document.querySelector("#progresso");
const dataAtual = document.querySelector("#dataAtual");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";

function mostrarData() {

    const hoje = new Date();

    const dataFormatada = hoje.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

    dataAtual.textContent = dataFormatada;
}


function salvarTarefas() {

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );

}

function adicionarTarefa() {

    const texto = inputTarefa.value.trim();

    if (texto === "") {
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false
    };

    tarefas.push(novaTarefa);

    salvarTarefas();

    inputTarefa.value = "";

    mostrarTarefas();

    inputTarefa.focus();
}

function alternarTarefa(id) {

    const tarefa = tarefas.find(
        tarefa => tarefa.id === id
    );

    if (tarefa) {

        tarefa.concluida = !tarefa.concluida;

        salvarTarefas();

        mostrarTarefas();
    }

}

function excluirTarefa(id) {

    tarefas = tarefas.filter(
        tarefa => tarefa.id !== id
    );

    salvarTarefas();

    mostrarTarefas();
}

function tarefasFiltradas() {

    if (filtroAtual === "pendentes") {

        return tarefas.filter(
            tarefa => !tarefa.concluida
        );

    }

    if (filtroAtual === "concluidas") {

        return tarefas.filter(
            tarefa => tarefa.concluida
        );

    }

    return tarefas;
}

function mostrarTarefas() {

    listaTarefas.innerHTML = "";

    const lista = tarefasFiltradas();


    if (lista.length === 0) {

        listaTarefas.innerHTML = `

            <div class="vazio">

                <i class="fa-regular fa-clipboard"></i>

                <p>Nenhuma tarefa por aqui.</p>

            </div>

        `;

    }

    lista.forEach(tarefa => {

        const elemento = document.createElement("div");

        elemento.classList.add("tarefa");


        if (tarefa.concluida) {

            elemento.classList.add("concluida");

        }

        elemento.innerHTML = `

            <button
                class="check"
                onclick="alternarTarefa(${tarefa.id})">
            </button>

            <span class="texto-tarefa">

                ${escapeHTML(tarefa.texto)}

            </span>

            <button
                class="excluir"
                onclick="excluirTarefa(${tarefa.id})">

                <i class="fa-regular fa-trash-can"></i>

            </button>

        `;

        listaTarefas.appendChild(elemento);

    });

    atualizarContadores();
}

function atualizarContadores() {

    const todas = tarefas.length;

    const concluidas = tarefas.filter(
        tarefa => tarefa.concluida
    ).length;

    const pendentes = todas - concluidas;

    contadorTodas.textContent = todas;

    contadorPendentes.textContent = pendentes;

    contadorConcluidas.textContent = concluidas;


    progresso.textContent =
        `${concluidas} de ${todas} tarefas concluídas`;

}

function escapeHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}

btnAdicionar.addEventListener(
    "click",
    adicionarTarefa
);

inputTarefa.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            adicionarTarefa();

        }

    }
);

filtros.forEach(botao => {

    botao.addEventListener(
        "click",
        function() {

            filtroAtual = this.dataset.filtro;

            filtros.forEach(
                filtro => filtro.classList.remove("ativo")
            );

            this.classList.add("ativo");

            menuItens.forEach(
                item => {

                    item.classList.toggle(
                        "ativo",
                        item.dataset.filtro === filtroAtual
                    );

                }
            );


            mostrarTarefas();

        }
    );

});

menuItens.forEach(item => {

    item.addEventListener(
        "click",
        function() {

            filtroAtual = this.dataset.filtro;

            menuItens.forEach(
                botao => botao.classList.remove("ativo")
            );

            this.classList.add("ativo");

            filtros.forEach(
                filtro => {

                    filtro.classList.toggle(
                        "ativo",
                        filtro.dataset.filtro === filtroAtual
                    );

                }
            );

            mostrarTarefas();

        }
    );

});

mostrarData();

mostrarTarefas();