import BlogArchive, { postsPerPage } from '../../../components/BlogArchive';
import { getPosts } from '../../../utils/api';

export default function BlogPaged({ page, archivePosts, sidebarPosts, totalPages }) {
  return (
    <BlogArchive
      currentPage={page}
      archivePosts={archivePosts}
      sidebarPosts={sidebarPosts}
      totalPages={totalPages}
    />
  );
}

// ponytail: blocking fallback allows pages to generate dynamically when posts are added in admin
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const page = Number(params.page);
  const posts = await getPosts();
  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (!Number.isInteger(page) || page < 2 || page > totalPages) {
    return { notFound: true };
  }

  const start = (page - 1) * postsPerPage;
  const archivePosts = posts.slice(start, start + postsPerPage);
  const sidebarPosts = posts
    .filter((_, index) => index < start || index >= start + postsPerPage)
    .slice(0, 10);

  return {
    props: {
      page,
      archivePosts,
      sidebarPosts,
      totalPages
    },
    revalidate: 60
  };
}
