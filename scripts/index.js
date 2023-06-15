let attempts = 0; //intentos validacion login
const btn_registro = document.getElementById("boton_registro"); //variable boton login coordinador
const btn_login = document.getElementById("boton_ingreso");//variable boton login tecnico
const loginForm = document.getElementById("formulario_login"); //variable formulario
const loginModal = document.getElementById("login-modal");
const registroForm = document.getElementById("formulario_registro"); //variable formulario
const registroModal = document.getElementById("registro_modal");
let lista_usuarios = []

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

//registro

registroForm.addEventListener('submit', function(){
    
    let username = document.getElementById("usernamer");
    let clave = document.getElementById("passwordr");
    let dniInput = document.getElementById("emailr");
    let emailInput = document.getElementById("dnir");

    let new_usuario = {nombre:username.value, password:clave.value, dni:dniInput.value, email:emailInput.value};
    lista_usuarios.push(new_usuario)
    console.log(new_usuario)
    let lista_json = JSON.stringify(lista_usuarios);
    localStorage.setItem("lista_usuarios", lista_json);

    if(username && clave && dniInput && emailInput != undefined){
        window.location.href='./index.html';
    }
})


//validacion de datos

loginForm.addEventListener('submit', function(event){
    event.preventDefault();

    let array = localStorage.getItem("lista_usuarios");
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    array = JSON.parse(array);

    for(let usuario of array){
        if(usuario.nombre == username && usuario.password == password){
            window.location.href='./pages/programa.html';
        }
        else{
            attempts++;
            if(attempts>=3){
                alert("Te equivocaste 3 veces, basta wei");
            }
            else{
                let intentos_restantes = 3 - attempts
                alert("Usuario/clave incorrectos. Intentos restantes: " + intentos_restantes)
            }
        }
    }
})

