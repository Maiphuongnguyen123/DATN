import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import RentService from "../../services/axios/RentService";
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';

function RentManagement_Dashboard({ authenticated, currentUser, location, onLogout }) {
    const navigate = useNavigate();
    const [rentData, setRentData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchRentData();
    }, [currentPage, searchQuery]);

    const fetchRentData = async () => {
        try {
            const response = await RentService.getAllRent(currentPage, itemsPerPage);
            setRentData(response.data.content);
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching rent data:', error);
            toast.error('Không thể tải dữ liệu tiền trọ');
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddRent = () => {
        navigate('/landlord/electric_water/add');
    };

    const getPaymentStatus = (paid) => {
        return paid ?
            <span className="badge bg-success">Đã thanh toán</span> :
            <span className="badge bg-danger">Chưa thanh toán</span>;
    };

    if (!authenticated) {
        return <Navigate to="/login-landlord" state={{ from: location }} />;
    }

    return (
        <div className="wrapper">
            <nav id="sidebar" className="sidebar js-sidebar">
                <div className="sidebar-content js-simplebar">
                    <a className="sidebar-brand" href="index.html">
                        <span className="align-middle"></span>
                    </a>
                    <SidebarNav />
                </div>
            </nav>

            <div className="main">
                <Nav onLogout={onLogout} currentUser={currentUser} />

                <div className="container-fluid p-0">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Quản lý tiền trọ</h5>
                            <h6 className="card-subtitle text-muted">
                                Quản lý tiền trọ của các phòng.
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="dataTables_wrapper dt-bootstrap5">
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="dt-buttons btn-group flex-wrap">
                                            <button
                                                className="btn btn-secondary buttons-copy buttons-html5"
                                                tabindex="0" 
                                                aria-controls="datatables-buttons"
                                                type="button"
                                                onClick={handleAddRent}
                                            >
                                                Thêm tiền trọ
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="dataTables_filter">
                                            <label>
                                                Tìm kiếm:
                                                <input
                                                    type="search"
                                                    className="form-control form-control-sm"
                                                    placeholder="Tìm theo tên phòng"
                                                    value={searchQuery}
                                                    onChange={handleSearch}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <table className="table table-striped dataTable" style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Phòng</th>
                                                    <th>Tháng</th>
                                                    <th>Tổng chi phí</th>
                                                    <th>Trạng thái</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rentData.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{currentPage * itemsPerPage + index + 1}</td>
                                                        <td>{item.room?.title || ''}</td>
                                                        <td>{(() => {
                                                            const now = new Date();
                                                            let month = now.getMonth(); // getMonth trả về 0-11
                                                            let year = now.getFullYear();
                                                            if (month === 0) {
                                                                month = 12;
                                                                year = year - 1;
                                                            }
                                                            return `${month}/${year}`;
                                                        })()}</td>
                                                        <td>{(item.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</td>
                                                        <td>{getPaymentStatus(item.paid)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => navigate(`/landlord/rent-management/edit/${item.id}`)}
                                                            >
                                                                Chi tiết
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <Pagination
                                    itemsPerPage={itemsPerPage}
                                    totalItems={totalItems}
                                    currentPage={currentPage}
                                    paginate={paginate}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RentManagement_Dashboard; 