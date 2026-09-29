console.log('home')

function verificarLogin() {
    if (!sessionStorage.getItem('authenticated')) {
        window.location.replace('/login/');
        return false;
    }
    return true;
}

const usuarioAutenticado = verificarLogin();
let paginaAtual = 0;

async function artApi() {
    const resposta = await fetch(`https://openaccess-api.clevelandart.org/api/artworks/?limit=20&skip=${paginaAtual * 20}&has_image=1&cc0=1`);
    if (!resposta.ok) throw new Error(`Falha ao buscar obras: ${resposta.status}`);
    const data = await resposta.json();
    return data.data;
}

async function postApi() {
    const main = document.getElementById('feed');
    try {
        const obras = await artApi();

        obras.forEach(obra => {
            const imagemUrl = obra.images?.print?.url || obra.images?.web?.url;
            if (!imagemUrl) return;

            const artista = obra.creators?.map(criador => criador.description).filter(Boolean).join(', ') || 'Artista desconhecido';

            main.insertAdjacentHTML('beforeend', `
                <div class="art slide" id="art${obra.id}">
                    <div class="artImagem">
                        <img src="${imagemUrl}" alt="${obra.title || 'Obra de arte'}" loading="lazy">
                    </div>
                    <div class="artInfo">
                        <h2 class="artTitulo">${obra.title || 'Obra sem título'}</h2>
                        <p class="artTitulo">${artista}</p>
                    </div>
                </div>
            `);

            const imagem = main.lastElementChild.querySelector('img');
            imagem.addEventListener('error', () => {
                if (obra.images?.web?.url && imagem.src !== obra.images.web.url) {
                    imagem.src = obra.images.web.url;
                } else {
                    imagem.remove();
                }
            }, { once: true });
        });
    } catch (erro) {
        console.error('Não foi possível carregar o feed de obras:', erro);
    }
}

if (usuarioAutenticado) postApi();
