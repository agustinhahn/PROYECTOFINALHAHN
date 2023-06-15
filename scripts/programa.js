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
listaProductos.push(new productos(1,"alfajor",8,20)); //salen de la clase
listaProductos.push(new productos(2,"coquita",12,10));
listaProductos.push(new productos(3,"caramelos",5,120));
listaProductos.push(new productos(2,"oreo",12,50));
listaProductos.push(new productos(3,"agua",5,60));
listaProductos.push(new productos(2,"ibuprofeno",12,25));

let listaProductoStock = listaProductos.slice();

//MANIPULAR EL DOM ########################################################################################################################################################################
//########################################################################################################################################################################


//####################REFERENCIAS DE NODOS####################################################################################

let carrito = [] //array vacio donde contener productos agregados al carrito
let btn_add_carrito = document.querySelectorAll(".btn_add_carrito") //REFERENCIA BOTON ADD CARRITO
let btn_resta_cantidad = document.querySelectorAll(".boton_resta")
let btn_suma_cantidad = document.querySelectorAll(".boton_suma")
let btn_subtotal = document.querySelector(".btn_subtotal")
let nodoPrincipal = null;

btn_subtotal.addEventListener("click", mostrarSubtotal)

for(let boton of btn_add_carrito){ //ciclo para que el boton ejecute la funcion de agregar carrito
    boton.addEventListener("click", agregarCarrito);
}

for(let boton of btn_resta_cantidad){
    boton.addEventListener("click", restarCantidad); //resta cantidad con contadores para add carrito
}

for(let boton of btn_suma_cantidad){
    boton.addEventListener("click", sumarCantidad); //suma cantidad con contadores para add carrito
}


//#################### FUNCIONES #####################################

function agregarCarrito(e){
    let cero = 0
    let hijo = e.target;
    let padre = hijo.parentNode;
    let abuelo = padre.parentNode;
    nodoPrincipal = abuelo;
    let nombre_producto = padre.querySelector(".title_product").textContent;
    let precio_producto = padre.querySelector(".price").textContent;
    let imagen_producto = padre.querySelector(".img_insertada").src;
    let cantidad_elegida = abuelo.querySelector(".span_contador").textContent;
    let stockCantidad = parseInt(abuelo.querySelector(".span_stock").textContent);
    let producto = {
        nombre : nombre_producto,
        precio : precio_producto,
        imagen : imagen_producto,
        cantidad: cantidad_elegida
    }
    if(cantidad_elegida>0){
        let indice = carrito.find(function(objeto){
            return objeto.nombre === nombre_producto;
        })
        if(indice === undefined){
            carrito.push(producto);
            mostrarCarrito();
            let indice2 = carrito.find(function(objeto){
                return objeto.nombre === nombre_producto;})
                if(indice2 != undefined){
                    let indiceNombre = indice2.nombre.toLowerCase();
                    let indexProduct = listaProductoStock.findIndex(function(nombre_indice){
                        return nombre_indice.nombre == indiceNombre
                    }); //aqui averiguo el index para descontar
                    cantidad_elegida = parseInt(cantidad_elegida)
                    listaProductoStock[indexProduct].stock = listaProductoStock[indexProduct].stock - cantidad_elegida
                    abuelo.querySelector(".span_stock").textContent = listaProductoStock[indexProduct].stock.toString()
                    abuelo.querySelector(".span_contador").textContent = cero.toString();
                }
        }
    }
    else{
        alert("DEBES INGRESAR UNA CANTIDAD")
    }
}

function mostrarCarrito(){
    let tabla = document.querySelector("tbody"); //referencia a cuerpo de la tabla
    tabla.innerHTML = "";
    for(let producto of carrito){
        let fila = document.createElement("tr"); //creo una fila
        fila.innerHTML = `<td><img class="img_insertada_tabla img_producto_tabla" src="${producto.imagen}"></td>
                        <td><p class="centrar_productos nombre_producto_tabla">${producto.nombre}</p></td>
                        <td class="centrar_productos precio_producto_tabla">$${producto.precio}</td>
                        <td class="centrar_productos cantidad_producto_tabla">${producto.cantidad}</td>
                        <td class="centrar_productos subtotal_producto_tabla">$${producto.precio * producto.cantidad}
                        <td><button class="btn btn-danger borrar_elemento">Borrar</button></td>`;
        tabla.append(fila);
    }
    let btn_borrar = document.querySelectorAll(".borrar_elemento");
    for(let btn of btn_borrar){
        btn.addEventListener("click", borrar_producto);
    }
}


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
        let devolverCantidad = parseInt(carrito[indice].cantidad)
        listaProductoStock[indexProduct].stock = listaProductoStock[indexProduct].stock + devolverCantidad;
        nodoPrincipal.querySelector(".span_stock").textContent = listaProductoStock[indexProduct].stock.toString() //funcion inconclusa. solo funciona con el ultimo elemento agregado.
        carrito.splice(indice, 1);
        
    }
    abuelo.remove();
}

function sumarCantidad(e){
    let hijo = e.target;
    let padre = hijo.parentNode;
    let abuelo = padre.parentNode;
    let stockValue = parseInt(padre.querySelector(".span_contador").textContent);
    let stockCant = parseInt(abuelo.querySelector(".span_stock").textContent);
    if(stockValue<stockCant){
        stockValue ++;
        padre.querySelector(".span_contador").textContent = stockValue.toString()
    }
    else{
        alert("NO HAY MAS CANTIDAD QUE LA SOLICITADA");
    }
}

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
        alert("NO HAY NADA QUE DESCONTAR");
    }
}

function mostrarSubtotal(e){
    let hijo = e.target;
    let padre = hijo.parentNode;
    let abuelo = padre.parentNode;
    let tabla = abuelo.querySelector("tbody");
    console.log("probando ####################")
    let suma = 0;
    for(let i = 0; i< carrito.length; i++){
        let producto = carrito[i];
        let precio = producto.precio;
        precio = parseInt(precio);
        let cantidad = producto.cantidad;
        cantidad = parseInt(cantidad);
        let subtotal = precio * cantidad;
        suma += subtotal
    }
    let fila = document.createElement("tr"); 
    fila.innerHTML =   `<td class="centrar_productos cantidad_producto_tabla"></td>
                        <td class="centrar_productos cantidad_producto_tabla"></td>
                        <td class="centrar_productos cantidad_producto_tabla"></td>
                        <td class="centrar_productos cantidad_producto_tabla">SUB-TOTAL A PAGAR:</td>
                        <td class="centrar_productos cantidad_producto_tabla">$${suma}</td>`;
    tabla.append(fila); 
}

