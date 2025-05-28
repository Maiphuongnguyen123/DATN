import React from "react";
import { NavLink } from "react-router-dom";
import "../SidebarNav.css";

const SidebarNav = ({ currentUser }) => {
  return (
    <div className="sidebar-container">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-user-info">
          
          <p className="sidebar-user-status">Quản lý tài khoản của bạn</p>
        </div>
      </div>

      {/* Navigation */}
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">👤</i>
            <span>Hồ sơ cá nhân</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/room-hired"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">🏠</i>
            <span>Lịch sử thuê trọ</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/request-status"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">📋</i>
            <span>Trạng thái yêu cầu</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/follow-agents"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">👥</i>
            <span>Người theo dõi</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/save-blog"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">📌</i>
            <span>Lưu bài đăng</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/message"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">💬</i>
            <span>Tin nhắn</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/change-password"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <i className="sidebar-icon">🔒</i>
            <span>Đổi mật khẩu</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SidebarNav;