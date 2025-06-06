import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import RoomService from "../../services/axios/RoomService";
import { toast } from 'react-toastify';

function EditRentManagement({ authenticated, currentUser, location, onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roomData, setRoomData] = useState({
        title: '',
        price: 0,
        status: false,
        rentDetails: {
            roomPrice: 0,
            electricPrice: 0,
            waterPrice: 0,
            services: [],
            totalAmount: 0
        }
    });

    useEffect(() => {
        fetchRoomData();
    }, [id]);

    const fetchRoomData = async () => {
        try {
            const response = await RoomService.getRoomDetailById(id);
            const room = response.data;
            setRoomData({
                title: room.title,
                price: room.price,
                status: room.status === 'CHECKED_OUT',
                rentDetails: {
                    roomPrice: room.price || 0,
                    electricPrice: room.publicElectricCost || 0,
                    waterPrice: room.waterCost || 0,
                    services: room.services || [],
                    totalAmount: calculateTotalAmount(room)
                }
            });
        } catch (error) {
            console.error('Error fetching room data:', error);
            toast.error('Không thể tải thông tin phòng');
        }
    };

    const calculateTotalAmount = (room) => {
        const total = (room.price || 0) + 
                     (room.publicElectricCost || 0) + 
                     (room.waterCost || 0) + 
                     (room.internetCost || 0) +
                     (room.services || []).reduce((sum, service) => sum + (service.price || 0), 0);
        return total;
    };

    const handleStatusChange = async () => {
        try {
            const updatedStatus = !roomData.status;
            // Gọi API cập nhật trạng thái
            // await RentService.updateStatus(id, updatedStatus);
            setRoomData({ ...roomData, status: updatedStatus });
            toast.success('Cập nhật trạng thái thành công');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handleSave = async () => {
        try {
            // Gọi API lưu thông tin
            // await RentService.updateRent(id, roomData);
            toast.success('Lưu thông tin thành công');
            navigate('/landlord/rent-management');
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Không thể lưu thông tin');
        }
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
                            <h5 className="card-title">Chi tiết tiền trọ</h5>
                            <h6 className="card-subtitle text-muted">
                                Thông tin chi tiết tiền trọ của phòng {roomData.title}
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Tên phòng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={roomData.title}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Giá phòng</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={roomData.rentDetails.roomPrice}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tiền điện</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={roomData.rentDetails.electricPrice}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Tiền nước</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={roomData.rentDetails.waterPrice}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tổng tiền</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={roomData.rentDetails.totalAmount}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Trạng thái thanh toán</label>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={roomData.status}
                                                    onChange={handleStatusChange}
                                                />
                                                <label className="form-check-label">
                                                    {roomData.status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Dịch vụ phụ thu</label>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Tên dịch vụ</th>
                                                <th>Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roomData.rentDetails.services.map((service, index) => (
                                                <tr key={index}>
                                                    <td>{service.name}</td>
                                                    <td>{service.price.toLocaleString('vi-VN')} VNĐ</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={handleSave}
                                    >
                                        Lưu thay đổi
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/landlord/rent-management')}
                                    >
                                        Quay lại
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditRentManagement; 