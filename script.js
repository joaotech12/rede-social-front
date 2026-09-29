function verificarLogin() {
    if (!sessionStorage.getItem('authenticated')) {
        window.location.replace('/login/');
        return false;
    }
    return true;
}

const usuarioAutenticado = verificarLogin();

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
            <article class="post">
                <img class="post-img" src="${imagem}" alt="${titulo}" loading="lazy">
                <div class="post-overlay">
                    <div class="post-info">
                        <strong>${titulo}</strong>
                        <p>${artista}</p>
                    </div>
                </div>
            </article>`);
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