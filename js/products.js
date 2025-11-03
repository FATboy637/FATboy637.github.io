document.addEventListener("DOMContentLoaded", () => {
  fetch("data/products.json")
    .then((res) => res.json())
    .then((products) => {
      document.querySelectorAll("[data-category]").forEach((section) => {
        const category = section.dataset.category;
        const categoryProducts = products.filter(
          (p) => p.category === category
        );
        renderProducts(section, categoryProducts);
      });
    });
});

function renderProducts(container, products) {
  if (!products || products.length === 0) {
    container.innerHTML = "<p>No products available.</p>";
    return;
  }

  // Outer container and row
  const outerContainer = document.createElement("div");
  outerContainer.className = "container";
  const row = document.createElement("div");
  row.className = "row justify-content-center g-4";
  outerContainer.appendChild(row);
  container.appendChild(outerContainer);

  // Load More button
  const loadMoreWrapper = document.createElement("div");
  loadMoreWrapper.className = "text-center mt-4 mb-5";
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.className = "btn btn-dark px-4 py-2";
  loadMoreBtn.textContent = "Load More";
  loadMoreWrapper.appendChild(loadMoreBtn);
  container.appendChild(loadMoreWrapper);

  let currentIndex = 0;

  // Determine batch size based on screen width
  function getBatchSize() {
    return window.innerWidth < 768 ? 4 : 8;
  }

  function renderBatch() {
    const batchSize = getBatchSize();
    const nextBatch = products.slice(currentIndex, currentIndex + batchSize);

    nextBatch.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6 product-card mb-4 fade-in";

      const card = document.createElement("div");
      card.className = "card product-Card h-100";

      const img = document.createElement("img");
      img.className = "card-img-top";
      img.src = product.image;
      img.alt = product.name;

      const body = document.createElement("div");
      body.className = "card-body";

      // Updated title and specs styling
      const title = document.createElement("h4");
      title.className = "card-title product-Title";
      title.innerText = `${product.name} - R${product.price}`; // combined name and price

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
      button.addEventListener("click", () => addToCart(product));

      // Append elements in correct order
      body.appendChild(title);
      body.appendChild(specList);
      body.appendChild(button);

      card.appendChild(img);
      card.appendChild(body);
      col.appendChild(card);
      row.appendChild(col);

      setTimeout(() => col.classList.add("visible"), 100);
    });

    currentIndex += nextBatch.length;

    if (currentIndex >= products.length) {
      loadMoreWrapper.style.display = "none";
    }
  }

  renderBatch();

  loadMoreBtn.addEventListener("click", () => {
    renderBatch();
    window.scrollTo({
      top: loadMoreBtn.offsetTop - 400,
      behavior: "smooth",
    });
  });

  // Optional: adjust batch size on resize
  window.addEventListener("resize", () => {
    if (currentIndex < products.length && !loadMoreWrapper.style.display) {
      loadMoreWrapper.style.display = "block";
    }
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
  const badge =
    document.getElementById("cart-badge") ||
    document.getElementById("cart-count");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

updateCartBadge();
