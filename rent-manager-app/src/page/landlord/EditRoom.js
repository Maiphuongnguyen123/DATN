import { Navigate, useParams } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import { useEffect, useState } from 'react';
import RoomService from "../../services/axios/RoomService";
import { toast } from 'react-toastify';
import { getRoom } from '../../services/fetch/ApiUtils';
import PlacesWithStandaloneSearchBox from './map/StandaloneSearchBox';
import LocationService from '../../services/axios/LocationService';

function EditRoom(props) {
    const { authenticated, role, currentUser, location, onLogout } = props;
    const { id } = useParams();

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
        assets: [
            { name: '', number: '' }
        ],
        services: [
            { name: '', price: '' }
        ],
        files: [],
        waterCost: 0,
        publicElectricCost: 0,
        internetCost: 0
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

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
            assets: prevState.assets?.map((asset, i) =>
                i === index ? { ...asset, [name]: value } : asset
            )
        }));
    };
    // const handleAssetChange = (event, index) => {
    //     const { name, value } = event.target;
    //     setRoomData(prevState => ({
    //         ...prevState,
    //         assets: (prevState.assets || []).map((asset, i) =>
    //             i === index ? { ...asset, [name]: value } : asset
    //         )
    //     }));
    // };

    const handleFileChange = (event) => {
        setRoomData(prevState => ({
            ...prevState,
            files: [...prevState.files, ...event.target.files]
        }));
    };

    const handleServiceChange = (event, index) => {
        const { name, value } = event.target;
        setRoomData(prevState => ({
            ...prevState,
            services: prevState.services?.map((service, i) =>
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch room data
                const room = await getRoom(id);
                setRoomData(prevState => ({
                    ...prevState,
                    ...room
                }));

                // Fetch provinces
                const provincesData = await LocationService.getProvinces();
                setProvinces(provincesData);

                // If room has addressLocation
                if (room.addressLocation) {
                    // Set selected province and fetch districts
                    setSelectedProvince(room.addressLocation.cityCode);
                    const districtsData = await LocationService.getDistrictsByProvince(room.addressLocation.cityCode);
                    setDistricts(districtsData);

                    // Set selected district and fetch wards
                    setSelectedDistrict(room.addressLocation.districtCode);
                    const wardsData = await LocationService.getWardsByDistrict(room.addressLocation.districtCode);
                    setWards(wardsData);

                    // Set selected ward
                    setSelectedWard(room.addressLocation.wardCode);

                    // Update roomData with address details
                    setRoomData(prev => ({
                        ...prev,
                        street: room.addressLocation.street,
                        addressDetail: room.addressLocation.addressDetail
                    }));
                }
            } catch (error) {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            }
        };
        fetchData();
    }, [id]);

    // Handle province change
    const handleProvinceChange = async (event) => {
        const provinceCode = event.target.value;
        setSelectedProvince(provinceCode);
        
        // Cập nhật roomData với cityCode mới
        setRoomData(prev => ({
            ...prev,
            addressLocation: {
                ...prev.addressLocation,
                cityCode: provinceCode,
                cityName: provinces.find(p => p.code === provinceCode)?.name || ''
            }
        }));

        if (provinceCode) {
            try {
                const data = await LocationService.getDistrictsByProvince(provinceCode);
                setDistricts(data);
                setSelectedDistrict('');
                setWards([]);
            } catch (error) {
                toast.error('Không thể tải danh sách quận/huyện');
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
    };

    // Handle district change
    const handleDistrictChange = async (event) => {
        const districtCode = event.target.value;
        setSelectedDistrict(districtCode);
        
        // Cập nhật roomData với districtCode mới
        setRoomData(prev => ({
            ...prev,
            addressLocation: {
                ...prev.addressLocation,
                districtCode: districtCode,
                districtName: districts.find(d => d.code === districtCode)?.name || ''
            }
        }));

        if (districtCode) {
            try {
                const data = await LocationService.getWardsByDistrict(districtCode);
                setWards(data);
                setSelectedWard('');
            } catch (error) {
                toast.error('Không thể tải danh sách phường/xã');
            }
        } else {
            setWards([]);
        }
    };

    // Handle ward change
    const handleWardChange = (event) => {
        const wardCode = event.target.value;
        const selectedWardData = wards.find(w => w.code === wardCode);
        
        setSelectedWard(wardCode);
        
        // Cập nhật roomData với wardCode mới
        setRoomData(prev => ({
            ...prev,
            addressLocation: {
                ...prev.addressLocation,
                wardCode: wardCode,
                wardName: selectedWardData?.name || ''
            }
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate required fields
        if (!roomData.addressLocation?.cityCode || !roomData.addressLocation?.districtCode || !roomData.addressLocation?.wardCode) {
            toast.error('Vui lòng chọn đầy đủ địa chỉ (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã)');
            return;
        }

        const formData = new FormData();

        // Thông tin cơ bản của phòng
        formData.append('title', roomData.title);
        formData.append('description', roomData.description);
        formData.append('price', roomData.price);

        // Format địa chỉ - bỏ số 0 ở đầu
        formData.append('city', roomData.addressLocation.cityCode.replace(/^0+/, ''));
        formData.append('district', roomData.addressLocation.districtCode.replace(/^0+/, ''));
        formData.append('ward', roomData.addressLocation.wardCode.replace(/^0+/, ''));
        formData.append('street', roomData.street);
        formData.append('addressDetail', roomData.addressDetail);

        // Format địa chỉ đầy đủ
        const selectedProvince = provinces.find(p => p.code === roomData.addressLocation.cityCode)?.name || '';
        const selectedDistrict = districts.find(d => d.code === roomData.addressLocation.districtCode)?.name || '';
        const selectedWard = wards.find(w => w.code === roomData.addressLocation.wardCode)?.name || '';
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

        // Thông tin thiết bị
        formData.append('asset', roomData.assets?.length || 0);
        roomData.assets?.forEach((asset, index) => {
            formData.append(`assets[${index}][name]`, asset.name);
            formData.append(`assets[${index}][number]`, asset.number);
        });

        // Thông tin dịch vụ
        formData.append('service', roomData.services?.length || 0);
        roomData.services?.forEach((service, index) => {
            formData.append(`services[${index}][name]`, service.name);
            formData.append(`services[${index}][price]`, service.price);
        });

        // Thông tin files
        roomData.files?.forEach((file) => {
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

        // Gọi API cập nhật phòng
        RoomService.updateRoom(id, formData)
            .then(response => {
                toast.success(response.message);
                toast.success("Cập nhật thông tin phòng thành công.");
            })
            .catch(error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            });
    };
    console.log("roomData", roomData);
    if (!authenticated) {
        return <Navigate
        to="/login-landlord"
        state={{ from: location }}
    />;
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
                                <h5 className="card-title mb-0">Cập nhật thông tin phòng</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Tiêu đề phòng</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="title" 
                                                value={roomData.title} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Giá/tháng (đơn vị VND)</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                name="price" 
                                                value={roomData.price} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <textarea 
                                            className="form-control" 
                                            name="description" 
                                            rows="3" 
                                            value={roomData.description} 
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <div className="card-header">
                                            <h5 className="card-title">Thiết bị trong phòng</h5>
                                    </div>
                                    <br />
                                    {roomData.assets?.map((asset, index) => (
                                        <div key={index} className="row">
                                            <div className="mb-3 col-md-6">
                                                <label className="form-label" htmlFor={`assetName${index}`}>Tên tài sản {index + 1}</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id={`assetName${index}`} 
                                                        name="name" 
                                                        value={asset.name} 
                                                        onChange={(event) => handleAssetChange(event, index)} 
                                                    />
                                            </div>
                                            <div className="mb-3 col-md-4">
                                                <label className="form-label" htmlFor={`assetNumber${index}`}>Số lượng</label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        id={`assetNumber${index}`} 
                                                        name="number" 
                                                        value={asset.number} 
                                                        onChange={(event) => handleAssetChange(event, index)} 
                                                    />
                                            </div>
                                            <div className="col-md-2">
                                                    <button 
                                                        type="button" 
                                                        style={{ marginTop: "34px" }} 
                                                        className="btn btn-danger" 
                                                        onClick={() => handleRemoveAsset(index)}
                                                    >
                                                        Xóa tài sản
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            className="btn btn-success" 
                                            onClick={() => setRoomData(prevState => ({ 
                                                ...prevState, 
                                                assets: [...prevState.assets, { name: '', number: '' }] 
                                            }))}
                                        >
                                            Thêm tài sản
                                        </button>
                                        <br /><br />

                                        <div className="card-header">
                                            <h5 className="card-title">Dịch vụ</h5>
                                    </div>
                                    <br />
                                    {roomData.services?.map((service, index) => (
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
                                                services: [...(prevState.services || []), { name: '', price: '' }] 
                                        }))}
                                    >
                                        Thêm dịch vụ
                                    </button>
                                    <br /><br />
                                    </div>

                                    <div className="mb-3">
                                        <div className="card-header">
                                            <h5 className="card-title">Vị trí trọ</h5>
                                        </div>
                                        <div className="card-body" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '20px', marginTop: '15px' }}>
                                            <div className="row mb-3">
                                                <div className="col-md-3">
                                                    <label className="form-label" style={{ fontWeight: '500', color: '#495057' }}>Thành phố/Tỉnh</label>
                                                    <select 
                                                        className="form-select" 
                                                        value={roomData.addressLocation?.cityCode || selectedProvince}
                                                        onChange={handleProvinceChange}
                                                        style={{ height: '42px', borderRadius: '6px', border: '1px solid #ced4da' }}
                                                    >
                                                        <option value="">Chọn Thành phố/Tỉnh</option>
                                                        {provinces.map(province => (
                                                            <option key={province.code} value={province.code}>
                                                                {province.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label" style={{ fontWeight: '500', color: '#495057' }}>Quận/Huyện</label>
                                                    <select 
                                                        className="form-select"
                                                        value={roomData.addressLocation?.districtCode || selectedDistrict}
                                                        onChange={handleDistrictChange}
                                                        style={{ height: '42px', borderRadius: '6px', border: '1px solid #ced4da' }}
                                                    >
                                                        <option value="">Chọn Quận/Huyện</option>
                                                        {districts.map(district => (
                                                            <option key={district.code} value={district.code}>
                                                                {district.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label" style={{ fontWeight: '500', color: '#495057' }}>Phường/Xã</label>
                                                    <select 
                                                        className="form-select"
                                                        value={roomData.addressLocation?.wardCode || selectedWard}
                                                        onChange={handleWardChange}
                                                        style={{ height: '42px', borderRadius: '6px', border: '1px solid #ced4da' }}
                                                    >
                                                        <option value="">Chọn Phường/Xã</option>
                                                        {wards.map(ward => (
                                                            <option key={ward.code} value={ward.code}>
                                                                {ward.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label" style={{ fontWeight: '500', color: '#495057' }}>Đường</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        name="street"
                                                        value={roomData.street || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Nhập tên đường"
                                                        style={{ height: '42px', borderRadius: '6px', border: '1px solid #ced4da' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label" style={{ fontWeight: '500', color: '#495057' }}>Địa chỉ chi tiết</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="address"
                                                    value={roomData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="Ngõ, ngách, số nhà"
                                                    style={{ height: '42px', borderRadius: '6px', border: '1px solid #ced4da' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Tải Hình Ảnh</label>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {roomData.roomMedia?.map((media, index) => (
                                                <img 
                                                    key={index}
                                                    src={"http://localhost:8080/document/"+media.files} 
                                                    alt={`Room image ${index + 1}`}
                                                    style={{
                                                        width: "150px",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            name="files" 
                                            multiple 
                                            onChange={handleFileChange} 
                                            accept="image/*"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-success">
                                        Lưu thay đổi
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditRoom;