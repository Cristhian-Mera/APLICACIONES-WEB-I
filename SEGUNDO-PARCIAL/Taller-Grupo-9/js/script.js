// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Xiaomi redmi 13 pro",
        precio: 430.00,
        precioOriginal: 450.00,
        categoria: "moviles",
        descripcion: "Procesador: MediaTek Dimensity 7300-Ultra.\nPantalla: CrystalRes AMOLED de 6,67.\nCámara principal: 200 MP.\nCámara frontal: 20 MP.\nBatería y carga: 5110 mAh.\nSistema operativo: Xiaomi HyperOS",
        stock: 10,
        imagenes: [
            "https://mistore.com.ec/web/image/product.product/1758/image_1024/%5B60092%5D%20Redmi%20Note%2014%20Pro%205G%20%20%28Negro%20Medianoche%29?unique=2ee80c9",
            "https://ae-pic-a1.aliexpress-media.com/kf/Af849d2adc9984a179f09527602b1ec770.jpg_960x960q75.jpg_.avif"
        ]
    },
    {
        id: 2,
        nombre: "ASUS ROG Strix G15",
        precio: 1499.99,
        categoria: "laptops",
        descripcion: "Ordenador portátil para juegos, NVIDIA GeForce RTX 3070, AMD Ryzen R9-5900HX, 16GB RAM, 1TB SSD, Windows 10",
        stock: 5,
        imagenes: [
            "https://m.media-amazon.com/images/I/81Cm1VMdxrL._AC_SL1500_.jpg"
        ]
    },
    {
        id: 3,
        nombre: "Auriculares Lenovo Tinkplus",
        precio: 89.99,
        precioOriginal: 119.99,
        categoria: "accesorios",
        descripcion: "AUDÍFONOS BLUETOOTH TIPO DIADEMA THINKPLUS HD200 LENOVO/ BT V5.0/ BATERIA 20 HORAS / BLACK",
        stock: 20,
        imagenes: [
            "https://nanotech-market.com/wp-content/uploads/2024/07/22931.jpg"
        ]
    },
    /*Este es el ejemplo de como agregar un nuevo producto:
    {
        id: 4,
        nombre: "Teclado",
        precio: 49.99,
        precioOriginal: 69.99,
        categoria: "perifericos",
        descripcion: "Teclado inalambrico",
        stock: 20,
        imagenes: [
            ""
        ]
    }
    */
    {
        id: 4,
        nombre: "Smart TV LG 50'' 4K UHD",
        precio: 499.99,
        precioOriginal: 599.99,
        categoria: "televisores",
        descripcion: "Pantalla LED de 50 pulgadas 4K UHD, resolución 3840 x 2160, Smart TV con WebOS, HDR10, control por voz y conectividad Wi-Fi y Bluetooth.",
        stock: 8,
        imagenes: [
            "https://www.kissu.com.ec/imagenes//productos/lg/16802863030.jpg"
        ]
    }
    
];

// Variables
const productosContainer = document.getElementById('productos-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const productoModal = new bootstrap.Modal(document.getElementById('productoModal'));
const toast = new bootstrap.Toast(document.getElementById('liveToast'));

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderProductos(productos);
    setupEventListeners();
});

// Renderizar productos
function renderProductos(productos) {
    productosContainer.innerHTML = '';
    
    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'col-12 col-md-6 col-lg-4 mb-4';
        productoElement.innerHTML = `
            <div class="card h-100" data-category="${producto.categoria}">
                <img src="${producto.imagenes[0]}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <div class="mt-auto">
                        <div class="d-flex align-items-center mb-2">
                            <span class="price">$${producto.precio.toFixed(2)}</span>
                            ${producto.precioOriginal ? `<span class="discount ms-2">$${producto.precioOriginal.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="btn btn-primary w-100 view-details-btn" data-id="${producto.id}">
                            Ver detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
        productosContainer.appendChild(productoElement);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.parentElement.style.display = 'block';
                } else {
                    card.parentElement.style.display = 'none';
                }
            });
        });
    });
    
    // Event delegation para botones de detalles
    productosContainer.addEventListener('click', (e) => {
        if (e.target.closest('.view-details-btn')) {
            const productId = parseInt(e.target.closest('.view-details-btn').dataset.id);
            showProductDetails(productId);
        }
    });
    
    // Botón añadir al carrito en el modal
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        showToast('Producto añadido al carrito');
    });
}

// Mostrar detalles del producto en el modal
function showProductDetails(productId) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;
    
    // Actualizar información del modal
    document.getElementById('modalProductTitle').textContent = producto.nombre;
    document.getElementById('modalProductName').textContent = producto.nombre;
    document.getElementById('modalProductPrice').textContent = `$${producto.precio.toFixed(2)}`;
    document.getElementById('modalProductDescription').textContent = producto.descripcion;
    document.getElementById('modalProductStock').textContent = producto.stock > 3 ? 'En stock' : `Últimas ${producto.stock} unidades`;
    
    // Actualizar carrusel de imágenes
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = '';
    
    producto.imagenes.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `<img src="${img}" class="d-block w-100" alt="${producto.nombre}">`;
        carouselInner.appendChild(item);
    });
    
    // Mostrar modal
    productoModal.show();
}

// Mostrar notificación toast
function showToast(message) {
    document.getElementById('toastMessage').textContent = message;
    toast.show();
}