import React, { Component } from "react";
import { Link, NavLink } from 'react-router-dom';
import { getAllAccountlandlordForCustomer, getAllRoomOfCustomer } from "../services/fetch/ApiUtils";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            totalPages: 3,
            rooms: [], // Mảng lưu trữ danh sách phòng trọ từ API
            sortingOption: "Thời gian: Mới đến cũ",
            landlord: [],
            isLoading: true,
        };
    }

    // Gọi API để lấy danh sách phòng trọ sau khi component được khởi tạo
    componentDidMount() {
        this.fetchRooms();
    }

    // Hàm gọi API lấy danh sách phòng trọ
    fetchRooms = () => {
        this.setState({ isLoading: true });
        
        Promise.all([
            getAllRoomOfCustomer(1, 3, '', '', '', '', null),
            getAllAccountlandlordForCustomer(1, 7)
        ]).then(([roomsResponse, landlordResponse]) => {
            this.setState({
                rooms: roomsResponse.content || [],
                landlord: landlordResponse.content || [],
                isLoading: false
            });
        }).catch(error => {
            console.error('Error fetching data:', error);
            toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            this.setState({ 
                isLoading: false,
                rooms: [],
                landlord: []
            });
        });
    };

    render() {
        const { rooms, landlord, isLoading } = this.state;

        if (isLoading) {
            return (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            );
        }

        return (
            <div style={{ fontFamily: "Arial, sans-serif" }}>
            <main id="main">
                <section className="section-services section-t8" style={{ padding: "5px 2", margin: "5" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="title-wrap d-flex justify-content-between">
                                    <div className="title-box">
                                        <h2 className="title-a">Giới thiệu về RenMate</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                            <div className="card-box-c foo">
                                    <div className="card-header-c d-flex">
                                        
                                            
                                        
                                        <div className="card-title-c align-self-center">
                                            <h3 className="title-a" style={{
                                                border: "4px solid #28a745",
                                                padding: "5px 10px",
                                                display: "inline-block",
                                                borderRadius: "4px",
                                                fontWeight: "bold"
                                            }}>Tầm nhìn</h3>
                                        </div>
                                    </div>
                                    <div className="card-body-c">
                                        <p className="content-c" style={{ color: 'black' }}>
                                        Trở thành nền tảng hàng đầu kết nối giữa người thuê trọ và chủ nhà, cung cấp trải nghiệm tìm kiếm, quản lý phòng trọ và thanh toán trực tuyến dễ dàng, minh bạch và đáng tin cậy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card-box-c foo">
                                    <div className="card-header-c d-flex">
                                        
                                    <div className="card-title-c align-self-center">
                                            <h3 className="title-a" style={{
                                                border: "4px solid #28a745",
                                                padding: "5px 10px",
                                                display: "inline-block",
                                                borderRadius: "4px",
                                                fontWeight: "bold"
                                            }}>Sứ mệnh</h3>
                                        </div>
                                    </div>
                                    <div className="card-body-c">
                                        <p className="content-c" style={{ color: 'black' }}> 
                                        1. Tạo môi trường trực tuyến hiệu quả giúp người thuê trọ tìm kiếm không gian sống phù hợp nhanh chóng.
                                        <br />2. Hỗ trợ chủ nhà quản lý phòng trọ thông minh và chuyên nghiệp.
                                        <br />3. Đảm bảo sự minh bạch và an toàn trong giao dịch giữa các bên.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card-box-c foo">
                                    <div className="card-header-c d-flex">
                                        
                                    <div className="card-title-c align-self-center">
                                            <h3 className="title-a" style={{
                                                border: "4px solid #28a745",
                                                padding: "5px 10px",
                                                display: "inline-block",
                                                borderRadius: "4px",
                                                fontWeight: "bold"
                                            }}>Giá trị cốt lõi</h3>
                                        </div>
                                    </div>
                                
                                    <div className="card-body-c">
                                        <p className="content-c" style={{ color: 'black' }}>
                                        1. Minh bạch: Cam kết cung cấp thông tin chính xác và rõ ràng về phòng trọ và giao dịch.
                                        <br />2. Tiện lợi: Tối ưu hóa quy trình tìm kiếm, quản lý và thanh toán trọ.
                                        <br />3. Tin cậy: Xây dựng niềm tin thông qua xác thực thông tin và hỗ trợ kịp thời.
                                        <br />4. Đổi mới: Không ngừng nâng cấp công nghệ để đáp ứng nhu cầu ngày càng cao của người dùng.
                                        <br />5. Kết nối: Tạo nền tảng để người thuê và chủ nhà dễ dàng tương tác và giao dịch.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            
                </section>

                <section className="section-property section-t8" style={{ padding: "5px 2", margin: "5" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="title-wrap d-flex justify-content-between">
                                    <div className="title-box">
                                        <h2 className="title-a">Bài đăng mới nhất</h2>
                                    </div>
                                    <div className="title-link">
                                        <a href="/rental-home">Tất cả bài đăng
                                            <span className="bi bi-chevron-right"></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="property-grid grid">
                            <div className="row">
                                {(rooms || []).length > 0 ? (
                                    (rooms || []).slice(0, 3).map(room => (
                                        <div className="col-md-4" key={room.id}>
                                            <div className="card-box-a card-shadow">
                                                <div className="img-box-a">
                                                    {room.roomMedia && room.roomMedia[0] ?
                                                        <img src={room.roomMedia[0].files} alt="" className="img-a img-fluid" style={{ width: "350px", height: "350px" }} />
                                                        :
                                                        <img src="assets/img/property-1.jpg" alt="" className="img-a img-fluid" style={{ width: "350px", height: "350px" }} />
                                                    }
                                                </div>
                                                <div className="card-overlay">
                                                    <div className="card-overlay-a-content">
                                                        <div className="card-header-a">
                                                            <h2 className="card-title-a">
                                                                <Link to={`/rental-home/${room.id}`}>
                                                                    <b style={{ fontSize: '25px' }}>{room.title}</b>
                                                                    <br /> <small style={{ fontSize: '15px' }}>{room.description}</small>
                                                                </Link>
                                                            </h2>
                                                        </div>
                                                        <div className="card-body-a">
                                                            <div className="price-box d-flex">
                                                                <span className="price-a" >
                                                                    {room.status === "ROOM_RENT" && `Cho thuê |  ${room.price.toLocaleString('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    })}`}
                                                                </span>
                                                            </div>
                                                            <Link to={`/rental-home/${room.id}`}>Xem chi tiết
                                                                <span className="bi bi-chevron-right"></span>
                                                            </Link>
                                                        </div>
                                                        <div className="card-footer-a">
                                                            <ul className="card-info d-flex justify-content-around">
                                                                <li>
                                                                    <h4 className="card-info-title" style={{ fontSize: '10px' }}>Vị trí</h4>
                                                                    <span style={{ fontSize: '10px' }}>{room.addressLocation.cityName}</span>
                                                                </li>
                                                                <li>
                                                                    <h4 className="card-info-title" style={{ fontSize: '10px' }}>Loại</h4>
                                                                    <span style={{ fontSize: '10px' }}>{room.category.name}</span>
                                                                </li>
                                                                <li>
                                                                    <h4 className="card-info-title" style={{ fontSize: '10px' }}>Người cho thuê</h4>
                                                                    <span style={{ fontSize: '10px' }}>{room.user.name}</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center">
                                        <p>Không có phòng trọ nào.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section-agents section-t8" style={{ padding: "5px 0", margin: "5" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="title-wrap d-flex justify-content-between">
                                    <div className="title-box">
                                        <h2 className="title-a">Người cho thuê</h2>
                                    </div>
                                    <div className="title-link">
                                        <a href="landlord-grid">Tất cả người cho thuê trọ
                                            <span className="bi bi-chevron-right"></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {(landlord || []).length > 0 ? (
                                (landlord || []).slice(0, 3).map(landlord => (
                                    <div className="col-md-4" key={landlord.id}>
                                        <div className="card-box-a card-shadow">
                                            <div className="img-box-a">
                                                {landlord.imageUrl ? (
                                                    <img src={landlord.imageUrl} alt={landlord.name} className="img-a img-fluid" style={{ width: "300px", height: "300px",objectFit: "cover" }} />
                                                ) : (
                                                    <img src="assets/img/agent-4.jpg" alt={landlord.name} className="img-a img-fluid" style={{ width: "300px", height: "300px", objectFit: "cover" }} />
                                                )}
                                                <div className="card-overlay">
                                                    <div className="card-overlay-a-content">
                                                        <div className="card-header-a">
                                                            <h2 className="card-title-a">
                                                                <Link to={`/angent-single/` + landlord.id} className="link-two">
                                                                    {landlord.name}
                                                                </Link>
                                                                <br /> <small style={{ fontSize: '15px' }}> Số phòng trống: {landlord.roomslot}</small>
                                                                <br /> <small style={{ fontSize: '15px' }}> Khu vực cho thuê: {landlord.area}</small>
                                                            </h2>
                                                        </div>
                                                        <div className="card-body-a">
                                                            <p className="content-a color-text-a" style={{ color: "white" }}>
                                                                {landlord.address}
                                                            </p>
                                                        </div>
                                                        <div className="card-footer-a">
                                                            <ul className="card-info d-flex justify-content-around">
                                                                <li>
                                                                    <h4 className="card-info-title" style={{ fontSize: '10px' }}>Số điện thoại</h4>
                                                                    <span style={{ fontSize: '10px' }}>{landlord?.phone}</span>
                                                                </li>
                                                                <li>
                                                                    <h4 className="card-info-title" style={{ fontSize: '10px' }}>Email</h4>
                                                                    <span style={{ fontSize: '10px' }}>{landlord?.email}</span>
                                                                </li>
                                                                <li>
                                                                    <h4 className="card-info-title" style={{ fontSize: '10px' }}>Đánh giá</h4>
                                                                    <span style={{ fontSize: '10px' }}>{landlord?.review }</span>
                                                                    <span className="bi bi-star"></span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p>Không có người cho thuê nào.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            </div>
        )
    }
}

export default Home;