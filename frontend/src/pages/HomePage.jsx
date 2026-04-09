import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="page gradient-bg">
      <Navbar />
      <section className="hero">
        <div className="hero-text">
          <span className="badge">Ăn gì hôm nay? 🤔</span>
          <h1>Foodbot là sự lựa chọn hàng đầu của bạn</h1>
          <p>
            Gợi ý món ăn theo nhu cầu, ngân sách, thời điểm trong ngày, chế độ ăn và sở thích cá nhân của bạn
          </p>
          <div className="hero-actions">
          <Link to="/chat" className="primary-btn">Bắt đầu ngay</Link>
            
          </div>
        </div>
        <div className="hero-card">
          <h3>Gợi ý câu hỏi cho bạn ?</h3>
          <ul>
            <li>Món ăn tối dưới 80k cho 2 người</li>
            <li>Món giảm cân dễ nấu cho sinh viên</li>
            <li>Gợi ý món cay kiểu Hàn Quốc</li>
            <li>Thực đơn 3 ngày tiết kiệm</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
