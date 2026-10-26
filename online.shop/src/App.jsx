import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Nova Laptop", price: 999, emoji: "💻", category: "Tech", rating: 4.8, badge: "Bestseller", color: "#6366f1" },
  { id: 2, name: "Pulse Headphones", price: 129, emoji: "🎧", category: "Tech", rating: 4.6, badge: "New", color: "#ec4899" },
  { id: 3, name: "Orbit Phone", price: 799, emoji: "📱", category: "Tech", rating: 4.7, color: "#06b6d4" },
  { id: 4, name: "Cloud Sneakers", price: 89, emoji: "👟", category: "Fashion", rating: 4.5, badge: "-20%", color: "#f59e0b" },
  { id: 5, name: "Urban Backpack", price: 59, emoji: "🎒", category: "Fashion", rating: 4.4, color: "#10b981" },
  { id: 6, name: "Chrono Watch", price: 199, emoji: "⌚", category: "Fashion", rating: 4.9, badge: "Hot", color: "#8b5cf6" },
  { id: 7, name: "Morning Mug", price: 15, emoji: "☕", category: "Home", rating: 4.3, color: "#f97316" },
  { id: 8, name: "Glow Lamp", price: 45, emoji: "💡", category: "Home", rating: 4.6, badge: "New", color: "#eab308" },
];

const categories = ["All", "Tech", "Fashion", "Home"];

const features = [
  { icon: "🚚", title: "Free Shipping", text: "On all orders over $50" },
  { icon: "🔒", title: "Secure Payment", text: "100% protected checkout" },
  { icon: "↩️", title: "Easy Returns", text: "30-day money back" },
  { icon: "💬", title: "24/7 Support", text: "We're always here to help" },
];

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.emoji} ${product.name} added to cart`);
  };

  const changeQty = (id, amount) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + amount } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast("🎉 Thanks for subscribing!");
    setEmail("");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="app">
      {/* Background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">◆</span> Lumo<span className="accent">.</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Shop</a></li>
          <li><a href="#features">Why Us</a></li>
          <li><a href="#newsletter">Contact</a></li>
        </ul>
        <div className="nav-actions">
          <span className="wish-count">♥ {wishlist.length}</span>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="home">
        <div className="hero-text">
          <span className="pill">✨ New Collection 2026</span>
          <h1>
            Shop the <span className="gradient-text">future</span>,<br />
            today.
          </h1>
          <p>Curated tech, fashion and home essentials — designed to make everyday life a little brighter.</p>
          <div className="hero-buttons">
            <a href="#products" className="btn-primary">Shop Now →</a>
            <a href="#features" className="btn-ghost">Learn More</a>
          </div>
          <div className="stats">
            <div><strong>10k+</strong><span>Customers</span></div>
            <div><strong>500+</strong><span>Products</span></div>
            <div><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="float-card fc-1">🎧</div>
          <div className="float-card fc-2">👟</div>
          <div className="float-card fc-3">⌚</div>
          <div className="hero-circle">🛍️</div>
        </div>
      </header>

      {/* Products */}
      <section className="container" id="products">
        <h1>Trending Products</h1>
        <p className="subtitle">Handpicked favorites our customers love</p>

        <div className="filters">
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="category-buttons">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="products">
          {filteredProducts.length === 0 && <p className="empty">No products found 😕</p>}
          {filteredProducts.map((product, i) => (
            <div
              className="card"
              key={product.id}
              style={{ "--card-color": product.color, animationDelay: `${i * 0.07}s` }}
            >
              {product.badge && <span className="badge">{product.badge}</span>}
              <button
                className={`heart ${wishlist.includes(product.id) ? "liked" : ""}`}
                onClick={() => toggleWishlist(product.id)}
              >
                {wishlist.includes(product.id) ? "♥" : "♡"}
              </button>
              <div className="card-image">{product.emoji}</div>
              <span className="category">{product.category}</span>
              <h2>{product.name}</h2>
              <div className="rating">★ {product.rating}</div>
              <div className="card-bottom">
                <p>${product.price}</p>
                <button className="add-btn" onClick={() => addToCart(product)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        {features.map((f) => (
          <div className="feature" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      {/* Newsletter */}
      <section className="newsletter" id="newsletter">
        <h2>Get 10% off your first order</h2>
        <p>Join our newsletter for exclusive deals and new arrivals.</p>
        <form onSubmit={subscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn-primary">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          <span className="logo-icon">◆</span> Lumo<span className="accent">.</span>
        </div>
        <p>© 2026 Lumo Shop. Made with ♥ in Ulaanbaatar.</p>
      </footer>

      {/* Cart drawer */}
      <div className={`overlay ${cartOpen ? "show" : ""}`} onClick={() => setCartOpen(false)}></div>
      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-emoji" style={{ background: item.color }}>{item.emoji}</div>
                  <div className="cart-info">
                    <strong>{item.name}</strong>
                    <span>${item.price}</span>
                  </div>
                  <div className="qty">
                    <button onClick={() => changeQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>${cartTotal}</strong>
              </div>
              <button
                className="btn-primary full"
                onClick={() => {
                  setCart([]);
                  setCartOpen(false);
                  showToast("✅ Order placed! Thank you");
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Toast */}
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}

export default App;