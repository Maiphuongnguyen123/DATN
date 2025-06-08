import React from 'react';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { Link } from 'react-router-dom';

const BlogDetail = (props) => {
    return (
        <>
            <Header
                authenticated={props.authenticated}
                currentUser={props.currentUser}
                onLogout={props.onLogout}
            />
            <main id="main">
                <section className="intro-single">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-lg-8">
                                <div className="title-single-box">
                                    <h1 className="title-single">Blog</h1>
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-4">
                                <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Trang chủ</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/blogs">Blogs</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Chi tiết
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="blog-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <article className="blog-details">
                                    <h1 style={{color: '#2ecc71', textAlign: 'center', marginBottom: '20px'}}>
                                        Tại sao nên sử dụng RentMate - nền tảng cho thuê nhà trọ số 1 Việt Nam
                                    </h1>
                                    
                                    <p>Trong bối cảnh nhu cầu thuê nhà trọ tại Việt Nam ngày càng tăng, đặc biệt ở các thành phố lớn như Hà Nội, TP. Hồ Chí Minh và Đà Nẵng, việc tìm kiếm một nền tảng hỗ trợ hiệu quả trở thành điều cần thiết. RentMate đã nhanh chóng khẳng định vị thế là nền tảng cho thuê nhà trọ số 1 Việt Nam, mang đến giải pháp tối ưu cho cả người thuê trọ và người cho thuê. Dưới đây là những lý do bạn nên lựa chọn RentMate.</p>

                                    <h2 style={{color: '#27ae60', marginTop: '20px'}}>1. Kết nối trực tiếp, minh bạch và an toàn</h2>
                                    <p>RentMate tạo ra một không gian kết nối trực tiếp giữa người thuê và người cho thuê, loại bỏ các bên trung gian, giúp tiết kiệm chi phí và thời gian. Mọi thông tin về phòng trọ, từ giá cả, diện tích, tiện ích đến hình ảnh thực tế, đều được kiểm duyệt kỹ lưỡng trước khi đăng tải, đảm bảo độ chính xác và minh bạch. Người dùng có thể yên tâm tránh được các rủi ro như thông tin sai lệch hay lừa đảo.</p>

                                    {/* ... Continue with other sections ... */}

                                    <div style={{
                                        backgroundColor: '#fff3cd',
                                        padding: '10px',
                                        borderLeft: '4px solid #ffeb3b',
                                        margin: '10px 0'
                                    }}>
                                        <strong>Tham gia RentMate ngay hôm nay để tìm kiếm và quản lý nhà trọ dễ dàng hơn bao giờ hết!</strong>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default BlogDetail; 