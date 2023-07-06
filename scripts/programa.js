//clase productos

class productos{
    constructor(indice, nombre, precio, stock){
        this.indice = indice;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;}
}

//ARRAY DE PRODUCTOS

const listaProductos = [];
listaProductos.push(new productos(0,"alfajor",8,20)); //salen de la clase
listaProductos.push(new productos(1,"coquita",12,10));
listaProductos.push(new productos(2,"caramelos",5,120));
listaProductos.push(new productos(3,"oreo",7,50));
listaProductos.push(new productos(4,"agua",10,60));
listaProductos.push(new productos(5,"ibuprofeno",3,25));

let listaProductoStock = listaProductos.slice();

//MANIPULAR EL DOM ########################################################################################################################################################################
//########################################################################################################################################################################

//####################REFERENCIAS DE NODOS####################################################################################

let carrito = [] //array vacio donde contener productos agregados al carrito
let btn_add_carrito = document.querySelectorAll(".btn_add_carrito") //REFERENCIA BOTON ADD CARRITO
let btn_resta_cantidad = document.querySelectorAll(".boton_resta")
let btn_suma_cantidad = document.querySelectorAll(".boton_suma")
let btn_subtotal = document.querySelector(".btn_subtotal")
let img_logout = document.querySelector(".img_logout")
let img_carrito = document.querySelector(".img_carrito")
let span_stock_page = document.querySelectorAll(".span_stock")
let indices_productos = document.querySelectorAll(".indice_product")
let nombreLogueado = document.querySelector(".labelUsuario")
let btn_carrito_comprar = document.querySelector(".btn_carrito_comprar")
let intervalTime
let intervalTime2
let sumaSubtotal
let sumaSubtotalActualizado
let btnCotizacion = document.querySelector(".btnCotizacion");
let valorPeso


//evento del boton que ejecuta funcion para mostrar cotizacion dolar // peso
btnCotizacion.addEventListener("click", function(){
    resultadosApi()
    .then(valorPeso =>{
        document.querySelector(".interiorBotton").textContent = `1 USD = ${valorPeso.toFixed(2)}`
    })
})


//evento que escucha la carga de la pantalla para mostrar el nombre del usuario logueado
window.addEventListener("load", function(){
    let nombrePresentar 
    let array = localStorage.getItem("arrayUsuarioLogueado");
    array = JSON.parse(array)
    for(let usuario of array){
        nombrePresentar = usuario.nombre;
    }
    nombreLogueado.textContent= nombrePresentar;
})


//evento para confirmar la compra del carrito
btn_carrito_comprar.addEventListener("click", function(e){
    if(carrito.length>=1){
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'COMPRA REALIZADA',
            text: 'factura enviada a su correo',
            showConfirmButton: false,
            timer: 1500
        })
        comprarProducto(e)
    }
    else{
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'NO HAY PRODUCTOS EN EL CARRITO',
            text: 'Agrega un producto para gestionar la compra',
            showConfirmButton: false,
            timer: 1500
        })
    }
})

//evento para retroceder en la web y volver al ingreso
img_logout.addEventListener("click", function(){
    window.location.href='../index.html';
})

//ciclo para que el boton ejecute la funcion de agregar carrito
for(let boton of btn_add_carrito){ 
    boton.addEventListener("click", agregarCarrito);
}

//resta cantidad con contadores para add carrito
for(let boton of btn_resta_cantidad){
    boton.addEventListener("click", restarCantidad); 
}

//suma cantidad con contadores para add carrito
for(let boton of btn_suma_cantidad){
    boton.addEventListener("click", sumarCantidad); 
}

//evento para que cuando se toque sobre la img del carrito se despliegue el modal
img_carrito.addEventListener("click", showModal)

//#################### FUNCIONES #####################################


//funcion principal, agregar objeto al carrito
function agregarCarrito(e){
    let cero = 0
    let hijo = e.target;
    let padre = hijo.parentNode;
    let abuelo = padre.parentNode;
    let indice_producto = padre.querySelector(".indice_product").textContent;
    let cantidad_elegida = abuelo.querySelector(".span_contador").textContent;
    let imagen_producto = padre.querySelector(".img_insertada").src;
    cantidad_elegida = parseInt(cantidad_elegida)
    if(cantidad_elegida == 0){
        noHayCantidadElegida()
    }
    else{
        producto_encontrado = listaProductoStock[indice_producto]
        producto_encontrado["cant_elegida"] = cantidad_elegida
        producto_encontrado["img"] = imagen_producto
        if(cantidad_elegida>0){
            let indice = carrito.find(function(objeto){
                return objeto.nombre === producto_encontrado.nombre;
            })
            if(indice === undefined){
                carrito.push(producto_encontrado);
                mostrarCarrito(); //poner fetch con promesa.
                let indice2 = carrito.find(function(objeto){
                    return objeto.nombre === producto_encontrado.nombre;})
                    if(indice2 != undefined){
                        let indiceNombre = indice2.nombre.toLowerCase();
                        let indexProduct = listaProductoStock.findIndex(function(nombre_indice){
                            return nombre_indice.nombre == indiceNombre
                        }); //aqui averiguo el index para descontar
                        cantidad_elegida = parseInt(cantidad_elegida)
                        listaProductoStock[indexProduct].stock = listaProductoStock[indexProduct].stock - cantidad_elegida
                        abuelo.querySelector(".span_stock").textContent = listaProductoStock[indexProduct].stock.toString()
                        abuelo.querySelector(".span_contador").textContent = cero.toString();
                        tostiAddCarrito()
                    }
            }
            else{
                indice = null
                abuelo.querySelector(".span_contador").textContent = cero.toString();
                productoYaEnCarrito()
            }
        }
    }
}

