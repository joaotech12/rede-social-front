function fazerCadastro() {
    const body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend', `
      <main>
       <form>
           <h1>Cadastro</h1>

           <div>
            <label for="email">E-mail:</label>
            <input type="email" id="email" name="email" required>
           </div>
           
           <div>
            <label for="senha">Senha:</label>
            <input type="password" id="senha">
           </div>
           
              <div>
                <label for="confirmarSenha">Confirmar Senha:</label>
                <input type="password" id="confirmarSenha">
              </div>
              
           
           
           
    </form>
    </main>` )
    }  
fazerCadastro()

function efetuarCadastro() {
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
    });
    localStorage.setItem("user", JSON.stringify({ email, senha }));
    location.href = "login.html";
}