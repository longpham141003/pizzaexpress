import PageLayout from '../components/PageLayout';
import { getPage, getPosts } from '../utils/api';

export default function CustomPage({ page, sidebarPosts = [] }) {
  if (!page) return <p>Trang không tồn tại</p>;

  return (
    <PageLayout
      title={page.title}
      breadcrumbs={[
        { label: page.title }
      ]}
      metaDesc={page.excerpt || `Trang: ${page.title} tại Pizza Express`}
    >
      <section className="page-content blog-detail">
        <div className="container">
          <article className="blog-post-article">
            <h1 className="blog-detail__title">{page.title}</h1>
            <ul className="archive_info">
              <li>
                <svg className="icon-meta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {page.date}
              </li>
              <li>
                <svg className="icon-meta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Đăng bởi: Admin
              </li>
            </ul>

            <div className="blog-detail__content" dangerouslySetInnerHTML={{ __html: page.content || `<p>Nội dung đang được cập nhật.</p>` }} />

            <div className="blog-detail__back">
              <a href="/">
                <svg className="icon-back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Quay lại Trang chủ
              </a>
            </div>
          </article>

          {sidebarPosts.length > 0 && (
            <section className="page-related-posts">
              <h3 className="widget-title widget_title">BÀI VIẾT KHÁC</h3>
              <div className="page-related-grid">
                {sidebarPosts.map((post) => (
                  <a key={post.slug} href={`/blog/${post.slug}`} className="page-related-item" title={post.title}>
                    <img src={post.image || '/wp-content/uploads/2024/10/logo_pizza-390x390.jpg'} alt={post.title} />
                    <div className="page-related-info">
                      <h4>{post.title}</h4>
                      <span>{post.date}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const [page, sidebarPosts] = await Promise.all([
    getPage(params.slug),
    getPosts().then(posts => posts.slice(0, 10))
  ]);

  if (!page) {
    return { notFound: true };
  }

  return {
    props: {
      page,
      sidebarPosts
    },
    revalidate: 60
  };
}