//parte de "agregarCarrito", aqui se crean las filas y se insertan los objetos agregados al carrito
function mostrarCarrito(){
    let tabla = document.querySelector("tbody"); //referencia a cuerpo de la tabla
    tabla.innerHTML = "";
    for(let producto of carrito){
        let fila = document.createElement("tr"); //creo una fila
        fila.innerHTML = `<td><img class="img_insertada_tabla img_producto_tabla" src="${producto.img}"></td>
                        <td><p class="centrar_productos nombre_producto_tabla">${producto.nombre}</p></td>
                        <td class="centrar_productos precio_producto_tabla">$${producto.precio}</td>
                        <td class="centrar_productos cantidad_producto_tabla">${producto.cant_elegida}</td>
                        <td class="centrar_productos subtotal_producto_tabla">$${producto.precio * producto.cant_elegida}
                        <td><button class="btn btn-danger borrar_elemento">Borrar</button></td>`;
        tabla.append(fila);
    }
    if(carrito.length>1){
        mostrarSubtotal()
    }
    let btn_borrar = document.querySelectorAll(".borrar_elemento");
    for(let btn of btn_borrar){
        btn.addEventListener("click", borrar_producto);
    }
}

//funcion que limpia el html del carrito y eliminar los productos del mismo ya que fueron comprados.
function comprarProducto(e){
    let abuelo = e.target.parentNode.parentNode;
    let padre = e.target.parentNode
    let cuerpoTabla = abuelo.querySelector("tbody")
    nombre_producto = abuelo.querySelector(".nombre_producto_tabla").textContent
    nombre_producto = nombre_producto.toLowerCase()
    carrito.splice(0, carrito.length);
    cuerpoTabla.innerHTML = "";
}

//aqui se encuentra el producto correspondiente al boton borrar tocado y se elimina del carrito.
//tambien retorna al array principal los productos que habian sido descontados anteriormente
function borrar_producto(e){
    let abuelo = e.target.parentNode.parentNode;
    nombre_producto = abuelo.querySelector(".nombre_producto_tabla").textContent
    nombre_producto = nombre_producto.toLowerCase()
    let indice = carrito.findIndex(function(objeto){ //aqui buscamos coincidencia de nombre dentro del array carrito para devolver index
        return objeto.nombre.toLowerCase() === nombre_producto;
    })
    if (indice !== -1){ //si el indice encontrado es distinto de -1 es decir, un indice valido elimina al primer objeto contando desde ese index
        let indexProduct = listaProductoStock.findIndex(function(objeto2){
            return objeto2.nombre === nombre_producto})
        let devolverCantidad = parseInt(carrito[indice].cant_elegida)
        listaProductoStock[indexProduct].stock = listaProductoStock[indexProduct].stock + devolverCantidad;
        intervalTime = setTimeout(actualizarStock, 100)
        carrito.splice(indice, 1);
        intervalTime2 = setTimeout(actualizarSubTotal, 10)
    }
    abuelo.remove();
}

//actualizar contadores del stock con la restitucion de los productos devueltos
function actualizarStock(){
    indices_productos.forEach(function(objetivo){
        let ubicacionTotal = objetivo.parentNode
        ubicacionTotal.querySelector(".span_stock").textContent = listaProductoStock[objetivo.textContent].stock
    })
}

//actualizar el subtotal de manera dinamica a medida que haya +1 producto
function actualizarSubTotal(){
    if(carrito.length < 1){
        let filaEliminar1 = document.querySelector(".valorSubtotal1");
        let filaEliminar2 = document.querySelector(".valorSubtotal2");
        filaEliminar1.remove()
        filaEliminar2.remove()
    }
    for(let i = 0; i< carrito.length; i++){
        let producto = carrito[i];
        let precio = producto.precio;
        precio = parseInt(precio);
        let cantidad = producto.cant_elegida;
        cantidad = parseInt(cantidad);
        sumaSubtotalActualizado = precio * cantidad;}
    document.querySelector(".valorSubtotal2").textContent = sumaSubtotalActualizado.toString()
}

