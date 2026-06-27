import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { getSettings, getLocations, submitContact } from '../utils/api';

export default function LienHe({ settings = {}, stores = [] }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const companyName = settings.companyName || "Công ty TNHH Pizza Express Việt Nam";
  const hotline = settings.hotline || "(024) 36.888.777";
  const feedbackPhone = settings.feedbackPhone || "0977.128.833";
  const email = settings.email || "lienhepizzaexpress@gmail.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitContact(form.name, form.email, form.phone, form.message);
    setSubmitting(false);
    
    if (res && res.success) {
      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } else {
      alert("Gửi tin nhắn thất bại, vui lòng thử lại sau.");
    }
  };

  return (
    <PageLayout
      title="Liên hệ"
      breadcrumbs={[{ label: 'Liên hệ' }]}
      metaDesc="Pizza Express: Pizza ngon - Giá rẻ - Vận chuyển tận nhà. Tổng đài đặt pizza: (024) 36.888.777"
    >
      <section className="page-content contact-page">
        <div className="container">
          {/* Map + sidebar layout matching original */}
          <div className="contact-map-wrap">
            <div className="contact-sidebar">
              <h3>{companyName}</h3>
              <p>Để đặt bánh pizza, vui lòng liên hệ tổng đài số: <a href={`tel:${hotline.replace(/[^0-9]/g, '')}`}>{hotline}</a></p>
              <p>Để phản ánh chất lượng dịch vụ, vui lòng gọi số: <a href={`tel:${feedbackPhone.replace(/[^0-9]/g, '')}`}>{feedbackPhone}</a></p>
              <p>Email: <a href={`mailto:${email}`}>{email}</a></p>

              {stores && stores.length > 0 && (
                <>
                  <h4>Các CƠ SỞ PIZZA EXPRESS</h4>
                  <div className="store-list">
                    {stores.map((s, i) => (
                      <div key={i} className="store-item">
                        <strong>Cơ sở {i + 1}:</strong> {s.address}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0!2d105.809476!3d21.020799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAxJzE0LjkiTiAxMDXCsDQ4JzM0LjEiRQ!5e0!3m2!1svi!2s!4v1"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Pizza Express Location"
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="contact-form-wrap">
            <h3>Gửi tin nhắn cho chúng tôi</h3>
            {sent && <div className="contact-success" style={{ padding: '12px', background: '#e6f7ed', color: '#1e7e34', borderRadius: '6px', marginBottom: '15px', fontWeight: '500' }}>Cảm ơn bạn đã liên hệ! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất.</div>}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Họ và tên *"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại *"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                placeholder="Nội dung tin nhắn *"
                required
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// ponytail: Static Gen with ISR every 60s
export async function getStaticProps() {
  const [settings, stores] = await Promise.all([
    getSettings(),
    getLocations()
  ]);
  return {
    props: {
      settings,
      stores
    },
    revalidate: 60
  };
}
