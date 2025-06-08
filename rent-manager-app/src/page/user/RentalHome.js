import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import Pagination from "./Pagnation";
import { getAllRoomOfCustomer } from "../../services/fetch/ApiUtils";

const RentalHome = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [totalItems, setTotalItems] = useState(0);
    const [rooms, setRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cateId, setCateId] = useState(0);

    // States cho price range
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceFilter, setPriceFilter] = useState('');

    // States cho area range
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');
    const [areaFilter, setAreaFilter] = useState('');

    // States cho địa chỉ
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [locationFilter, setLocationFilter] = useState({
        province: '',
        district: '',
        ward: ''
    });

    // Preset ranges
    const priceRanges = [
        { label: 'Dưới 2 triệu', min: 0, max: 2000000 },
        { label: '2 - 4 triệu', min: 2000000, max: 4000000 },
        { label: '4 - 6 triệu', min: 4000000, max: 6000000 },
        { label: 'Trên 6 triệu', min: 6000000, max: null }
    ];

    const areaRanges = [
        { label: 'Dưới 20m²', min: 0, max: 20 },
        { label: '20 - 30m²', min: 20, max: 30 },
        { label: '30 - 50m²', min: 30, max: 50 },
        { label: 'Trên 50m²', min: 50, max: null }
    ];

    useEffect(() => {
        fetchData();
    }, [currentPage, searchQuery, priceFilter, areaFilter, cateId, locationFilter]);

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchData = () => {
        // Format price filter
        let priceValue = null;
        if (priceFilter) {
            const [min, max] = priceFilter.split('-');
            priceValue = min; // Sử dụng giá min làm giá tham chiếu
        }

        // Format area filter
        let areaValue = null;
        if (areaFilter) {
            const [min, max] = areaFilter.split('-');
            areaValue = min; // Sử dụng diện tích min làm tham chiếu
        }

        getAllRoomOfCustomer(
            currentPage, 
            itemsPerPage, 
            searchQuery, 
            priceValue,
            areaValue, 
            cateId
        ).then(response => {
            setRooms(response.content);
            setTotalItems(response.totalElements);
        }).catch(
            error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            }
        )
    }

    const fetchProvinces = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            setProvinces(response.data);
        } catch (error) {
            toast.error('Không thể tải danh sách tỉnh/thành phố');
        }
    };

    const fetchDistricts = async (provinceCode) => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            setDistricts(response.data.districts);
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
        } catch (error) {
            toast.error('Không thể tải danh sách quận/huyện');
        }
    };

    const fetchWards = async (districtCode) => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            setWards(response.data.wards);
            setSelectedWard('');
        } catch (error) {
            toast.error('Không thể tải danh sách phường/xã');
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCateId(event.target.value);
    };

    // Handlers cho price filter
    const handleApplyPriceFilter = () => {
        if (minPrice && maxPrice && parseInt(minPrice) > parseInt(maxPrice)) {
            toast.error('Giá từ không được lớn hơn giá đến');
            return;
        }
        const priceRange = `${minPrice}-${maxPrice}`;
        setPriceFilter(priceRange);
        setShowPriceModal(false);
    };

    const handleClearPriceFilter = () => {
        setMinPrice('');
        setMaxPrice('');
        setPriceFilter('');
        setShowPriceModal(false);
    };

    // Handlers cho area filter
    const handleApplyAreaFilter = () => {
        if (minArea && maxArea && parseInt(minArea) > parseInt(maxArea)) {
            toast.error('Diện tích từ không được lớn hơn diện tích đến');
            return;
        }
        const areaRange = `${minArea}-${maxArea}`;
        setAreaFilter(areaRange);
        setShowAreaModal(false);
    };

    const handleClearAreaFilter = () => {
        setMinArea('');
        setMaxArea('');
        setAreaFilter('');
        setShowAreaModal(false);
    };

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        if (provinceCode) {
            fetchDistricts(provinceCode);
        } else {
            setDistricts([]);
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
        }
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);
        if (districtCode) {
            fetchWards(districtCode);
        } else {
            setWards([]);
            setSelectedWard('');
        }
    };

    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
    };

    const handleApplyLocationFilter = () => {
        const selectedProvinceName = provinces.find(p => p.code === parseInt(selectedProvince))?.name || '';
        const selectedDistrictName = districts.find(d => d.code === parseInt(selectedDistrict))?.name || '';
        const selectedWardName = wards.find(w => w.code === parseInt(selectedWard))?.name || '';

        setLocationFilter({
            province: selectedProvinceName,
            district: selectedDistrictName,
            ward: selectedWardName
        });
        setShowLocationModal(false);
    };

    const handleClearLocationFilter = () => {
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
        setDistricts([]);
        setWards([]);
        setLocationFilter({
            province: '',
            district: '',
            ward: ''
        });
        setShowLocationModal(false);
    };

    // Format price display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Header authenticated={props.authenticated} currentUser={props.currentUser} onLogout={props.onLogout} />
            <main id="main">
                <section className="intro-single">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-lg-8">
                                <div className="title-single-box">
                                    <h1 className="title-single">PHÒNG TRỌ</h1>
                                    <span className="color-text-a">Danh sách phòng trọ cho thuê</span>
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-4">
                                <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="/">Trang chủ</a>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="property-grid grid">
                    <div className="container">
                        <div className="row" style={{ marginBottom: "15px" }}>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="searchQuery"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Tên phòng"
                                />
                            </div>
                            <div className="col-sm-3">
                                <select
                                    className="form-control"
                                    value={cateId}
                                    onChange={handleCategoryChange}
                                >
                                    <option value={0}>Tất cả loại phòng</option>
                                    <option value={1}>Phòng trọ</option>
                                    <option value={2}>Chung cư mini</option>
                                    <option value={3}>Nhà nguyên căn</option>
                                </select>
                            </div>
                        </div>
                        <div className="row" style={{ marginBottom: "30px" }}>
                            <div className="col-sm-4">
                                <button 
                                    className="btn btn-outline-primary w-100"
                                    onClick={() => setShowPriceModal(true)}
                                >
                                    {!priceFilter ? 'Chọn khoảng giá' : (
                                        `${formatPrice(parseInt(minPrice))} - ${formatPrice(parseInt(maxPrice))}`
                                    )}
                                </button>
                            </div>
                            <div className="col-sm-4">
                                <button 
                                    className="btn btn-outline-primary w-100"
                                    onClick={() => setShowAreaModal(true)}
                                >
                                    {!areaFilter ? 'Chọn diện tích' : (
                                        `${minArea}m² - ${maxArea}m²`
                                    )}
                                </button>
                            </div>
                            <div className="col-sm-4">
                                <button 
                                    className="btn btn-outline-primary w-100"
                                    onClick={() => setShowLocationModal(true)}
                                >
                                    {!locationFilter.province ? 'Chọn địa chỉ' : (
                                        `${locationFilter.province}${locationFilter.district ? ` - ${locationFilter.district}` : ''}${locationFilter.ward ? ` - ${locationFilter.ward}` : ''}`
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Modal cho price filter */}
                        {showPriceModal && (
                            <div className="modal-overlay" style={styles.modalOverlay}>
                                <div className="modal-content" style={styles.modalContent}>
                                    <div className="modal-header" style={styles.modalHeader}>
                                        <h5>Chọn khoảng giá</h5>
                                        <button 
                                            onClick={() => setShowPriceModal(false)}
                                            style={styles.closeButton}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="modal-body" style={styles.modalBody}>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Giá từ</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="VD: 2000000"
                                                        value={minPrice}
                                                        onChange={(e) => setMinPrice(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Đến</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="VD: 4000000"
                                                        value={maxPrice}
                                                        onChange={(e) => setMaxPrice(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <p>Khoảng giá phổ biến:</p>
                                            <div className="row g-2">
                                                {priceRanges.map((range, index) => (
                                                    <div className="col-6" key={index}>
                                                        <button 
                                                            className="btn btn-outline-secondary w-100"
                                                            onClick={() => {
                                                                setMinPrice(range.min.toString());
                                                                setMaxPrice(range.max ? range.max.toString() : '');
                                                            }}
                                                        >
                                                            {range.label}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer" style={styles.modalFooter}>
                                        <button 
                                            className="btn btn-link"
                                            onClick={handleClearPriceFilter}
                                        >
                                            Xóa bộ lọc
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => setShowPriceModal(false)}
                                        >
                                            Đóng
                                        </button>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={handleApplyPriceFilter}
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal cho area filter */}
                        {showAreaModal && (
                            <div className="modal-overlay" style={styles.modalOverlay}>
                                <div className="modal-content" style={styles.modalContent}>
                                    <div className="modal-header" style={styles.modalHeader}>
                                        <h5>Chọn diện tích</h5>
                                        <button 
                                            onClick={() => setShowAreaModal(false)}
                                            style={styles.closeButton}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="modal-body" style={styles.modalBody}>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Diện tích từ</label>
                                                    <div className="input-group">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="VD: 20"
                                                            value={minArea}
                                                            onChange={(e) => setMinArea(e.target.value)}
                                                        />
                                                        <span className="input-group-text">m²</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Đến</label>
                                                    <div className="input-group">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="VD: 30"
                                                            value={maxArea}
                                                            onChange={(e) => setMaxArea(e.target.value)}
                                                        />
                                                        <span className="input-group-text">m²</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <p>Diện tích phổ biến:</p>
                                            <div className="row g-2">
                                                {areaRanges.map((range, index) => (
                                                    <div className="col-6" key={index}>
                                                        <button 
                                                            className="btn btn-outline-secondary w-100"
                                                            onClick={() => {
                                                                setMinArea(range.min.toString());
                                                                setMaxArea(range.max ? range.max.toString() : '');
                                                            }}
                                                        >
                                                            {range.label}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer" style={styles.modalFooter}>
                                        <button 
                                            className="btn btn-link"
                                            onClick={handleClearAreaFilter}
                                        >
                                            Xóa bộ lọc
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => setShowAreaModal(false)}
                                        >
                                            Đóng
                                        </button>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={handleApplyAreaFilter}
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal cho location filter */}
                        {showLocationModal && (
                            <div className="modal-overlay" style={styles.modalOverlay}>
                                <div className="modal-content" style={styles.modalContent}>
                                    <div className="modal-header" style={styles.modalHeader}>
                                        <h5>Chọn địa chỉ</h5>
                                        <button 
                                            onClick={() => setShowLocationModal(false)}
                                            style={styles.closeButton}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="modal-body" style={styles.modalBody}>
                                        <div className="form-group mb-3">
                                            <label>Tỉnh/Thành phố</label>
                                            <select
                                                className="form-control"
                                                value={selectedProvince}
                                                onChange={handleProvinceChange}
                                            >
                                                <option value="">Chọn Tỉnh/Thành phố</option>
                                                {provinces.map(province => (
                                                    <option key={province.code} value={province.code}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label>Quận/Huyện</label>
                                            <select
                                                className="form-control"
                                                value={selectedDistrict}
                                                onChange={handleDistrictChange}
                                                disabled={!selectedProvince}
                                            >
                                                <option value="">Chọn Quận/Huyện</option>
                                                {districts.map(district => (
                                                    <option key={district.code} value={district.code}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label>Phường/Xã</label>
                                            <select
                                                className="form-control"
                                                value={selectedWard}
                                                onChange={handleWardChange}
                                                disabled={!selectedDistrict}
                                            >
                                                <option value="">Chọn Phường/Xã</option>
                                                {wards.map(ward => (
                                                    <option key={ward.code} value={ward.code}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer" style={styles.modalFooter}>
                                        <button 
                                            className="btn btn-link"
                                            onClick={handleClearLocationFilter}
                                        >
                                            Xóa bộ lọc
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => setShowLocationModal(false)}
                                        >
                                            Đóng
                                        </button>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={handleApplyLocationFilter}
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row">
                            {rooms.map(room => (
                                <div className="col-md-4">
                                    <div className="card-box-a card-shadow">
                                        <div className="img-box-a">
                                            {room.roomMedia[0] ?
                                                <img src={"http://localhost:8080/document/"+room.roomMedia[0].files} alt="" className="img-a img-fluid" style={{ width: "350px", height: "450px" }} />
                                                :
                                                <img src="assets/img/property-1.jpg" alt="" className="img-a img-fluid" style={{ width: "350px", height: "350px" }} />
                                            }
                                        </div>
                                        <div className="card-overlay">
                                            <div className="card-overlay-a-content">
                                                <div className="card-header-a">
                                                    <h2 className="card-title-a">
                                                        <Link to={`/rental-home/${room.id}`}>
                                                            <b>{room.title}</b>
                                                            <br /> <small>{room.description}</small>
                                                        </Link>
                                                    </h2>
                                                </div>
                                                <div className="card-body-a">
                                                    <div className="price-box d-flex">
                                                        <span className="price-a">
                                                            {room.status === "ROOM_RENT" && `Cho thuê |  ${room.price.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}`}
                                                            {room.status === "HIRED" && `Đã thuê | ${room.price.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}`}
                                                            {room.status === "CHECKED_OUT" && `Đã trả phòng | ${room.price.toLocaleString('vi-VN', {
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
                                                            <h4 className="card-info-title">Vị trí</h4>
                                                            <span>{room.addressLocation?.cityName || 'Chưa có thông tin'}
                                                                <sup></sup>
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <h4 className="card-info-title">Loại</h4>
                                                            <span>{room.category?.name || 'Chưa có thông tin'}</span>
                                                        </li>
                                                        <li>
                                                            <h4 className="card-info-title">Người cho thuê</h4>
                                                            <span>{room.user?.name || 'Chưa có thông tin'}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            paginate={paginate}
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

// Styles cho modal
const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
    },
    modalHeader: {
        padding: '1rem',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    modalBody: {
        padding: '1rem'
    },
    modalFooter: {
        padding: '1rem',
        borderTop: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem'
    },
    closeButton: {
        border: 'none',
        background: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer'
    }
};

export default RentalHome;