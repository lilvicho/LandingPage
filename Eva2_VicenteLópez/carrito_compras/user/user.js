function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar))
}
function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave))
    return datos
}
let productos = obtenerAlmacenamientoLocal('productos') || [];

const informacionCompra = document.getElementById('informacionCompra');
const contenedorCompra = document.getElementById('contenedorCompra');
const productosCompra = document.getElementById('productosCompra');
const contenedor = document.getElementById('contenedor');
const carrito = document.getElementById('carrito');
const numero = document.getElementById("numero");
const header = document.querySelector("#header");
const total = document.getElementById('total');
const body = document.querySelector("body");
const x = document.getElementById('x')

let lista = []
let valortotal = 0

window.addEventListener("scroll", function () {
    if (contenedor.getBoundingClientRect().top < 10) {
        header.classList.add("scroll")
    }
    else {
        header.classList.remove("scroll")
    }
})


window.addEventListener('load', () => {
    visualizarProductos();
    contenedorCompra.classList.add("none")
})

function visualizarProductos() {
    contenedor.innerHTML = ""
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].existencia > 0) {
            contenedor.innerHTML += `<div><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio">$${productos[i].valor}</p><button onclick=comprar(${i})>Comprar</button></div></div>`
        }
        else {
            contenedor.innerHTML += `<div><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio">$${productos[i].valor}</p><p class="soldOut">Sold Out</p></div></div>`
        }
    }
}

function comprar(indice) {
    lista.push({ nombre: productos[indice].nombre, precio: productos[indice].valor })

    let van = true
    let i = 0
    while (van == true) {
        if (productos[i].nombre == productos[indice].nombre) {
            productos[i].existencia -= 1
            if (productos[i].existencia == 0) {
                visualizarProductos()
            }
            van = false
        }
        guardarAlmacenamientoLocal("productos", productos)
        i += 1
    }
    numero.innerHTML = lista.length
    numero.classList.add("diseñoNumero")
    return lista
}

carrito.addEventListener("click", function(){
    body.style.overflow = "hidden"
    contenedorCompra.classList.remove('none')
    contenedorCompra.classList.add('contenedorCompra')
    informacionCompra.classList.add('informacionCompra')
    mostrarElemtrosLista()
})

function mostrarElemtrosLista() {
    productosCompra.innerHTML = ""
    valortotal = 0
    for (let i = 0; i < lista.length; i++){
        productosCompra.innerHTML += `<div><div class="img"><button onclick=eliminar(${i}) class="botonTrash"><img src="../img/trash.png"></button><p>${lista[i].nombre}</p></div><p> $${lista[i].precio}</p></div>`
        valortotal += parseInt(lista[i].precio)
    }
    total.innerHTML = `<p>Valor Total</p> <p><span>$${valortotal}</span></p>`
}

function eliminar(indice){
    let van = true
    let i = 0
    while (van == true) {
        if (productos[i].nombre == lista[indice].nombre) {
            productos[i].existencia += 1
            lista.splice(indice, 1)
            van = false
        }
        i += 1
    }
    guardarAlmacenamientoLocal("productos", productos)

    numero.innerHTML = lista.length
    if (lista.length == 0){
        numero.classList.remove("diseñoNumero")
    }
    visualizarProductos()
    mostrarElemtrosLista()
}

x.addEventListener("click", function(){
    body.style.overflow = "auto"
    contenedorCompra.classList.add('none')
    contenedorCompra.classList.remove('contenedorCompra')
    informacionCompra.classList.remove('informacionCompra')
})

function finalizarCompra() {
    if (valortotal === 0) {
    const mensajeCarritoVacio = document.createElement('div');
    mensajeCarritoVacio.classList.add('mensaje-carrito-vacio');
    mensajeCarritoVacio.textContent = 'El carrito está vacío.';

    body.appendChild(mensajeCarritoVacio);

    setTimeout(() => {
        mensajeCarritoVacio.remove();
    }, 2000);

    return;
    }

    const voucher = document.createElement('div');
    voucher.classList.add('voucher');
  
    const encabezado = document.createElement('h2');
    encabezado.textContent = 'Voucher';
    voucher.appendChild(encabezado);
  
    const productosVoucher = document.createElement('div');
    productosVoucher.classList.add('productos-voucher');
    for (let i = 0; i < lista.length; i++) {
      const producto = document.createElement('p');
      producto.textContent = `${lista[i].nombre} - $${lista[i].precio}`;
      productosVoucher.appendChild(producto);
    }
    voucher.appendChild(productosVoucher);
  
    const totalVoucher = document.createElement('p');
    totalVoucher.classList.add('total-voucher');
    totalVoucher.textContent = `Total a pagado Dolares: $${valortotal}`;
    voucher.appendChild(totalVoucher);
  
    body.appendChild(voucher);

    const mensajePago = document.createElement('div');
    mensajePago.classList.add('mensaje-pago');
    mensajePago.textContent = '¡Pago realizado con éxito!';

    body.appendChild(mensajePago);

    setTimeout(ocultarVoucher, 5000);
    setTimeout(ocultarMensaje, 2000);
    }

function ocultarVoucher() {
    const voucher = document.querySelector('.voucher');
    
    voucher.remove();
    }
function ocultarMensaje() {
    const mensajePago = document.querySelector('.mensaje-pago');
    
    mensajePago.remove();
    }