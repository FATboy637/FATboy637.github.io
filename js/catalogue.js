// Update this path if your file structure differs
const DATA_URL = "data/products.json";

// Extract category from HTML <body data-category="laptops">
const category = document.body.dataset.category;

// Load and render products
document.addEventListener("DOMContentLoaded", () => {
  fetch(DATA_URL)
    .then(response => response.json())
    .then(products => {
      const filtered = products.filter(p => p.category === category);
      renderProducts(filtered);
    })
    .catch(error => console.error("Error loading product data:", error));
});

// Render product cards
function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = products.map(product => `
    <div class="col-md-3 col-sm-6 product-card mb-4"
         data-brand="${product.brand}"
         data-price="${product.price}">
      <div class="card product-Card h-100 mb-10 d-flex flex-column justify-content-between">
        <img class="card-img-top" src="${product.image}" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h4 class="card-title product-Title">${product.name}<br>- R${product.price || "?"}</h4>
          <ul class="mb-3">
            ${product.specs.map(spec => `<li class="product-Spec">${spec}</li>`).join("")}
          </ul>
          <button class="btn btn-success add-to-cart mt-auto"
                  data-id="${product.id}"
                  data-name="${product.name}"
                  data-price="${product.price}"
                  data-image="${product.image}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join("");
}
