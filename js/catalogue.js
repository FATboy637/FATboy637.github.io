document.addEventListener("DOMContentLoaded", () => {
  fetch("data/products.json")
    .then((res) => res.json())
    .then((products) => {
      document.querySelectorAll("[data-category]").forEach((section) => {
        const category = section.dataset.category;
        const categoryProducts = products.filter((p) => p.category === category);
        renderProducts(section, categoryProducts);
      });
    });
});

function renderProducts(container, products) {
  if (!products || products.length === 0) {
    container.innerHTML = "<p>No products available.</p>";
    return;
  }

  // ✅ Outer container wrapper
  const outerContainer = document.createElement("div");
  outerContainer.className = "container";

  const row = document.createElement("div");
  row.className = "row justify-content-center";

  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-md-3 col-sm-6 product-card mb-4";

    const card = document.createElement("div");
    card.className = "card product-Card h-100";

    const img = document.createElement("img");
    img.className = "card-img-top";
    img.src = product.image;
    img.alt = product.name;

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h4");
    title.className = "card-title product-Title";
    title.innerText = `${product.name} - R${product.price}`;

    const specList = document.createElement("ul");
    product.specs.forEach((spec) => {
      const li = document.createElement("li");
      li.className = "product-Spec";
      li.textContent = spec;
      specList.appendChild(li);
    });

    const button = document.createElement("button");
    button.className = "btn btn-success product-Button mt-2";
    button.innerText = "Add to Cart";
    button.addEventListener("click", () => {
      addToCart(product);
    });

    body.appendChild(title);
    body.appendChild(specList);
    body.appendChild(button);

    card.appendChild(img);
    card.appendChild(body);
    col.appendChild(card);
    row.appendChild(col);
  });

  outerContainer.appendChild(row);
  container.appendChild(outerContainer);
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("computerhub_cart")) || [];

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("computerhub_cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("computerhub_cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

// Initial badge update
updateCartBadge();
