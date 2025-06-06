import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import RoomService from "../../services/axios/RoomService";
import RentService from "../../services/axios/RentService";
import { toast } from 'react-toastify';

function RentManagement(props) {
    const { authenticated, currentUser, location, onLogout } = props;

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [rentData, setRentData] = useState({
        roomPrice: 0,
        discount: 0,
        services: [],
        totalAmount: 0
    });

    // Fetch danh sách phòng khi component mount
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await RoomService.getAllRooms();
                // Chuyển đổi dữ liệu để hiển thị trong select
                const formattedRooms = response.data.content.map(room => ({
                    id: room.id,
                    title: room.title,
                    price: room.price,
                    services: room.services || []
                }));
                setRooms(formattedRooms);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                toast.error('Không thể tải danh sách phòng');
            }
        };
        fetchRooms();
    }, []);

    // Xử lý khi chọn phòng
    const handleRoomSelect = async (event) => {
        const roomId = event.target.value;
        if (!roomId) {
            setSelectedRoom('');
            setRentData({
                roomPrice: 0,
                discount: 0,
                services: [],
                totalAmount: 0
            });
            return;
        }

        try {
            const response = await RoomService.getRoomDetailById(roomId);
            const roomDetail = response.data;
            
            setSelectedRoom(roomId);
            setRentData({
                roomPrice: roomDetail.price,
                discount: 0,
                services: roomDetail.services.map(service => ({
                    id: service.id,
                    name: service.name,
                    price: service.price,
                    quantity: 0,
                    total: 0
                })),
                totalAmount: roomDetail.price
            });
        } catch (error) {
            console.error('Error fetching room details:', error);
            toast.error('Không thể lấy thông tin chi tiết phòng');
        }
    };

    // Xử lý thay đổi giá phòng
    const handlePriceChange = (event) => {
        const newPrice = parseFloat(event.target.value) || 0;
        setRentData(prev => ({
            ...prev,
            roomPrice: newPrice,
            totalAmount: calculateTotal(newPrice, prev.discount, prev.services)
        }));
    };

    // Xử lý thay đổi giảm giá
    const handleDiscountChange = (event) => {
        const newDiscount = parseFloat(event.target.value) || 0;
        setRentData(prev => ({
            ...prev,
            discount: newDiscount,
            totalAmount: calculateTotal(prev.roomPrice, newDiscount, prev.services)
        }));
    };

    // Xử lý thay đổi số lượng dịch vụ
    const handleServiceQuantityChange = (index, event) => {
        const quantity = parseFloat(event.target.value) || 0;
        const updatedServices = rentData.services.map((service, i) => {
            if (i === index) {
                return {
                    ...service,
                    quantity: quantity,
                    total: quantity * service.price
                };
            }
            return service;
        });

        setRentData(prev => ({
            ...prev,
            services: updatedServices,
            totalAmount: calculateTotal(prev.roomPrice, prev.discount, updatedServices)
        }));
    };

    // Xử lý thay đổi đơn giá dịch vụ
    const handleServicePriceChange = (index, event) => {
        const price = parseFloat(event.target.value) || 0;
        const updatedServices = rentData.services.map((service, i) => {
            if (i === index) {
                return {
                    ...service,
                    price: price,
                    total: service.quantity * price
                };
            }
            return service;
        });

        setRentData(prev => ({
            ...prev,
            services: updatedServices,
            totalAmount: calculateTotal(prev.roomPrice, prev.discount, updatedServices)
        }));
    };

    // Xử lý thay đổi ghi chú dịch vụ
    const handleServiceNoteChange = (index, event) => {
        const note = event.target.value;
        const updatedServices = rentData.services.map((service, i) => {
            if (i === index) {
                return {
                    ...service,
                    note: note
                };
            }
            return service;
        });

        setRentData(prev => ({
            ...prev,
            services: updatedServices
        }));
    };

    // Tính tổng tiền
    const calculateTotal = (roomPrice, discount, services) => {
        const servicesTotal = services.reduce((sum, service) => sum + (service.total || 0), 0);
        return roomPrice - discount + servicesTotal;
    };

    // Xử lý submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!selectedRoom) {
            toast.error('Vui lòng chọn phòng');
            return;
        }

        try {
            const submitData = {
                roomId: selectedRoom,
                roomPrice: rentData.roomPrice,
                discount: rentData.discount,
                services: rentData.services.map(service => ({
                    id: service.id,
                    name: service.name,
                    quantity: service.quantity,
                    price: service.price,
                    total: service.total,
                    note: service.note
                })),
                totalAmount: rentData.totalAmount
            };

            await RentService.saveRentData(submitData);
            
            // Refresh room data after successful submission
            const response = await RoomService.getAllRooms();
            const formattedRooms = response.data.content.map(room => ({
                id: room.id,
                title: room.title,
                price: room.price,
                services: room.services || []
            }));
            setRooms(formattedRooms);
            
            // Reset form
            setSelectedRoom('');
            setRentData({
                roomPrice: 0,
                discount: 0,
                services: [],
                totalAmount: 0
            });

            toast.success('Lưu thông tin thành công');
        } catch (error) {
            console.error('Error saving rent data:', error);
            toast.error('Có lỗi xảy ra khi lưu thông tin');
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
                            <h5 className="card-title">Thêm tiền trọ</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Chọn phòng</label>
                                    <select 
                                        className="form-select" 
                                        value={selectedRoom} 
                                        onChange={handleRoomSelect}
                                    >
                                        <option value="">Chọn phòng</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Tiền trọ (theo hợp đồng)</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={rentData.roomPrice} 
                                        onChange={handlePriceChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Giảm giá (nếu có)</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={rentData.discount} 
                                        onChange={handleDiscountChange}
                                    />
                                </div>

                                <div className="card-header">
                                    <h5 className="card-title">Các dịch vụ:</h5>
                                </div>
                                
                                {rentData.services.map((service, index) => (
                                    <div key={index} className="row mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label">{service.name}</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                placeholder="Số lượng"
                                                value={service.quantity}
                                                onChange={(e) => handleServiceQuantityChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Đơn giá</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                value={service.price}
                                                onChange={(e) => handleServicePriceChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Ghi chú</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Ghi chú"
                                                value={service.note || ''}
                                                onChange={(e) => handleServiceNoteChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Thành tiền</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                value={service.total}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="mb-3">
                                    <label className="form-label">Tổng chi phí</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={rentData.totalAmount}
                                        readOnly
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RentManagement; 