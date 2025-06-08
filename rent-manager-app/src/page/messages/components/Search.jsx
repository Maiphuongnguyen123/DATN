import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import '../style.css'
import Chats from "./Chats";

const Search = () => {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [err, setErr] = useState(false);
  const { setSelectedUser } = useUserContext();

  // Thêm useEffect để thực hiện tìm kiếm real-time
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (username.trim()) {
        handleSearch();
      } else {
        setUserList([]);
        setErr(false);
      }
    }, 500); // Đợi 500ms sau khi người dùng ngừng gõ

    return () => clearTimeout(debounceTimeout);
  }, [username]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8080/user/message/${username}?limit=10`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi tìm kiếm');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        setUserList(data);
        setErr(false);
      } else {
        setUserList([]);
        setErr(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setUserList([]);
      setErr(true);
    }
  };

  const handleSelect = async (user) => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = user.id;

      const response = await fetch(`http://localhost:8080/user/message-chat/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
        // Reset search sau khi chọn user
        setUsername("");
        setUserList([]);
      } else {
        console.error("Error fetching message data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="px-4 d-none d-md-block">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <input 
              type="text" 
              className="form-control my-3" 
              placeholder="Tìm kiếm..."
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />

            {err && username.trim() && <span className="text-danger">Không tìm thấy người dùng</span>}
            
            {userList && userList.length > 0 && (
              <div className="userList">
                {userList.map((user) => (
                  <div 
                    className="list-group-item list-group-item-action border-0" 
                    style={{ margin: "10px 10px 10px 15.2px", paddingLeft: "10px" }}
                    key={user.id} 
                    onClick={() => handleSelect(user)}
                  >
                    <div className="d-flex align-items-start">
                      <img 
                        src={user.imageUrl || 'default-avatar.png'} 
                        alt="" 
                        className="rounded-circle"
                        style={{ maxWidth: '50px', maxHeight: '50px' }} 
                      />
                      <div className="flex-grow-1 ms-3">
                        <div className="fw-bold">{user.name}</div>
                        {user.email && <div className="small text-muted">{user.email}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;