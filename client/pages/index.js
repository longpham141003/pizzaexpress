import Head from 'next/head';
import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CartPopup from '../components/CartPopup';
import { getBanners, getCategories, getProducts, getReviews, getFeatures, getLocations } from '../utils/api';

// ponytail: inline SVG icons matching original line-art style — no icon lib needed
const catIcons = {
  'pizza': <svg viewBox="0 0 64 64" width="40" height="40"><path d="M32 4L4 56h56L32 4z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="24" cy="40" r="3" fill="currentColor"/><circle cx="36" cy="36" r="3" fill="currentColor"/><circle cx="30" cy="48" r="3" fill="currentColor"/></svg>,
  'suon-bbq': <svg viewBox="0 0 64 64" width="40" height="40"><path d="M16 20c0-6 4-12 16-12s16 6 16 12v8c0 4-2 6-4 8l-2 4H22l-2-4c-2-2-4-4-4-8v-8z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M24 40v8M32 40v8M40 40v8" stroke="currentColor" strokeWidth="2"/><path d="M20 56h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  'mi-y': <svg viewBox="0 0 64 64" width="40" height="40"><ellipse cx="32" cy="40" rx="20" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 40c0-16 8-28 20-28s20 12 20 28" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M28 16c-2-4-1-8 2-10M36 16c2-4 1-8-2-10" stroke="currentColor" strokeWidth="2" fill="none"/></svg>,
  'salad': <svg viewBox="0 0 64 64" width="40" height="40"><ellipse cx="32" cy="40" rx="22" ry="14" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 36c4-8 12-14 16-14s12 6 16 14" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M28 28c-2-6 0-12 4-14M36 28c2-6 0-12-4-14" stroke="currentColor" strokeWidth="2" fill="none"/></svg>,
  'do-uong': <svg viewBox="0 0 64 64" width="40" height="40"><path d="M20 16h24l-4 40H24L20 16z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M18 16h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M44 24c4 0 8 2 8 8s-4 8-8 8" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M28 24v8M36 24v8" stroke="currentColor" strokeWidth="2"/></svg>,
  'pizza-cap-dong': <svg viewBox="0 0 64 64" width="40" height="40"><circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M32 10v44M10 32h44M18 18l28 28M46 18L18 46" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/><circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>,
  'combo': <svg viewBox="0 0 64 64" width="40" height="40"><rect x="16" y="20" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M24 20v-6a8 8 0 0116 0v6" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M24 36h16M32 28v16" stroke="currentColor" strokeWidth="2"/></svg>,
  'khac': <svg viewBox="0 0 64 64" width="40" height="40"><rect x="18" y="28" width="28" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M14 28h36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M26 28v-4a6 6 0 0112 0v4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M28 38v8M36 38v8" stroke="currentColor" strokeWidth="2"/></svg>,
};

export default function Home({ banners = [], categories = [], reviews = [], features = [], stores = [] }) {
  const [activeTab, setActiveTab] = useState('pizza');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reducedMotion = useRef(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // ponytail: reduced-motion check (impeccable rule)
  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const check = () => setIsMobile(window.innerWidth <= 479);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-slide banner
  const nextBanner = useCallback(() => {
    setBannerIndex(i => (i + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (reducedMotion.current) return;
    const t = setInterval(nextBanner, 4000);
    return () => clearInterval(t);
  }, [nextBanner]);

  // Auto-slide reviews (carousel like original — 2 at a time on desktop)
  useEffect(() => {
    if (reducedMotion.current) return;
    const t = setInterval(() => {
      setReviewIndex(i => (i + 2) % reviews.length);
    }, 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const activeCategory = categories.find(c => c.slug === activeTab);
  const activeProducts = activeCategory?.products || [];
  const itemsPerPage = 8;
  const totalPages = Math.ceil(activeProducts.length / itemsPerPage);
  const displayedProducts = activeProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const visibleReviews = reviews.slice(reviewIndex, reviewIndex + (isMobile ? 1 : 2));
  // ponytail: wrap around if not enough reviews at end
  if (visibleReviews.length < (isMobile ? 1 : 2)) {
    visibleReviews.push(...reviews.slice(0, (isMobile ? 1 : 2) - visibleReviews.length));
  }
  const totalDots = Math.ceil(reviews.length / (isMobile ? 1 : 2));

  return (
    <>
      <Head>
        <title>Pizza, Đặt pizza ngon, giá rẻ tại Pizza Express</title>
      </Head>

      <Header />

      {/* Hero Banner */}
      <section className="hero">
        <div className="hero__slides" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
          {banners.map(b => (
            <div
              key={b.id}
              className="hero__slide"
              style={{ backgroundImage: `url(${isMobile ? b.mobile : b.desktop})` }}
            />
          ))}
        </div>
        
        {/* Navigation Arrows for Premium Feel */}
        <button 
          type="button" 
          className="hero__arrow left" 
          onClick={() => setBannerIndex(i => (i - 1 + banners.length) % banners.length)}
          aria-label="Banner trước"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button 
          type="button" 
          className="hero__arrow right" 
          onClick={() => setBannerIndex(i => (i + 1) % banners.length)}
          aria-label="Banner tiếp theo"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        <div className="hero__dots">
          {banners.map((b, i) => (
            <button
              key={b.id}
              className={`hero__dot${i === bannerIndex ? ' active' : ''}`}
              onClick={() => setBannerIndex(i)}
            />
          ))}
        </div>
      </section>

      {/* Menu Section */}
      <section id="home_thucdon" className="menu-section">
        <div className="container">
          <div className="menu-section__title">Thực đơn</div>

          {/* Category Tabs — SVG icons matching original */}
          <div className="cat-tabs">
            {categories.map(cat => (
              <button
                key={cat.slug}
                className={`cat-tab${activeTab === cat.slug ? ' active' : ''}`}
                onClick={() => setActiveTab(cat.slug)}
              >
                <span className="cat-tab__icon">{catIcons[cat.slug]}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="products-grid">
            {displayedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination for Homepage Menu */}
          {totalPages > 1 && (
            <div className="wp-pagenavi" style={{ marginTop: '40px' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  type="button"
                  className={currentPage === i + 1 ? 'current' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews — carousel matching original */}
      <section className="reviews-section">
        <div className="container">
          <div className="reviews-section__title">Phản hồi của khách hàng</div>
          <div className="reviews-carousel">
            {visibleReviews.map((r, i) => (
              <div key={reviewIndex + i} className="review-card">
                <img className="review-card__avatar" src={r.avatar} alt={r.name} />
                <div>
                  <p className="review-card__content">"{r.content}"</p>
                  <p className="review-card__name">{r.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reviews-dots">
            {Array.from({ length: totalDots }, (_, i) => (
              <button
                key={i}
                className={`hero__dot${Math.floor(reviewIndex / (isMobile ? 1 : 2)) === i ? ' active' : ''}`}
                onClick={() => setReviewIndex(i * (isMobile ? 1 : 2))}
              />
            ))}
          </div>
        </div>
      </section>

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

// ponytail: Static Gen with ISR every 60 seconds
export async function getStaticProps() {
  const [banners, categories, products, reviews, features, stores] = await Promise.all([
    getBanners(),
    getCategories(),
    getProducts(),
    getReviews(),
    getFeatures(),
    getLocations()
  ]);

  // Group products into their respective categories
  const mappedCategories = categories.map(cat => ({
    ...cat,
    products: products.filter(p => p.categorySlug === cat.slug)
  }));

  return {
    props: {
      banners,
      categories: mappedCategories,
      reviews,
      features,
      stores
    },
    revalidate: 60
  };
}
