import { useState, useEffect, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #faf8f5; color: #1a1714; }
  :root {
    --gold: #c9973a; --gold-light: #f0deb4; --dark: #1a1714;
    --mid: #5c5650; --light: #f5f2ec; --border: #e8e2d9;
    --white: #ffffff; --red: #c0392b;
  }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  nav { background: var(--dark); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 60px; position: sticky; top: 0; z-index: 100; }
  .nav-logo { font-family: 'Playfair Display', serif; color: var(--gold); font-size: 20px; font-weight: 600; letter-spacing: 2px; }
  .nav-right { display: flex; align-items: center; gap: 1.5rem; }
  .nav-links { display: flex; gap: 1.5rem; }
  .nav-link { color: #c8c2b8; font-size: 13px; letter-spacing: 1px; cursor: pointer; transition: color .2s; text-transform: uppercase; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .nav-link:hover, .nav-link.active { color: var(--gold); }
  .cart-btn { background: none; border: 1px solid var(--gold); color: var(--gold); padding: 7px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all .2s; letter-spacing: .5px; }
  .cart-btn:hover { background: var(--gold); color: var(--dark); }
  .cart-count { background: var(--gold); color: var(--dark); width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }

  /* HERO */
  .hero { background: linear-gradient(135deg, var(--dark) 0%, #2d2820 100%); padding: 2.5rem 2rem; display: flex; align-items: center; gap: 2rem; }
  .hero-badge { background: var(--gold); color: var(--dark); font-size: 11px; font-weight: 500; padding: 4px 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: .75rem; display: inline-block; }
  .hero-text h1 { font-family: 'Playfair Display', serif; color: #fff; font-size: 34px; font-weight: 500; line-height: 1.2; margin-bottom: .5rem; }
  .hero-text p { color: #a09890; font-size: 14px; font-weight: 300; letter-spacing: .5px; }

  /* MAIN */
  main { flex: 1; padding: 2rem; max-width: 1200px; width: 100%; margin: 0 auto; }
  .section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid var(--border); }
  .section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; }
  .section-count { font-size: 13px; color: var(--mid); }
  .filters { display: flex; gap: .5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .filter-btn { padding: 6px 16px; border: 1px solid var(--border); background: transparent; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; color: var(--mid); letter-spacing: .5px; text-transform: uppercase; transition: all .2s; }
  .filter-btn:hover, .filter-btn.active { border-color: var(--dark); background: var(--dark); color: #fff; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1.5rem; }

  /* PRODUCT CARD */
  .product-card { background: var(--white); border: 1px solid var(--border); cursor: pointer; transition: transform .2s, box-shadow .2s; position: relative; overflow: hidden; }
  .product-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,.1); }
  .product-badge { position: absolute; top: 10px; left: 10px; background: var(--red); color: #fff; font-size: 10px; padding: 3px 8px; letter-spacing: 1px; text-transform: uppercase; z-index: 2; }
  .product-badge.new-badge { background: var(--dark); }
  .product-img-wrap { width: 100%; aspect-ratio: 3/3.5; overflow: hidden; position: relative; background: var(--light); }
  .product-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
  .product-card:hover .product-img-wrap img { transform: scale(1.06); }
  .img-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 52px; background: var(--light); }
  .product-body { padding: 1rem; }
  .product-cat { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--mid); margin-bottom: 4px; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; margin-bottom: .25rem; }
  .product-rating { display: flex; align-items: center; gap: 4px; margin-bottom: .35rem; }
  .rating-count { font-size: 11px; color: var(--mid); }
  .product-footer { display: flex; align-items: center; justify-content: space-between; margin-top: .75rem; padding-top: .75rem; border-top: 1px solid var(--border); }
  .product-price { font-size: 18px; font-weight: 500; }
  .product-price-old { font-size: 12px; color: var(--mid); text-decoration: line-through; margin-left: 4px; }
  .add-btn { background: var(--dark); color: #fff; border: none; padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; transition: background .2s, color .2s; letter-spacing: .5px; }
  .add-btn:hover { background: var(--gold); color: var(--dark); }
  .add-btn.added { background: var(--gold); color: var(--dark); }

  /* CART PANEL */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 200; opacity: 0; pointer-events: none; transition: opacity .3s; }
  .overlay.open { opacity: 1; pointer-events: all; }
  .cart-panel { position: fixed; right: 0; top: 0; bottom: 0; width: 400px; max-width: 100vw; background: #fff; z-index: 201; transform: translateX(100%); transition: transform .3s; display: flex; flex-direction: column; }
  .cart-panel.open { transform: translateX(0); }
  .cart-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--dark); }
  .cart-title { font-family: 'Playfair Display', serif; color: #fff; font-size: 18px; }
  .close-btn { background: none; border: none; color: #888; font-size: 22px; cursor: pointer; line-height: 1; }
  .close-btn:hover { color: #fff; }
  .cart-items { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; }
  .cart-empty { text-align: center; padding: 3rem 1rem; color: var(--mid); }
  .cart-item { display: flex; gap: 1rem; padding: .75rem 0; border-bottom: 1px solid var(--border); }
  .cart-item-img { width: 64px; height: 72px; background: var(--light); overflow: hidden; flex-shrink: 0; }
  .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .emoji-fb { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 26px; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
  .cart-item-cat { font-size: 11px; color: var(--mid); margin-bottom: .5rem; }
  .cart-item-controls { display: flex; align-items: center; gap: .5rem; }
  .qty-btn { width: 24px; height: 24px; border: 1px solid var(--border); background: none; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all .2s; line-height: 1; }
  .qty-btn:hover { background: var(--dark); color: #fff; border-color: var(--dark); }
  .qty-num { font-size: 14px; min-width: 20px; text-align: center; }
  .remove-btn { background: none; border: none; color: #ccc; cursor: pointer; font-size: 14px; }
  .remove-btn:hover { color: var(--red); }
  .cart-footer { padding: 1.25rem 1.5rem; border-top: 1px solid var(--border); }
  .cart-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--mid); margin-bottom: .4rem; }
  .cart-total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 500; padding-top: .75rem; border-top: 1px solid var(--border); margin-top: .4rem; }
  .checkout-btn { width: 100%; background: var(--dark); color: #fff; border: none; padding: 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; letter-spacing: 1px; text-transform: uppercase; transition: background .2s; margin-top: 1rem; }
  .checkout-btn:hover { background: var(--gold); color: var(--dark); }

  /* CHECKOUT MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 300; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity .3s; }
  .modal-overlay.open { opacity: 1; pointer-events: all; }
  .modal { background: #fff; width: 520px; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
  .modal-header { background: var(--dark); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-family: 'Playfair Display', serif; color: #fff; font-size: 18px; }
  .steps { display: flex; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
  .step { flex: 1; text-align: center; position: relative; }
  .step::after { content: ''; position: absolute; top: 14px; left: 50%; width: 100%; height: 1px; background: var(--border); }
  .step:last-child::after { display: none; }
  .step-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto .35rem; font-size: 12px; font-weight: 500; position: relative; z-index: 1; color: var(--mid); }
  .step.active .step-dot { background: var(--dark); color: #fff; }
  .step.done .step-dot { background: var(--gold); color: var(--dark); }
  .step-label { font-size: 11px; color: var(--mid); letter-spacing: .5px; text-transform: uppercase; }
  .step.active .step-label { color: var(--dark); font-weight: 500; }
  .modal-body { padding: 1.5rem; }
  .form-group { margin-bottom: 1rem; }
  .form-group label { display: block; font-size: 12px; letter-spacing: .5px; text-transform: uppercase; color: var(--mid); margin-bottom: .4rem; }
  .form-group input, .form-group select { width: 100%; padding: 10px 12px; border: 1px solid var(--border); font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--dark); outline: none; transition: border .2s; background: #fff; }
  .form-group input:focus, .form-group select:focus { border-color: var(--dark); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .modal-footer { display: flex; gap: .75rem; margin-top: 1.5rem; }
  .btn-primary { flex: 1; background: var(--dark); color: #fff; border: none; padding: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; letter-spacing: .5px; transition: background .2s; }
  .btn-primary:hover { background: var(--gold); color: var(--dark); }
  .btn-secondary { background: none; border: 1px solid var(--border); color: var(--mid); padding: 12px 20px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all .2s; }
  .btn-secondary:hover { border-color: var(--dark); color: var(--dark); }
  .order-summary { background: var(--light); padding: 1rem; margin-bottom: 1.25rem; }
  .order-sum-title { font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: var(--mid); margin-bottom: .75rem; }
  .order-sum-item { display: flex; justify-content: space-between; font-size: 13px; padding: .25rem 0; }
  .order-sum-total { display: flex; justify-content: space-between; font-size: 15px; font-weight: 500; padding-top: .75rem; margin-top: .5rem; border-top: 1px solid var(--border); }
  .success { text-align: center; padding: 2rem; }
  .success-icon { font-size: 48px; margin-bottom: 1rem; }
  .success h2 { font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: .5rem; }
  .success p { color: var(--mid); font-size: 14px; margin-bottom: .25rem; }
  .order-id { font-size: 12px; color: var(--mid); margin-top: .5rem; font-family: monospace; background: var(--light); padding: 4px 10px; display: inline-block; }
  .continue-btn { margin-top: 1.5rem; display: inline-block; background: var(--dark); color: #fff; border: none; padding: 12px 32px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; letter-spacing: .5px; transition: background .2s; }
  .continue-btn:hover { background: var(--gold); color: var(--dark); }

  /* TOAST */
  .toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--dark); color: #fff; padding: 10px 20px; font-size: 13px; z-index: 500; opacity: 0; transition: opacity .3s; pointer-events: none; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
  .toast.show { opacity: 1; }
`;

const PRODUCTS = [
  { id: 1, name: "Merino Wool Coat", cat: "Outerwear", img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80", emoji: "🧥", price: 289, oldPrice: 349, rating: 4.8, reviews: 124, badge: "sale", desc: "Premium Merino blend" },
  { id: 2, name: "Leather Chelsea Boots", cat: "Footwear", img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80", emoji: "👢", price: 199, rating: 4.9, reviews: 87, badge: "new", desc: "Full-grain leather" },
  { id: 3, name: "Silk Blouse", cat: "Tops", img: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=500&q=80", emoji: "👘", price: 129, oldPrice: 159, rating: 4.6, reviews: 203, badge: "sale", desc: "100% Mulberry silk" },
  { id: 4, name: "Tailored Trousers", cat: "Bottoms", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80", emoji: "👔", price: 149, rating: 4.7, reviews: 56, badge: "", desc: "Italian wool blend" },
  { id: 5, name: "Canvas Tote Bag", cat: "Accessories", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80", emoji: "👜", price: 79, rating: 4.5, reviews: 312, badge: "new", desc: "Organic cotton canvas" },
  { id: 6, name: "Cashmere Scarf", cat: "Accessories", img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&q=80", emoji: "🧣", price: 95, oldPrice: 119, rating: 4.9, reviews: 178, badge: "sale", desc: "Pure cashmere" },
  { id: 7, name: "Linen Dress", cat: "Dresses", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80", emoji: "👗", price: 169, rating: 4.7, reviews: 94, badge: "", desc: "Stonewashed linen" },
  { id: 8, name: "Sunglasses", cat: "Accessories", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80", emoji: "🕶️", price: 119, rating: 4.6, reviews: 67, badge: "new", desc: "UV400 polarized" },
];

const CATEGORIES = ["All", "Outerwear", "Footwear", "Tops", "Bottoms", "Accessories", "Dresses"];

function genId() {
  return "ORD-" + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function Stars({ rating }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#c9973a" : "#ddd" }}>★</span>
      ))}
    </div>
  );
}

function ProductImage({ img, name, emoji }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="product-img-wrap">
      {!failed
        ? <img src={img} alt={name} onError={() => setFailed(true)} loading="lazy" />
        : <div className="img-fallback">{emoji}</div>
      }
    </div>
  );
}

function ProductCard({ product, inCart, onAdd }) {
  return (
    <div className="product-card">
      {product.badge && (
        <div className={`product-badge ${product.badge === "new" ? "new-badge" : ""}`}>
          {product.badge === "sale" ? "SALE" : "NEW"}
        </div>
      )}
      <ProductImage img={product.img} name={product.name} emoji={product.emoji} />
      <div className="product-body">
        <div className="product-cat">{product.cat}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-rating">
          <Stars rating={product.rating} />
          <span className="rating-count">{product.rating} ({product.reviews})</span>
        </div>
        <div style={{ fontSize: 12, color: "#888" }}>{product.desc}</div>
        <div className="product-footer">
          <div>
            <span className="product-price">${product.price}</span>
            {product.oldPrice && <span className="product-price-old">${product.oldPrice}</span>}
          </div>
          <button
            className={`add-btn ${inCart ? "added" : ""}`}
            onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
          >
            {inCart ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartItemImg({ img, name, emoji }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="cart-item-img">
      {!failed
        ? <img src={img} alt={name} onError={() => setFailed(true)} />
        : <div className="emoji-fb">{emoji}</div>
      }
    </div>
  );
}

function CartPanel({ cart, open, onClose, onUpdateQty, onRemove, onCheckout }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = subtotal > 0 ? 12 : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = (subtotal + ship + tax).toFixed(2);

  return (
    <>
      <div className={`overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`cart-panel ${open ? "open" : ""}`}>
        <div className="cart-header">
          <span className="cart-title">Cart {cart.length > 0 && `(${cart.reduce((s, i) => s + i.qty, 0)})`}</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div style={{ fontSize: 40, marginBottom: "1rem" }}>🛍️</div>
              <p style={{ fontWeight: 500, marginBottom: ".5rem" }}>Your cart is empty</p>
              <p style={{ fontSize: 13 }}>Add some beautiful items</p>
            </div>
          ) : cart.map(item => (
            <div className="cart-item" key={item.id}>
              <CartItemImg img={item.img} name={item.name} emoji={item.emoji} />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-cat">{item.cat}</div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => onUpdateQty(item.id, 1)}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".5rem" }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>${(item.price * item.qty).toFixed(2)}</span>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div>
              <div className="cart-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="cart-row"><span>Shipping</span><span>${ship.toFixed(2)}</span></div>
              <div className="cart-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="cart-total-row"><span>Total</span><span>${total}</span></div>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

function CheckoutModal({ open, cart, step, orderPlaced, orderId, onClose, onNext, onPrev }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = (subtotal + 12 + tax).toFixed(2);

  const stepLabels = ["Shipping", "Payment", "Review"];

  return (
    <div className={`modal-overlay ${open ? "open" : ""}`} onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{orderPlaced ? "Order Confirmed" : "Checkout"}</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {!orderPlaced && (
          <div className="steps">
            {stepLabels.map((label, i) => (
              <div key={i} className={`step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
                <div className="step-dot">{step > i + 1 ? "✓" : i + 1}</div>
                <div className="step-label">{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-body">
          {orderPlaced ? (
            <div className="success">
              <div className="success-icon">✅</div>
              <h2>Order Confirmed!</h2>
              <p>Thank you for your purchase.</p>
              <p>A confirmation email has been sent.</p>
              <div className="order-id">Order: {orderId}</div>
              <div><button className="continue-btn" onClick={onClose}>Continue Shopping</button></div>
            </div>
          ) : step === 1 ? (
            <>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: "1rem" }}>Shipping Details</h2>
              <div className="form-row">
                <div className="form-group"><label>First Name</label><input placeholder="Jane" /></div>
                <div className="form-group"><label>Last Name</label><input placeholder="Doe" /></div>
              </div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="jane@example.com" /></div>
              <div className="form-group"><label>Address</label><input placeholder="123 Main Street" /></div>
              <div className="form-row">
                <div className="form-group"><label>City</label><input placeholder="New York" /></div>
                <div className="form-group"><label>ZIP</label><input placeholder="10001" /></div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <select>
                  <option>United States</option><option>United Kingdom</option>
                  <option>Canada</option><option>Australia</option><option>India</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={onClose}>← Back</button>
                <button className="btn-primary" onClick={onNext}>Continue →</button>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: "1rem" }}>Payment Details</h2>
              <div className="form-group"><label>Cardholder Name</label><input placeholder="Jane Doe" /></div>
              <div className="form-group"><label>Card Number</label><input placeholder="4242 4242 4242 4242" maxLength={19} /></div>
              <div className="form-row">
                <div className="form-group"><label>Expiry</label><input placeholder="MM / YY" /></div>
                <div className="form-group"><label>CVV</label><input placeholder="•••" maxLength={4} /></div>
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: ".5rem" }}>🔒 Secured with 256-bit encryption</div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={onPrev}>← Back</button>
                <button className="btn-primary" onClick={onNext}>Review Order →</button>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: "1rem" }}>Review Your Order</h2>
              <div className="order-summary">
                <div className="order-sum-title">Order Summary</div>
                {cart.map(i => (
                  <div className="order-sum-item" key={i.id}>
                    <span>{i.name} × {i.qty}</span>
                    <span>${(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="order-sum-item" style={{ color: "#888" }}><span>Shipping</span><span>$12.00</span></div>
                <div className="order-sum-item" style={{ color: "#888" }}><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="order-sum-total"><span>Total</span><span>${total}</span></div>
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: "1rem" }}>By placing your order you agree to our Terms & Conditions.</div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={onPrev}>← Back</button>
                <button className="btn-primary" onClick={onNext}>Place Order ✓</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, visible }) {
  return <div className={`toast ${visible ? "show" : ""}`}>{message}</div>;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [filter, setFilter] = useState("All");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Inject styles once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const addToCart = (id) => {
    const product = PRODUCTS.find(p => p.id === id);
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i);
      return updated.filter(i => i.qty > 0);
    });
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const openCheckout = () => { setCartOpen(false); setCheckoutOpen(true); setCheckoutStep(1); };
  const closeCheckout = () => { setCheckoutOpen(false); setOrderPlaced(false); };

  const nextStep = () => {
    if (checkoutStep < 3) {
      setCheckoutStep(s => s + 1);
    } else {
      setOrderPlaced(true);
      setOrderId(genId());
      setCart([]);
    }
  };

  const filteredProducts = filter === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === filter);

  return (
    <div className="app">
      {/* NAV */}
      <nav>
        <div className="nav-logo">LUMIÈRE</div>
        <div className="nav-right">
          <div className="nav-links">
            <button className="nav-link active">Shop</button>
            <button className="nav-link">Collections</button>
            <button className="nav-link">About</button>
          </div>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛍️ Cart
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-text">
          <div className="hero-badge">New Season</div>
          <h1>Refined Essentials<br />for Modern Living</h1>
          <p>Curated luxury. Timeless style.</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <main>
        <div className="section-header">
          <span className="section-title">Our Collection</span>
          <span className="section-count">{filteredProducts.length} products</span>
        </div>
        <div className="filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {filteredProducts.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              inCart={!!cart.find(i => i.id === p.id)}
              onAdd={addToCart}
            />
          ))}
        </div>
      </main>

      {/* CART PANEL */}
      <CartPanel
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onCheckout={openCheckout}
      />

      {/* CHECKOUT MODAL */}
      <CheckoutModal
        open={checkoutOpen}
        cart={cart}
        step={checkoutStep}
        orderPlaced={orderPlaced}
        orderId={orderId}
        onClose={closeCheckout}
        onNext={nextStep}
        onPrev={() => setCheckoutStep(s => s - 1)}
      />

      {/* TOAST */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
