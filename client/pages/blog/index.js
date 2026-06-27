import BlogArchive, { postsPerPage } from '../../components/BlogArchive';
import { getPosts } from '../../utils/api';

export default function BlogIndex({ archivePosts, sidebarPosts, totalPages }) {
  return (
    <BlogArchive
      currentPage={1}
      archivePosts={archivePosts}
      sidebarPosts={sidebarPosts}
      totalPages={totalPages}
    />
  );
}

// ponytail: Static Gen with ISR every 60s
export async function getStaticProps() {
  const posts = await getPosts();
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  const archivePosts = posts.slice(0, postsPerPage);
  const sidebarPosts = posts.slice(postsPerPage, postsPerPage + 10);

  return {
    props: {
      archivePosts,
      sidebarPosts,
      totalPages
    },
    revalidate: 60
  };
}
