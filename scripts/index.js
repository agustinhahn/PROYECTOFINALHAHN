let attempts = parseInt(0); //intentos validacion login
const btn_registro = document.getElementById("boton_registro"); //variable boton login coordinador
const btn_login = document.getElementById("boton_ingreso");//variable boton login tecnico
const loginForm = document.getElementById("formulario_login"); //variable formulario
const loginModal = document.getElementById("login-modal");
const registroForm = document.getElementById("formulario_registro"); //variable formulario
const registroModal = document.getElementById("registro_modal");
const volverIndex = document.querySelectorAll(".volverIndex");
let lista_usuarios = []
let arrayUsuarioLogueado = []
if (localStorage.getItem("lista_usuarios")) {
    lista_usuarios = JSON.parse(localStorage.getItem("lista_usuarios"));
}
let lista_json
let new_usuario
const btn_submit_registro = document.getElementById("btn_submit_registro");

// acciones de botones
btn_login.addEventListener("click", function(){ //cuando se haga click sobre coordinador que aparezca el formulario de login
    loginModal.style.display = "block";
    btn_registro.style.display = "none";
    btn_login.style.display = "none";

})
btn_registro.addEventListener("click", function(){ //cuando se haga click sobre coordinador que aparezca el formulario de login
    registroModal.style.display = "block";
    btn_registro.style.display = "none";
    btn_login.style.display = "none";
})

volverIndex.forEach((element) => {
    element.addEventListener("click", volverIndexFunc)
});



//registro

registroForm.addEventListener('submit', function(){
    
    let username = document.getElementById("usernamer");
    let clave = document.getElementById("passwordr");
    let dniInput = document.getElementById("emailr");
    let emailInput = document.getElementById("dnir");

    new_usuario = {nombre:username.value, password:clave.value, dni:dniInput.value, email:emailInput.value};
    lista_usuarios.push(new_usuario)
    lista_json = JSON.stringify(lista_usuarios);
    localStorage.setItem("lista_usuarios", lista_json);

    if(username && clave && dniInput && emailInput != undefined){
        avisoRegistroExitoso()
    }
})


//validacion de datos

loginForm.addEventListener('submit', function(event){
    event.preventDefault();

    let array = localStorage.getItem("lista_usuarios");
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let intentos_restantes = 3

    array = JSON.parse(array);

    for(let usuario of array){
        if(usuario.nombre == username && usuario.password == password){
            window.location.href='./pages/programa.html';
            let usuarioLogueado = {nombre: username, clave: password}
            arrayUsuarioLogueado.push(usuarioLogueado)
            let lista_json2
            lista_json2 = JSON.stringify(arrayUsuarioLogueado);
            localStorage.setItem("arrayUsuarioLogueado", lista_json2);
            return
        }}
        console.log("estamos ejecutando")
        attempts ++;
        intentos_restantes = intentos_restantes - attempts
        loginForm.reset()
        Swal.fire({
            icon: 'error',
            title: 'CREDENCIALES INCORRECTAS',
            text: `TE QUEDAN SOLO ${intentos_restantes} INTENTOS`
        })
        if(intentos_restantes == 0){
            let timerInterval
            Swal.fire({
                title: 'VENTANA BLOQUEADA TEMPORALMENTE',
                html: 'Esta ventana se cerrara en <b></b> milisegundos.',
                timer: 10000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
                }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log('I was closed by the timer')
                }
            })
        }
})


//funcion para indicar que ingreso bien el registro.
function avisoRegistroExitoso(){
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'REGISTRO EXITOSO',
        showConfirmButton: false,
        timer: 1500
    })
    setTimeout(function(){
        window.location.href='./index.html'
    },2000)
}

//funcion para volver en el index.

function volverIndexFunc(){
    window.location.href="index.html"
}