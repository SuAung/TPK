let products = [];
let filtered = [];

const perPage = 9;

let currentPage = 1;
let currentCategory = "All";

let cat;
let grid;
let pag;
let title;
let result;
let sort;

let cats = [];
let productById = new Map();

async function loadProducts() {
    try {

        const response = await fetch("data/products.json");
        products = await response.json();

        filtered = [...products];

        cats = ["All", ...new Set(products.map(p => p.category))];

        productById = new Map(
            products.map(p => [Number(p.id), p])
        );

        cat = document.getElementById("categories");
        grid = document.getElementById("productGrid");
        pag = document.getElementById("pagination");
        title = document.getElementById("catalogTitle");
        result = document.getElementById("resultText");
        sort = document.getElementById("sortSelect");

        sort.onchange = () => {
            applySort();
            currentPage = 1;
            render();
        };

        renderCats();
        render();

    } catch (error) {
        console.error("Failed to load products:", error);
    }
}

function renderCats() {

    cat.innerHTML = cats.map(c => `
        <button
            class="category-btn ${c === currentCategory ? "active" : ""}"
            onclick="selectCategory('${escJS(c)}')"
        >
            <span>${c === "All" ? "All Products" : c}</span>
            <span class="category-count">
                ${c === "All"
            ? products.length
            : products.filter(p => p.category === c).length}
            </span>
        </button>
    `).join("");
}

function selectCategory(c) {

    currentCategory = c;
    currentPage = 1;

    filtered = products.filter(
        p => c === "All" || p.category === c
    );

    applySort();

    renderCats();
    render();
}

function applySort() {

    if (sort.value === "priceLow") {
        filtered.sort(
            (a, b) => num(a.price) - num(b.price)
        );
    }

    if (sort.value === "priceHigh") {
        filtered.sort(
            (a, b) => num(b.price) - num(a.price)
        );
    }
}

function num(s) {
    return Number(
        String(s).replace(/[^0-9]/g, "")
    );
}

function render() {

    const total =
        Math.ceil(filtered.length / perPage) || 1;

    const start =
        (currentPage - 1) * perPage;

    const items =
        filtered.slice(start, start + perPage);

    title.textContent =
        currentCategory === "All"
            ? "All Products"
            : currentCategory;

    result.textContent =
        `Showing ${start + 1}–${Math.min(start + items.length, filtered.length)} of ${filtered.length} products`;

    grid.innerHTML = items.map(p => `
        <article
            class="product-card"
            onclick="openProduct(${p.id})"
        >
         <div class="product-img">
            <img
                    src="${p.image}"
                    alt="${esc(p.name)}"
                    decoding="async">
        </div>

            <div class="product-info">

                <div class="product-category">
                    ${esc(p.category)}
                </div>

                <div class="product-name">
                    ${esc(p.name)}
                </div>

                <div class="product-bottom">
                    <span class="price">
                        ${p.price}
                    </span>

                    <span class="view">
                        VIEW DETAILS →
                    </span>
                </div>

            </div>
        </article>
    `).join("");

    if (total > 1) {

        pag.innerHTML = `
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <button class="page-link" onclick="page(${currentPage - 1})">
                    ‹
                </button>
            </li>

            ${Array.from(
            { length: total },
            (_, i) => `
                    <li class="page-item ${i + 1 === currentPage ? "active" : ""}">
                        <button class="page-link" onclick="page(${i + 1})">
                            ${i + 1}
                        </button>
                    </li>
                `
        ).join("")}

            <li class="page-item ${currentPage === total ? "disabled" : ""}">
                <button class="page-link" onclick="page(${currentPage + 1})">
                    ›
                </button>
            </li>
        `;

    } else {

        pag.innerHTML = "";
    }
}

function page(n) {

    const total =
        Math.ceil(filtered.length / perPage);

    if (n < 1 || n > total) return;

    currentPage = n;

    render();

    window.scrollTo({
        top:
            document.querySelector(".store")
                .offsetTop - 80,
        behavior: "smooth"
    });
}

function openProduct(id) {

    const p = productById.get(Number(id));

    if (!p) return;

    document.getElementById("modalImage").src = p.image;
    document.getElementById("modalImage").alt = p.name;

    document.getElementById("modalCategory").textContent =
        p.category.toUpperCase();

    document.getElementById("modalTitle").textContent =
        p.name;

    document.getElementById("modalPrice").textContent =
        p.price;

    document.getElementById("modalDescription").textContent =
        p.description;

    document.getElementById("modalSize").textContent =
        p.size;

    document.getElementById("modalColor").textContent =
        p.color;

    new bootstrap.Modal(
        document.getElementById("productModal")
    ).show();
}

function esc(s) {

    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escJS(s) {

    return String(s)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

loadProducts();