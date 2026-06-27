import Header from './Header';
import Footer from './Footer';
import CartPopup from './CartPopup';
import Head from 'next/head';
import siteContent from '../data/site-content.json';

// ponytail: shared layout for all sub-pages, matching original HTML structure
export default function PageLayout({ title, breadcrumbs, children, metaDesc }) {
  const { features, stores } = siteContent;

  return (
    <>
      <Head>
        <title>{`${title} - Pizza Express`}</title>
        {metaDesc && <meta name="description" content={metaDesc} />}
      </Head>

      <Header />

      {/* Title bar + Breadcrumb — matching original dc_title section */}
      <section className="page-title-bar">
        <div className="container">
          <h1>{title}</h1>
          <div className="breadcrumbs">
            <a href="/">Trang chủ</a>
            {breadcrumbs?.map((b, i) => (
              <span key={i}>
                {' / '}
                {b.href ? <a href={b.href}>{b.label}</a> : <span>{b.label}</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {children}

      <Footer stores={stores} features={features} />

      {/* Floating buttons — SVG/CSS inline for pixel-perfect display */}
      <div className="floating-btns">
        <a href="tel:02436888777" className="floating-btn hotline-btn" aria-label="Gọi điện Hotline">
          <div className="hotline-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="pulsing-ring"></span>
          </div>
        </a>
        <a href="https://zalo.me/0819180706" target="_blank" rel="noreferrer" className="floating-btn zalo-btn" aria-label="Chat Zalo">
          <div className="zalo-icon-wrapper">
            <span className="zalo-text">Zalo</span>
          </div>
        </a>
        <a href="http://m.me/119445844878458" target="_blank" rel="noreferrer" className="floating-btn messenger-btn" aria-label="Chat Messenger">
          <div className="messenger-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M12 2C6.36 2 1.78 6.17 1.78 11.3c0 2.92 1.45 5.54 3.73 7.15.19.14.31.37.31.61l-.01 1.94c0 .35.37.59.68.44l2.16-1.04c.16-.08.34-.1.51-.06 1 .28 2.05.43 3.14.43 5.64 0 10.22-4.17 10.22-9.3S17.64 2 12 2zm1.19 12l-2.43-2.6-4.75 2.6 5.22-5.55 2.48 2.6 4.7-2.6-5.22 5.55z" fill="#ffffff"/>
            </svg>
          </div>
        </a>
      </div>

      <CartPopup />
    </>
  );
}
