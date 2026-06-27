import productsData from '../data/products.json';
import siteContent from '../data/site-content.json';
import blogPosts from '../data/blog-posts.json';
import customPages from '../data/custom-pages.json';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5290/api/public';

// Helper to handle fetch with timeout & fallback
async function fetchWithFallback(endpoint, mockData) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) return await res.json();
  } catch (e) {
    // ponytail: silent warning in console, use mock
    console.warn(`[API] Failed to fetch /${endpoint}, falling back to mock data.`);
  }
  return mockData;
}

export async function getSettings() {
  const fallback = siteContent.settings || {
    siteName: "Pizza Express",
    logoPath: "/wp-content/uploads/2018/05/logo.png",
    slogan: "Pizza ngon - Giá rẻ - Vận chuyển tận nhà",
    companyName: "Công ty TNHH Pizza Express Việt Nam",
    businessRegNumber: "0106675108",
    companyAddress: "Số 352 Đường Bưởi, P.Vĩnh Phúc, Q.Ba Đình, TP.Hà Nội",
    hotline: "(024) 36.888.777",
    feedbackPhone: "0977.128.833",
    email: "lienhepizzaexpress@gmail.com",
    zaloUrl: "https://zalo.me/0819180706",
    messengerUrl: "http://m.me/119445844878458",
    privacyPolicyUrl: "/chinh-sach-bao-mat-thong-tin/",
    returnPolicyUrl: "/chinh-sach-doi-tra-san-pham-va-hoan-tien/",
    paymentPolicyUrl: "/chinh-sach-thanh-toan/"
  };
  const s = await fetchWithFallback('settings', fallback);
  return {
    siteName: s.siteName || null,
    logoPath: s.logoPath || null,
    footerLogoPath: s.footerLogoPath || null,
    slogan: s.slogan || null,
    companyName: s.companyName || null,
    businessRegNumber: s.businessRegNumber || null,
    companyAddress: s.companyAddress || null,
    hotline: s.hotline || null,
    feedbackPhone: s.feedbackPhone || null,
    email: s.email || null,
    zaloUrl: s.zaloUrl || null,
    messengerUrl: s.messengerUrl || null,
    privacyPolicyUrl: s.privacyPolicyUrl || null,
    returnPolicyUrl: s.returnPolicyUrl || null,
    paymentPolicyUrl: s.paymentPolicyUrl || null
  };
}

export async function getMenu() {
  const fallback = [
    { label: "Trang chủ", url: "/" },
    { label: "Thực đơn", url: "/#home_thucdon" },
    { label: "Khuyến mại", url: "/khuyen-mai/" },
    { label: "Chính sách", url: "/chinh-sach/" },
    { label: "Blog", url: "/blog/" },
    { label: "Liên hệ", url: "/lien-he/" }
  ];
  const data = await fetchWithFallback('menu', fallback);
  return data.map(m => ({
    label: m.label || null,
    url: m.url || null,
    openNewTab: m.openNewTab || false
  }));
}

export async function getBanners() {
  const fallback = siteContent.banners || [];
  const data = await fetchWithFallback('banners', fallback);
  return data.map(b => ({
    title: b.title || null,
    desktop: b.desktopImagePath ? `http://localhost:5290/${b.desktopImagePath}` : (b.desktopImage || null),
    mobile: b.mobileImagePath ? `http://localhost:5290/${b.mobileImagePath}` : (b.mobileImage || null),
    desktopImage: b.desktopImagePath ? `http://localhost:5290/${b.desktopImagePath}` : (b.desktopImage || null),
    mobileImage: b.mobileImagePath ? `http://localhost:5290/${b.mobileImagePath}` : (b.mobileImage || null),
    link: b.linkUrl || b.link || null
  }));
}

export async function getCategories() {
  const fallback = productsData.categories.map(c => ({ id: c.slug, name: c.name, slug: c.slug, description: c.description }));
  const data = await fetchWithFallback('categories', fallback);
  return data.map(c => ({
    id: c.id || c.slug || null,
    name: c.name || null,
    slug: c.slug || null,
    description: c.description || null
  }));
}

export async function getProducts(categoryId = null) {
  const fallback = productsData.products;
  const endpoint = categoryId ? `products?categoryId=${categoryId}` : 'products';
  const data = await fetchWithFallback(endpoint, fallback);
  return data.map(p => ({
    id: p.id,
    name: p.name || null,
    description: p.description || null,
    ingredients: p.ingredients || null,
    image: p.imagePath ? `http://localhost:5290/${p.imagePath}` : (p.image || null),
    categoryName: p.categoryName || p.category || null,
    categorySlug: p.categorySlug || p.category || null,
    hasVariants: p.hasVariants || false,
    simplePrice: p.singlePrice || p.simplePrice || p.price || null,
    originalPrice: p.singleSalePrice || p.originalPrice || p.salePrice || null,
    variations: p.variants ? p.variants.map(v => ({
      size: v.sizeName || v.size || null,
      diameter: v.sizeLabel || v.diameter || null,
      price: v.price || null,
      salePrice: v.salePrice || null
    })) : (p.variations || null)
  }));
}

export async function getFeatures() {
  const fallback = siteContent.features || [];
  const data = await fetchWithFallback('features', fallback);
  return data.map(f => ({
    title: f.title || null,
    desc: f.description || f.desc || null,
    icon: f.iconPath ? `http://localhost:5290/${f.iconPath}` : (f.icon || null)
  }));
}

export async function getReviews() {
  const fallback = siteContent.reviews || [];
  const data = await fetchWithFallback('reviews', fallback);
  return data.map(r => ({
    name: r.customerName || r.name || r.customer || null,
    avatar: r.avatarPath ? `http://localhost:5290/${r.avatarPath}` : (r.avatar || null),
    content: r.content || null
  }));
}

export async function getLocations() {
  const fallback = siteContent.stores || [];
  const data = await fetchWithFallback('locations', fallback);
  return data.map(l => ({
    address: l.address || null,
    mapUrl: l.mapUrl || null,
    icon: l.iconPath ? `http://localhost:5290/${l.iconPath}` : (l.icon || '/wp-content/uploads/2018/05/location_icon.png')
  }));
}

export async function getPosts() {
  const fallback = blogPosts;
  const data = await fetchWithFallback('posts', fallback);
  return data.map(p => ({
    title: p.title || null,
    slug: p.slug || null,
    excerpt: p.summary || p.excerpt || null,
    image: p.imagePath ? `http://localhost:5290/${p.imagePath}` : (p.image || null),
    date: p.createdAt ? p.createdAt.split('T')[0] : (p.date || null)
  }));
}

export async function getPost(slug) {
  const fallback = blogPosts.find(p => p.slug === slug);
  const data = await fetchWithFallback(`posts/${slug}`, fallback);
  if (!data) return null;
  return {
    title: data.title || null,
    slug: data.slug || null,
    excerpt: data.summary || data.excerpt || null,
    content: data.content || null,
    image: data.imagePath ? `http://localhost:5290/${data.imagePath}` : (data.image || null),
    date: data.createdAt ? data.createdAt.split('T')[0] : (data.date || null)
  };
}

export async function getPage(slug) {
  const fallback = customPages.find(p => p.slug === slug);
  const data = await fetchWithFallback(`pages/${slug}`, fallback);
  if (!data) return null;
  return {
    title: data.title || null,
    slug: data.slug || null,
    content: data.content || null
  };
}

export async function submitContact(name, email, phone, message) {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('[API] Contact submission failed', e);
  }
  return { success: false };
}
