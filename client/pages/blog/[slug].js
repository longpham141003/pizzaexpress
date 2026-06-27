import PageLayout from '../../components/PageLayout';
import { getPost, getPosts } from '../../utils/api';

function formatDate(date) {
  if (!date) return '';
  const dateStr = String(date).split('T')[0];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return date;
  const months = ['Th01','Th02','Th03','Th04','Th05','Th06','Th07','Th08','Th09','Th10','Th11','Th12'];
  return `${parts[2]} ${months[parseInt(parts[1])-1]}, ${parts[0]}`;
}

function readTime(content) {
  const text = String(content || '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPost({ post, relatedPosts = [] }) {
  if (!post) return <p>Bài viết không tồn tại</p>;
  const rt = readTime(post.content);

  return (
    <PageLayout
      title={post.title}
      breadcrumbs={[
        { label: 'Blog', href: '/blog' },
        { label: post.title }
      ]}
      metaDesc={post.excerpt || `Bài viết: ${post.title} tại NIA PIZZA`}
    >
      <section className="blog-detail">
        <div className="container">
          <article className="blog-post-article">
            <h1 className="blog-detail__title">{post.title}</h1>
            <div className="blog-meta blog-detail-meta">
              <span className="blog-meta__item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {formatDate(post.date)}
              </span>
              <span className="blog-meta__sep" aria-hidden="true">·</span>
              <span className="blog-meta__item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Admin
              </span>
              <span className="blog-meta__sep" aria-hidden="true">·</span>
              <span className="blog-meta__item">{rt} phút đọc</span>
            </div>
            {post.image && (
              <div className="blog-detail__featured-wrapper">
                <img className="blog-detail__featured" src={post.image} alt={post.title} />
              </div>
            )}
            <div className="blog-detail__content" dangerouslySetInnerHTML={{ __html: post.content || `<p>Nội dung bài viết "${post.title}" đang được cập nhật.</p>` }} />
            <div className="blog-detail__back">
              <a href="/blog">
                <svg className="icon-back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Quay lại danh sách blog
              </a>
            </div>
          </article>

          {relatedPosts.length > 0 && (
            <section className="blog-related" aria-label="Bài viết liên quan">
              <h2 className="blog-related__title">Bài viết khác</h2>
              <div className="blog-related__grid">
                {relatedPosts.map(rp => (
                  <a key={rp.slug} href={`/blog/${rp.slug}`} className="blog-related__card">
                    <img
                      src={rp.image || '/wp-content/uploads/2024/10/logo_pizza-390x390.jpg'}
                      alt={rp.title}
                      className="blog-related__img"
                      width="300" height="169"
                      loading="lazy"
                    />
                    <div className="blog-related__info">
                      <span className="blog-related__date">{formatDate(rp.date)}</span>
                      <h3 className="blog-related__name">{rp.title}</h3>
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

// ponytail: blocking fallback allows new blog posts in admin to work instantly
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const [post, allPosts] = await Promise.all([
    getPost(params.slug),
    getPosts()
  ]);

  if (!post) {
    return { notFound: true };
  }

  const relatedPosts = allPosts
    .filter(p => p.slug !== params.slug)
    .slice(0, 4);

  return {
    props: {
      post,
      relatedPosts
    },
    revalidate: 60
  };
}
