function verificarLogin() {
    if (!sessionStorage.getItem('authenticated')) {
        window.location.replace('/login/');
        return false;
    }
    return true;
}

const usuarioAutenticado = verificarLogin();

const botaoConta = document.querySelector('#account-button');
const menuConta = document.querySelector('#account-dropdown');
const usuarioSalvo = JSON.parse(localStorage.getItem('user') || 'null');
const emailUsuario = usuarioSalvo?.email || 'Conta conectada';

document.querySelector('#account-email').textContent = emailUsuario;
document.querySelector('#account-avatar').textContent = emailUsuario.charAt(0).toUpperCase() || '?';

botaoConta.addEventListener('click', () => {
    const menuAberto = botaoConta.getAttribute('aria-expanded') === 'true';
    botaoConta.setAttribute('aria-expanded', String(!menuAberto));
    menuConta.hidden = menuAberto;
});

document.querySelector('#account-logout').addEventListener('click', () => {
    sessionStorage.removeItem('authenticated');
    window.location.replace('/login/');
});

document.addEventListener('click', (evento) => {
    if (!evento.target.closest('.account-menu')) {
        botaoConta.setAttribute('aria-expanded', 'false');
        menuConta.hidden = true;
    }
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !menuConta.hidden) {
        botaoConta.setAttribute('aria-expanded', 'false');
        menuConta.hidden = true;
        botaoConta.focus();
    }
});

document.body.insertAdjacentHTML('beforeend', `
    <section class="post-modal" id="post-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
        <button class="modal-backdrop" type="button" data-close-modal aria-label="Fechar detalhes do post"></button>
        <div class="modal-content">
            <button class="modal-close" type="button" data-close-modal aria-label="Fechar">&times;</button>
            <div class="modal-image-wrap">
                <img class="modal-image" id="modal-image" alt="">
            </div>
            <div class="modal-details">
                <div class="modal-user">
                    <div class="avatar" id="modal-avatar" aria-hidden="true">?</div>
                    <div>
                        <strong id="modal-artist"></strong>
                        <span>Obra em destaque</span>
                    </div>
                </div>
                <div class="modal-description">
                    <h2 id="modal-title"></h2>
                    <p id="modal-description-text"></p>
                </div>
                <dl class="artwork-details" id="modal-artwork-details"></dl>
                <p class="modal-credit" id="modal-credit"></p>
            </div>
        </div>
    </section>
`);

const modal = document.querySelector('#post-modal');
const modalImage = document.querySelector('#modal-image');
let ultimoPostAtivo = null;

function escaparHtml(valor = '') {
    return String(valor).replace(/[&<>"']/g, (caractere) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

function abrirModal(obra, post) {
    const artista = obra.creators?.[0]?.description || 'Artista desconhecido';
    const titulo = obra.title || 'Obra sem título';
    const descricao = obra.wall_description || obra.description || 'Confira os detalhes desta obra da coleção do Cleveland Museum of Art.';
    const informacoes = [
        ['Data', obra.creation_date],
        ['Técnica', obra.technique],
        ['Dimensões', obra.measurements],
        ['Cultura', obra.culture]
    ].filter(([, valor]) => valor);

    document.querySelector('#modal-title').textContent = titulo;
    document.querySelector('#modal-artist').textContent = artista;
    document.querySelector('#modal-avatar').textContent = artista.trim().charAt(0).toUpperCase() || '?';
    document.querySelector('#modal-description-text').textContent = descricao;
    document.querySelector('#modal-credit').textContent = obra.creditline || '';
    modalImage.src = obra.images?.web?.url || obra.images?.print?.url;
    modalImage.alt = titulo;
    document.querySelector('#modal-artwork-details').innerHTML = informacoes.map(([rotulo, valor]) => `
        <div><dt>${escaparHtml(rotulo)}</dt><dd>${escaparHtml(valor)}</dd></div>
    `).join('');

    ultimoPostAtivo = post;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();
}

function fecharModal() {
    if (!modal.classList.contains('is-open')) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalImage.removeAttribute('src');
    ultimoPostAtivo?.focus();
}

modal.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-close-modal]')) fecharModal();
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharModal();
});

function mostrarPosts(obras) {
    const feed = document.querySelector('#feed');

    obras.forEach((obra) => {
        const imagem = obra.images?.web?.url || obra.images?.print?.url;
        if (!imagem) {
            return;
        }

        const titulo = obra.title || 'Obra sem título';
        const artista = obra.creators?.[0]?.description || 'Artista desconhecido';

        feed.insertAdjacentHTML('beforeend', `
            <article class="post" tabindex="0" role="button" aria-label="Ver detalhes de ${escaparHtml(titulo)}">
                <img class="post-img" src="${escaparHtml(imagem)}" alt="${escaparHtml(titulo)}" loading="lazy">
                <div class="post-overlay">
                    <div class="post-info">
                        <strong>${escaparHtml(titulo)}</strong>
                        <p>${escaparHtml(artista)}</p>
                    </div>
                </div>
            </article>`);

        const post = feed.lastElementChild;
        post.addEventListener('click', () => abrirModal(obra, post));
        post.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                abrirModal(obra, post);
            }
        });
    });
}

function buscarObras() {
    fetch("https://openaccess-api.clevelandart.org/api/artworks/?limit=20&has_image=1&cc0=1")
        .then((resposta) => resposta.json())
        .then((dados) => mostrarPosts(dados.data));
}

if (usuarioAutenticado) {
    buscarObras();
}