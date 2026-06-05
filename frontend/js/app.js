let editingProductId = null;

// ==============================
// USUARIO LOGEADO
// ==============================
const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
const role = loggedUser?.role;

// ==============================
// ELEMENTOS
// ==============================
const form = document.getElementById("productForm");
const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const API_URL = "https://aromacafe-backend.onrender.com/api/products";

// ==============================
// PROTEGER CRUD (solo admin)
// ==============================
if (form && role !== "admin") {
    form.style.display = "none";
}

// ==============================
// PROTEGER ACCESO
// ==============================
if (!loggedUser) {
    if (productsDiv) {
        productsDiv.innerHTML = `
            <h2 style="text-align:center;margin-top:50px;">
                🔒 Debes iniciar sesión para ver los productos
            </h2>
        `;
    }
} else {
    getProducts();
}




// ==============================
// OBTENER PRODUCTOS
// ==============================
async function getProducts() {

    if (!productsDiv) return;

    const response = await fetch(API_URL);
    const products = await response.json();

    productsDiv.innerHTML = "";

    const searchValue = searchInput?.value || "";

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    filteredProducts.forEach(product => {

        productsDiv.innerHTML += `
        <div class="card">

            <img src="${product.image}">

            <div class="card-content">

                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>₡${product.price}</p>
                <p>Stock: ${product.stock}</p>

                ${role === "admin" ? `
                    <button onclick="editProduct('${product._id}')">
                        Editar
                    </button>

                    <button onclick="deleteProduct('${product._id}')">
                        Eliminar
                    </button>
                ` : ""}

                <a 
                href="https://wa.me/50686285807?text=Hola,%20quiero%20ordenar%20${product.name}" 
                target="_blank">

                    <button>Ordenar por WhatsApp</button>
                </a>

            </div>
        </div>
        `;
    });
}


// ==============================
// ELIMINAR PRODUCTO
// ==============================
async function deleteProduct(id){

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    getProducts();
}


// ==============================
// EDITAR PRODUCTO
// ==============================
async function editProduct(id){

    const response = await fetch(API_URL);
    const products = await response.json();

    const product = products.find(p => p._id === id);

    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("description").value = product.description;
    document.getElementById("image").value = product.image;
    document.getElementById("stock").value = product.stock;

    editingProductId = id;

    form.querySelector("button").textContent = "Actualizar producto";
}


// ==============================
// FORMULARIO (CREATE / UPDATE)
// ==============================
if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const product = {
            name: document.getElementById("name").value,
            price: Number(document.getElementById("price").value),
            description: document.getElementById("description").value,
            image: document.getElementById("image").value,
            stock: Number(document.getElementById("stock").value)
        };

        // UPDATE
        if (editingProductId) {

            await fetch(`${API_URL}/${editingProductId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            });

            editingProductId = null;
            form.querySelector("button").textContent = "Agregar producto";

        } 
        // CREATE
        else {

            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            });
        }

        form.reset();
        getProducts();
    });
}
