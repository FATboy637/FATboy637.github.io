document.addEventListener("DOMContentLoaded", () => {
  fetch("data/products.json")
    .then(res => res.json())
    .then(products => {
      document.querySelectorAll("[data-category]").forEach(section => {
        const category = section.dataset.category;
        const categoryProducts = products.filter(p => p.category === category);
        renderProducts(section, categoryProducts, category);
      });
    });
});

function renderProducts(container, products, category) {
  if (!products || products.length === 0) {
    container.innerHTML = "<p>No products available.</p>";
    return;
  }

  const outerContainer = document.createElement("div");
  outerContainer.className = "container position-relative";

  const carouselWrapper = document.createElement("div");
  carouselWrapper.className = "carousel-wrapper position-relative";
  carouselWrapper.style.overflow = "hidden";

  const track = document.createElement("div");
  track.className = "d-flex";
  track.style.transition = "transform 0.4s ease";
  track.style.willChange = "transform";

  const maxProducts = Math.min(products.length, 8);

  // Create cards using existing column classes to maintain size
  products.slice(0, maxProducts).forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-3 col-sm-6 product-card mb-4 fade-in";
    col.style.flex = "0 0 auto"; // keep original card size

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
    product.specs.forEach(spec => {
      const li = document.createElement("li");
      li.className = "product-Spec";
      li.textContent = spec;
      specList.appendChild(li);
    });

    const button = document.createElement("button");
    button.className = "btn btn-success product-Button mt-2";
    button.innerText = "Add to Cart";
    button.addEventListener("click", () => addToCart(product));

    body.appendChild(title);
    body.appendChild(specList);
    body.appendChild(button);
    card.appendChild(img);
    card.appendChild(body);
    col.appendChild(card);
    track.appendChild(col);

    // fade-in
    setTimeout(() => col.classList.remove("fade-in"), 500);
  });

  carouselWrapper.appendChild(track);
  outerContainer.appendChild(carouselWrapper);
  container.appendChild(outerContainer);

  // Navigation buttons
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");
  prevBtn.innerHTML = "&#10094;";
  nextBtn.innerHTML = "&#10095;";

  [prevBtn, nextBtn].forEach(btn => {
    btn.className = "btn btn-dark btn-sm position-absolute top-50 translate-middle-y";
    btn.style.zIndex = "10";
  });

  prevBtn.style.left = "-1.5rem";
  nextBtn.style.right = "-1.5rem";

  let currentIndex = 0;
  let itemsPerView = window.innerWidth < 768 ? 1 : 4;

  prevBtn.addEventListener("click", () => {
  if (currentIndex === 0) {
    // wrap to last possible start index
    currentIndex = maxProducts - itemsPerView;
  } else {
    currentIndex -= 1;
  }
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  if (currentIndex >= maxProducts - itemsPerView) {
    // wrap to beginning
    currentIndex = 0;
  } else {
    currentIndex += 1;
  }
  updateCarousel();
});


  function updateCarousel() {
    const shift = track.children[0].offsetWidth * currentIndex;
    track.style.transform = `translateX(-${shift}px)`;
  }

  function updateLayout() {
    const width = window.innerWidth;
    if (width < 768) {
      itemsPerView = 1;
      carouselWrapper.style.overflowX = "auto";
      carouselWrapper.style.scrollBehavior = "smooth";
      track.style.transition = "none";
      track.querySelectorAll(".product-card").forEach(c => (c.style.flex = "0 0 100%"));
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      itemsPerView = 4;
      track.style.transition = "transform 0.4s ease";
      track.querySelectorAll(".product-card").forEach(c => (c.style.flex = "0 0 auto"));
      carouselWrapper.style.overflow = "hidden";
      prevBtn.style.display = "block";
      nextBtn.style.display = "block";
      updateCarousel();
    }
  }

  window.addEventListener("resize", updateLayout);
  updateLayout();

  if (window.innerWidth >= 768) {
    outerContainer.appendChild(prevBtn);
    outerContainer.appendChild(nextBtn);
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("computerhub_cart")) || [];
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
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
