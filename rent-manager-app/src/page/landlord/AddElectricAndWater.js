import { Navigate } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getAllRoomOflandlord } from '../../services/fetch/ApiUtils'; // Thay getRentOfHome
import { ACCESS_TOKEN } from '../../constants/Connect';

const AddElectric = (props) => {
    const { authenticated, role, currentUser, location, onLogout } = props;

    const [roomOptions, setRoomOptions] = useState([]);
    const [electricData, setElectricData] = useState({
        name: '',
        month: '',
        lastMonthNumberOfElectric: '',
        thisMonthNumberOfElectric: '',
        lastMonthBlockOfWater: '',
        thisMonthBlockOfWater: '',
        moneyEachNumberOfElectric: '',
        moneyEachBlockOfWater: '',
        roomId: '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!electricData.name.trim()) newErrors.name = 'Tên hóa đơn là bắt buộc';
        if (!electricData.month) newErrors.month = 'Vui lòng chọn tháng';
        if (!electricData.roomId) newErrors.roomId = 'Vui lòng chọn phòng';
        if (!electricData.lastMonthNumberOfElectric || isNaN(electricData.lastMonthNumberOfElectric))
            newErrors.lastMonthNumberOfElectric = 'Số điện tháng trước phải là số';
        if (!electricData.thisMonthNumberOfElectric || isNaN(electricData.thisMonthNumberOfElectric))
            newErrors.thisMonthNumberOfElectric = 'Số điện tháng này phải là số';
        if (!electricData.moneyEachNumberOfElectric || isNaN(electricData.moneyEachNumberOfElectric))
            newErrors.moneyEachNumberOfElectric = 'Số tiền mỗi số điện phải là số';
        if (!electricData.lastMonthBlockOfWater || isNaN(electricData.lastMonthBlockOfWater))
            newErrors.lastMonthBlockOfWater = 'Số khối nước tháng trước phải là số';
        if (!electricData.thisMonthBlockOfWater || isNaN(electricData.thisMonthBlockOfWater))
            newErrors.thisMonthBlockOfWater = 'Số khối nước tháng này phải là số';
        if (!electricData.moneyEachBlockOfWater || isNaN(electricData.moneyEachBlockOfWater))
            newErrors.moneyEachBlockOfWater = 'Số tiền mỗi khối nước phải là số';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setElectricData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error('Vui lòng điền đầy đủ thông tin hợp lệ');
            return;
        }
        const data = {
            name: electricData.name,
            month: electricData.month,
            lastMonthNumberOfElectric: Number(electricData.lastMonthNumberOfElectric),
            thisMonthNumberOfElectric: Number(electricData.thisMonthNumberOfElectric),
            lastMonthBlockOfWater: Number(electricData.lastMonthBlockOfWater),
            thisMonthBlockOfWater: Number(electricData.thisMonthBlockOfWater),
            moneyEachNumberOfElectric: Number(electricData.moneyEachNumberOfElectric),
            moneyEachBlockOfWater: Number(electricData.moneyEachBlockOfWater),
            room: {
                id: electricData.roomId,
            },
        };
        try {
            await axios.post('http://localhost:8080/electric-water/create', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                },
            });
            toast.success('Thêm mới thành công');
            setElectricData({
                name: '',
                month: '',
                lastMonthNumberOfElectric: '',
                thisMonthNumberOfElectric: '',
                lastMonthBlockOfWater: '',
                thisMonthBlockOfWater: '',
                moneyEachNumberOfElectric: '',
                moneyEachBlockOfWater: '',
                roomId: '',
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            toast.error(errorMessage);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem(ACCESS_TOKEN);
                window.location.href = '/login-landlord';
            }
        }
    };

    useEffect(() => {
        getAllRoomOflandlord(1, 1000, '')
            .then((response) => {
                console.log('API Response:', response);
                const room = response.content || [];
                setRoomOptions(room);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || error.message || 'Không thể tải danh sách phòng!';
                toast.error(errorMessage);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem(ACCESS_TOKEN);
                    window.location.href = '/login-landlord';
                }
            });
    }, []);

    if (!authenticated) {
        return (
            <Navigate
                to={{
                    pathname: '/login-landlord',
                    state: { from: location },
                }}
            />
        );
    }

    return (
        <div className="wrapper">
            <nav id="sidebar" className="sidebar js-sidebar">
                <div className="sidebar-content js-simplebar">
                    <a className="sidebar-brand" href="index.html">
                        <span className="align-middle">landlord PRO</span>
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
                            <h5 className="card-title">Tiền điện nước</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <label className="form-label" htmlFor="name">
                                    Tên hóa đơn
                                </label>
                                <div className="row mx-1 mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        name="name"
                                        value={electricData.name}
                                        onChange={handleInputChange}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="month">
                                            Tháng sử dụng
                                        </label>
                                        <select
                                            className={`form-select ${errors.month ? 'is-invalid' : ''}`}
                                            id="month"
                                            name="month"
                                            value={electricData.month}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn...</option>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    Tháng {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.month && <div className="invalid-feedback">{errors.month}</div>}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="lastMonthNumberOfElectric">
                                            Số điện tháng trước
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.lastMonthNumberOfElectric ? 'is-invalid' : ''}`}
                                            id="lastMonthNumberOfElectric"
                                            name="lastMonthNumberOfElectric"
                                            value={electricData.lastMonthNumberOfElectric}
                                            onChange={handleInputChange}
                                        />
                                        {errors.lastMonthNumberOfElectric && (
                                            <div className="invalid-feedback">{errors.lastMonthNumberOfElectric}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="thisMonthNumberOfElectric">
                                            Số điện tháng này
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.thisMonthNumberOfElectric ? 'is-invalid' : ''}`}
                                            id="thisMonthNumberOfElectric"
                                            name="thisMonthNumberOfElectric"
                                            value={electricData.thisMonthNumberOfElectric}
                                            onChange={handleInputChange}
                                        />
                                        {errors.thisMonthNumberOfElectric && (
                                            <div className="invalid-feedback">{errors.thisMonthNumberOfElectric}</div>
                                        )}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="moneyEachNumberOfElectric">
                                            Số tiền mỗi số
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.moneyEachNumberOfElectric ? 'is-invalid' : ''}`}
                                            id="moneyEachNumberOfElectric"
                                            name="moneyEachNumberOfElectric"
                                            value={electricData.moneyEachNumberOfElectric}
                                            onChange={handleInputChange}
                                        />
                                        {errors.moneyEachNumberOfElectric && (
                                            <div className="invalid-feedback">{errors.moneyEachNumberOfElectric}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="lastMonthBlockOfWater">
                                            Số khối tháng trước
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.lastMonthBlockOfWater ? 'is-invalid' : ''}`}
                                            id="lastMonthBlockOfWater"
                                            name="lastMonthBlockOfWater"
                                            value={electricData.lastMonthBlockOfWater}
                                            onChange={handleInputChange}
                                        />
                                        {errors.lastMonthBlockOfWater && (
                                            <div className="invalid-feedback">{errors.lastMonthBlockOfWater}</div>
                                        )}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="thisMonthBlockOfWater">
                                            Số khối tháng này
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.thisMonthBlockOfWater ? 'is-invalid' : ''}`}
                                            id="thisMonthBlockOfWater"
                                            name="thisMonthBlockOfWater"
                                            value={electricData.thisMonthBlockOfWater}
                                            onChange={handleInputChange}
                                        />
                                        {errors.thisMonthBlockOfWater && (
                                            <div className="invalid-feedback">{errors.thisMonthBlockOfWater}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="moneyEachBlockOfWater">
                                            Số tiền mỗi khối
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.moneyEachBlockOfWater ? 'is-invalid' : ''}`}
                                            id="moneyEachBlockOfWater"
                                            name="moneyEachBlockOfWater"
                                            value={electricData.moneyEachBlockOfWater}
                                            onChange={handleInputChange}
                                        />
                                        {errors.moneyEachBlockOfWater && (
                                            <div className="invalid-feedback">{errors.moneyEachBlockOfWater}</div>
                                        )}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="roomId">
                                            Chọn phòng
                                        </label>
                                        <select
                                            className={`form-select ${errors.roomId ? 'is-invalid' : ''}`}
                                            id="roomId"
                                            name="roomId"
                                            value={electricData.roomId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn...</option>
                                            {roomOptions.length > 0 ? (
                                                roomOptions.map((roomOption) => (
                                                    <option key={roomOption.id} value={roomOption.id}>
                                                        {roomOption.title}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Không có phòng nào</option>
                                            )}
                                        </select>
                                        {errors.roomId && <div className="invalid-feedback">{errors.roomId}</div>}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddElectric;