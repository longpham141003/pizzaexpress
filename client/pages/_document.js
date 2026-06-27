import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi-VN">
      <Head>
        <link rel="icon" href="/logo-nia-pizza.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Karla:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="description" content="Pizza Express - Pizza ngon, giá rẻ, khuyến mãi cả tuần. Mua 1 tặng 1 chỉ với 160.000đ. Tổng đài (24/7): 0973.198.462." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
