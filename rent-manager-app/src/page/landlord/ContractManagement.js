import React, { useEffect, useState } from "react";
import SidebarNav from "./SidebarNav";
import Nav from "./Nav";
import { getAllContractOflandlord } from "../../services/fetch/ApiUtils";
import Pagination from "./Pagnation";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

function ContractManagement({ authenticated, role, currentUser, location, onLogout }) {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllContractOflandlord(
        currentPage - 1, // Chuyển currentPage thành 0-based cho API
        itemsPerPage,
        searchQuery,
        searchQuery // Gửi searchQuery cho cả name và phone
      );
      setTableData(response.content || []);
      setTotalItems(response.totalElements || 0);
    } catch (error) {
      toast.error(error?.message || "Không thể tải danh sách hợp đồng!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Đặt lại trang về 1 khi tìm kiếm
  };

  const handleRedirectAddRoom = () => {
    navigate("/landlord/add-contract");
  };

  const handleEditContract = (id) => {
    navigate(`/landlord/edit-contract/${id}`);
  };

  const handleExportBill = (id) => {
    navigate(`/landlord/export-contract/${id}`);
  };

  const calculateRemainingMonths = (deadlineContract) => {
    const currentDate = new Date();
    const contractDate = new Date(deadlineContract);
    if (isNaN(contractDate)) return "N/A";
    const remainingMonths =
      (contractDate.getFullYear() - currentDate.getFullYear()) * 12 +
      (contractDate.getMonth() - currentDate.getMonth());
    return remainingMonths >= 0 ? `${remainingMonths} tháng` : "Hết hạn";
  };

  if (!authenticated) {
    return (
      <Navigate
        to={{
          pathname: "/login-landlord",
          state: { from: location || {} },
        }}
      />
    );
  }

  return (
    <div className="wrapper">
      <nav id="sidebar" className="sidebar js-sidebar">
        <div className="sidebar-content js-simplebar">
          <a className="sidebar-brand" href="#">
            <span className="align-middle">landlord PRO</span>
          </a>
          <SidebarNav />
        </div>
      </nav>
      <div className="main">
        <Nav onLogout={onLogout} currentUser={currentUser} />
        <div className="container-fluid p-0">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Quản lý hợp đồng</h5>
              <h6 className="card-subtitle text-muted">
                Quản lý hợp đồng của những người thuê trọ.
              </h6>
            </div>
            <div className="card-body">
              <div className="dataTables_wrapper dt-bootstrap5">
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="dt-buttons btn-group flex-wrap">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleRedirectAddRoom}
                      >
                        Thêm Hợp Đồng
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <div className="dataTables_filter">
                      <label>
                        Tìm kiếm:
                        <input
                          type="search"
                          className="form-control form-control-sm"
                          placeholder="Tìm theo tên hoặc số điện thoại"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row dt-row">
                  <div className="col-sm-12">
                    {isLoading ? (
                      <div className="text-center">Đang tải...</div>
                    ) : (
                      <table className="table table-striped" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Tên Hợp Đồng</th>
                            <th>Tên Phòng</th>
                            <th>Người thuê</th>
                            <th>Số điện thoại</th>
                            <th>Hợp Đồng</th>
                            <th>Giá phòng</th>
                            <th>Phụ phí</th>
                            <th>Thời hạn</th>
                            <th>Trạng Thái</th>
                            <th>Chế độ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center">
                                Không có dữ liệu
                              </td>
                            </tr>
                          ) : (
                            tableData.map((item) => (
                              <tr key={item.id}>
                                <td>{item.name || "N/A"}</td>
                                <td>{item.room?.title || "N/A"}</td>
                                <td>{item.nameOfRent || "N/A"}</td>
                                <td>{item.phone || "N/A"}</td>
                                <td>
                                  {item.files ? (
                                    <button className="btn btn-outline-success">
                                      <a
                                        href={`http://localhost:8080/document/${item.files.replace(
                                          "photographer/files/",
                                          ""
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Xem
                                      </a>
                                    </button>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td>
                                  {item.room?.price?.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }) || "N/A"}
                                </td>
                                <td>
                                  {(() => {
                                    const subFee =
                                      (item.room?.waterCost || 0) +
                                      (item.room?.publicElectricCost || 0) +
                                      (item.room?.internetCost || 0);
                                    return subFee.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    });
                                  })()}
                                </td>
                                <td>{calculateRemainingMonths(item.deadlineContract)}</td>
                                <td
                                  style={{
                                    color:
                                      item.room?.status === "CHECKED_OUT" ? "red" : "green",
                                  }}
                                >
                                  {item.room?.status === "CHECKED_OUT"
                                    ? "Đã trả phòng"
                                    : item.room?.status === "ROOM_RENT"
                                    ? "Đã thuê"
                                    : "N/A"}
                                </td>
                                <td>
                                  <a
                                    href="#"
                                    onClick={() => handleEditContract(item.id)}
                                    title="Sửa hợp đồng"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                    </svg>
                                  </a>{" "}
                                  <a
                                    href="#"
                                    onClick={() => handleExportBill(item.id)}
                                    title="Trả phòng và xuất hóa đơn"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 384 512"
                                    >
                                      <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm0 32v64H288V256H96zM240 416h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                                    </svg>
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <Pagination
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  paginate={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractManagement;