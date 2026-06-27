import PageLayout from './PageLayout';

export const postsPerPage = 10;

function formatDate(date) {
  if (!date) return '';
  const dateStr = String(date).split('T')[0];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return date;
  const months = ['Th01','Th02','Th03','Th04','Th05','Th06','Th07','Th08','Th09','Th10','Th11','Th12'];
  return `${parts[2]} ${months[parseInt(parts[1])-1]}, ${parts[0]}`;
}

function getExcerpt(post, len = 140) {
  const text = String(post.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '';
  return text.length > len ? `${text.slice(0, len).trim()}…` : text;
}

function readTime(post) {
  const text = String(post.content || '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function pageHref(page) {
  return page === 1 ? '/blog/' : `/blog/page/${page}/`;
}

const FALLBACK_IMG = '/wp-content/uploads/2024/10/logo_pizza-780x780.jpg';

function HeroPost({ post, index }) {
  const excerpt = getExcerpt(post, 200);
  const rt = readTime(post);
  return (
    <article className="blog-hero-post">
      <a href={`/blog/${post.slug}`} className="blog-hero-post__img-wrap" tabIndex="-1" aria-hidden="true">
        <img
          src={post.image || FALLBACK_IMG}
          alt={post.title}
          className="blog-hero-post__img"
          width="900" height="506"
          loading={index === 0 ? 'eager' : 'lazy'}
        />
        <span className="blog-hero-post__overlay" />
      </a>
      <div className="blog-hero-post__body">
        <span className="blog-badge">Nổi bật</span>
        <h2 className="blog-hero-post__title">
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h2>
        {excerpt && <p className="blog-hero-post__excerpt">{excerpt}</p>}
        <div className="blog-meta">
          <span className="blog-meta__item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {formatDate(post.date)}
          </span>
          <span className="blog-meta__sep" aria-hidden="true">·</span>
          <span className="blog-meta__item">{rt} phút đọc</span>
        </div>
        <a href={`/blog/${post.slug}`} className="blog-hero-post__cta">
          Đọc bài viết
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </article>
  );
}

function PostCard({ post, index }) {
  const excerpt = getExcerpt(post, 110);
  const rt = readTime(post);
  return (
    <article className="blog-card-v2">
      <a href={`/blog/${post.slug}`} className="blog-card-v2__img-wrap" tabIndex="-1" aria-hidden="true">
        <img
          src={post.image || FALLBACK_IMG}
          alt={post.title}
          className="blog-card-v2__img"
          width="400" height="225"
          loading="lazy"
        />
      </a>
      <div className="blog-card-v2__body">
        <div className="blog-meta blog-meta--sm">
          <span className="blog-meta__item">{formatDate(post.date)}</span>
          <span className="blog-meta__sep" aria-hidden="true">·</span>
          <span className="blog-meta__item">{rt} phút đọc</span>
        </div>
        <h3 className="blog-card-v2__title">
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h3>
        {excerpt && <p className="blog-card-v2__excerpt">{excerpt}</p>}
        <a href={`/blog/${post.slug}`} className="blog-card-v2__link" aria-label={`Đọc: ${post.title}`}>
          Đọc tiếp
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </article>
  );
}

function SidebarCard({ post }) {
  return (
    <a href={`/blog/${post.slug}`} className="blog-sidebar-card" title={post.title}>
      <img
        src={post.image || FALLBACK_IMG}
        alt={post.title}
        className="blog-sidebar-card__img"
        width="80" height="60"
        loading="lazy"
      />
      <div className="blog-sidebar-card__info">
        <span className="blog-sidebar-card__title">{post.title}</span>
        <span className="blog-sidebar-card__date">{formatDate(post.date)}</span>
      </div>
    </a>
  );
}

function Pagination({ currentPage, totalPages }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="blog-pagination" role="navigation" aria-label="Phân trang">
      {currentPage > 1 && (
        <a href={pageHref(currentPage - 1)} className="blog-pagination__btn" aria-label="Trang trước">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </a>
      )}
      {pages.map(p => (
        p === currentPage
          ? <span key={p} className="blog-pagination__num blog-pagination__num--active" aria-current="page">{p}</span>
          : <a key={p} href={pageHref(p)} className="blog-pagination__num">{p}</a>
      ))}
      {currentPage < totalPages && (
        <a href={pageHref(currentPage + 1)} className="blog-pagination__btn" aria-label="Trang sau">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      )}
    </nav>
  );
}

export default function BlogArchive({ archivePosts = [], sidebarPosts = [], currentPage = 1, totalPages = 1 }) {
  const [heroPost, ...restPosts] = archivePosts;

  return (
    <PageLayout
      title="Blog"
      breadcrumbs={[{ label: 'Blog' }]}
      metaDesc="Bí quyết làm pizza, ẩm thực Ý, khuyến mãi và những câu chuyện thú vị từ NIA PIZZA."
    >
      <section className="blog-page">
        <div className="container">

          {/* Hero post */}
          {heroPost && <HeroPost post={heroPost} index={0} />}

          {/* Main + Sidebar layout */}
          <div className="blog-layout">
            <div className="blog-main">
              {restPosts.length > 0 && (
                <>
                  <h2 className="blog-section-title">Bài viết mới nhất</h2>
                  <div className="blog-grid">
                    {restPosts.map((post, i) => (
                      <PostCard key={post.slug} post={post} index={i + 1} />
                    ))}
                  </div>
                </>
              )}
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>

            <aside className="blog-sidebar" aria-label="Bài viết nổi bật">
              <div className="blog-sidebar__box">
                <h3 className="blog-sidebar__title">Bài viết khác</h3>
                <div className="blog-sidebar__list">
                  {sidebarPosts.map(post => (
                    <SidebarCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </aside>
          </div>

        </div>
      </section>
    </PageLayout>
  );
}
