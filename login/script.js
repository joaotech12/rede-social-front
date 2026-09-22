function fazerLogin() {
    const body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend', `
  </div>

        <main>
            <form>
                <h1>Login</h1>
                <div>
                    <label for="email">E-mail</label>
                    <input id="email" type="email" placeholder="E-mail">
                </div>
                <div>
                    <label for="senha">Senha</label>
                    <input id="senha" type="password" placeholder="Senha">
                </div>
                <button type="submit">Enviar</button>
            </form>
            <a href="../cadastro">Fazer cadastro</a>
        </main>`)
    }  
fazerLogin()

function efetuarLogin() {
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }
        localStorage.setItem("user", JSON.stringify({ email, senha }));
        location.href = "login.html";
    });
}
function mostrarToast(mensagem) {
    const toast = document.querySelector("#toast")
    const toastMensagem = document.querySelector("#toast-mensagem")

    toastMensagem.textContent = mensagem
    toast.classList.add("show")

    
    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
}

function compararCadastro(){
    const form = document.querySelector("form")
    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const email = document.querySelector("#email")
        const senha = document.querySelector("#senha")

        const user = {
            email: email.value,
            senha: senha.value
        }

        const userCadastro = JSON.parse(localStorage.getItem("user"))

        if (!userCadastro) {
            mostrarToast("Nenhum usuário cadastrado!")
            return
        }

        if (user.email === userCadastro.email && user.senha === userCadastro.senha) {
            setTimeout(() => {
                window.location.href = '/'
            }, 3000)
        } else {
            mostrarToast("E-mail ou senha incorretos!")
        }
    })
}
compararCadastro()