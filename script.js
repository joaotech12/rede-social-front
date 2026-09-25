console.log('home')
function verificarLogin(){
const user = localStorage.getItem('user')

if(!user){
    setTimeout(() =>{
        window.location.href = '/login'
    }, 3000);
}



}
verificarLogin()

let paginaAtual = 0 
async function artApi() {
    const resposta = await fetch(`https://api.artic.edu/api/v1/artworks?page=${paginaAtual + 1}&fields=id,title,artist_display,image_id`)
    const data = await resposta.json();
    console.log(data);
    return data.data;
}

async function postApi(){
    const main = document.getElementById("feed")
    const obras = await artApi();

    obras.forEach(obra => {
        if (!obra.image_id) return;
        const imagemUrl = `https://www.artic.edu/iiif/2/${obra.image_id}/full/843,/0/default.jpg`

        main.insertAdjacentHTML(`beforeend`, `
            <div class="art slide" id="art${obra.id}">
                <div class="artImagem">
                    <img src="${imagemUrl}" alt="${obra.title}" loading="lazy" >
                </div>
                <div class="artInfo">
                    <h2 class="artTitulo">${obra.title}</h2>
                    <p class="artTitulo">${obra.artist_display}</p>
                </div>
            </div>
        `);
    });
}

postApi()




