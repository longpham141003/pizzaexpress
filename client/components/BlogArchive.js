import PageLayout from './PageLayout';

export const postsPerPage = 10;

function formatDate(date) {
  // Handle formats like "YYYY-MM-DD" or standard ISO
  if (!date) return '';
  const dateStr = String(date).split('T')[0];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return date;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function getExcerpt(post) {
  const text = String(post.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return '';
  return text.length > 170 ? `${text.slice(0, 170).trim()}...` : text;
}

function pageHref(page) {
  return page === 1 ? '/blog/' : `/blog/page/${page}/`;
}

function Pagination({ currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="wp-pagenavi" role="navigation" aria-label="Phân trang blog">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        if (page === currentPage) {
          return (
            <span key={page} aria-current="page" className="current">
              {page}
            </span>
          );
        }

        return (
          <a key={page} className="page larger" href={pageHref(page)} title={`Page ${page}`}>
            {page}
          </a>
        );
      })}
      {currentPage < totalPages && (
        <a className="nextpostslink" rel="next" href={pageHref(currentPage + 1)}>
          »
        </a>
      )}
    </nav>
  );
}

export default function BlogArchive({ archivePosts = [], sidebarPosts = [], currentPage = 1, totalPages = 1 }) {
  const start = (currentPage - 1) * postsPerPage;

  return (
    <PageLayout
      title="Blog"
      breadcrumbs={[{ label: 'Blog' }]}
      metaDesc="Những thông tin chính thức, những khuyến mãi lớn nhất, những combo hấp dẫn, công thức Pizza hay nhất của Pizza Express Việt Nam."
    >
      <section className="kc-elm kc_row dc_section dc_archive">
        <div className="container archive-layout">
          <div className="archive_content">
            {archivePosts.map((post, i) => (
              <article key={post.slug} className="archive_item">
                <div className="archive_thumb">
                  <a href={`/blog/${post.slug}`} title={post.title}>
                    <img
                      width="780"
                      height="780"
                      src={post.image || '/wp-content/uploads/2024/10/logo_pizza-780x780.jpg'}
                      className="attachment-large size-large wp-post-image"
                      alt={post.title}
                    />
                  </a>
                </div>
                <div className="archive_right">
                  <ul className="archive_info">
                    <li>
                      <svg className="icon-meta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {formatDate(post.date)}
                    </li>
                    <li>
                      <svg className="icon-meta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Admin
                    </li>
                    <li>
                      <svg className="icon-meta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      {353 + (start + i) * 37} Lượt xem
                    </li>
                  </ul>
                  <div className="archive_desc">
                    <h3>
                      <a href={`/blog/${post.slug}`} title={post.title}>
                        {post.title}
                      </a>
                    </h3>
                    <p>{getExcerpt(post)}</p>
                  </div>
                  <a className="archive_chitiet" href={`/blog/${post.slug}`} title={post.title}>
                    Đọc chi tiết
                    <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>
              </article>
            ))}

            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>

          <aside className="archive_widget">
            <section className="widget widget_views sidebar_widget">
              <h3 className="widget-title widget_title">BÀI VIẾT KHÁC</h3>
              <ul>
                {sidebarPosts.map((post) => (
                  <li key={post.slug} className="wview_item">
                    <div className="wview_thumb">
                      <a href={`/blog/${post.slug}`} title={post.title}>
                        <img
                          width="370"
                          height="275"
                          src={post.image || '/wp-content/uploads/2024/10/logo_pizza-390x390.jpg'}
                          className="attachment-thumbnail size-thumbnail wp-post-image"
                          alt={post.title}
                        />
                      </a>
                    </div>
                    <div className="wview_cont">
                      <h3>
                        <a href={`/blog/${post.slug}`} title={post.title}>{post.title}</a>
                      </h3>
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
}
