import { Navigate } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import { useState } from 'react';
import RoomService from "../../services/axios/RoomService";
import { toast } from 'react-toastify';

function AddRoom(props) {
    const { authenticated, role, currentUser, location, onLogout } = props;

    const [roomData, setRoomData] = useState({
        title: '',
        description: '',
        price: 0,
        service: [{ name: '', price: 0 }],
        equipment: [{ name: '', qty: 0 }],
        files: [],
    });

    const [roomLocation, setRoomLocation] = useState({
        city: '',
        district: '',
        ward: '',
        street: '',
        detail: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRoomData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleServiceChange = (event, index, field) => {
        const { value } = event.target;
        setRoomData(prevState => ({
            ...prevState,
            service: prevState.service.map((service, i) =>
                i === index ? { ...service, [field]: value } : service
            )
        }));
    };

    const handleAddService = () => {
        setRoomData(prevState => ({
            ...prevState,
            service: [...prevState.service, { name: '', price: 0 }]
        }));
    };

    const handleRemoveService = (index) => {
        setRoomData(prevState => ({
            ...prevState,
            service: prevState.service.filter((_, i) => i !== index)
        }));
    };

    const handleEquipmentChange = (event, index, field) => {
        const { value } = event.target;
        setRoomData(prevState => ({
            ...prevState,
            equipment: prevState.equipment.map((equipment, i) =>
                i === index ? { ...equipment, [field]: value } : equipment
            )
        }));
    };

    const handleAddEquipment = () => {
        setRoomData(prevState => ({
            ...prevState,
            equipment: [...prevState.equipment, { name: '', qty: 0 }]
        }));
    };

    const handleRemoveEquipment = (index) => {
        setRoomData(prevState => ({
            ...prevState,
            equipment: prevState.equipment.filter((_, i) => i !== index)
        }));
    };

    const handleLocationChange = (event, field) => {
        const { value } = event.target;
        setRoomLocation(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleFileChange = (event) => {
        setRoomData(prevState => ({
            ...prevState,
            files: [...prevState.files, ...event.target.files]
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', roomData.title);
        formData.append('description', roomData.description);
        formData.append('price', roomData.price);
        formData.append('location', JSON.stringify(roomLocation));
        formData.append('service', JSON.stringify(roomData.service));
        formData.append('equipment', JSON.stringify(roomData.equipment));
        formData.append('equipment', JSON.stringify(roomData.room_media));
        roomData.files.forEach(file => {
            formData.append('files', file);
        });

        RoomService.addNewRoom(formData)
            .then(response => {
                toast.success("Thêm phòng thành công!");
                setRoomData({
                    title: '',
                    description: '',
                    price: 0,
                    service: [{ name: '', price: 0 }],
                    equipment: [{ name: '', qty: 0 }],
                    files: [],
                });
                setRoomLocation({
                    city: '',
                    district: '',
                    ward: '',
                    street: '',
                    detail: '',
                });
            })
            .catch(error => {
                toast.error("Có lỗi xảy ra, vui lòng thử lại!");
            });
    };

    if (!authenticated) {
        return <Navigate to="/login-landlord" />;
    }

    return (
        <div className="wrapper">
            <nav id="sidebar" className="sidebar js-sidebar">
                <div className="sidebar-content js-simplebar">
                    <SidebarNav />
                </div>
            </nav>

            <div className="main">
                <Nav onLogout={onLogout} currentUser={currentUser} />
                <div className="container-fluid p-0">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title">Thêm phòng</h1>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Tiêu đề và giá */}
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Tiêu đề phòng</label>
                                        <input type="text" className="form-control" name="title" value={roomData.title} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Giá/ tháng (VND)</label>
                                        <input type="number" className="form-control" name="price" value={roomData.price} onChange={handleInputChange} />
                                    </div>
                                </div>

                                {/* Mô tả */}
                                <div className="mb-3">
                                    <label className="form-label">Mô tả</label>
                                    <textarea className="form-control" name="description" value={roomData.description} onChange={handleInputChange}></textarea>
                                </div>

                                {/* Dịch vụ */}
                                <div className="card-header">
                                    <h5 className="card-title">Dịch vụ</h5>
                                </div>
                                {roomData.service.map((service, index) => (
                                    <div key={index} className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Tên dịch vụ</label>
                                            <input type="text" className="form-control" value={service.name} onChange={(e) => handleServiceChange(e, index, 'name')} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Giá dịch vụ</label>
                                            <input type="number" className="form-control" value={service.price} onChange={(e) => handleServiceChange(e, index, 'price')} />
                                        </div>
                                        <div className="col-md-2">
                                            <button type="button" className="btn btn-danger" onClick={() => handleRemoveService(index)}>Xóa</button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-primary" onClick={handleAddService}>Thêm dịch vụ</button>

                                {/* Thiết bị */}
                                <div className="card-header">
                                    <h5 className="card-title">Thiết bị trong phòng</h5>
                                </div>
                                {roomData.equipment.map((equipment, index) => (
                                    <div key={index} className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Tên thiết bị</label>
                                            <input type="text" className="form-control" value={equipment.name} onChange={(e) => handleEquipmentChange(e, index, 'name')} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Số lượng</label>
                                            <input type="number" className="form-control" value={equipment.qty} onChange={(e) => handleEquipmentChange(e, index, 'qty')} />
                                        </div>
                                        <div className="col-md-2">
                                            <button type="button" className="btn btn-danger" onClick={() => handleRemoveEquipment(index)}>Xóa</button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-primary" onClick={handleAddEquipment}>Thêm thiết bị</button>

                                {/* Vị trí */}
                                <div className="card-header">
                                    <h5 className="card-title">Vị trí trọ</h5>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <label className="form-label">Thành phố</label>
                                        <select className="form-select" value={roomLocation.city} onChange={(e) => handleLocationChange(e, 'city')}>
                                            <option value="">Chọn...</option>
                                            <option value="Hanoi">Hà Nội</option>
                                            <option value="HCMC">TP. Hồ Chí Minh</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Quận</label>
                                        <select className="form-select" value={roomLocation.district} onChange={(e) => handleLocationChange(e, 'district')}>
                                            <option value="">Chọn...</option>
                                            <option value="dongda">Đống Đa</option>
                                            <option value="caugiay">Cầu Giấy</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Phường</label>
                                        <select className="form-select" value={roomLocation.ward} onChange={(e) => handleLocationChange(e, 'ward')}>
                                            <option value="">Chọn...</option>
                                            <option value="phuong1">Phường 1</option>
                                            <option value="phuong2">Phường 2</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Đường</label>
                                        <input type="text" className="form-control" value={roomLocation.street} onChange={(e) => handleLocationChange(e, 'street')} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Địa chỉ chi tiết</label>
                                    <input type="text" className="form-control" value={roomLocation.detail} onChange={(e) => handleLocationChange(e, 'detail')} />
                                </div>

                                {/* Hình ảnh */}
                                <div className="mb-3">
                                    <label className="form-label">Tải hình ảnh</label>
                                    <input className="form-control" type="file" name="files" multiple onChange={handleFileChange} />
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

export default AddRoom;