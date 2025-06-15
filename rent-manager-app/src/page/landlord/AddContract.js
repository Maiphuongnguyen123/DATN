import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { getAllRoomOflandlord } from '../../services/fetch/ApiUtils';
import ContractService from '../../services/axios/ContractService';
import RenterService from '../../services/axios/RenterService';
import '../../styles/dropdown.css';

function AddContract({ authenticated, role, currentUser, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [roomOptions, setRoomOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userOptions, setUserOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef(null);
    const dropdownRef = useRef(null);
    const [contractData, setContractData] = useState({
        name: '',
        roomId: '',
        nameOfRent: '',
        phone: '',
        numOfPeople: 1,
        deadline: '',
        files: [],
        identityCard: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Hàm tìm kiếm người thuê
    const searchRenters = async (query) => {
        setIsSearching(true);
        try {
            const response = await RenterService.searchRenters(query, 0, 10);
            const users = response.data.content || [];
            
            // Sắp xếp kết quả theo độ phù hợp
            const sortedUsers = users.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                const searchQuery = query.toLowerCase();
                
                // Ưu tiên kết quả bắt đầu bằng từ khóa
                const startsWithA = nameA.startsWith(searchQuery);
                const startsWithB = nameB.startsWith(searchQuery);
                if (startsWithA && !startsWithB) return -1;
                if (!startsWithA && startsWithB) return 1;
                
                // Sau đó sắp xếp theo độ dài tên (ngắn hơn lên trước)
                return nameA.length - nameB.length;
            });

            setUserOptions(sortedUsers);
        } catch (error) {
            toast.error('Không thể tải danh sách người thuê');
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('ACCESS_TOKEN');
                navigate('/login-landlord');
            }
        } finally {
            setIsSearching(false);
        }
    };

    // Xử lý sự kiện tìm kiếm
    const handleUserSearch = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        setShowDropdown(true);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Chỉ tìm kiếm khi có ít nhất 2 ký tự
        if (value.trim().length >= 2) {
            searchTimeout.current = setTimeout(() => {
                searchRenters(value);
            }, 300);
        } else {
            setUserOptions([]);
        }
    };

    // Highlight từ khóa trong kết quả
    const highlightText = (text, keyword) => {
        if (!keyword.trim()) return text;
        
        const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
        return (
            <span>
                {parts.map((part, index) => 
                    part.toLowerCase() === keyword.toLowerCase() ? 
                        <span key={index} className="highlight" style={{backgroundColor: '#fff3cd'}}>{part}</span> : 
                        part
                )}
            </span>
        );
    };

    // Xử lý khi chọn người thuê
    const handleUserSelect = (user) => {
        setContractData(prev => ({
            ...prev,
            nameOfRent: user.name,
            phone: user.phone || '',
            identityCard: user.identityCard || ''
        }));
        setSearchTerm(user.name);
        setShowDropdown(false);
        setErrors(prev => ({ ...prev, nameOfRent: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!contractData.name.trim()) newErrors.name = 'Tên hợp đồng là bắt buộc';
        if (!contractData.roomId) newErrors.roomId = 'Vui lòng chọn phòng';
        if (!contractData.nameOfRent.trim()) newErrors.nameOfRent = 'Tên người thuê là bắt buộc';
        if (!contractData.phone || !/^\d{10}$/.test(contractData.phone)) {
            newErrors.phone = 'Số điện thoại phải là 10 chữ số';
        }
        if (!contractData.identityCard || !/^\d{12}$/.test(contractData.identityCard)) {
            newErrors.identityCard = 'CCCD phải là 12 chữ số';
        }
        if (!contractData.numOfPeople || contractData.numOfPeople <= 0) {
            newErrors.numOfPeople = 'Số lượng người phải lớn hơn 0';
        }
        const deadlineDate = new Date(contractData.deadline);
        if (!contractData.deadline || deadlineDate <= new Date()) {
            newErrors.deadline = 'Thời hạn hợp đồng phải là ngày trong tương lai';
        }
        if (contractData.files.length === 0) {
            newErrors.files = 'Vui lòng chọn ít nhất một file PDF';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setContractData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const maxFiles = 1; // Chỉ cho phép 1 file để khớp với backend
        const maxSize = 5 * 1024 * 1024; // 5MB
        const validFiles = files
            .filter(file => file.type === 'application/pdf' && file.size <= maxSize)
            .slice(0, maxFiles);
        if (validFiles.length !== files.length) {
            toast.error('Chỉ chấp nhận 1 file PDF, tối đa 5MB');
        }
        setContractData((prevState) => ({
            ...prevState,
            files: validFiles,
        }));
        setErrors((prev) => ({ ...prev, files: '' }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error('Vui lòng điền đầy đủ thông tin hợp lệ');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', contractData.name.trim());
        formData.append('roomId', contractData.roomId);
        formData.append('nameOfRent', contractData.nameOfRent.trim());
        formData.append('numOfPeople', contractData.numOfPeople);
        formData.append('phone', contractData.phone);
        formData.append('identityCard', contractData.identityCard.trim());
        formData.append('deadlineContract', new Date(contractData.deadline).toISOString().slice(0, 19));
        contractData.files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await ContractService.addNewContract(formData);
            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message || 'Hợp đồng lưu thành công!');
                setContractData({
                    name: '',
                    roomId: '',
                    nameOfRent: '',
                    phone: '',
                    numOfPeople: 1,
                    deadline: '',
                    files: [],
                    identityCard: '',
                });
                navigate('/landlord/contract-management');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            toast.error(errorMessage);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('ACCESS_TOKEN');
                navigate('/login-landlord');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                const response = await getAllRoomOflandlord(1, 1000, '');
                console.log('API Response:', response);
                setRoomOptions(response.content || []);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Không thể tải danh sách phòng!';
                toast.error(errorMessage);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('ACCESS_TOKEN');
                    navigate('/login-landlord');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchRooms();
    }, [navigate]);

    // Thêm useEffect để xử lý click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.position-relative')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (!authenticated) {
        return <Navigate to={{ pathname: '/login-landlord', state: { from: location } }} />;
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
                <br />
                <div className="container-fluid p-0">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Thiết lập hợp đồng</h5>
                        </div>
                        <div className="card-body">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label" htmlFor="name">
                                                Tên hợp đồng
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                id="name"
                                                name="name"
                                                value={contractData.name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label" htmlFor="nameOfRent">
                                                Người thuê
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.nameOfRent ? 'is-invalid' : ''}`}
                                                    id="nameOfRent"
                                                    value={searchTerm}
                                                    onChange={handleUserSearch}
                                                    onFocus={() => setShowDropdown(true)}
                                                    placeholder="Nhập tên người thuê (ít nhất 2 ký tự)..."
                                                    autoComplete="off"
                                                />
                                                {showDropdown && (
                                                    <div 
                                                        ref={dropdownRef}
                                                        className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm dropdown-scroll" 
                                                        style={{ 
                                                            maxHeight: '200px', 
                                                            overflowY: 'auto', 
                                                            zIndex: 1000 
                                                        }}
                                                    >
                                                        {isSearching ? (
                                                            <div className="p-2 text-center text-muted">
                                                                <small>Đang tìm kiếm...</small>
                                                            </div>
                                                        ) : userOptions.length > 0 ? (
                                                            userOptions.map((user) => (
                                                                <div
                                                                    key={user.id}
                                                                    className="p-2 cursor-pointer hover-bg-light"
                                                                    onClick={() => handleUserSelect(user)}
                                                                    style={{ cursor: 'pointer' }}
                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                                >
                                                                    <div>{highlightText(user.name, searchTerm)}</div>
                                                                    <small className="text-muted">
                                                                        {user.phone} - CCCD: {user.identityCard}
                                                                    </small>
                                                                </div>
                                                            ))
                                                        ) : searchTerm.length >= 2 ? (
                                                            <div className="p-2 text-center text-muted">
                                                                <small>Không tìm thấy kết quả</small>
                                                            </div>
                                                        ) : (
                                                            <div className="p-2 text-center text-muted">
                                                                <small>Nhập ít nhất 2 ký tự để tìm kiếm</small>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {errors.nameOfRent && (
                                                    <div className="invalid-feedback">{errors.nameOfRent}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label" htmlFor="numOfPeople">
                                                Số lượng người
                                            </label>
                                            <input
                                                type="number"
                                                className={`form-control ${errors.numOfPeople ? 'is-invalid' : ''}`}
                                                id="numOfPeople"
                                                name="numOfPeople"
                                                value={contractData.numOfPeople}
                                                onChange={handleInputChange}
                                                min="1"
                                            />
                                            {errors.numOfPeople && (
                                                <div className="invalid-feedback">{errors.numOfPeople}</div>
                                            )}
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label className="form-label" htmlFor="phone">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                id="phone"
                                                name="phone"
                                                value={contractData.phone}
                                                onChange={handleInputChange}
                                            />
                                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label className="form-label" htmlFor="identityCard">
                                                CCCD
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.identityCard ? 'is-invalid' : ''}`}
                                                id="identityCard"
                                                name="identityCard"
                                                value={contractData.identityCard}
                                                onChange={handleInputChange}
                                            />
                                            {errors.identityCard && <div className="invalid-feedback">{errors.identityCard}</div>}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="roomId">
                                            Chọn phòng
                                        </label>
                                        <select
                                            className={`form-select ${errors.roomId ? 'is-invalid' : ''}`}
                                            id="roomId"
                                            name="roomId"
                                            value={contractData.roomId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn...</option>
                                            {roomOptions.map(roomOption => (
                                                <option key={roomOption.id} value={roomOption.id}>{roomOption.title}</option>
                                            ))}
                                        </select>
                                        {errors.roomId && <div className="invalid-feedback">{errors.roomId}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="deadline">
                                            Thời Hạn Hợp Đồng
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                                            id="deadline"
                                            name="deadline"
                                            value={contractData.deadline}
                                            onChange={handleInputChange}
                                        />
                                        {errors.deadline && <div className="invalid-feedback">{errors.deadline}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tải File Hợp Đồng</label>
                                        <h6 className="card-subtitle text-muted">
                                            Tải mẫu hợp đồng để tạo hợp đồng với người thuê và đẩy lên lưu trữ trên hệ thống. Sau đó chuyển sang file .pdf để upload.{' '}
                                            <a 
                                                href="https://image.luatvietnam.vn/uploaded/Others/2021/04/08/hop-dong-thue-nha-o_2810144434_2011152916_0804150405.doc" 
                                                download
                                                className="btn btn-sm btn-primary"
                                                style={{ marginLeft: '10px' }}
                                            >
                                                <i className="fas fa-download"></i> Tải mẫu hợp đồng
                                            </a>
                                        </h6>
                                        <input
                                            className="form-control"
                                            type="file"
                                            accept=".pdf"
                                            name="files"
                                            onChange={handleFileChange}
                                        />
                                        {errors.files && <div className="invalid-feedback">{errors.files}</div>}
                                        {contractData.files.length > 0 && (
                                            <ul>
                                                {contractData.files.map((file, index) => (
                                                    <li key={index}>{file.name}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? 'Đang gửi...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-2"
                                        onClick={() => navigate('/landlord/contract-management')}
                                        disabled={isLoading}
                                    >
                                        Hủy
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddContract;