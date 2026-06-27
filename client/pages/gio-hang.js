import PageLayout from '../components/PageLayout';
import { useCart } from '../components/CartContext';
import Link from 'next/link';

export default function GioHang() {
  const { items, removeFromCart, updateQty, totalPrice } = useCart();

  const formatPrice = (p) => p.toLocaleString('vi-VN').replace(/\./g, '.');

  return (
    <PageLayout
      title="Giỏ hàng"
      breadcrumbs={[{ label: 'Giỏ hàng' }]}
    >
      <section className="page-content cart-page">
        <div className="container">
          {!items || items.length === 0 ? (
            <div className="cart-empty">
              <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
              <Link href="/#home_thucdon" className="btn-back">← Quay lại thực đơn</Link>
            </div>
          ) : (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const price = item.price || 0;
                    const subtotal = price * item.qty;
                    return (
                      <tr key={item.key}>
                        <td>
                          <button className="cart-remove" onClick={() => removeFromCart(item.key)}>×</button>
                        </td>
                        <td className="cart-thumb">
                          <img src={item.image} alt={item.name} />
                        </td>
                        <td className="cart-name">
                          {item.name}
                          {item.size && <span className="cart-size"> – Size {item.size}</span>}
                        </td>
                        <td className="cart-price">{formatPrice(price)}đ</td>
                        <td className="cart-qty">
                          <div className="qty-control">
                            <button onClick={() => updateQty(item.key, Math.max(1, item.qty - 1))}>−</button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                          </div>
                        </td>
                        <td className="cart-subtotal">{formatPrice(subtotal)}đ</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="cart-totals">
                <h3>Cộng giỏ hàng</h3>
                <div className="cart-totals__row">
                  <span>Tổng phụ</span>
                  <span>{formatPrice(totalPrice)}đ</span>
                </div>
                <div className="cart-totals__row cart-totals__shipping">
                  <span>Giao hàng</span>
                  <span>Miễn phí giao hàng</span>
                </div>
                <div className="cart-totals__row cart-totals__total">
                  <span>Tổng</span>
                  <span>{formatPrice(totalPrice)}đ</span>
                </div>
                <Link href="/thanh-toan" className="btn-checkout">TIẾN HÀNH THANH TOÁN</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
