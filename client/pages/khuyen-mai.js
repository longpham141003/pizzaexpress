import PageLayout from '../components/PageLayout';

const PROMOS = [
  {
    tag: 'HOT',
    tagColor: '#E03030',
    icon: '🍕',
    title: 'Mua 1 Tặng 1',
    desc: 'Mua 1 pizza size M bất kỳ tặng ngay 1 pizza size M cùng loại. Áp dụng mỗi thứ 3 và thứ 5 hàng tuần.',
    condition: 'Áp dụng thứ 3 & thứ 5 | Không áp dụng cùng KM khác',
    badge: 'Tiết kiệm 50%',
    badgeColor: '#E03030',
    link: '/#home_thucdon',
    cta: 'Đặt ngay',
  },
  {
    tag: 'MỚI',
    tagColor: '#D4641A',
    icon: '👨‍👩‍👧‍👦',
    title: 'Combo Gia Đình',
    desc: '2 Pizza size L + 2 Salad + 2 Đồ uống chỉ với 599.000đ. Giao hàng miễn phí nội thành Hà Nội.',
    condition: 'Đặt trước 17h | Giao trong ngày',
    badge: 'Tiết kiệm 30%',
    badgeColor: '#D4641A',
    link: '/#home_thucdon',
    cta: 'Chọn Combo',
  },
  {
    tag: 'ĐẶC BIỆT',
    tagColor: '#3D1F00',
    icon: '🎂',
    title: 'Sinh Nhật Vui',
    desc: 'Tặng bánh sinh nhật mini khi đặt đơn từ 300.000đ. Chỉ cần nhắn "SINH NHẬT" vào ghi chú đơn hàng.',
    condition: 'Thông báo trước 1 ngày | Số lượng có hạn',
    badge: 'Quà tặng miễn phí',
    badgeColor: '#3D1F00',
    link: '/lien-he',
    cta: 'Đặt hàng ngay',
  },
  {
    tag: 'FREESHIP',
    tagColor: '#2e8b57',
    icon: '🛵',
    title: 'Miễn Phí Vận Chuyển',
    desc: 'Freeship toàn bộ đơn hàng từ 200.000đ trong nội thành Hà Nội. Giao nhanh trong 45 phút.',
    condition: 'Nội thành Hà Nội | Đơn từ 200K',
    badge: '0đ ship',
    badgeColor: '#2e8b57',
    link: '/#home_thucdon',
    cta: 'Đặt ngay',
  },
  {
    tag: 'GIỚI HẠN',
    tagColor: '#7B4FBF',
    icon: '⏰',
    title: 'Happy Hour',
    desc: 'Giảm 20% toàn bộ thực đơn từ 17:00 – 19:00 mỗi ngày. Nhanh tay đặt trước giờ cao điểm!',
    condition: '17:00 – 19:00 hàng ngày | Đặt online',
    badge: 'Giảm 20%',
    badgeColor: '#7B4FBF',
    link: '/#home_thucdon',
    cta: 'Đặt trong giờ vàng',
  },
  {
    tag: 'ONLINE',
    tagColor: '#0068cc',
    icon: '📱',
    title: 'Đặt Online Giảm 15%',
    desc: 'Đặt hàng trực tiếp qua website niapizza.com.vn được giảm ngay 15% cho toàn bộ đơn hàng.',
    condition: 'Đặt qua website | Thanh toán khi nhận hàng',
    badge: 'Giảm 15%',
    badgeColor: '#0068cc',
    link: '/#home_thucdon',
    cta: 'Đặt ngay',
  },
];

export default function KhuyenMai() {
  return (
    <PageLayout
      title="Khuyến mại"
      breadcrumbs={[{ label: 'Khuyến mại' }]}
      metaDesc="NIA PIZZA khuyến mãi hấp dẫn: mua 1 tặng 1, combo gia đình, freeship, happy hour và nhiều ưu đãi mỗi ngày."
    >
      <section className="promo-page">
        <div className="container">
          <p className="promo-page__subtitle">Ưu đãi cập nhật liên tục – Đặt ngay hôm nay!</p>
          <div className="promo-cards">
            {PROMOS.map((p, i) => (
              <div className="promo-card" key={i}>
                <div className="promo-card__top">
                  <span className="promo-card__tag" style={{ background: p.tagColor }}>{p.tag}</span>
                  <span className="promo-card__badge" style={{ color: p.badgeColor }}>{p.badge}</span>
                </div>
                <div className="promo-card__icon">{p.icon}</div>
                <h3 className="promo-card__title">{p.title}</h3>
                <p className="promo-card__desc">{p.desc}</p>
                <p className="promo-card__condition">{p.condition}</p>
                <a href={p.link} className="promo-card__cta" style={{ background: p.tagColor }}>
                  {p.cta} →
                </a>
              </div>
            ))}
          </div>

          <div className="promo-note">
            <span>📌</span>
            <p>Các chương trình khuyến mại có thể thay đổi. Gọi <a href="tel:0973198462">0973.198.462</a> để được tư vấn và xác nhận ưu đãi mới nhất.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
