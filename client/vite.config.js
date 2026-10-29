:root {
  --bg: #f6f8fc;
  --panel: #ffffff;
  --panel-alt: #eef4ff;
  --text: #111827;
  --muted: #64748b;
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --shadow: rgba(15, 23, 42, 0.08);
  --border: rgba(148, 163, 184, 0.25);
}

body[data-theme='dark'] {
  --bg: #07111d;
  --panel: #101b2c;
  --panel-alt: #111827;
  --text: #edf6ff;
  --muted: #9db0c6;
  --primary: #60a5fa;
  --primary-dark: #3b82f6;
  --shadow: rgba(15, 23, 42, 0.42);
  --border: rgba(148, 163, 184, 0.22);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

img {
  max-width: 100%;
  display: block;
}

.container {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  background: rgba(17, 24, 39, 0.96);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
}

.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  height: 78px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.3rem;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  color: white;
}

.search-box-wrap {
  flex: 1;
  max-width: 520px;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  overflow: hidden;
}

.search-box-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  color: #fff;
  padding: 12px 14px;
  outline: none;
}

.search-box-wrap input::placeholder {
  color: rgba(255,255,255,0.7);
}

.search-box-wrap button {
  border: none;
  background: var(--primary);
  color: white;
  padding: 12px 18px;
  cursor: pointer;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions a,
.header-actions button {
  color: #eef2ff;
  background: transparent;
  border: none;
  cursor: pointer;
}

.cart-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cart-link span {
  background: white;
  color: #111827;
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  line-height: 24px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.category-strip {
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 4px 18px var(--shadow);
}

.category-nav {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  min-height: 52px;
}

.category-nav a {
  color: var(--muted);
  font-weight: 600;
  padding: 14px 8px;
}

.hero {
  padding: 52px 0 18px;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 24px;
  background: linear-gradient(135deg, #dfeeff, #f2f7ff);
  border-radius: 28px;
  padding: 36px;
  box-shadow: 0 22px 50px rgba(30, 64, 175, 0.12);
}

body[data-theme='dark'] .hero-inner {
  background: linear-gradient(135deg, #0b1d33, #101827);
}

.hero-copy h1 {
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.1;
  margin: 12px 0 16px;
}

.hero-copy p {
  color: var(--muted);
  max-width: 560px;
  font-size: 1.05rem;
}

.eyebrow {
  display: inline-block;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.74rem;
  font-weight: 700;
}

.hero-actions,
.cta-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  padding: 0.9rem 1.3rem;
  font-weight: 700;
  transition: 0.2s ease;
}

.button.primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
}

.button.secondary {
  background: var(--panel);
  color: var(--text);
  border: 1px solid var(--border);
}

.button.full {
  width: 100%;
}

.hero-metrics {
  display: flex;
  gap: 30px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.hero-metrics strong,
.hero-metrics span {
  display: block;
}

.hero-metrics strong {
  font-size: 1.5rem;
}

.hero-metrics span {
  color: var(--muted);
  font-size: 0.85rem;
}

.hero-visual {
  display: grid;
  gap: 18px;
}

.promo-card {
  background: linear-gradient(135deg, #101827, #243b5b);
  color: white;
  border-radius: 22px;
  padding: 24px;
  min-height: 160px;
  position: relative;
  overflow: hidden;
}

.promo-card.large {
  min-height: 240px;
}

.promo-card.small {
  min-height: 120px;
  background: linear-gradient(135deg, #2563eb, #0f172a);
}

.page-section {
  padding: 36px 0;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
}

.section-heading h2,
.catalog-header h1,
.simple-page h1,
.admin-page h1,
.checkout-form h1 {
  margin: 8px 0 0;
  font-size: clamp(2rem, 2.5vw, 2.8rem);
}

.text-link {
  color: var(--primary);
  font-weight: 700;
}

.category-grid,
.product-grid,
.testimonial-grid,
.info-card-grid,
.stats-grid {
  display: grid;
  gap: 20px;
}

.category-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.category-card {
  position: relative;
  min-height: 220px;
  overflow: hidden;
  border-radius: 18px;
  box-shadow: 0 20px 35px var(--shadow);
}

.category-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
}

.category-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 18px;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.7));
  color: white;
}

.product-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.product-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 18px 32px var(--shadow);
}

.product-media {
  display: block;
  background: var(--panel-alt);
}

.product-media img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.product-body {
  padding: 18px 16px 16px;
}

.product-meta,
.product-pricing,
.rating-line,
.summary-row,
.inventory-row,
.order-row,
.account-meta,
.row-fields,
.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.badge {
  padding: 7px 10px;
  font-size: 0.72rem;
  border-radius: 999px;
  background: #eef2ff;
  color: var(--primary);
  font-weight: 700;
}

.rating {
  color: #f59e0b;
  font-weight: 700;
  font-size: 0.8rem;
}

.product-card h3 {
  margin: 14px 0 12px;
  font-size: 1.08rem;
}

.product-pricing {
  margin-bottom: 14px;
  font-size: 1.1rem;
}

.product-pricing del,
.old-price {
  color: var(--muted);
  font-size: 0.9rem;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.product-actions .button {
  flex: 1;
  padding: 0.75rem 0.85rem;
}

.promo-banner {
  background: linear-gradient(135deg, rgba(37,99,235,0.10), rgba(14,165,233,0.08));
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.testimonial-grid,
.info-card-grid,
.stats-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.testimonial-card,
.info-card,
.stat-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 14px 28px var(--shadow);
}

.star-row {
  color: #fbbf24;
  font-size: 1.3rem;
  margin-bottom: 12px;
}

.site-footer {
  margin-top: 28px;
  background: #0f172a;
  color: #dfeaff;
  padding: 40px 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr;
  gap: 24px;
}

.site-footer h4,
.site-footer h5 {
  margin-top: 0;
  margin-bottom: 14px;
}

.site-footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 7px;
  color: #cfe0ff;
}

