import React, { Component } from "react";

class Footer extends Component {
    render() {
        return (
            <div style={{ fontFamily: "Arial, sans-serif" }}>
            <>
                <section class="section-footer" style={{ padding: "5px 5", margin: "5" }}>
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-12 col-md-6">
                                <div class="widget-a">
                                    <div class="w-header-a">
                                        <h3 class="w-title-a text-brand"> <img src="/assets/img/logo.png" alt="Logo" style={{ height: '30px', marginRight: '10px' }} />RentMate</h3>
                                    </div>
                                    <div class="w-body-a">
                                        <p class="w-text-a color-text-a">
                                            Phòng trọ chất lượng - Uy tín hàng đầu!!!
                                        </p>
                                    </div>
                                    <div class="w-footer-a">
                                        <ul class="list-unstyled">
                                            <li class="color-a">
                                                <span class="color-text-a">Email: </span> rentmate.cskh@gmail.com
                                            </li>
                                            <li class="color-a">
                                                <span class="color-text-a">Số điện thoại: </span> +84365 744 905
                                            </li>
                                            <li class="color-a">
                                                <span class="color-text-a">Địa chỉ: </span> Số 30 phố Bạch Mai, Hai Bà Trưng, Hà Nội
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6 section-md-t3">
                                <div class="widget-a">
                                    <div class="w-header-a">
                                        <h3 class="w-title-a text-brand">Về công ty</h3>
                                    </div>
                                    <div class="w-body-a">
                                        <div class="w-body-a">
                                            <ul class="list-unstyled">
                                            
                                                <li class="item-list-a">
                                                    <i class="bi bi-chevron-right"></i> <a href="#">Sứ mệnh, tầm nhìn</a>
                                                </li>
                                
                                                <li class="item-list-a">
                                                    <i class="bi bi-chevron-right"></i> <a href="#">Careers path</a>
                                                </li>
                                               
                                                <li class="item-list-a">
                                                    <i class="bi bi-chevron-right"></i> <a href="/contact">Hướng dẫn sử dụng RentMate</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                </section >
                <footer style={{ padding: "5px 0", margin: "5" }}>
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <nav class="nav-footer">
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a href="#">Home</a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a href="#">About</a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a href="#">Property</a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a href="#">Blog</a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a href="#">Contact</a>
                                        </li>
                                    </ul>
                                </nav>
                                <div class="socials-a">
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a href="#">
                                                <i class="bi bi-facebook" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a href="#">
                                                <i class="bi bi-twitter" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a href="#">
                                                <i class="bi bi-instagram" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a href="#">
                                                <i class="bi bi-linkedin" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="copyright-footer">
                                    <p class="copyright color-text-a">
                                        &copy; 2024 - 2025
                                        <span class="color-a">RenMate</span> All Rights Reserved.
                                    </p>
                                </div>
                                <div class="credits">
                                    Designed by <a href="https://bootstrapmade.com/">MaiPhuong Nguyen</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </>
            </div>
        )
    }
}

export default Footer;