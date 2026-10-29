const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { db } = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'shoplane-dev-secret';

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

function normalizeUser(user) {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return {
    ...safeUser,
    isAdmin: Boolean(safeUser.is_admin)
  };
}

function buildToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: Boolean(user.is_admin) },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid user token.' });
    }
    req.user = normalizeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopLane API is running.',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/categories', (req, res) => {
  const items = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
  res.json(items);
});

app.get('/api/products', (req, res) => {
  const q = (req.query.q || '').toString().trim();
  const category = (req.query.category || 'all').toString();
  const sort = (req.query.sort || 'featured').toString();
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);

  const offset = (page - 1) * limit;
  let whereClauses = [];
  const params = [];

  if (q) {
    whereClauses.push('(LOWER(name) LIKE ? OR LOWER(description) LIKE ?)');
    const search = `%${q.toLowerCase()}%`;
    params.push(search, search);
  }

  if (category && category !== 'all') {
    whereClauses.push('category = ?');
    params.push(category);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const orderMap = {
    featured: 'featured DESC, rating DESC',
    newest: 'created_at DESC',
    price_asc: 'price ASC',
    price_desc: 'price DESC',
    rating: 'rating DESC'
  };

  const total = db.prepare(`SELECT COUNT(*) as count FROM products ${whereSql}`).get(...params)?.count || 0;
  const rows = db.prepare(`
    SELECT * FROM products
    ${whereSql}
    ORDER BY ${orderMap[sort] || orderMap.featured}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  res.json({
    products: rows,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(product.id);
  res.json({ product, reviews });
});

app.get('/api/products/:id/related', (req, res) => {
  const selected = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));
  if (!selected) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const related = db.prepare(
    'SELECT * FROM products WHERE category = ? AND id != ? ORDER BY rating DESC LIMIT 4'
  ).all(selected.category, Number(req.params.id));

  res.json(related);
});

app.get('/api/reviews/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(productId);
  res.json(reviews);
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db.prepare('INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)')
    .run(name.trim(), email.toLowerCase(), passwordHash, 0);

  const createdUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.lastInsertRowid);
  const token = buildToken(createdUser);

  res.status(201).json({
    token,
    user: normalizeUser(createdUser)
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = buildToken(user);
  res.json({
    token,
    user: normalizeUser(user)
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/reviews', authMiddleware, (req, res) => {
  const { productId, rating, comment } = req.body || {};

  if (!productId || !rating) {
    return res.status(400).json({ message: 'Product and rating are required.' });
  }

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(productId));
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  db.prepare('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)')
    .run(productId, req.user.name, Number(rating), comment || 'Good product.');

  const allReviews = db.prepare('SELECT * FROM reviews WHERE product_id = ?').all(productId);
  const averageRating = allReviews.reduce((sum, review) => sum + Number(review.rating), 0) / allReviews.length;
  const reviewCount = allReviews.length;

  db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?')
    .run(Number(averageRating.toFixed(1)), reviewCount, productId);

  res.status(201).json({ message: 'Review submitted successfully.' });
});

app.post('/api/checkout', authMiddleware, (req, res) => {
  const { items = [], shipping = {}, paymentMethod = 'Card' } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart cannot be empty.' });
  }

  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    return sum + (price * qty);
  }, 0);

  const shippingFee = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const discount = subtotal > 300 ? 25 : 0;
  const total = subtotal + shippingFee + tax - discount;

  const orderNumber = `SL-${Date.now()}`;
  const orderInsert = db.prepare(`
    INSERT INTO orders (
      user_id, order_number, status, subtotal, shipping, tax, discount, total,
      shipping_name, shipping_phone, shipping_address, payment_method
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.user.id,
    orderNumber,
    'Processing',
    subtotal,
    shippingFee,
    tax,
    discount,
    total,
    shipping.fullName || req.user.name,
    shipping.phone || '',
    `${shipping.address || ''}, ${shipping.city || ''}, ${shipping.state || ''}, ${shipping.postalCode || ''}`,
    paymentMethod
  );

  const orderId = orderInsert.lastInsertRowid;

  for (const item of items) {
    db.prepare('INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(
        orderId,
        item.id,
        item.name,
        item.image,
        Number(item.quantity || 1),
        Number(item.price || 0),
        Number(item.price || 0) * Number(item.quantity || 1)
      );
  }

  res.status(201).json({
    message: 'Order placed successfully.',
    order: {
      id: orderId,
      orderNumber,
      total: Number(total.toFixed(2)),
      status: 'Processing'
    }
  });
});

app.get('/api/orders', authMiddleware, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(orders);
});

app.get('/api/orders/:id', authMiddleware, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(Number(req.params.id), req.user.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  res.json({ order, items });
});

app.get('/api/admin/stats', authMiddleware, requireAdmin, (req, res) => {
  const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const ordersCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  const revenue = db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM orders').get().total;
  const lowStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock < 10').get().count;

  res.json({
    productsCount,
    ordersCount,
    revenue: Number(revenue).toFixed(2),
    lowStock
  });
});

app.get('/api/admin/orders', authMiddleware, requireAdmin, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders);
});

app.put('/api/admin/orders/:id/status', authMiddleware, requireAdmin, (req, res) => {
  const { status } = req.body || {};
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(req.params.id));

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status || 'Processing', Number(req.params.id));
  res.json({ message: 'Order status updated.' });
});

app.get('/api/admin/products', authMiddleware, requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/admin/products', authMiddleware, requireAdmin, (req, res) => {
  const { name, category, price, originalPrice, stock, image, description } = req.body || {};

  if (!name || !category || !price) {
    return res.status(400).json({ message: 'Name, category, and price are required.' });
  }

  const result = db.prepare(`
    INSERT INTO products (
      name, category, price, original_price, stock, image, description,
      rating, review_count, featured, bestseller, new_arrival
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 4.5, 0, 0, 0, 0)
  `).run(
    name.trim(),
    category,
    Number(price),
    Number(originalPrice || price),
    Number(stock || 10),
    image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    description || 'A new premium product from ShopLane.'
  );

  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

app.put('/api/admin/products/:id', authMiddleware, requireAdmin, (req, res) => {
  const { name, category, price, originalPrice, stock, image, description } = req.body || {};
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  db.prepare(`
    UPDATE products
    SET name = ?, category = ?, price = ?, original_price = ?, stock = ?, image = ?, description = ?
    WHERE id = ?
  `).run(
    name || product.name,
    category || product.category,
    Number(price || product.price),
    Number(originalPrice || product.original_price || product.price),
    Number(stock || product.stock),
    image || product.image,
    description || product.description,
    Number(req.params.id)
  );

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));
  res.json(updated);
});

app.delete('/api/admin/products/:id', authMiddleware, requireAdmin, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(Number(req.params.id));
  res.json({ message: 'Product removed successfully.' });
});

app.listen(port, () => {
  console.log(`ShopLane API running on http://localhost:${port}`);
});