.catalog-header {
  margin-bottom: 18px;
}

.catalog-controls {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.8fr;
  gap: 14px;
  margin-bottom: 28px;
}

.catalog-controls input,
.catalog-controls select,
.checkout-form input,
.checkout-form select,
.admin-form input,
.admin-form select,
.admin-form textarea,
.auth-form input,
.auth-form button,
.search-box-wrap input {
  width: 100%;
}

.catalog-controls input,
.catalog-controls select,
.checkout-form input,
.checkout-form select,
.admin-form input,
.admin-form select,
.admin-form textarea,
.auth-form input {
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  border-radius: 12px;
  padding: 0.9rem 1rem;
}

.checkout-form,
.auth-card,
.account-card,
.admin-form,
.admin-list,
.summary-card,
.info-card,
.stat-card,
.review-card,
.inventory-row,
.order-row,
.empty-state,
.simple-page {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: 0 18px 40px var(--shadow);
}

.product-page,
.checkout-page,
.admin-page,
.auth-panel,
.account-panel,
.cart-page {
  padding-top: 28px;
}

.product-showcase,
.cart-layout,
.checkout-grid,
.admin-grid {
  display: grid;
  gap: 28px;
}

.product-showcase {
  grid-template-columns: 1fr 1fr;
}

.product-gallery {
  display: grid;
  gap: 14px;
}

.product-gallery .main-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 24px;
}

.thumbnail-row {
  display: flex;
  gap: 10px;
}

.thumb {
  border: 1px solid var(--border);
  background: transparent;
  border-radius: 14px;
  overflow: hidden;
  width: 90px;
  height: 90px;
  padding: 0;
  cursor: pointer;
}

.thumb.active {
  border-color: var(--primary);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: grid;
  align-content: start;
  gap: 14px;
}

.product-info h1 {
  margin: 0;
  font-size: clamp(2rem, 2.5vw, 3rem);
}

.price-row h2 {
  margin: 0;
}

.variants {
  display: grid;
  gap: 16px;
}

.swatches {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.swatches span {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 12px;
}

.stock-box span {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.stock-box .ok {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
}

.stock-box .warning {
  background: rgba(245, 158, 11, 0.14);
  color: #b45309;
}

.review-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.review-card {
  padding: 18px;
}

.review-card strong,
.review-card span,
.review-card p {
  display: block;
}

.auth-panel,
.account-panel {
  display: grid;
  place-items: center;
  min-height: 60vh;
}

.auth-card,
.account-card {
  width: min(520px, 100%);
  padding: 26px;
}

.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--panel-alt);
  border-radius: 12px;
  padding: 6px;
  margin-bottom: 20px;
}

.auth-tabs button {
  border: none;
  padding: 12px;
  border-radius: 10px;
  background: transparent;
  color: var(--muted);
  font-weight: 700;
  cursor: pointer;
}

.auth-tabs .active {
  background: var(--panel);
  color: var(--text);
  box-shadow: 0 8px 18px var(--shadow);
}

.auth-form,
.checkout-form,
.admin-form {
  display: grid;
  gap: 16px;
}

.auth-form label,
.checkout-form label {
  display: grid;
  gap: 8px;
  font-weight: 600;
}

.form-message {
  background: rgba(37, 99, 235, 0.08);
  color: var(--primary);
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
}

.demo-box {
  margin-top: 18px;
  background: var(--panel-alt);
  border-radius: 14px;
  padding: 16px;
}

.cart-layout,
.checkout-grid,
.admin-grid {
  grid-template-columns: 1.6fr 0.8fr;
}

.cart-items,
.checkout-form,
.summary-card,
.admin-list,
.orders-table {
  display: grid;
  gap: 18px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 18px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px;
  align-items: center;
}

.cart-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 14px;
}

.qty-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 6px 10px;
}

.qty-row button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: var(--panel-alt);
  cursor: pointer;
}

.text-button {
  border: none;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  font-weight: 700;
}

.summary-card {
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 110px;
}

.summary-row {
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}

.summary-row.total {
  font-size: 1.2rem;
  border-bottom: none;
}

.summary-item {
  padding: 8px 0;
}

.row-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.admin-grid {
  margin-top: 24px;
}

.admin-form,
.admin-list {
  padding: 20px;
}

.inventory-row,
.order-row {
  background: var(--panel-alt);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
}

.order-row {
  grid-template-columns: 1fr 1fr 1fr;
}

.admin-page .orders-table {
  margin-top: 20px;
  background: var(--panel);
  border-radius: 20px;
  border: 1px solid var(--border);
  padding: 18px;
}

.stats-grid {
  margin-top: 14px;
}

.stat-card {
  text-align: center;
}

.stat-card span {
  display: block;
  color: var(--muted);
  margin-bottom: 10px;
}

.empty-state,
.simple-page {
  text-align: center;
  padding: 40px 24px;
  max-width: 900px;
  margin: 40px auto;
}

.flash-error {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 12px 16px;
  border-radius: 12px;
  width: min(1200px, calc(100% - 32px));
  margin: 10px auto 0;
}

@media (max-width: 980px) {
  .hero-inner,
  .product-showcase,
  .cart-layout,
  .checkout-grid,
  .admin-grid,
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .catalog-controls,
  .row-fields,
  .testimonial-grid,
  .stats-grid,
  .review-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .nav-row {
    flex-wrap: wrap;
    height: auto;
    padding: 16px 0;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .search-box-wrap {
    width: 100%;
    max-width: none;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 1fr;
  }

  .hero-inner,
  .promo-banner {
    padding: 22px 16px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }
}
