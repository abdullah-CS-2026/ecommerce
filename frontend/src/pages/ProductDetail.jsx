import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import {
  Star,
  Truck,
  Shield,
  RefreshCw,
  Plus,
  Minus,
  CreditCard,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  Tag,
  Share2,
  ShoppingCart,
  Heart
} from 'lucide-react';

/* ─── Scoped Styles ─────────────────────────────────────────────────── */
const styles = `
  .pd-root {
    --c-bg:       #f8f7f4;
    --c-surface:  #ffffff;
    --c-border:   #e8e4de;
    --c-border-2: #d4cfc8;
    --c-ink:      #1a1a1a;
    --c-ink-2:    #555;
    --c-ink-3:    #999;
    --c-accent:   #2563eb;
    --c-accent-h: #1d4ed8;
    --c-green:    #16a34a;
    --c-red:      #dc2626;
    --c-gold:     #d97706;
    --radius:     10px;
    --shadow-sm:  0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.05);
    --shadow-md:  0 4px 16px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.05);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--c-bg);
    min-height: 100vh;
  }

  .pd-wrap { max-width: 1200px; margin: 0 auto; padding: 36px 28px 96px; }
  .pd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
  @media(max-width:860px){ .pd-grid { grid-template-columns:1fr; gap:36px; } }

  /* breadcrumb */
  .pd-crumb { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--c-ink-3); margin-bottom:36px; }
  .pd-crumb a { color:var(--c-ink-3); text-decoration:none; transition:color .15s; }
  .pd-crumb a:hover { color:var(--c-accent); }

  /* gallery */
  .gal-main {
    position:relative; background:#eeebe5;
    border-radius:16px; overflow:hidden; aspect-ratio:1;
    border:1px solid var(--c-border); box-shadow:var(--shadow-md);
  }
  .gal-main img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .6s cubic-bezier(.25,.46,.45,.94); }
  .gal-main:hover img { transform:scale(1.04); }
  .gal-badges { position:absolute; top:16px; left:16px; display:flex; flex-direction:column; gap:8px; }
  .gal-badge  { display:inline-block; font-size:10px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; padding:5px 12px; border-radius:20px; }
  .gal-badge-new  { background:var(--c-ink); color:#fff; }
  .gal-badge-sale { background:var(--c-green); color:#fff; }
  .gal-share {
    position:absolute; top:16px; right:16px; width:38px; height:38px; border-radius:50%;
    background:rgba(255,255,255,.9); border:1px solid var(--c-border);
    display:flex; align-items:center; justify-content:center;
    color:var(--c-ink-2); cursor:pointer; transition:all .2s; backdrop-filter:blur(6px);
  }
  .gal-share:hover { background:#fff; color:var(--c-accent); transform:scale(1.06); }

  .gal-thumbs { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:10px; }
  .gal-thumb  { aspect-ratio:1; border-radius:10px; overflow:hidden; border:2px solid transparent; cursor:pointer; opacity:.55; transition:all .2s; background:#eee; }
  .gal-thumb:hover  { opacity:.85; }
  .gal-thumb.active { border-color:var(--c-accent); opacity:1; box-shadow:0 0 0 3px rgba(37,99,235,.15); }
  .gal-thumb img { width:100%; height:100%; object-fit:cover; display:block; }

  /* right panel */
  .pd-right { display:flex; flex-direction:column; gap:24px; }

  .pd-cat { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--c-accent); background:rgba(37,99,235,.08); padding:5px 12px; border-radius:20px; width:fit-content; }

  .pd-title { font-size:clamp(26px,3.5vw,40px); font-weight:700; color:var(--c-ink); line-height:1.12; letter-spacing:-.02em; }

  .pd-rating { display:flex; align-items:center; gap:10px; padding-bottom:20px; border-bottom:1px solid var(--c-border); }
  .pd-stars  { display:flex; gap:2px; }
  .pd-rating-text { font-size:13px; color:var(--c-ink-2); }
  .pd-rating-text b { color:var(--c-ink); font-weight:600; }

  /* price card */
  .pd-price-card { background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--radius); padding:20px 22px; box-shadow:var(--shadow-sm); }
  .pd-price-row  { display:flex; align-items:baseline; gap:12px; margin-bottom:10px; }
  .pd-price-main { font-size:36px; font-weight:700; color:var(--c-ink); letter-spacing:-.02em; }
  .pd-price-orig { font-size:16px; color:var(--c-ink-3); text-decoration:line-through; }
  .pd-stock      { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:var(--c-green); }
  .pd-stock-dot  { width:7px; height:7px; border-radius:50%; background:var(--c-green); flex-shrink:0; }
  .pd-stock-dot.out { background:var(--c-red); }
  .pd-stock.out  { color:var(--c-red); }

  /* variants */
  .pd-variant-block { display:flex; flex-direction:column; gap:10px; }
  .pd-variant-label { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--c-ink-2); }
  .pd-variant-pills { display:flex; flex-wrap:wrap; gap:8px; }
  .pd-pill { padding:7px 16px; border:1.5px solid var(--c-border); border-radius:8px; font-size:12px; font-weight:500; color:var(--c-ink-2); background:var(--c-surface); cursor:pointer; transition:all .18s; letter-spacing:.03em; }
  .pd-pill:hover  { border-color:var(--c-accent); color:var(--c-accent); }
  .pd-pill.active { border-color:var(--c-accent); color:var(--c-accent); background:rgba(37,99,235,.06); }

  /* info grid */
  .pd-info-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
  @media(max-width:500px){ .pd-info-grid { grid-template-columns:1fr 1fr; } }
  .pd-info-cell { background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--radius); padding:14px; display:flex; align-items:flex-start; gap:10px; }
  .pd-info-icon { color:var(--c-accent); flex-shrink:0; margin-top:1px; }
  .pd-info-lbl  { font-size:10px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--c-ink-3); margin-bottom:3px; }
  .pd-info-val  { font-size:13px; font-weight:500; color:var(--c-ink); }

  /* CTA */
  .pd-cta { display:flex; gap:10px; align-items:stretch; }
  .pd-qty { display:flex; align-items:center; border:1.5px solid var(--c-border); border-radius:var(--radius); overflow:hidden; background:var(--c-surface); }
  .pd-qty-btn { width:42px; height:52px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--c-ink-2); transition:background .15s; }
  .pd-qty-btn:hover { background:var(--c-bg); color:var(--c-ink); }
  .pd-qty-num { width:40px; text-align:center; font-size:15px; font-weight:600; color:var(--c-ink); border-left:1px solid var(--c-border); border-right:1px solid var(--c-border); line-height:52px; }

  .pd-add-btn { flex:1; height:52px; border:none; border-radius:var(--radius); background:var(--c-accent); color:#fff; cursor:pointer; font-size:13px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; display:flex; align-items:center; justify-content:center; gap:9px; transition:all .2s; box-shadow:0 2px 8px rgba(37,99,235,.3); }
  .pd-add-btn:hover  { background:var(--c-accent-h); box-shadow:0 4px 16px rgba(37,99,235,.4); transform:translateY(-1px); }
  .pd-add-btn:active { transform:scale(.98); }

  /* tabs */
  .pd-tabs { display:flex; gap:0; border-bottom:1.5px solid var(--c-border); margin-top:60px; }
  .pd-tab  { padding:12px 28px 12px 0; background:none; border:none; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--c-ink-3); cursor:pointer; position:relative; transition:color .18s; }
  .pd-tab.active { color:var(--c-ink); }
  .pd-tab.active::after { content:''; position:absolute; bottom:-1.5px; left:0; right:0; height:2px; background:var(--c-accent); border-radius:2px; }

  /* specs */
  .pd-specs-grid { display:grid; grid-template-columns:1fr 1.5fr; gap:44px; padding:44px 0; align-items:start; }
  @media(max-width:700px){ .pd-specs-grid { grid-template-columns:1fr; } }

  .pd-spec-desc h3 { font-size:20px; font-weight:700; color:var(--c-ink); margin-bottom:14px; letter-spacing:-.01em; }
  .pd-spec-desc p  { font-size:14px; line-height:1.75; color:var(--c-ink-2); }

  .pd-spec-table-wrap { background:var(--c-surface); border:1px solid var(--c-border); border-radius:14px; overflow:hidden; box-shadow:var(--shadow-sm); }
  .pd-spec-table-head { padding:16px 22px; border-bottom:1px solid var(--c-border); font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--c-ink-3); }
  .pd-spec-row { display:flex; align-items:flex-start; padding:14px 22px; border-bottom:1px solid var(--c-border); transition:background .15s; }
  .pd-spec-row:last-child { border-bottom:none; }
  .pd-spec-row:hover { background:var(--c-bg); }
  .pd-spec-key { width:42%; font-size:12px; font-weight:600; color:var(--c-ink-3); letter-spacing:.03em; text-transform:uppercase; padding-top:1px; }
  .pd-spec-val { flex:1; font-size:13px; font-weight:500; color:var(--c-ink); }

  /* reviews empty */
  .pd-reviews-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:72px 0; text-align:center; }
  .pd-reviews-icon { width:56px; height:56px; border-radius:50%; background:var(--c-bg); border:1px solid var(--c-border); display:flex; align-items:center; justify-content:center; color:var(--c-gold); margin-bottom:20px; }
  .pd-reviews-empty h3 { font-size:18px; font-weight:700; color:var(--c-ink); margin-bottom:8px; }
  .pd-reviews-empty p  { font-size:13px; color:var(--c-ink-3); max-width:320px; }

  /* loading/error */
  .pd-state { min-height:60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; }
  .pd-spinner { width:32px; height:32px; border:2.5px solid var(--c-border); border-top-color:var(--c-accent); border-radius:50%; animation:pd-spin .75s linear infinite; }
  @keyframes pd-spin { to { transform:rotate(360deg); } }
  .pd-state-label { font-size:12px; letter-spacing:.1em; text-transform:uppercase; color:var(--c-ink-3); }

  /* animations */
  @keyframes pd-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .pd-a  { animation:pd-up .45s cubic-bezier(.25,.46,.45,.94) both; }
  .pd-a1 { animation-delay:.04s; }
  .pd-a2 { animation-delay:.10s; }
  .pd-a3 { animation-delay:.17s; }
  .pd-a4 { animation-delay:.24s; }
  .pd-a5 { animation-delay:.31s; }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [product, setProduct]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [quantity, setQuantity]           = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab]         = useState('specs');
  const [selColor, setSelColor]           = useState(null);
  const [selSize, setSelSize]             = useState(null);
  const [addedToCart, setAddedToCart]     = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); setError(null);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product sync failed.');
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.mainImage);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="pd-root">
      <style>{styles}</style>
      <div className="pd-wrap"><div className="pd-state">
        <div className="pd-spinner" />
        <p className="pd-state-label">Loading product…</p>
      </div></div>
    </div>
  );

  if (error || !product) return (
    <div className="pd-root">
      <style>{styles}</style>
      <div className="pd-wrap"><div className="pd-state">
        <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--c-ink)', marginBottom: 6 }}>Product Not Found</p>
        <p style={{ fontSize: 13, color: 'var(--c-ink-3)', marginBottom: 20 }}>{error || 'This item may have been de-listed.'}</p>
        <Link to="/products" style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-accent)', textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: '1.5px solid currentColor', paddingBottom: 2 }}>← Back to Catalog</Link>
      </div></div>
    </div>
  );

  const allImages = [product.mainImage, ...(product.images || [])].filter(Boolean);
  const inStock   = product.countInStock > 0;

  return (
    <div className="pd-root">
      <style>{styles}</style>
      <div className="pd-wrap">

        {/* Breadcrumb */}
        <nav className="pd-crumb pd-a">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/products">Catalog</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--c-ink)', fontWeight: 500 }}>{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="pd-grid">

          {/* Gallery */}
          <div className="pd-a pd-a1">
            <div className="gal-main">
              <img src={selectedImage} alt={product.name}
                onError={e => e.target.src = 'https://via.placeholder.com/600'} />
              <div className="gal-badges">
                {product.isNewArrival && <span className="gal-badge gal-badge-new">New</span>}
                {product.discountPercentage > 0 && (
                  <span className="gal-badge gal-badge-sale">−{product.discountPercentage}%</span>
                )}
              </div>
              <button 
                className="gal-share" 
                title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={(e) => {
                  e.preventDefault();
                  if (isInWishlist(product._id)) {
                    removeFromWishlist(product._id);
                  } else {
                    addToWishlist(product._id);
                  }
                }}
                style={{
                  left: 'auto',
                  right: 16,
                  background: isInWishlist(product._id) ? 'rgba(220, 38, 38, 0.9)' : 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <Heart size={16} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} color={isInWishlist(product._id) ? '#fff' : 'currentColor'} />
              </button>
            </div>

            {allImages.length > 1 && (
              <div className="gal-thumbs">
                {allImages.map((img, i) => (
                  <button key={i} className={`gal-thumb ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}>
                    <img src={img} alt={`thumb-${i}`}
                      onError={e => e.target.src = 'https://via.placeholder.com/150'} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="pd-right">

            <div className="pd-cat pd-a pd-a1">
              <Tag size={11} />{product.category}
            </div>

            <h1 className="pd-title pd-a pd-a2">{product.name}</h1>

            <div className="pd-rating pd-a pd-a2">
              <div className="pd-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15}
                    fill={i < Math.floor(product.rating || 0) ? '#f59e0b' : 'none'}
                    color={i < Math.floor(product.rating || 0) ? '#f59e0b' : '#d1d5db'} />
                ))}
              </div>
              <span className="pd-rating-text">
                <b>{(product.rating || 0).toFixed(1)}</b> &nbsp;·&nbsp; {product.numReviews || 0} reviews
              </span>
            </div>

            <div className="pd-price-card pd-a pd-a3">
              <div className="pd-price-row">
                <span className="pd-price-main">{product.currency} {product.discountPrice?.toLocaleString()}</span>
                {product.originalPrice > product.discountPrice && (
                  <span className="pd-price-orig">{product.currency} {product.originalPrice?.toLocaleString()}</span>
                )}
              </div>
              <div className={`pd-stock ${!inStock ? 'out' : ''}`}>
                <span className={`pd-stock-dot ${!inStock ? 'out' : ''}`} />
                {inStock ? `${product.countInStock} in stock` : 'Pre-order available'}
              </div>
            </div>

            {(product.colors?.length > 0 || product.sizes?.length > 0) && (
              <div className="pd-a pd-a3" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {product.colors?.length > 0 && (
                  <div className="pd-variant-block">
                    <span className="pd-variant-label">Color{selColor ? ` — ${selColor}` : ''}</span>
                    <div className="pd-variant-pills">
                      {product.colors.map(c => (
                        <button key={c} className={`pd-pill ${selColor === c ? 'active' : ''}`}
                          onClick={() => setSelColor(selColor === c ? null : c)}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizes?.length > 0 && (
                  <div className="pd-variant-block">
                    <span className="pd-variant-label">Configuration{selSize ? ` — ${selSize}` : ''}</span>
                    <div className="pd-variant-pills">
                      {product.sizes.map(s => (
                        <button key={s} className={`pd-pill ${selSize === s ? 'active' : ''}`}
                          onClick={() => setSelSize(selSize === s ? null : s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pd-info-grid pd-a pd-a4">
              <div className="pd-info-cell">
                <Truck size={16} className="pd-info-icon" />
                <div>
                  <div className="pd-info-lbl">Shipping</div>
                  <div className="pd-info-val">{product.shippingCost === 0 ? 'Free' : `${product.currency} ${product.shippingCost}`}</div>
                </div>
              </div>
              <div className="pd-info-cell">
                <Clock size={16} className="pd-info-icon" />
                <div>
                  <div className="pd-info-lbl">Delivery</div>
                  <div className="pd-info-val">{product.deliveryTime}</div>
                </div>
              </div>
              <div className="pd-info-cell">
                <Shield size={16} className="pd-info-icon" />
                <div>
                  <div className="pd-info-lbl">Warranty</div>
                  <div className="pd-info-val">{product.warranty || '1 Year'}</div>
                </div>
              </div>
            </div>

            <div className="pd-cta pd-a pd-a5">
              <div className="pd-qty">
                <button className="pd-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                <div className="pd-qty-num">{quantity}</div>
                <button className="pd-qty-btn" onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></button>
              </div>
              <button 
                className="pd-add-btn"
                onClick={() => {
                  if (product) {
                    addToCart(product, quantity);
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                  }
                }}
              >
                <ShoppingCart size={17} />
                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs pd-a">
          <button className={`pd-tab ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button>
          <button className={`pd-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({product.numReviews || 0})</button>
        </div>

        {activeTab === 'specs' ? (
          <div className="pd-specs-grid pd-a">
            <div className="pd-spec-desc">
              <h3>Product Overview</h3>
              <p>{product.description}</p>
            </div>
            <div className="pd-spec-table-wrap">
              <div className="pd-spec-table-head">Detailed Specifications</div>
              {product.specifications && Object.keys(product.specifications).length > 0
                ? Object.entries(product.specifications).map(([k, v]) => (
                    <div className="pd-spec-row" key={k}>
                      <span className="pd-spec-key">{k}</span>
                      <span className="pd-spec-val">{v}</span>
                    </div>
                  ))
                : <div style={{ padding: '24px 22px', fontSize: 13, color: 'var(--c-ink-3)' }}>No specifications available.</div>
              }
            </div>
          </div>
        ) : (
          <div className="pd-reviews-empty pd-a">
            <div className="pd-reviews-icon"><Star size={22} /></div>
            <h3>No Reviews Yet</h3>
            <p>Verified purchases can leave reviews to help others make the right decision.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;