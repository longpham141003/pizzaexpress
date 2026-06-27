import PageLayout from '../components/PageLayout';
import { getBanners } from '../utils/api';
import { useState, useEffect } from 'react';

export default function KhuyenMai({ banners = [] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 479);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <PageLayout
      title="Khuyến mại"
      breadcrumbs={[{ label: 'Khuyến mại' }]}
      metaDesc="Pizza Express khuyến mãi mua 1 tặng 1 cả tuần. Khuyến mãi miễn phí vận chuyển nội thành Hà Nội."
    >
      <section className="page-content">
        <div className="container">
          <div className="promo-grid">
            {banners.map((b, i) => (
              <a key={i} href={b.link || '/#home_thucdon'} className="promo-grid__item">
                <img 
                  src={isMobile ? (b.mobileImage || b.desktopImage) : b.desktopImage} 
                  alt={b.title || `Khuyến mại ${i + 1}`} 
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// ponytail: Static Gen with ISR every 60s
export async function getStaticProps() {
  const banners = await getBanners();
  return {
    props: {
      banners
    },
    revalidate: 60
  };
}
