import React from "react";
import { Link, NavLink } from 'react-router-dom';

const SidebarNav = () => {
  return (
    <ul className="sidebar-nav">
      <li className="sidebar-header">
        Quản lí chức năng
      </li>
      <li className="sidebar-item">
        <NavLink to="/landlord" className="sidebar-link">
          <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Thống kê</span>
        </NavLink>
      </li>
      <li className="sidebar-item">
        <NavLink to="/landlord/room-management" className="sidebar-link">
          <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Quản lý phòng trọ</span>
        </NavLink>
      </li>
      <li className="sidebar-item">
        <NavLink to="/landlord/maintenance-management" className="sidebar-link">
          <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Quản lý bảo trì</span>
        </NavLink>
      </li>
      <li className="sidebar-item">
        <NavLink to="/landlord/contract-management" className="sidebar-link">
          <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Quản lý hợp đồng</span>
        </NavLink>
      </li>
      <li className="sidebar-item">
        <NavLink to="/landlord/request-management" className="sidebar-link">
          <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Quản lý yêu cầu</span>
        </NavLink>
      </li>
      <li className="sidebar-item">
        <NavLink to="/landlord/electric_water-management" className="sidebar-link">
          <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Quản lý điện nước</span>
        </NavLink>
      </li>
    </ul>
  )
}

export default SidebarNav;