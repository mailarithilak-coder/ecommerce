import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value || 0));

function apiFetch(path, options = {}, tokenOverride) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (tokenOverride) {
    headers.Authorization = `Bearer ${tokenOverride}`;
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  }).then(async (response) => {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.message || 'Request failed.');
    }

    return data;
  });
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('shoplane-theme') || 'light');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('shoplane-user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('shoplane-token') || '');
  const [cart, setCart] = useState(() => {
    const raw = localStorage.getItem('shoplane-cart');
    return raw ? JSON.parse(raw) : [];
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('shoplane-theme', theme);
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('shoplane-user', JSON.stringify(user || null));
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('shoplane-token', token);
    } else {
      localStorage.removeItem('shoplane-token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('shoplane-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          apiFetch('/categories'),
          apiFetch('/products?limit=12&page=1')
        ]);
        setCategories(categoriesResponse);
        setProducts(productsResponse.products || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [cart]
  );

  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  function addToCart(product, quantity = 1) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...currentCart, { ...product, quantity }];
    });
  }

  function clearCart() {
    setCart([]);
  }

  function changeQuantity(productId, delta) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  }

  async function loginUser(payload) {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setToken(result.token);
    setUser(result.user);
    return result;
  }

  async function registerUser(payload) {
    const result = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setToken(result.token);
    setUser(result.user);
    return result;
  }

  function logoutUser() {
    setUser(null);
    setToken('');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav-row">
          <Link to="/" className="brand">
            <span className="brand-mark">S</span> ShopLane
          </Link>

          <div className="search-box-wrap">
            <input type="text" placeholder="Search products, brands, deals" />
            <button>Search</button>
          </div>

          <nav className="header-actions">
            <button className="theme-toggle" onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <NavLink to="/products">Shop</NavLink>
            <NavLink to="/account">Account</NavLink>
            <NavLink to="/contact">Support</NavLink>
            <NavLink to="/cart" className="cart-link">
              Cart <span>{totalItems}</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="category-strip">
        <div className="container category-nav">
          {categories.map((item) => (
            <NavLink key={item.id} to={`/products?category=${encodeURIComponent(item.name)}`}>
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {error && <div className="flash-error">{error}</div>}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              categories={categories}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/products"
          element={<CatalogPage products={products} categories={categories} addToCart={addToCart} />}
        />
        <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />
        <Route
          path="/account"
          element={<AccountPage loginUser={loginUser} registerUser={registerUser} user={user} token={token} logoutUser={logoutUser} />}
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              subtotal={subtotal}
              changeQuantity={changeQuantity}
              removeFromCart={removeFromCart}
              user={user}
            />
          }
        />
        <Route
          path="/checkout"
          element={<CheckoutPage cart={cart} subtotal={subtotal} user={user} token={token} clearCart={clearCart} />}
        />
        <Route path="/admin" element={<AdminPage user={user} token={token} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h4>ShopLane</h4>
            <p>Modern essentials for daily living, curated for comfort, style, and convenience.</p>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h5>Account</h5>
            <ul>
              <li><Link to="/account">Login</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h5>Need help?</h5>
            <ul>
              <li>support@shoplane.dev</li>
              <li>+1 (800) 555-1234</li>
              <li>Mon-Sat, 9am-8pm</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ products, categories, addToCart }) {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const bestSellers = products.filter((product) => product.bestseller).slice(0, 4);
  const newArrivals = products.filter((product) => product.new_arrival).slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">New season deals</span>
            <h1>Upgrade your everyday life.</h1>
            <p>Discover premium gadgets, home essentials, wellness picks, and modern fashion at unbeatable prices.</p>
            <div className="hero-actions">
              <Link to="/products" className="button primary">Shop now</Link>
              <Link to="/account" className="button secondary">Join free</Link>
            </div>
            <div className="hero-metrics">
              <div><strong>20K+</strong><span>Happy shoppers</span></div>
              <div><strong>4.8/5</strong><span>Average rating</span></div>
              <div><strong>2-day</strong><span>Fast delivery</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="promo-card large">
              <span>Flash sale</span>
              <h3>Up to 60% OFF</h3>
              <p>Smart home, tech, and lifestyle picks.</p>
            </div>
            <div className="promo-card small">
              <span>Member price</span>
              <h4>Extra 10% off</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Browse by category</span>
            <h2>Shop trending categories</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${encodeURIComponent(category.name)}`} className="category-card">
              <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80" alt={category.name} />
              <div className="category-overlay">
                <strong>{category.name}</strong>
                <span>Explore now</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured</span>
            <h2>Top picks for you</h2>
          </div>
          <Link to="/products" className="text-link">View all</Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </section>

      <section className="container page-section promo-banner">
        <div>
          <span className="eyebrow">Weekend deal</span>
          <h2>Save on premium essentials</h2>
          <p>From smart tech to home comfort, find curated products that make everyday life easier.</p>
        </div>
        <Link to="/products" className="button primary">Explore deals</Link>
      </section>

      <section className="container page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Best sellers</span>
            <h2>Customer favorites</h2>
          </div>
        </div>
        <div className="product-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">New arrivals</span>
            <h2>Fresh picks</h2>
          </div>
        </div>
        <div className="product-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </section>

      <section className="container page-section testimonials">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Reviews</span>
            <h2>What customers say</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {[
            { name: 'Ayesha', quote: 'The quality feels premium and delivery was super fast.' },
            { name: 'David', quote: 'I love the interface and the product recommendations were spot on.' },
            { name: 'Priya', quote: 'Easy checkout, great offers, and everything arrived in perfect condition.' }
          ].map((item) => (
            <div className="testimonial-card" key={item.name}>
              <div className="star-row">★★★★★</div>
              <p>“{item.quote}”</p>
              <strong>{item.name}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function CatalogPage({ products, categories, addToCart }) {
  const [searchParams, setSearchParams] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const categoryFromQuery = new URLSearchParams(window.location.hash.split('?')[1] || '').get('category');
    if (categoryFromQuery) setSelectedCategory(categoryFromQuery);
  }, []);

  useEffect(() => {
    let nextProducts = [...products];

    if (selectedCategory !== 'all') {
      nextProducts = nextProducts.filter((product) => product.category === selectedCategory);
    }

    if (searchParams.trim()) {
      const value = searchParams.trim().toLowerCase();
      nextProducts = nextProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(value) ||
          product.description.toLowerCase().includes(value)
      );
    }

    if (sort === 'price_asc') {
      nextProducts.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === 'price_desc') {
      nextProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (sort === 'rating') {
      nextProducts.sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    if (sort === 'newest') {
      nextProducts.sort((a, b) => Number(b.new_arrival) - Number(a.new_arrival));
    }

    setFilteredProducts(nextProducts);
  }, [products, selectedCategory, searchParams, sort]);

  return (
    <main className="container page-section">
      <div className="catalog-header">
        <div>
          <span className="eyebrow">Product catalog</span>
          <h1>Discover the best deals</h1>
        </div>
      </div>

      <div className="catalog-controls">
        <input
          type="text"
          value={searchParams}
          onChange={(event) => setSearchParams(event.target.value)}
          placeholder="Search products"
        />
        <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to high</option>
          <option value="price_desc">Price: High to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </main>
  );
}

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    Promise.all([
      apiFetch(`/products/${id}`),
      apiFetch(`/products/${id}/related`)
    ])
      .then(([productResponse, relatedResponse]) => {
        setProduct(productResponse.product);
        setReviews(productResponse.reviews || []);
        setRelated(relatedResponse || []);
      })
      .catch((error) => console.error(error.message));
  }, [id]);

  if (!product) {
    return <div className="container page-section">Loading product...</div>;
  }

  const images = [product.image, product.image, product.image];

  return (
    <main className="container page-section product-page">
      <div className="product-showcase">
        <div className="product-gallery">
          <img src={images[selectedImage]} alt={product.name} className="main-image" />
          <div className="thumbnail-row">
            {images.map((image, index) => (
              <button key={index} className={`thumb ${selectedImage === index ? 'active' : ''}`} onClick={() => setSelectedImage(index)}>
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="rating-line">
            <span>★★★★★</span>
            <strong>{product.rating}</strong>
            <small>({product.review_count} reviews)</small>
          </div>
          <div className="price-row">
            <h2>{formatPrice(product.price)}</h2>
            <span className="old-price">{formatPrice(product.original_price)}</span>
          </div>
          <p>{product.description}</p>

          <div className="variants">
            <div>
              <strong>Colors</strong>
              <div className="swatches">
                {JSON.parse(product.colors || '[]').length ? JSON.parse(product.colors).map((color) => <span key={color}>{color}</span>) : <span>Standard</span>}
              </div>
            </div>
          </div>

          <div className="cta-row">
            <button className="button primary" onClick={() => addToCart(product, 1)}>Add to cart</button>
            <button className="button secondary">Wishlist</button>
          </div>

          <div className="stock-box">
            <span className={Number(product.stock) < 10 ? 'warning' : 'ok'}>
              {Number(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Customer feedback</span>
            <h2>Reviews</h2>
          </div>
        </div>
        <div className="review-list">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <strong>{review.user_name}</strong>
              <span>{'★'.repeat(review.rating)}</span>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">You may also like</span>
            <h2>Related products</h2>
          </div>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} addToCart={addToCart} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="product-body">
        <div className="product-meta">
          <span className="badge">{product.category}</span>
          <span className="rating">⭐ {product.rating}</span>
        </div>
        <h3>{product.name}</h3>
        <div className="product-pricing">
          <strong>{formatPrice(product.price)}</strong>
          <del>{formatPrice(product.original_price)}</del>
        </div>
        <div className="product-actions">
          <button className="button primary" onClick={() => addToCart(product, 1)}>
            Add to cart
          </button>
          <Link to={`/product/${product.id}`} className="button secondary">Learn more</Link>
        </div>
      </div>
    </article>
  );
}

function AccountPage({ loginUser, registerUser, user, token, logoutUser }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'user@shoplane.com', password: 'user123' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        await loginUser({ email: form.email, password: form.password });
        setMessage('Login successful. Welcome back!');
      } else {
        await registerUser({ name: form.name, email: form.email, password: form.password });
        setMessage('Account created. Welcome to ShopLane!');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <main className="container page-section account-panel">
        <div className="account-card">
          <h1>My account</h1>
          <p>Welcome back, {user.name}</p>
          <div className="account-meta">
            <span>Email: {user.email}</span>
            <span>Role: {user.isAdmin ? 'Administrator' : 'Customer'}</span>
          </div>
          <div className="cta-row">
            <Link to="/cart" className="button primary">View cart</Link>
            {user.isAdmin && <Link to="/admin" className="button secondary">Open admin dashboard</Link>}
            <button className="button secondary" onClick={logoutUser}>Logout</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container page-section auth-panel">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <label>
              Full name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
          )}

          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>

          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>

          {message && <p className="form-message">{message}</p>}
          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <div className="demo-box">
          <h4>Demo access</h4>
          <p>Admin: admin@shoplane.com / admin123</p>
          <p>Customer: user@shoplane.com / user123</p>
        </div>
      </div>
    </main>
  );
}

function CartPage({ cart, subtotal, changeQuantity, removeFromCart, user }) {
  const navigate = useNavigate();

  if (!cart.length) {
    return (
      <main className="container page-section empty-state">
        <h1>Your cart is empty</h1>
        <p>Continue shopping to add products to your cart.</p>
        <Link to="/products" className="button primary">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="container page-section cart-page">
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>{formatPrice(item.price)}</p>
                <div className="qty-row">
                  <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                </div>
              </div>
              <button className="text-button" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>

        <aside className="summary-card">
          <h3>Order summary</h3>
          <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>Free</strong></div>
          <div className="summary-row"><span>Estimated tax</span><strong>{formatPrice(subtotal * 0.08)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatPrice(subtotal * 1.08)}</strong></div>
          <button className="button primary full" onClick={() => (user ? navigate('/checkout') : navigate('/account'))}>
            {user ? 'Proceed to checkout' : 'Login to checkout'}
          </button>
        </aside>
      </div>
    </main>
  );
}

function CheckoutPage({ cart, subtotal, user, token, clearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: user?.name || '', phone: '', address: '', city: '', state: '', postalCode: '', paymentMethod: 'Card' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div className="container page-section">Please log in to continue checkout.</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        items: cart,
        shipping: form,
        paymentMethod: form.paymentMethod
      };

      const result = await apiFetch('/checkout', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, token);

      setMessage(`Order placed successfully! Order #${result.order.orderNumber}`);
      localStorage.removeItem('shoplane-cart');
      clearCart();
      setTimeout(() => navigate('/account'), 1500);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page-section checkout-page">
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h1>Checkout</h1>
          <label>
            Full name
            <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </label>
          <label>
            Address
            <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          </label>
          <div className="row-fields">
            <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="City" />
            <input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} placeholder="State" />
            <input value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} placeholder="ZIP" />
          </div>
          <label>
            Payment method
            <select value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Cash on delivery">Cash on delivery</option>
            </select>
          </label>
          {message && <p className="form-message">{message}</p>}
          <button type="submit" className="button primary full" disabled={loading}>
            {loading ? 'Processing...' : 'Place order'}
          </button>
        </form>

        <aside className="summary-card">
          <h3>Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>Free</strong></div>
          <div className="summary-row"><span>Tax</span><strong>{formatPrice(subtotal * 0.08)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatPrice(subtotal * 1.08)}</strong></div>
        </aside>
      </div>
    </main>
  );
}

