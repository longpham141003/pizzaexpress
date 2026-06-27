import { useState } from 'react';
import { useCart } from './CartContext';

// ponytail: matching original format "100.000" (no đ suffix, dot separator)
// ponytail: matching original format "100.000" (no đ suffix, dot separator)
function formatPrice(n) {
  return (n || 0).toLocaleString('vi-VN');
}

function priceRange(product) {
  if (product.simplePrice) {
    if (product.originalPrice) return null; // handled separately
    return formatPrice(product.simplePrice);
  }
  if (!product.variations?.length) return '';
  const prices = product.variations.map(v => v.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
}

function renderPizzaSliceIcon(size) {
  const s = (size || '').toUpperCase();
  if (s === 'S') {
    // 4 miếng
    return (
      <svg className="pizza-slice-icon" viewBox="0 0 24 24" width="28" height="28">
        <circle cx="12" cy="12" r="10" fill="#8f0418"/>
        <line x1="12" y1="2" x2="12" y2="22" stroke="#ffffff" strokeWidth="1.5"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="#ffffff" strokeWidth="1.5"/>
      </svg>
    );
  }
  if (s === 'M') {
    // 6 miếng
    return (
      <svg className="pizza-slice-icon" viewBox="0 0 24 24" width="28" height="28">
        <circle cx="12" cy="12" r="10" fill="#8f0418"/>
        <line x1="12" y1="2" x2="12" y2="22" stroke="#ffffff" strokeWidth="1.5"/>
        <line x1="3.34" y1="7" x2="20.66" y2="17" stroke="#ffffff" strokeWidth="1.5"/>
        <line x1="3.34" y1="17" x2="20.66" y2="7" stroke="#ffffff" strokeWidth="1.5"/>
      </svg>
    );
  }
  // L hoặc các size khác: 8 miếng
  return (
    <svg className="pizza-slice-icon" viewBox="0 0 24 24" width="28" height="28">
      <circle cx="12" cy="12" r="10" fill="#8f0418"/>
      <line x1="12" y1="2" x2="12" y2="22" stroke="#ffffff" strokeWidth="1.5"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="#ffffff" strokeWidth="1.5"/>
      <line x1="5" y1="5" x2="19" y2="19" stroke="#ffffff" strokeWidth="1.5"/>
      <line x1="5" y1="19" x2="19" y2="5" stroke="#ffffff" strokeWidth="1.5"/>
    </svg>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasVariations = product.variations?.length > 0;
  
  // Sort variations from smallest to largest by price (S -> M -> L)
  const sortedVariations = hasVariations
    ? [...product.variations].sort((a, b) => a.price - b.price)
    : [];

  const [selectedSize, setSelectedSize] = useState(hasVariations ? sortedVariations[0].size : null);
  const [qty, setQty] = useState(1);

  const currentPrice = hasVariations
    ? sortedVariations.find(v => v.size === selectedSize)?.price
    : product.simplePrice;

  const handleAdd = () => {
    addToCart(product, selectedSize, qty);
    setQty(1);
  };

  // Sale badge: compute from originalPrice if available
  const salePct = product.originalPrice && product.simplePrice
    ? Math.round((1 - product.simplePrice / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card">
      {/* Hover Overlay — trượt lên che phần ảnh và text cơ bản */}
      <div className="product-card__hover-overlay">
        <div className="product-card__hover-name">{product.name.toUpperCase()}</div>
        
        {product.description && (
          <div className="product-card__hover-section">
            <h4 className="hover-section-title">Thành phần</h4>
            <p className="hover-section-desc">{product.description}</p>
          </div>
        )}

        {hasVariations && (
          <div className="product-card__hover-section">
            <h4 className="hover-section-title">Kích thước / Giá</h4>
            <ul className="hover-size-list">
              {sortedVariations.map(v => (
                <li key={v.size}>
                  {renderPizzaSliceIcon(v.size)}
                  <span className="hover-size-text">
                    Size {v.size} / {v.diameter} / {formatPrice(v.price)}đ
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="product-card__img-wrapper">
        {salePct && <span className="product-card__badge">-{salePct}%</span>}
        <img 
          src={product.image || '/wp-content/uploads/2018/06/P1-2-260x204.jpg'} 
          alt={product.name} 
          className="product-card__img"
        />
      </div>
      
      <div className="product-card__info">
        <div className="product-card__name">{product.name.toUpperCase()}</div>
        <div className="product-card__price">
          {product.originalPrice && (
            <span className="product-card__price-old">{formatPrice(product.originalPrice)}đ</span>
          )}
          <span>{priceRange(product) || formatPrice(product.simplePrice)}đ</span>
        </div>

        {product.description && (
          <p className="product-card__desc" title={product.description}>
            {product.description}
          </p>
        )}
      </div>

      {/* Action Area — luôn hiển thị cố định ở chân card */}
      <div className="product-card__actions">
        <div className="product-card__control-rows">
          {hasVariations && (
            <div className="compact-size-selector">
              <span className="compact-label">Size</span>
              <div className="compact-size-options">
                {sortedVariations.map(v => (
                  <button
                    key={v.size}
                    type="button"
                    className={`compact-size-btn${selectedSize === v.size ? ' active' : ''}`}
                    onClick={() => setSelectedSize(v.size)}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="compact-qty-selector">
            <span className="compact-label">Số lượng</span>
            <div className="compact-qty-controls">
              <button type="button" className="qty-change-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <input className="qty-num-input" type="number" value={qty} min={1} readOnly />
              <button type="button" className="qty-change-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
        </div>

        <button className="compact-add-btn" onClick={handleAdd}>
          Mua hàng
        </button>
      </div>
    </div>
  );
}
