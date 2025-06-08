import React from "react";
import { Link, NavLink, useLocation } from 'react-router-dom';
import "../SidebarNav.css";

const SidebarNav = () => {
  const location = useLocation();
  
  // Kiểm tra đường dẫn chính xác
  const isDashboardActive = location.pathname === '/admin';
  const isAccountManagementActive = location.pathname.includes('/admin/account-management');
  const isRoomManagementActive = location.pathname.includes('/admin/room-management');

  return (
    <ul className="sidebar-nav">
      <li className="sidebar-header">
        <div className="sidebar-brand-wrapper">
          <img src="/assets/img/logo.png" alt="RentMate Logo" className="sidebar-logo" />
          <span className="sidebar-brand-text">RentMate</span>
        </div>
        <p className="sidebar-user-status">Quản lý tài khoản Admin</p>
      </li>
      
      <li className="sidebar-item">
        <NavLink 
          to="/admin" 
          end
          className={isDashboardActive ? "sidebar-link active" : "sidebar-link"}
        >
          <i className="sidebar-icon">📊</i>
          <span className="align-middle">Thống kê</span>
        </NavLink>
      </li>
      <li className="sidebar-item">
        <NavLink 
          to="/admin/account-management" 
          className={isAccountManagementActive ? "sidebar-link active" : "sidebar-link"}
        >
          <i className="sidebar-icon">👥</i>
          <span className="align-middle">Quản lý tài khoản</span>
        </NavLink>
      </li>
      <li className="sidebar-item">
        <NavLink 
          to="/admin/room-management" 
          className={isRoomManagementActive ? "sidebar-link active" : "sidebar-link"}
        >
          <i className="sidebar-icon">🏠</i>
          <span className="align-middle">Quản lý phòng trọ</span>
        </NavLink>
      </li>
    </ul>
  )
}

export default SidebarNav;