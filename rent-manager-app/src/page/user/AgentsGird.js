import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { toast } from "react-toastify";
import Pagination from "./Pagnation";
import { getAllAccountlandlordForCustomer } from "../../services/fetch/ApiUtils";
import { Link } from "react-router-dom";

const AgentsGird = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [totalItems, setTotalItems] = useState(0);
    const [tableData, settableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, [currentPage, searchQuery]);

    const fetchData = () => {
        getAllAccountlandlordForCustomer(currentPage, itemsPerPage).then(response => {
            settableData(response.content);
            setTotalItems(response.totalElements);
        }).catch(
            error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            }
        )
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Lọc dữ liệu theo tên hoặc địa chỉ
    const filteredData = tableData.filter(landlord => {
        const keyword = searchQuery.toLowerCase();
        return (
            landlord.name?.toLowerCase().includes(keyword) ||
            landlord.address?.toLowerCase().includes(keyword)
        );
    });

    return (
        <>
            <Header authenticated={props.authenticated} currentUser={props.currentUser} onLogout={props.onLogout} />
            <main id="main">
                <section className="intro-single">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-lg-8">
                                <div className="title-single-box">
                                    <h1 className="title-single">CHỦ TRỌ</h1>
                                    <span className="color-text-a">Danh sách Chủ trọ uy tín hàng đầu</span>
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-4">
                                <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="/">Trang chủ</a>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-2">
                    <div className="container">
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="input-group input-group-lg">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm theo tên hoặc địa chỉ chủ trọ..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        style={{ borderRight: 'none', borderRadius: '8px 0 0 8px' }}
                                    />
                                    <span className="input-group-text bg-white" style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="agents-grid grid">
                    <div className="container">
                        <div className="row">
                            {filteredData.map((landlord) => {
                                if (landlord.roles[0] && landlord.roles[0].name === "ROLE_LANDLORD") {
                                    return (
                                        <div className="col-12 col-md-3 mb-4">
                                            <div className="card">
                                                <div className="card-img-top">
                                                    {landlord?.imageUrl ?
                                                        <img src={landlord?.imageUrl} alt="" className="img-fluid" style={{ height: "250px", width: "100%", objectFit: "cover" }} />
                                                        :
                                                        <img src="assets/img/agent-4.jpg" alt="" className="img-fluid" style={{ height: "250px", width: "100%", objectFit: "cover" }} />
                                                    }
                                                </div>
                                                <div className="card-body">
                                                    <h3 className="card-title text-center mb-3">
                                                        <Link to={`/angent-single/`+landlord.id} className="text-decoration-none">{landlord.name}</Link>
                                                    </h3>
                                                    <div className="card-text">
                                                        <p className="mb-2">
                                                            <i className="bi bi-geo-alt me-2"></i>
                                                            {landlord.address}
                                                        </p>
                                                        <p className="mb-2">
                                                            <i className="bi bi-telephone me-2"></i>
                                                            {landlord.phone}
                                                        </p>
                                                        <p className="mb-3">
                                                            <i className="bi bi-envelope me-2"></i>
                                                            {landlord.email}
                                                        </p>
                                                    </div>
                                                    <div className="social-links text-center">
                                                        {landlord?.facebookUrl && 
                                                            <a href={landlord?.facebookUrl} className="btn btn-outline-primary me-2" target="_blank">
                                                                <i className="bi bi-facebook"></i>
                                                            </a>
                                                        }
                                                        {landlord?.zaloUrl && 
                                                            <a href={landlord?.zaloUrl} className="btn btn-outline-primary" target="_blank">
                                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                                                                    <path d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 15.576172 6 C 12.118043 9.5981082 10 14.323627 10 19.5 C 10 24.861353 12.268148 29.748596 15.949219 33.388672 C 15.815412 33.261195 15.988635 33.48288 16.005859 33.875 C 16.023639 34.279773 15.962689 34.835916 15.798828 35.386719 C 15.471108 36.488324 14.785653 37.503741 13.683594 37.871094 A 1.0001 1.0001 0 0 0 13.804688 39.800781 C 16.564391 40.352722 18.51646 39.521812 19.955078 38.861328 C 21.393696 38.200845 22.171033 37.756375 23.625 38.34375 A 1.0001 1.0001 0 0 0 23.636719 38.347656 C 26.359037 39.41176 29.356235 40 32.5 40 C 36.69732 40 40.631169 38.95117 44 37.123047 L 44 41 C 44 42.668484 42.668484 44 41 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z"></path>
                                                                </svg>
                                                            </a>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        <div className="row">
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                                currentPage={currentPage}
                                paginate={paginate}
                            />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default AgentsGird;