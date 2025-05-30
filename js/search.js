let allProducts = [];

window.addEventListener("DOMContentLoaded", () => {
  fetch("data/products.json")
    .then((res) => res.json())
    .then((products) => {
      allProducts = products;
    });

  const searchInputs = document.querySelectorAll('input[type="search"]');
  searchInputs.forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleModalSearch(e);
      }
    });
  });

  const searchButtons = document.querySelectorAll("#search-button");
  searchButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form or page refresh
      handleModalSearch(e);
    });
  });
});

function handleModalSearch(event) {
  const searchInput = document.querySelector('input[type="search"]');
  const query = searchInput.value.toLowerCase().trim();
  const resultsContainer = document.getElementById("searchResultsContainer");
  resultsContainer.innerHTML = "";

  if (!query) return;

  const filtered = allProducts.filter((product) => {
    const hasName = typeof product.name === "string";
    const hasSpecs = Array.isArray(product.specs);
    const hasCategory = typeof product.category === "string";

    return (
      (hasName && product.name.toLowerCase().includes(query)) ||
      (hasSpecs && product.specs.some((spec) => spec.toLowerCase().includes(query))) ||
      (hasCategory && product.category.toLowerCase().includes(query))
    );
  });

  if (filtered.length === 0) {
    resultsContainer.innerHTML = "<p>No products found.</p>";
  } else {
    renderSearchResults(resultsContainer, filtered);
  }

  // Show modal after DOM update is ready
  requestAnimationFrame(() => {
    const modalEl = document.getElementById("searchModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  });
}

function renderSearchResults(container, products) {
  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-md-3 col-sm-6 mb-4";

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
    container.appendChild(col);
  });
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

updateCartBadge();