function AdminPage({ user, token }) {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '10',
    image: '',
    description: ''
  });

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    Promise.all([
      apiFetch('/admin/stats', {}, token),
      apiFetch('/admin/orders', {}, token),
      apiFetch('/admin/products', {}, token)
    ])
      .then(([statsResult, ordersResult, productsResult]) => {
        setStats(statsResult);
        setOrders(ordersResult || []);
        setItems(productsResult || []);
      })
      .catch((err) => console.error(err.message));
  }, [user, token]);

  if (!user || !user.isAdmin) {
    return <div className="container page-section">Admin access required.</div>;
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    const result = await apiFetch('/admin/products', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice || form.price),
        stock: Number(form.stock)
      })
    }, token);

    setItems((current) => [result, ...current]);
    setForm({ name: '', category: 'Electronics', price: '', originalPrice: '', stock: '10', image: '', description: '' });
  };

  const handleDelete = async (id) => {
    await apiFetch(`/admin/products/${id}`, { method: 'DELETE' }, token);
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <main className="container page-section admin-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Admin controls</span>
          <h1>Dashboard</h1>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card"><span>Products</span><strong>{stats.productsCount}</strong></div>
          <div className="stat-card"><span>Orders</span><strong>{stats.ordersCount}</strong></div>
          <div className="stat-card"><span>Revenue</span><strong>{formatPrice(Number(stats.revenue))}</strong></div>
          <div className="stat-card"><span>Low stock</span><strong>{stats.lowStock}</strong></div>
        </div>
      )}

      <div className="admin-grid">
        <form className="admin-form" onSubmit={handleProductSubmit}>
          <h3>Add product</h3>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Product name" />
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
            <option>Beauty</option>
            <option>Grocery</option>
          </select>
          <div className="row-fields">
            <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price" />
            <input value={form.originalPrice} onChange={(event) => setForm({ ...form, originalPrice: event.target.value })} placeholder="Original price" />
          </div>
          <div className="row-fields">
            <input value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="Stock" />
            <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="Image URL" />
          </div>
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" />
          <button className="button primary" type="submit">Save product</button>
        </form>

        <div className="admin-list">
          <h3>Current inventory</h3>
          {items.map((item) => (
            <div className="inventory-row" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>{item.category}</small>
              </div>
              <div>
                <span>{item.stock} in stock</span>
                <button className="text-button" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="orders-table">
        <h3>Order management</h3>
        {orders.map((item) => (
          <div className="order-row" key={item.id}>
            <span>#{item.order_number}</span>
            <span>{item.status}</span>
            <span>{formatPrice(item.total)}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

function ContactPage() {
  return (
    <main className="container page-section simple-page">
      <h1>Contact us</h1>
      <p>Need help with orders, support, or returns? Our customer care team is available daily.</p>
      <div className="info-card-grid">
        <div className="info-card">Email: support@shoplane.dev</div>
        <div className="info-card">Phone: +1 (800) 555-1234</div>
        <div className="info-card">Hours: 9am - 8pm</div>
      </div>
    </main>
  );
}

function FAQPage() {
  return (
    <main className="container page-section simple-page">
      <h1>Frequently asked questions</h1>
      <div className="faq-list">
        <div className="faq-item"><strong>How long is shipping?</strong><p>Orders usually arrive in 2-5 business days depending on location.</p></div>
        <div className="faq-item"><strong>Do you accept returns?</strong><p>Yes. Returns are accepted within 30 days for eligible items.</p></div>
        <div className="faq-item"><strong>Can I change my address after ordering?</strong><p>Yes, if the order has not been shipped yet.</p></div>
      </div>
    </main>
  );
}

export default App;
