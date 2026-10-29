const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.join(dbDir, 'store.db'));
db.pragma('journal_mode = WAL');

const seedCategories = [
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Grocery'
];

const seedProducts = [
  {
    id: 1,
    name: 'Aero Pro Wireless Headphones',
    category: 'Electronics',
    price: 299.99,
    original_price: 399.99,
    stock: 48,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    description: 'Premium wireless audio with 30-hour battery life, rapid charging, and rich sound quality.',
    featured: 1,
    bestseller: 1,
    new_arrival: 0,
    rating: 4.8,
    review_count: 128,
    colors: JSON.stringify(['Black', 'Silver']),
    sizes: JSON.stringify([])
  },
  {
    id: 2,
    name: 'UrbanFlex Running Shoes',
    category: 'Fashion',
    price: 169.0,
    original_price: 229.0,
    stock: 23,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight, breathable sneakers built for comfort and all-day movement.',
    featured: 1,
    bestseller: 1,
    new_arrival: 1,
    rating: 4.7,
    review_count: 214,
    colors: JSON.stringify(['Gray', 'Red', 'Black']),
    sizes: JSON.stringify(['6', '7', '8', '9', '10'])
  },
  {
    id: 3,
    name: 'Luma Smart Watch',
    category: 'Electronics',
    price: 249.0,
    original_price: 329.0,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    description: 'Track workouts, health metrics, notifications, and calls with a premium smartwatch display.',
    featured: 1,
    bestseller: 0,
    new_arrival: 1,
    rating: 4.6,
    review_count: 125,
    colors: JSON.stringify(['Midnight', 'Rose Gold']),
    sizes: JSON.stringify([])
  },
  {
    id: 4,
    name: 'ZenAir Smart Blender',
    category: 'Home',
    price: 129.99,
    original_price: 179.99,
    stock: 11,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80',
    description: 'A compact kitchen essential for smoothies, sauces, and quick meal prep.',
    featured: 0,
    bestseller: 1,
    new_arrival: 0,
    rating: 4.5,
    review_count: 84,
    colors: JSON.stringify(['White', 'Black']),
    sizes: JSON.stringify([])
  },
  {
    id: 5,
    name: 'AuraGlow Serum Kit',
    category: 'Beauty',
    price: 79.0,
    original_price: 109.0,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    description: 'Hydration-focused skincare kit that brightens and nourishes daily for visible glow.',
    featured: 1,
    bestseller: 0,
    new_arrival: 1,
    rating: 4.9,
    review_count: 176,
    colors: JSON.stringify(['Amber', 'Pink']),
    sizes: JSON.stringify([])
  },
  {
    id: 6,
    name: 'Harvest Basket Organic Box',
    category: 'Grocery',
    price: 64.5,
    original_price: 89.0,
    stock: 32,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
    description: 'Curated fresh produce and pantry essentials for healthy and convenient home cooking.',
    featured: 0,
    bestseller: 1,
    new_arrival: 0,
    rating: 4.7,
    review_count: 98,
    colors: JSON.stringify([]),
    sizes: JSON.stringify([])
  },
  {
    id: 7,
    name: 'CozyNest Throw Blanket',
    category: 'Home',
    price: 54.0,
    original_price: 79.0,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'Premium knit blanket with a soft touch for bedrooms, lounges, and cold evenings.',
    featured: 0,
    bestseller: 0,
    new_arrival: 1,
    rating: 4.6,
    review_count: 61,
    colors: JSON.stringify(['Sand', 'Forest', 'Charcoal']),
    sizes: JSON.stringify([])
  },
  {
    id: 8,
    name: 'Nova Laptop 14"',
    category: 'Electronics',
    price: 899.0,
    original_price: 1099.0,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    description: 'Ultra-portable performance laptop with all-day battery life and sleek design.',
    featured: 1,
    bestseller: 1,
    new_arrival: 0,
    rating: 4.8,
    review_count: 264,
    colors: JSON.stringify(['Silver', 'Space Gray']),
    sizes: JSON.stringify([])
  }
];

const seedReviews = [
  { product_id: 1, user_name: 'Aisha', rating: 5, comment: 'Amazing sound and battery life. Perfect for travel.' },
  { product_id: 2, user_name: 'Marcus', rating: 5, comment: 'Extremely comfortable and looks premium.' },
  { product_id: 3, user_name: 'Nina', rating: 4, comment: 'Very useful features and easy to sync with my phone.' },
  { product_id: 5, user_name: 'Sofia', rating: 5, comment: 'My skin feels softer and brighter after a week.' },
  { product_id: 8, user_name: 'Dev', rating: 5, comment: 'Fast, lightweight, and beautifully designed.' }
];

function seedDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      description TEXT,
      featured INTEGER DEFAULT 0,
      bestseller INTEGER DEFAULT 0,
      new_arrival INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      colors TEXT,
      sizes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      label TEXT,
      full_name TEXT,
      phone TEXT,
      address_line_1 TEXT,
      address_line_2 TEXT,
      city TEXT,
      state TEXT,
      postal_code TEXT,
      country TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      order_number TEXT UNIQUE,
      status TEXT DEFAULT 'Pending',
      subtotal REAL DEFAULT 0,
      shipping REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total REAL DEFAULT 0,
      shipping_name TEXT,
      shipping_phone TEXT,
      shipping_address TEXT,
      payment_method TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      product_name TEXT,
      product_image TEXT,
      quantity INTEGER,
      unit_price REAL,
      total REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      user_name TEXT,
      rating INTEGER,
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  for (const category of seedCategories) {
    db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)').run(category);
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    for (const product of seedProducts) {
      db.prepare(`
        INSERT INTO products (
          name, category, price, original_price, stock, image, description,
          featured, bestseller, new_arrival, rating, review_count, colors, sizes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        product.name,
        product.category,
        product.price,
        product.original_price,
        product.stock,
        product.image,
        product.description,
        product.featured,
        product.bestseller,
        product.new_arrival,
        product.rating,
        product.review_count,
        product.colors,
        product.sizes
      );
    }
  }

  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
  if (reviewCount === 0) {
    for (const review of seedReviews) {
      db.prepare('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)')
        .run(review.product_id, review.user_name, review.rating, review.comment);
    }
  }

  const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?').get('admin@shoplane.com').count;
  if (adminCount === 0) {
    const bcrypt = require('bcryptjs');
    const adminHash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)')
      .run('Admin User', 'admin@shoplane.com', adminHash, 1);
  }

  const customerCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?').get('user@shoplane.com').count;
  if (customerCount === 0) {
    const bcrypt = require('bcryptjs');
    const userHash = bcrypt.hashSync('user123', 10);
    db.prepare('INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)')
      .run('Demo Customer', 'user@shoplane.com', userHash, 0);
  }
}

seedDatabase();

module.exports = { db, seedDatabase };
