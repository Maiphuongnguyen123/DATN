import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../SidebarNav.css";

const SidebarNav = () => {
  const location = useLocation();
  
  // Kiểm tra active state cho từng menu quản lý
  const isRoomManagementActive = location.pathname.includes('/landlord/room-management') || 
                                location.pathname.includes('/landlord/add-room') ||
                                location.pathname.includes('/landlord/edit-room');

  const isMaintenanceManagementActive = location.pathname.includes('/landlord/maintenance-management') ||
                                      location.pathname.includes('/landlord/add-maintenance') ||
                                      location.pathname.includes('/landlord/edit-maintenance');

  const isContractManagementActive = location.pathname.includes('/landlord/contract-management') ||
                                    location.pathname.includes('/landlord/add-contract') ||
                                    location.pathname.includes('/landlord/edit-contract') ||
                                    location.pathname.includes('/landlord/export-contract');

  const isRequestManagementActive = location.pathname.includes('/landlord/request-management') ||
                                  location.pathname.includes('/landlord/export-bill');

  const isRentManagementActive = location.pathname.includes('/landlord/rent-management') ||
                                location.pathname.includes('/landlord/electric_water/add');

  return (
    <ul className="sidebar-nav">
      <li className="sidebar-header">
        <div className="sidebar-brand-wrapper">
          <img src="/assets/img/logo.png" alt="RentMate Logo" className="sidebar-logo" />
          <span className="sidebar-brand-text">RentMate</span>
        </div>
        <p className="sidebar-user-status">Quản lý tài khoản Chủ trọ</p>
      </li>
      <li className="sidebar-item">
          <NavLink
            to="/landlord/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">📊</i>
            <span>Thống kê</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/landlord/room-management"
            className={isRoomManagementActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="sidebar-icon">🏠</i>
            <span>Quản lý phòng trọ</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/landlord/maintenance-management"
            className={isMaintenanceManagementActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="sidebar-icon">🔧</i>
            <span>Quản lý bảo trì</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/landlord/contract-management"
            className={isContractManagementActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="sidebar-icon">📜</i>
            <span>Quản lý hợp đồng</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/landlord/request-management"
            className={isRequestManagementActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="sidebar-icon">📋</i>
            <span>Quản lý yêu cầu</span>
          </NavLink>
        </li>
        {/* <li className="sidebar-item">
          <NavLink
            to="/landlord/electric_water-management"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">💡</i>
            <span>Quản lý điện nước</span>
          </NavLink>
        </li> */}
        <li className="sidebar-item">
          <NavLink
            to="/landlord/rent-management"
            className={isRentManagementActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="sidebar-icon">💰</i>
            <span>Quản lý tiền trọ</span>
          </NavLink>
        </li>
    </ul>
  )
}

export default SidebarNav;