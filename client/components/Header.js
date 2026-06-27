import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { getSettings, getMenu } from '../utils/api';

export default function Header() {
  const { totalItems, totalPrice, setShowCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState(null);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch dynamic header settings & menu
    getSettings().then(setSettings);
    getMenu().then(setMenu);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/#home_thucdon', label: 'Thực đơn' },
    { href: '/khuyen-mai', label: 'Khuyến mại' },
    { href: '/chinh-sach', label: 'Chính sách' },
    { href: '/blog', label: 'Blog' },
    { href: '/lien-he', label: 'Liên hệ' },
  ];

  const links = menu ? menu.map(m => ({ href: m.url, label: m.label })) : defaultLinks;

  const fmtPrice = (n) => (n || 0).toLocaleString('vi-VN');

  const logoUrl = settings?.logoPath 
    ? (settings.logoPath.startsWith('http') ? settings.logoPath : `http://localhost:5290/${settings.logoPath}`) 
    : "/wp-content/uploads/2018/05/logo.png";

  const slogan = settings?.slogan || "Pizza ngon - Giá rẻ - Vận chuyển tận nhà";
  const hotline = settings?.hotline || "(024) 36.888.777";

  return (
    <>
      {/* Top header */}
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <a href="/" className="header__logo">
            <img src={logoUrl} alt="Pizza Express" />
          </a>
          <span className="header__tagline">{slogan}</span>
          
          <button className="header__cart" onClick={() => setShowCart(true)}>
            <div className="header__cart-icon-wrapper">
              <svg className="header__cart-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <span className="header__cart-text">
              Giỏ hàng<br/>
              <span className="header__cart-detail">{totalItems} | {fmtPrice(totalPrice)}đ</span>
            </span>
          </button>
          
          <button className="menu-btn" onClick={() => setMenuOpen(true)}>☰</button>
        </div>
      </header>

      {/* Nav — red bar matching original */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav__inner">
          <ul className="nav__menu">
            {links.map(l => <li key={l.href + l.label}><a href={l.href}>{l.label}</a></li>)}
          </ul>
          <a className="nav__phone" href={`tel:${hotline.replace(/[^0-9]/g, '')}`}>
            <span className="nav__phone-sub">Gọi điện ngay - Ship liên tay (24/7)</span>
            <span className="nav__phone-num">📱 {hotline}</span>
          </a>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu open" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu__inner" onClick={e => e.stopPropagation()}>
            <button className="mobile-menu__close" onClick={() => setMenuOpen(false)}>×</button>
            {links.map(l => <a key={l.href + l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}
            <a className="mobile-menu__phone" href={`tel:${hotline.replace(/[^0-9]/g, '')}`}>{hotline}</a>
          </div>
        </div>
      )}
    </>
  );
}
