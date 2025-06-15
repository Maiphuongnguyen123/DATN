import { Navigate, useParams } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { getContract, getRentOfHome, getRoom } from '../../services/fetch/ApiUtils';
import ContractService from '../../services/axios/ContractService';
import RenterService from '../../services/axios/RenterService';
import '../../styles/dropdown.css';

function EditContract(props) {
    const { authenticated, role, currentUser, location, onLogout } = props;
    const { id } = useParams();

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
        numOfPeople: '',
        deadline: null,
        files: null,
        room: '',
        identityCard: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [roomId, setRoomId] = useState();

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
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setContractData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', contractData.name);
        formData.append('roomId', roomId);
        formData.append('nameOfRent', contractData.nameOfRent);
        formData.append('numOfPeople', contractData.numOfPeople);
        formData.append('phone', contractData.phone);
        formData.append('identityCard', contractData.identityCard);
        formData.append('deadlineContract', contractData.deadlineContract);
        
        // Always append files parameter, even if empty
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });
        } else {
            // Create an empty file if no new file is selected
            const emptyBlob = new Blob([''], { type: 'application/pdf' });
            const emptyFile = new File([emptyBlob], 'empty.pdf', { type: 'application/pdf' });
            formData.append('files', emptyFile);
        }

        ContractService.editContractInfo(id, formData)
            .then(response => {
                toast.success(response.data.message);
                toast.success("Cập nhật hợp đồng thành công!!")
            })
            .catch(error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            });
    };

    useEffect(() => {
        getContract(id)
            .then(response => {
                const contract = response;
                setContractData(prevState => ({
                    ...prevState,
                    ...contract
                }));
                setSearchTerm(contract.nameOfRent || '');
                setRoomId(response.room.id);
            })
            .catch(error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            });
    }, [id]);

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
                                <h5 className="card-title">Chỉnh sửa hợp đồng</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label" htmlFor="title">Tên hợp đồng</label>
                                            <input type="text" className="form-control" id="title" name="name" value={contractData.name} onChange={handleInputChange} />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label" htmlFor="nameOfRent">Người thuê</label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control"
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label" htmlFor="title">Số lượng người</label>
                                            <input type="number" className="form-control" id="title" name="numOfPeople" value={contractData.numOfPeople} onChange={handleInputChange} />
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label className="form-label" htmlFor="phone">Số điện thoại</label>
                                            <input type="text" className="form-control" id="phone" name="phone" value={contractData.phone} onChange={handleInputChange} />
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label className="form-label" htmlFor="identityCard">CCCD</label>
                                            <input type="text" className="form-control" id="identityCard" name="identityCard" value={contractData.identityCard} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="locationId">Chọn phòng</label>
                                        <select className="form-select" id="locationId" name="roomId" value={contractData.roomId} onChange={handleInputChange} disabled>
                                            <option key={contractData.room.id} value={contractData.room.id}>{contractData.room.title}</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">Thời Hạn Hợp Đồng</label>
                                        <input type="datetime-local" className="form-control" id="price" name="deadlineContract"
                                            value={contractData.deadlineContract}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="mb-3">
                                            <label className="form-label">Tải File Hợp Đồng</label> <br />
                                            <h6 className="card-subtitle text-muted">Tải mẫu hợp đồng để tạo hợp đồng với người thuê và đẩy lên lưu trữ trên hệ thống. Sau đó chuyển sang file .pdf để upload.<a href='https://image.luatvietnam.vn/uploaded/Others/2021/04/08/hop-dong-thue-nha-o_2810144434_2011152916_0804150405.doc'>Tải Mẫu</a></h6>
                                            <button type="button" className="btn btn-outline-success" style={{marginBottom: "10px"}}>
                                                <a href={contractData.files} target="_blank">Xem Hợp Đồng</a>
                                            </button>
                                            <input className="form-control" id="fileInput" type="file" accept=".pdf" name="files" onChange={handleFileChange} />
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

export default EditContract;