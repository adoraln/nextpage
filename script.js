// --- DADOS DOS LIVROS (BANCO DE DADOS) ---
const acervo = {
    fantasia: [
        { t: "O Hobbit", a: "J.R.R. Tolkien", img: "img/hobbit.jpg" },
        { t: "Harry Potter", a: "J.K. Rowling", img: "img/hp.jpg" },
        { t: "Percy Jackson", a: "Rick Riordan", img: "img/percyj.jpg" },
        { t: "Game of Thrones", a: "G.R.R. Martin", img: "img/gameofthrones.jpg" },
        { t: "Eragon", a: "C. Paolini", img: "img/eragon.webp" },
        { t: "Nome do Vento", a: "P. Rothfuss", img: "img/onomedovento.jpg" },
        { t: "O Mundo de Sofia", a: "Jostein Gaarder", img: "img/omundodesofia.jpg" },
        { t: "Através do Espelho", a: "Jostein Gaarder", img: "img/espelho.jpg" },
        { t: "Vendedor de Histórias", a: "Jostein Gaarder", img: "img/vendedorhistorias.jpg" },
        { t: "A Carta do Coringa", a: "Jostein Gaarder", img: "img/coringacarta.webp" }
    ],
    scifi: [
        { t: "Duna", a: "Frank Herbert", img: "img/duna.jpg" },
        { t: "1984", a: "George Orwell", img: "img/1984.jpg" },
        { t: "Neuromancer", a: "William Gibson", img: "img/neuro.jpg" },
        { t: "Matéria escura", a: "Blake Crouch", img: "img/materiaescura.webp" },
        { t: "Eu, Robô", a: "Isaac Asimov", img: "img/eu.jpg" },
        { t: "Percy Jackson", a: "Rick Riordan", img: "img/percyj.jpg" },
        { t: "Game of Thrones", a: "G.R.R. Martin", img: "img/gameofthrones.jpg" }, ,
        { t: "Eragon", a: "C. Paolini", img: "img/eragon.webp" }
    ],
    terror: [
        { t: "It: A Coisa", a: "Stephen King", img: "img/it.webp" },
        { t: "Drácula", a: "Bram Stoker", img: "img/dracula.jpg" },
        { t: "O Iluminado", a: "Stephen King", img: "img/ilu.jpg" },
        { t: "Frankenstein", a: "Mary Shelley", img: "img/frank.webp" },
        { t: "O Exorcista", a: "W.P. Blatty", img: "img/exor.jpg" },
        { t: "O Corvo", a: "Edgar Alan Poe", img: "img/corvo.jpg" },
        { t: "Uzumaki", a: "Junji Ito", img: "img/uzumaki.jpg" }
    ]
};

// --- 1. FUNÇÃO GLOBAL: Carregar Nome do Usuário ---
// Roda em TODAS as páginas para atualizar o nome na sidebar
document.addEventListener("DOMContentLoaded", () => {
    const nomeSalvo = localStorage.getItem('bookavy_username');
    const sidebarName = document.querySelector('.user-profile h3');

    // Se existir um nome salvo e um elemento h3 na sidebar, atualiza
    if (nomeSalvo && sidebarName) {
        sidebarName.innerText = nomeSalvo;
        // Se tiver ID específico (na página config), atualiza também
        const configName = document.getElementById('sidebar-username');
        if (configName) configName.innerText = nomeSalvo;
    }
});


// --- 2. PREENCHER AS 4 FILEIRAS (INDEX.HTML) ---
function preencherFileira(idContainer, listaLivros) {
    const container = document.getElementById(idContainer);
    if (!container) return; // Se não achar a div, não faz nada (evita erro em outras páginas)

    listaLivros.forEach(livro => {
        const card = document.createElement('a');
        card.href = `checkout.html?livro=${encodeURIComponent(livro.t)}`; // Codifica caracteres especiais
        card.classList.add('book-card-mini');

        card.innerHTML = `
            <img src="${livro.img}" alt="${livro.t}">
            <h4>${livro.t}</h4>
            <p>${livro.a}</p>
        `;
        container.appendChild(card);
    });
}

// Chama a função para cada categoria
preencherFileira('row-fantasia', acervo.fantasia);
preencherFileira('row-scifi', acervo.scifi);
preencherFileira('row-terror', acervo.terror);
preencherFileira('row-romance', acervo.romance);


// --- 3. LÓGICA DA PÁGINA DE CONFIGURAÇÕES (CONFIG.HTML) ---
if (document.getElementById('form-config')) {
    document.getElementById('form-config').addEventListener('submit', function (e) {
        e.preventDefault();

        const novoNome = document.getElementById('novo-nome').value;

        if (novoNome) {
            // Salva o nome globalmente no navegador
            localStorage.setItem('bookavy_username', novoNome);
            alert("Perfil atualizado com sucesso!");
            location.reload(); // Recarrega a página para mostrar o novo nome
        }
    });
}


// --- 4. LÓGICA DE CHECKOUT (CHECKOUT.HTML) ---
if (document.getElementById('form-aluguel')) {
    const params = new URLSearchParams(window.location.search);
    const nomeLivro = params.get('livro') || "Livro não selecionado";
    document.getElementById('nome-livro-titulo').innerText = nomeLivro;

    document.getElementById('form-aluguel').addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const dias = document.getElementById('dias').value;

        if (nome.length < 3) {
            alert("O nome precisa ter pelo menos 3 letras.");
            return;
        }

        const novoAluguel = {
            livro: nomeLivro,
            usuario: nome,
            dias: dias,
            data: new Date().toLocaleDateString()
        };

        let biblioteca = JSON.parse(localStorage.getItem('meusLivros')) || [];
        biblioteca.push(novoAluguel);
        localStorage.setItem('meusLivros', JSON.stringify(biblioteca));

        alert("Livro alugado com sucesso!");
        window.location.href = "perfil.html";
    });
}

// --- 5. LÓGICA DE PERFIL (PERFIL.HTML) ---
if (document.getElementById('corpo-tabela')) {
    const tbody = document.getElementById('corpo-tabela');
    const biblioteca = JSON.parse(localStorage.getItem('meusLivros')) || [];

    if (biblioteca.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3'>Nenhum livro alugado ainda.</td></tr>";
    } else {
        biblioteca.forEach(item => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td><strong>${item.livro}</strong></td>
                <td>${item.dias} dias</td>
                <td>${item.data}</td>
            `;
            tbody.appendChild(linha);
        });
    }
}

function limparHistorico() {
    if (confirm("Deseja apagar todo o histórico?")) {
        localStorage.removeItem('meusLivros');
        location.reload();
    }
}