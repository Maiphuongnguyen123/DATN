import React from "react";
import { NavLink } from "react-router-dom";
import "../SidebarNav.css";

const SidebarNav = () => {
  return (
    <ul className="sidebar-nav">
      <li className="sidebar-header">
      <p className="sidebar-user-status">Quản lý tài khoản của bạn</p>
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
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">🏠</i>
            <span>Quản lý phòng trọ</span>
          </NavLink>
        </li>

        
        <li className="sidebar-item">
          <NavLink
            to="/landlord/maintenance-management"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">🔧</i>
            <span>Quản lý bảo trì</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/landlord/contract-management"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">📜</i>
            <span>Quản lý hợp đồng</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/landlord/request-management"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">📋</i>
            <span>Quản lý yêu cầu</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/landlord/electric-water-management"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">💡</i>
            <span>Quản lý điện nước</span>
          </NavLink>
        </li>
    </ul>
  )
}

export default SidebarNav;