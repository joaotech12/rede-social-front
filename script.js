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