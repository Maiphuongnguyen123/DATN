import { Navigate, useParams } from 'react-router-dom';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getContract, getRentOfHome, getRoom } from '../../services/fetch/ApiUtils';
import ContractService from '../../services/axios/ContractService';


function EditContract(props) {
    const { authenticated, role, currentUser, location, onLogout } = props;
    const { id } = useParams();

    const [contractData, setContractData] = useState({
        name: '',
        roomId: '',
        nameRentHome: '',
        phone: '',
        numOfPeople: '',
        deadline: null,
        files: null,
        room: '',
        identityCard: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [roomId, setRoomId] = useState();

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
                setRoomId(response.room.id)
            })
            .catch(error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            });

    }, [id]);

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
                                            <label className="form-label" htmlFor="description">Người thuê</label>
                                            <input type="text" className="form-control" id="description" name="nameOfRent" value={contractData.nameOfRent} onChange={handleInputChange} />
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