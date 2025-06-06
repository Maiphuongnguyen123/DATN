import { Navigate, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import { useState, useEffect } from 'react';
import RoomService from "../../services/axios/RoomService";
import LocationService from "../../services/axios/LocationService";
import { toast } from 'react-toastify';
import PlacesWithStandaloneSearchBox from './map/StandaloneSearchBox';

function AddRoom(props) {
    const { authenticated, role, currentUser, location, onLogout } = props;
    const navigate = useNavigate();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [roomData, setRoomData] = useState({
        title: '',
        description: '',
        price: 0,
        latitude: 0.0,
        longitude: 0.0,
        address: '',
        city: '',
        district: '',
        ward: '',
        street: '',
        addressDetail: '',
        categoryId: 2,
        assets: [],
        services: [],
        files: []
    });

    useEffect(() => {
        // Load tất cả các tỉnh/thành phố khi component mount
        const fetchProvinces = async () => {
            try {
                const data = await LocationService.getProvinces();
                setProvinces(data);
            } catch (error) {
                toast.error('Không thể tải danh sách tỉnh/thành phố');
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (event) => {
        const { value } = event.target;
        setRoomData(prev => ({
            ...prev,
            city: value,
            district: '',
            ward: ''
        }));

        // Load quận/huyện của tỉnh/thành phố được chọn
        if (value) {
            try {
                const data = await LocationService.getDistrictsByProvince(value);
                console.log('Selected province districts:', data);
                setDistricts(data);
                setWards([]); // Reset phường/xã
            } catch (error) {
                toast.error('Không thể tải danh sách quận/huyện');
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
    };

    const handleDistrictChange = async (event) => {
        const { value } = event.target;
        setRoomData(prev => ({
            ...prev,
            district: value,
            ward: ''
        }));

        // Load phường/xã của quận/huyện được chọn
        if (value) {
            try {
                const data = await LocationService.getWardsByDistrict(value);
                console.log('Selected district wards:', data);
                setWards(data);
            } catch (error) {
                toast.error('Không thể tải danh sách phường/xã');
            }
        } else {
            setWards([]);
        }
    };

    const handleWardChange = (event) => {
        const { value } = event.target;
        const selectedWard = wards.find(w => w.code === value);
        console.log('Selected ward:', selectedWard);
        
        setRoomData(prev => ({
            ...prev,
            ward: value
        }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRoomData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRemoveAsset = (indexToRemove) => {
        setRoomData(prevState => ({
            ...prevState,
            assets: prevState.assets.filter((asset, index) => index !== indexToRemove)
        }));
    }

    const handleAssetChange = (event, index) => {
        const { name, value } = event.target;
        setRoomData(prevState => ({
            ...prevState,
            assets: prevState.assets.map((asset, i) =>
                i === index ? { ...asset, [name]: value } : asset
            )
        }));
    };

    const handleFileChange = (event) => {
        setRoomData(prevState => ({
            ...prevState,
            files: [...prevState.files, ...event.target.files]
        }));
    };

    const setLatLong = (lat, long, address) => {
        setRoomData((prevRoomData) => ({
            ...prevRoomData,
            latitude: lat,
            longitude: long,
            address: address,
          }));
      };

    const handleServiceChange = (event, index) => {
        const { name, value } = event.target;
        setRoomData(prevState => ({
            ...prevState,
            services: prevState.services.map((service, i) =>
                i === index ? { ...service, [name]: value } : service
            )
        }));
    };

    const handleRemoveService = (indexToRemove) => {
        setRoomData(prevState => ({
            ...prevState,
            services: prevState.services.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate required fields
        if (!roomData.city || !roomData.district || !roomData.ward) {
            toast.error('Vui lòng chọn đầy đủ địa chỉ (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã)');
            return;
        }

        const formData = new FormData();
        formData.append('title', roomData.title);
        formData.append('description', roomData.description);
        formData.append('price', roomData.price);
        
        // Format địa chỉ - bỏ số 0 ở đầu
        formData.append('city', roomData.city.replace(/^0+/, ''));
        formData.append('district', roomData.district.replace(/^0+/, ''));
        formData.append('ward', roomData.ward.replace(/^0+/, ''));
        formData.append('street', roomData.street);
        formData.append('addressDetail', roomData.addressDetail);

        // Format địa chỉ đầy đủ
        const selectedProvince = provinces.find(p => p.code === roomData.city)?.name || '';
        const selectedDistrict = districts.find(d => d.code === roomData.district)?.name || '';
        const selectedWard = wards.find(w => w.code === roomData.ward)?.name || '';
        const fullAddress = [
            roomData.addressDetail,
            roomData.street,
            selectedWard,
            selectedDistrict,
            selectedProvince
        ].filter(Boolean).join(', ');
        
        // Thông tin vị trí
        formData.append('address', fullAddress);
        formData.append('latitude', roomData.latitude || 0.0);
        formData.append('longitude', roomData.longitude || 0.0);
        formData.append('locationId', roomData.locationId || 1);
        formData.append('categoryId', roomData.categoryId || 2);

        formData.append('asset', roomData.assets.length);
        formData.append('service', roomData.services.length);

        roomData.assets.forEach((asset, index) => {
            formData.append(`assets[${index}][name]`, asset.name);
            formData.append(`assets[${index}][number]`, asset.number);
        });

        roomData.services.forEach((service, index) => {
            formData.append(`services[${index}][name]`, service.name);
            formData.append(`services[${index}][price]`, service.price);
        });

        roomData.files.forEach((file) => {
            formData.append('files', file);
        });

        console.log("Submitting form data:", {
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price'),
            city: formData.get('city'),
            district: formData.get('district'),
            ward: formData.get('ward'),
            street: formData.get('street'),
            addressDetail: formData.get('addressDetail'),
            address: formData.get('address'),
            assets: roomData.assets,
            services: roomData.services
        });

        RoomService.addNewRoom(formData)
            .then(response => {
                toast.success(response.message);
                toast.success("Đăng tin thành công!!");
                setRoomData({
                    title: '',
                    description: '',
                    price: 0,
                    latitude: 0.0,
                    longitude: 0.0,
                    address: '',
                    city: '',
                    district: '',
                    ward: '',
                    street: '',
                    addressDetail: '',
                    categoryId: 2,
                    assets: [],
                    services: [],
                    files: []
                });
                navigate('/landlord/room-management');
            })
            .catch(error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            });
    };
    console.log("Add room", authenticated);
    if (!authenticated) {
        return <Navigate
            to={{
                pathname: "/login-landlord",
                state: { from: location }
            }} />;
    }
    return (
        <>
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

                    <br />
                    <div className="container-fluid p-0">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Thêm phòng</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label" htmlFor="title">Tiêu đề phòng</label>
                                            <input type="text" className="form-control" id="title" name="title" value={roomData.title} onChange={handleInputChange} />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label" htmlFor="price">Giá/ tháng (đơn vị VND)</label>
                                            <input type="number" className="form-control" id="price" name="price" value={roomData.price} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="description">Mô tả</label>
                                        <input type="text" className="form-control" id="description" name="description" value={roomData.description} onChange={handleInputChange} />
                                    </div>

                                    <div className="card-header">
                                        <h5 className="card-title">Thiết bị trong phòng</h5>
                                    </div>
                                    <br />
                                    {roomData.assets.length > 0 && roomData.assets.map((asset, index) => (
                                        <div key={index} className="row">
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor={`assetName${index}`}>Tên tài sản {index + 1}</label>
                                                <input type="text" className="form-control" id={`assetName${index}`} name="name" value={asset.name} onChange={(event) => handleAssetChange(event, index)} />
                                            </div>
                                            <div className="mb-3 col-md-4">
                                                <label className="form-label" htmlFor={`assetNumber${index}`}>Số lượng</label>
                                                <input type="number" className="form-control" id={`assetNumber${index}`} name="number" value={asset.number} onChange={(event) => handleAssetChange(event, index)} />
                                            </div>
                                            <div className="col-md-2">
                                                <button type="button" style={{ marginTop: "34px" }} className="btn btn-danger" onClick={() => handleRemoveAsset(index)}>Xóa tài sản</button>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-success" onClick={() => setRoomData(prevState => ({ ...prevState, assets: [...prevState.assets, { name: '', number: '' }] }))}>Thêm tài sản</button>
                                    <br /><br />

                                    <div className="card-header">
                                        <h5 className="card-title">Dịch vụ</h5>
                                    </div>
                                    <br />
                                    {roomData.services.length > 0 && roomData.services.map((service, index) => (
                                        <div key={index} className="row">
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor={`serviceName${index}`}>Tên dịch vụ {index + 1}</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id={`serviceName${index}`} 
                                                    name="name" 
                                                    value={service.name} 
                                                    onChange={(event) => handleServiceChange(event, index)} 
                                                />
                                            </div>
                                            <div className="mb-3 col-md-4">
                                                <label className="form-label" htmlFor={`servicePrice${index}`}>Đơn giá</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    id={`servicePrice${index}`} 
                                                    name="price" 
                                                    value={service.price} 
                                                    onChange={(event) => handleServiceChange(event, index)} 
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <button 
                                                    type="button" 
                                                    style={{ marginTop: "34px" }} 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleRemoveService(index)}
                                                >
                                                    Xóa dịch vụ
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        className="btn btn-success" 
                                        onClick={() => setRoomData(prevState => ({ 
                                            ...prevState, 
                                            services: [...prevState.services, { name: '', price: '' }] 
                                        }))}
                                    >
                                        Thêm dịch vụ
                                    </button>
                                    <br /><br />

                                    <div className="card-header">
                                        <h5 className="card-title">Vị trí trọ</h5>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="mb-3 col-md-3">
                                            <label className="form-label">Thành phố/ Tỉnh</label>
                                            <select 
                                                className="form-select" 
                                                name="city" 
                                                value={roomData.city} 
                                                onChange={handleProvinceChange}
                                            >
                                                <option value="">Chọn Thành phố / Tỉnh</option>
                                                {provinces.map(province => (
                                                    <option key={province.code} value={province.code}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label className="form-label">Quận/ Huyện</label>
                                            <select 
                                                className="form-select" 
                                                name="district" 
                                                value={roomData.district}
                                                onChange={handleDistrictChange}
                                                disabled={!roomData.city}
                                            >
                                                <option value="">Chọn Quận / Huyện</option>
                                                {districts.map(district => (
                                                    <option key={district.code} value={district.code}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label className="form-label">Phường/ Xã</label>
                                            <select 
                                                className="form-select" 
                                                name="ward" 
                                                value={roomData.ward}
                                                onChange={handleWardChange}
                                                disabled={!roomData.district}
                                            >
                                                <option value="">Chọn Phường / Xã</option>
                                                {wards.map(ward => (
                                                    <option key={ward.code} value={ward.code}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label className="form-label">Đường</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="street" 
                                                value={roomData.street} 
                                                onChange={handleInputChange} 
                                                placeholder="Đường"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ chi tiết</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="addressDetail" 
                                            value={roomData.addressDetail} 
                                            onChange={handleInputChange}
                                            placeholder="Ngõ, ngách, số nhà" 
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="mb-3">
                                            <label className="form-label">Tải Hình Ảnh</label>
                                            <input className="form-control" type="file" name="files" multiple onChange={handleFileChange} />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

        </>
    )
} 

export default AddRoom;