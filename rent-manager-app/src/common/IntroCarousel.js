import React, { Component } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

class IntroCarosel extends Component {
    render() {
        return (
            <>
                <div className="intro intro-carousel swiper position-relative">



<Swiper spaceBetween={30}
    centeredSlides={true}
    autoplay={{
        delay: 5000,
        disableOnInteraction: false,
    }}
    pagination={{
        clickable: true,
    }}
    navigation={true}
    modules={[Autoplay, Pagination, Navigation]} className="swiper-wrapper">
    <SwiperSlide className="carousel-item-b swiper-slide" >
        <div className="swiper-slide carousel-item-a intro-item bg-image" style={{ backgroundImage: `url(assets/img/phongtro3.jpg)` }}>
            <div className="overlay overlay-a"></div>
            <div className="intro-content display-table">
                <div className="table-cell">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="intro-body">
                                    <p className="intro-title-top"> <strong> Phòng trọ tốt bạn muốn tìm kiếm </strong>
                                        <br /> <strong>Uy tín - Nhanh chóng - Tối giản chi phí</strong>
                                    </p>
                                    <h1 className="intro-title mb-4 ">
                                        <span className="color-b">RentMate </span> Một
                                        <br /> Nơi tuyệt vời để tìm trọ đúng ý của bạn
                                    </h1>
                                    <p className="intro-subtitle intro-price">
                                        <a href="/rental-home"><span className="price-a">Xem tại đây!</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </SwiperSlide>
    <SwiperSlide className="carousel-item-b swiper-slide" >
        <div className="swiper-slide carousel-item-a intro-item bg-image" style={{ backgroundImage: `url(assets/img/phongtro2.jpg)` }}>
            <div className="overlay overlay-a"></div>
            <div className="intro-content display-table">
                <div className="table-cell">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="intro-body">
                                    <p className="intro-title-top"> <strong>Tìm người ở ghép cùng bạn</strong>
                                        <br /> <strong>Tiết kiệm chi phí!</strong>
                                    </p>
                                    <h1 className="intro-title mb-4">
                                        <span className="color-b">100+ </span> Người dùng
                                        <br /> Đã tìm được phòng trọ như ý
                                    </h1>
                                    <p className="intro-subtitle intro-price">
                                        <a href="/rental-home"><span className="price-a">Tìm tại đây!</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </SwiperSlide>
    <SwiperSlide className="carousel-item-b swiper-slide" >
        <div className="swiper-slide carousel-item-a intro-item bg-image" style={{ backgroundImage: `url(assets/img/phongtro3.jpg)` }}>
            <div className="overlay overlay-a"></div>
            <div className="intro-content display-table">
                <div className="table-cell">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="intro-body">
                                    <p className="intro-title-top"> <strong>Quản lý phòng trọ</strong>
                                        <br /> <strong>Tiết kiệm thời gian!</strong>
                                    </p>
                                    <h1 className="intro-title mb-4">
                                        <span className="color-b">300+ </span> Chủ trọ
                                        <br /> Đã tin tưởng sử dụng 
                                    </h1>
                                    <p className="intro-subtitle intro-price">
                                        <a href="/signup-landlord"><span className="price-a">Đăng ký tại đây!</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </SwiperSlide>
</Swiper>
</div>
<div className="swiper-pagination"></div>

            </>
        )
    }
}

export default IntroCarosel;