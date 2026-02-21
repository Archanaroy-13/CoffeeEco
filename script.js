/* ===========================
   Coffee Eco — Main JavaScript
   =========================== */

/* ── State ── */
let cart = JSON.parse(localStorage.getItem('ce_cart') || '[]');
let isLoggedIn = JSON.parse(localStorage.getItem('ce_loggedIn') || 'false');
let activePage = 'home';
let activeCategory = 'all';
let activeBakery = 'all';

/* ── Data ── */
const drinks = [
  { id: 'd1', name: 'Ethiopian Espresso', category: 'espresso', price: 4.50, badge: 'Popular', sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&q=80' },
  { id: 'd2', name: 'Velvet Flat White', category: 'espresso', price: 5.20, badge: '', sizes: ['S','M'], img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80' },
  { id: 'd3', name: 'Cold Brew Tonic', category: 'iced', price: 5.80, badge: 'New', sizes: ['M','L'], img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80' },
  { id: 'd4', name: 'Spiced Honey Latte', category: 'specialty', price: 6.20, badge: 'New', sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=500&q=80' },
  { id: 'd5', name: 'Oat Milk Cortado', category: 'espresso', price: 4.90, badge: '', sizes: ['S','M'], img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&q=80' },
  { id: 'd6', name: 'Mango Iced Coffee', category: 'iced', price: 6.50, badge: 'Seasonal', sizes: ['M','L'], img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80' },
  { id: 'd7', name: 'Rose Cardamom Latte', category: 'specialty', price: 6.80, badge: '', sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&q=80' },
  { id: 'd8', name: 'Classic Americano', category: 'espresso', price: 3.80, badge: '', sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1521302200778-33500795e128?w=500&q=80' },
  { id: 'd9', name: 'Brown Sugar Shaken', category: 'iced', price: 6.10, badge: 'Popular', sizes: ['M','L'], img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&q=80' },
];

const bakeryItems = [
  { id: 'b1', name: 'Sourdough Loaf', category: 'breads', price: 7.50, img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=80' },
  { id: 'b2', name: 'Almond Croissant', category: 'pastries', price: 4.80, img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
  { id: 'b3', name: 'Chocolate Tart', category: 'desserts', price: 5.50, img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80' },
  { id: 'b4', name: 'Honey Walnut Bread', category: 'breads', price: 8.20, img: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=400&q=80' },
  { id: 'b5', name: 'Cinnamon Scroll', category: 'pastries', price: 4.20, img: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=80' },
  { id: 'b6', name: 'Lemon Drizzle Cake', category: 'desserts', price: 6.00, img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80' },
  { id: 'b7', name: 'Salted Caramel Bon Bons', category: 'sweets', price: 3.80, img: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80' },
  { id: 'b8', name: 'Olive Focaccia', category: 'breads', price: 6.50, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80' },
];

/* ── Cart ── */
function saveCart() { localStorage.setItem('ce_cart', JSON.stringify(cart)); }

function addToCart(id, type) {
  const items = type === 'drink' ? drinks : bakeryItems;
  const item = items.find(i => i.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  saveCart();
  updateCartCount();
  showToast(`<span class="toast-accent">${item.name}</span> added to cart`);
}

function updateCartCount() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const el = document.getElementById('cart-count');
  el.textContent = total;
  el.classList.toggle('visible', total > 0);
}

function renderCartPanel() {
  const container = document.getElementById('cart-items-list');
  const emptyEl = document.getElementById('cart-empty');
  const totalEl = document.getElementById('cart-total');
  if (cart.length === 0) {
    container.innerHTML = '';
    emptyEl.classList.remove('hidden');
    totalEl.textContent = '$0.00';
    return;
  }
  emptyEl.classList.add('hidden');
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  totalEl.innerHTML = `<span>$</span>${total.toFixed(2)}`;
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.img}" alt="${item.name}" loading="lazy"></div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
      </div>
    </div>
  `).join('');
}

function changeQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  updateCartCount();
  renderCartPanel();
}

/* ── Cart Panel ── */
function openCart() {
  renderCartPanel();
  document.getElementById('cart-panel').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-panel').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Auth ── */
function checkAuth() {
  document.getElementById('login-btn').classList.toggle('hidden', isLoggedIn);
  document.getElementById('logout-btn').classList.toggle('hidden', !isLoggedIn);
}
function doLogin(e) {
  e.preventDefault();
  isLoggedIn = true;
  localStorage.setItem('ce_loggedIn', 'true');
  checkAuth();
  closeModal();
  showToast('Welcome back, <span class="toast-accent">Coffee lover</span>!');
}
function doLogout() {
  isLoggedIn = false;
  localStorage.setItem('ce_loggedIn', 'false');
  checkAuth();
  showToast('Signed out. See you soon!');
}

/* ── Modal ── */
function openModal() {
  document.getElementById('login-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('login-modal').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Toast ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ── Pages ── */
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page === 'home' ? 'home-page' : 'drinks-page').classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  activePage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'drinks') renderDrinksPage('all');
}

/* ── Render Cards ── */
function createDrinkCard(item) {
  const sizes = item.sizes.map(s => `<button class="size-btn" onclick="selectSize(this)">${s}</button>`).join('');
  return `
    <div class="product-card fade-in-up">
      <div class="card-img">
        ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-category">${item.category}</div>
        <div class="card-name">${item.name}</div>
        <div class="card-sizes">${sizes}</div>
        <div class="card-footer">
          <div class="card-price"><sup>$</sup>${item.price.toFixed(2)}</div>
          <button class="add-cart-btn" onclick="handleAddCart(this,'${item.id}','drink')" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `;
}

function createBakeryCard(item) {
  return `
    <div class="product-card fade-in-up" data-cat="${item.category}">
      <div class="card-img">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-category">${item.category}</div>
        <div class="card-name">${item.name}</div>
        <div class="card-footer">
          <div class="card-price"><sup>$</sup>${item.price.toFixed(2)}</div>
          <button class="add-cart-btn" onclick="handleAddCart(this,'${item.id}','bakery')" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `;
}

function handleAddCart(btn, id, type) {
  addToCart(id, type);
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 400);
}

function selectSize(btn) {
  const siblings = btn.closest('.card-sizes').querySelectorAll('.size-btn');
  siblings.forEach(s => s.classList.remove('selected'));
  btn.classList.add('selected');
}

/* ── Render Featured (home) ── */
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = drinks.slice(0, 3);
  grid.innerHTML = featured.map(createDrinkCard).join('');
  observeFadeIn(grid.querySelectorAll('.fade-in-up'));
}

/* ── Render Bakery (home) ── */
function renderBakery(cat) {
  activeBakery = cat;
  const items = cat === 'all' ? bakeryItems : bakeryItems.filter(i => i.category === cat);
  const grid = document.getElementById('bakery-grid');
  if (!grid) return;
  grid.innerHTML = items.map(createBakeryCard).join('');
  observeFadeIn(grid.querySelectorAll('.fade-in-up'));

  document.querySelectorAll('#bakery-tabs .tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
}

/* ── Render Drinks Page ── */
function renderDrinksPage(cat) {
  activeCategory = cat;
  const items = cat === 'all' ? drinks : drinks.filter(d => d.category === cat);
  const grid = document.getElementById('drinks-page-grid');
  if (!grid) return;
  grid.innerHTML = items.map(createDrinkCard).join('');
  observeFadeIn(grid.querySelectorAll('.fade-in-up'));

  document.querySelectorAll('#drinks-filters .tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
}

/* ── Scroll Animations ── */
const ioOptions = { threshold: 0.1 };
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, ioOptions);

function observeFadeIn(els) {
  els.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.07}s`;
    io.observe(el);
  });
}

/* ── Navbar scroll ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── Hamburger ── */
function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  checkAuth();
  renderFeatured();
  renderBakery('all');
  initNavbar();
  initHamburger();

  // Observe other fade-in sections
  document.querySelectorAll('.fade-in-up:not(.product-card)').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    io.observe(el);
  });
});