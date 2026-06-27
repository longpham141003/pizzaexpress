import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useCart } from '../components/CartContext';
import Link from 'next/link';

export default function ThanhToan() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [ordered, setOrdered] = useState(false);

  const formatPrice = (p) => p.toLocaleString('vi-VN').replace(/\./g, '.');

  const handleSubmit = (e) => {
    e.preventDefault();
    // ponytail: save order to localStorage, no backend needed
    const order = {
      id: Date.now(),
      items: items,
      total: totalPrice,
      customer: form,
      date: new Date().toISOString(),
    };
    const orders = JSON.parse(localStorage.getItem('pe_orders') || '[]');
    orders.push(order);
    localStorage.setItem('pe_orders', JSON.stringify(orders));
    clearCart();
    setOrdered(true);
  };

  if (ordered) {
    return (
      <PageLayout title="Đặt hàng thành công" breadcrumbs={[{ label: 'Thanh toán' }]}>
        <section className="page-content checkout-page">
          <div className="container">
            <div className="checkout-success">
              <h2>🎉 Đặt hàng thành công!</h2>
              <p>Cảm ơn bạn đã đặt hàng tại Pizza Express.</p>
              <p>Chúng tôi sẽ liên hệ xác nhận đơn hàng qua số điện thoại của bạn.</p>
              <Link href="/" className="btn-back">← Quay lại trang chủ</Link>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  if (!items || items.length === 0) {
    return (
      <PageLayout title="Thanh toán" breadcrumbs={[{ label: 'Thanh toán' }]}>
        <section className="page-content checkout-page">
          <div className="container">
            <div className="cart-empty">
              <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
              <Link href="/#home_thucdon" className="btn-back">← Quay lại thực đơn</Link>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Thanh toán"
      breadcrumbs={[{ label: 'Thanh toán' }]}
    >
      <section className="page-content checkout-page">
        <div className="container">
          <div className="checkout-grid">
            {/* Billing form */}
            <div className="checkout-billing">
              <h3>Thông tin thanh toán</h3>
              <form onSubmit={handleSubmit} id="checkout-form">
                <label>
                  Họ và tên *
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  Số điện thoại *
                  <input type="tel" required value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </label>
                <label>
                  Địa chỉ giao hàng *
                  <input type="text" required value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })} />
                </label>
                <label>
                  Ghi chú đơn hàng
                  <textarea rows={3} value={form.note}
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    placeholder="Ghi chú thêm (tùy chọn)" />
                </label>
              </form>
            </div>

            {/* Order summary */}
            <div className="checkout-summary">
              <h3>Đơn hàng của bạn</h3>
              <table className="checkout-order-table">
                <thead>
                  <tr><th>Sản phẩm</th><th>Tổng</th></tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const price = item.price || 0;
                    return (
                      <tr key={item.key}>
                        <td>{item.name}{item.size ? ` – Size ${item.size}` : ''} × {item.qty}</td>
                        <td>{formatPrice(price * item.qty)}đ</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr><td>Tổng phụ</td><td>{formatPrice(totalPrice)}đ</td></tr>
                  <tr><td>Giao hàng</td><td>Miễn phí</td></tr>
                  <tr className="checkout-total"><td>Tổng</td><td>{formatPrice(totalPrice)}đ</td></tr>
                </tfoot>
              </table>

              <div className="checkout-payment">
                <p><strong>Thanh toán khi nhận hàng (COD)</strong></p>
                <p>Thanh toán bằng tiền mặt khi nhận hàng.</p>
              </div>

              <button type="submit" form="checkout-form" className="btn-place-order">
                ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