//funcion para devolver a 0 los contadores de eleccion de cantidad ya que el producto fue agregado
function actualizarContadoresCero(){
    let cero = 0
    indices_productos.forEach(function(objetivo){
        let ubicacionTotal = objetivo.parentNode
        ubicacionTotal.querySelector(".span_contador").textContent = cero.toString()
    })
}

//funcion para sumar 1 en contadores de compra
function sumarCantidad(e){
    let hijo = e.target;
    let padre = hijo.parentNode;
    let abuelo = padre.parentNode;
    let indiceProducto = parseInt(abuelo.querySelector(".indice_product").textContent)
    carrito.forEach(objetivo => {
        if(objetivo.indice == indiceProducto){
            productoYaEnCarrito()
            actualizarContadoresCero()
        }
    });
    let stockValue = parseInt(padre.querySelector(".span_contador").textContent);
    let stockCant = parseInt(abuelo.querySelector(".span_stock").textContent);
    if(stockValue<stockCant){
        stockValue ++;
        padre.querySelector(".span_contador").textContent = stockValue.toString()
    }
    else{
        maximoLogrado()
    }
}

//funcion resta 1 en contadores de compra
function restarCantidad(e){
    let hijo = e.target;
    let padre = hijo.parentNode;
    let abuelo = padre.parentNode;
    let stockValue = parseInt(padre.querySelector(".span_contador").textContent);
    let stockCant = parseInt(abuelo.querySelector(".span_stock").textContent);
    if(stockValue>0){
        stockValue --;
        padre.querySelector(".span_contador").textContent = stockValue.toString()
    }
    else{
        elegirMinimo()
    }
}

//funcion que crea fila subtotal y la muestra en caso de que sea >1 la cantidad de productos en carrito
function mostrarSubtotal(){
    let tabla = document.querySelector("tbody");
    sumaSubtotal = 0;
    for(let i = 0; i< carrito.length; i++){
        let producto = carrito[i];
        let precio = producto.precio;
        precio = parseInt(precio);
        let cantidad = producto.cant_elegida;
        cantidad = parseInt(cantidad);
        let subtotal = precio * cantidad;
        sumaSubtotal += subtotal
    }
    let fila = document.createElement("tr"); 
    fila.innerHTML =   `<td class="centrar_productos cantidad_producto_tabla"></td>
                        <td class="centrar_productos cantidad_producto_tabla"></td>
                        <td class="centrar_productos cantidad_producto_tabla"></td>
                        <td class="centrar_productos cantidad_producto_tabla valorSubtotal1">SUB-TOTAL A PAGAR:</td>
                        <td class="centrar_productos cantidad_producto_tabla valorSubtotal2">$${sumaSubtotal}</td>`;
    tabla.append(fila); 
}

//funcion para mostrar leyenda cuando se agrega un producto
function tostiAddCarrito(){
        Toastify({
        text:"PRODUCTO AGREGADO",
        duration: 2000,
        gravity:"bottom",
        position: "center",
        backgroundColor: "#1E212B"
    }
    ).showToast();
}

//funcion para indicar que no hay ninguna cantidad elegida
function noHayCantidadElegida(){
    Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'DEBES ELEGIR UNA CANTIDAD',
        text: 'Elije como minimo 1!',
        showConfirmButton: false,
        timer: 1500
    })
}

//funcion para indicar que el producto escogido ya esta en carrito
function productoYaEnCarrito(){
    Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'ESTE PRODUCTO YA ESTA EN EL CARRITO',
        text: 'Para cambiar cantidad, ingresar al carrito',
        showConfirmButton: false,
        timer: 1500
    })
}

//funcion para indicar que el contador esta en cero y que no va mas para atras.
function elegirMinimo(){
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'EL CONTADOR ESTA EN CERO',
        text: 'Suma productos para seguir!',
        showConfirmButton: false,
        timer: 1500
    })
}

//funcion para indicar que ya se llego al maximo de stock
function maximoLogrado(){
    Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'STOCK DISPONIBLE SUPERADO',
        text: 'el contador se detiene en el maximo disponible',
        showConfirmButton: false,
        timer: 1500
    })
}

//funcion para mostrar el carrito
function showModal(){
    let modalCarrito = new bootstrap.Modal(document.getElementById('exampleModal'));
    modalCarrito.show();
}

//funcion para traer api desde oepnexchangerates
function resultadosApi(){
    return fetch(`https://openexchangerates.org/api/latest.json?app_id=2b8ba5ceebc1474dbff7a72c4f73992e`)
        .then(response => response.json()) //pasa a json y retorna por arrow function
        .then(data => {
            let monedaBase= data.base;
            let monedas = data.rates;
            let monedaArgentina = monedas.ARS
            return monedaArgentina
        })
        .catch(() => {
            console.log("API caida")
        })
}