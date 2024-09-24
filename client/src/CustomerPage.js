import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleBookNow = () => {
        // Redirect to login page instead of booking
        navigate('/booking');
    };

    return (
        <div className="home-page">
        <Navbar />
        <header className="hero" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/img/NUI3.jpg)`}}>
            <div className="hero-content">
                <h1>Ngày trôi, việc chảy!</h1>
                <p className='p-home'>Không gian tích hợp đa dạng dịch vụ giúp thúc đẩy công việc của bạn phát triển một cách tối đa.</p>
                <button className="cta-button" onClick={handleBookNow}>BOOK NOW</button>
            </div>
        </header>
        <main>
            <section className="features">
                <h2>Không gian làm việc hiện đại với đa dạng dịch vụ và tiện ích</h2>
                <div className="feature-grid">
                    <div className="feature-item">
                        <img src={`${process.env.PUBLIC_URL}/img/homeKhongGianFb.png`} alt="F&B Space" className="feature-icon" />
                        <h3>Không gian F&B</h3>
                        <p>Không gian mở với menu đồ ăn, thức uống đa dạng, mang nét hiện đại, thoáng đãng, là địa điểm lý tưởng để gặp gỡ, trò chuyện cùng đối tác và đồng nghiệp.</p>
                    </div>
                    <div className="feature-item">
                        <img src={`${process.env.PUBLIC_URL}/img/homeKhongGianMembership.png`} alt="Membership Space" className="feature-icon" />
                        <h3>Không gian Membership</h3>
                        <p>Khu vực làm việc chuyên nghiệp dành cho cá nhân và tổ chức. Thành viên được sử dụng bàn làm việc cao cấp, ghế công thái học, hệ thống check-in thông minh cùng nhiều tiện ích khác để hỗ trợ công việc.</p>
                    </div>
                    <div className="feature-item">
                        <img src={`${process.env.PUBLIC_URL}/img/homePodLamViec.png`} alt="Work Pod" className="feature-icon" />
                        <h3>Pod làm việc</h3>
                        <p>Không gian yên tĩnh, riêng tư với hệ thống cách âm - tiêu âm với môi trường bên ngoài lên đến 70%, thích hợp cho công việc cần sự tập trung và tính bảo mật cao: phỏng vấn, họp trực tuyến, tham vấn,...</p>
                    </div>
                    <div className="feature-item">
                        <img src={`${process.env.PUBLIC_URL}/img/homePhongHop.png`} alt="Meeting Room" className="feature-icon" />
                        <h3>Phòng họp</h3>
                        <p>Các phòng họp có đa dạng sức chứa (4-10 người), được trang bị cơ sở vật chất hiện đại, bao bọc bởi nhiều mảng xanh xung quanh, giúp cuộc họp trở nên chuyên nghiệp và mang nhiều cảm hứng.</p>
                    </div>
                </div>
            </section>
        </main>
        <footer>
            <p>&copy; 2023 Your Company Name. All rights reserved.</p>
        </footer>
    </div>
    );
};

export default Home;
