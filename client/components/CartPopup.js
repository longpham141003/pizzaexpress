import { useCart } from './CartContext';

function formatPrice(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

export default function CartPopup() {
  const { items, showCart, setShowCart, removeFromCart, totalPrice } = useCart();

  if (!showCart) return null;

  return (
    <div className="cart-popup" onClick={() => setShowCart(false)}>
      <div className="cart-popup__inner" onClick={e => e.stopPropagation()}>
        <div className="cart-popup__header">
          <h3>Giỏ hàng</h3>
          <button className="cart-popup__close" onClick={() => setShowCart(false)}>×</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-popup__empty">Chưa có sản phẩm trong giỏ hàng</div>
        ) : (
          <>
            {items.map(item => (
              <div key={item.key} className="cart-popup__item">
                <img className="cart-popup__item-img" src={item.image || 'https://www.pizzaexpress.vn/wp-content/uploads/2018/06/P1-2-260x204.jpg'} alt={item.name} />
                <div className="cart-popup__item-info">
                  <div className="cart-popup__item-name">{item.name}</div>
                  <div className="cart-popup__item-detail">
                    {item.size && `Size ${item.size} · `}SL: {item.qty}
                  </div>
                  <div className="cart-popup__item-price">{formatPrice(item.price * item.qty)}</div>
                </div>
                <button className="cart-popup__item-remove" onClick={() => removeFromCart(item.key)}>×</button>
              </div>
            ))}
            <div className="cart-popup__total">
              <span>Tổng:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            {/* ponytail: action buttons matching original */}
            <div className="cart-popup__actions">
              <button className="cart-popup__btn cart-popup__btn--detail" onClick={() => setShowCart(false)}>Chi tiết giỏ hàng</button>
              <button className="cart-popup__btn cart-popup__btn--continue" onClick={() => setShowCart(false)}>Tiếp tục mua hàng</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
