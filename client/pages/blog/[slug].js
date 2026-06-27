import PageLayout from '../../components/PageLayout';
import { getPost, getPosts } from '../../utils/api';

export default function BlogPost({ post }) {
  if (!post) return <p>Bài viết không tồn tại</p>;

  return (
    <PageLayout
      title={post.title}
      breadcrumbs={[
        { label: 'Blog', href: '/blog' },
        { label: post.title }
      ]}
      metaDesc={post.excerpt || `Bài viết: ${post.title} tại Pizza Express`}
    >
      <section className="page-content blog-detail">
        <div className="container">
          <article className="blog-post-article">
            <h1 className="blog-detail__title">{post.title}</h1>
            <ul className="archive_info">
              <li>
                <svg className="icon-meta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {post.date}
              </li>
              <li>
                <svg className="icon-meta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Đăng bởi: Admin
              </li>
            </ul>
            {post.image && (
              <div className="blog-detail__featured-wrapper">
                <img className="blog-detail__featured" src={post.image} alt={post.title} />
              </div>
            )}
            <div className="blog-detail__content" dangerouslySetInnerHTML={{ __html: post.content || `<p>Nội dung bài viết "${post.title}" đang được cập nhật.</p>` }} />
            <div className="blog-detail__back">
              <a href="/blog">
                <svg className="icon-back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Quay lại danh sách blog
              </a>
            </div>
          </article>
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
  const post = await getPost(params.slug);
  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post
    },
    revalidate: 60
  };
}
