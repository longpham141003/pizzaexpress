import { useState, useEffect } from 'react';
import { getSettings, getLocations } from '../utils/api';

export default function Footer({ stores: propStores, features = [] }) {
  const [settings, setSettings] = useState(null);
  const [stores, setStores] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings);
    if (!propStores) {
      getLocations().then(setStores);
    }
  }, [propStores]);

  const activeStores = propStores || stores || [];

  const footerLogoUrl = settings?.footerLogoPath
    ? (settings.footerLogoPath.startsWith('http') ? settings.footerLogoPath : `/${settings.footerLogoPath}`)
    : "/logo-nia-pizza.png";

  const companyName = settings?.companyName || "Công ty TNHH Pizza Express Việt Nam";
  const hotline = settings?.hotline || "0973.198.462";
  const feedbackPhone = settings?.feedbackPhone || "0973.198.462";
  const email = settings?.email || "lienhepizzaexpress@gmail.com";
  const businessReg = settings?.businessRegNumber || "0106675108";
  const address = settings?.companyAddress || "Số 352 Đường Bưởi, P.Vĩnh Phúc, Q.Ba Đình, TP.Hà Nội";

  const privacyUrl = settings?.privacyPolicyUrl || "/chinh-sach-bao-mat-thong-tin/";
  const returnUrl = settings?.returnPolicyUrl || "/chinh-sach-doi-tra-san-pham-va-hoan-tien/";
  const paymentUrl = settings?.paymentPolicyUrl || "/chinh-sach-thanh-toan/";

  return (
    <>
      {/* Features */}
      {features && features.length > 0 && (
        <section className="features-section">
          <div className="container">
            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className="feature-item">
                  <img src={f.icon} alt={f.title} />
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="footer" className="footer">
        <div className="container">
          <img className="footer__logo" src={footerLogoUrl} alt="NIA PIZZA VIỆT NAM" />
          <h4 className="footer__company">{companyName}</h4>
          <div className="footer__info">
            <p>Để đặt bánh pizza, vui lòng liên hệ tổng đài số: <a href={`tel:${hotline.replace(/[^0-9]/g, '')}`}>{hotline}</a></p>
          </div>
          
          <div className="footer__policies">
            <a href={privacyUrl}>Chính sách bảo mật thông tin cá nhân</a>
            <a href={returnUrl}>Chính sách đổi/trả sản phẩm và hoàn tiền</a>
            <a href={paymentUrl}>Chính sách thanh toán</a>
          </div>

          <div className="footer__stores">
            {activeStores.map((s, i) => (
              <div key={i} className="store-item">
                <img src={s.icon} alt={`Cửa hàng ${i + 1}`} />
                <p>{s.address}</p>
                {s.phone && <p><a href={`tel:${s.phone}`}>{s.phone}</a></p>}
                {s.mapUrl && <a href={s.mapUrl} target="_blank" rel="noreferrer" className="store-item__map">📍 Xem trên bản đồ</a>}
              </div>
            ))}
          </div>

          {/* ponytail: Bộ Công Thương badge */}
          <div className="footer__badge">
            <img src="/bo-cong-thuong.png" alt="Đã thông báo Bộ Công Thương" />
          </div>
          <div className="footer__legal">
            <p>Bản quyền thuộc về {companyName}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
