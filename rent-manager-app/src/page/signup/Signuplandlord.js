import React, { useState } from "react";
import './Signup.css';
import { toast } from 'react-toastify';
import { signup } from "../../services/fetch/ApiUtils";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function Signuplandlord(props) {

    const history = useNavigate();
    const location = useLocation();
    const [cccd, setCccd] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role] = useState('ROLE_LANDLORD');
    const [isAgreed, setIsAgreed] = useState(false); // State để quản lý checkbox

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
      }

      const validateCccd = (cccd) => {
        const cccdRegex = /^\d{12}$/; // CCCD phải là 12 số
        return cccdRegex.test(cccd);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isAgreed) {
                    toast.error("Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục.");
                    return;
                }
        if (!validateCccd(cccd)) {
            toast.error("Căn cước công dân không hợp lệ. Vui lòng nhập đủ 12 số.");
            return;
        }
        console.log("Number", confirmPassword.length);
        if (password === confirmPassword) {
            const signUpRequest = { name, email,phone, address, password, confirmPassword , role };
            signup(signUpRequest)
                .then(response => {
                    toast.success("Tài khoản đăng kí thành công. Vui lòng kiểm tra email đễ xác thực.");
                    history("/login-landlord");
                })
                .catch(error => {
                    toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
                });
        } else if (validatePhone(phone) === false) {
            toast.error("Số điện thoại không hợp lệ.")
        }
        
        else if (name === '' || email === '' || password === '' || phone === '' || address === '' || confirmPassword === '') {
            toast.error("Vui lòng điền đầy đủ thông tin.")
        }
        else if (password.length <= 8 || confirmPassword.length <= 8) {
            toast.error("Mật khẩu phải đủ 8 kí tự.")
        }
        else {
            toast.error("Mật khẩu không trùng khớp. Vui lòng nhập lại.")
        }
    }

    if (props.authenticated) {
        return <Navigate
            to={{
                pathname: "/",
                state: { from: location }
            }} />;
    }

        return (
            <>
                <div className="signup-container">
                    {/* Lớp phủ tối */}
                    <div className="background-overlay"></div>
        
                    {/* Pop-up đăng ký */}
                    <div className="signup-popup">
                        <div className="mb-4 text-center">
                        <h3 style={{ fontWeight: 'bold' }}>Đăng ký <a href="/" style={{ textDecoration: 'none' }}>Rent<span className="color-b" style={{ color: '#28a745' }}>Mate</span></a></h3>
                            <p className="mb-4">Nếu bạn có tài khoản, hãy <a href="/login-landlord">Đăng nhập</a> để bắt đầu quản lý và cho thuê các phòng trọ của mình</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group first">
                                <span>Email</span>
                                <input type="email" className="form-control" id="username" name="email"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group first">
                                <span>Họ và tên</span>
                                <input type="text" className="form-control" id="username"
                                    name="name"
                                    value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group first">
                                <span>Số điện thoại</span>
                                <input type="text" className="form-control" id="phone"
                                    name="phone"
                                    value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            
                            <div className="form-group first">
                                <span>Căn cước công dân</span>
                                <input type="text" className="form-control" id="cccd"
                                    name="cccd"
                                    value={cccd} onChange={(e) => setCccd(e.target.value)} required />
                            </div>
                            <div className="form-group last mb-4">
                                <span>Mật khẩu</span>
                                <input type="password" className="form-control" id="password"
                                    name="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="form-group last mb-4">
                                <span>Nhập lại mật khẩu</span>
                                <input type="password" className="form-control" id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                            {/* Checkbox Điều khoản dịch vụ */}
                        <div className="form-group mb-4 terms-checkbox">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                style={{ marginRight: '10px' }}
                            />
                            <label htmlFor="terms">
                                Tôi đã đọc và đồng ý với <a href="/terms" style={{ color: '#28a745', textDecoration: 'underline' }}>Điều khoản dịch vụ</a> và <a href="/privacy" style={{ color: '#28a745', textDecoration: 'underline' }}>Chính sách bảo mật</a> của RentMate.
                            </label>
                        </div>
                            <input type="submit" value="Đăng ký" className="btn text-white btn-block btn-primary" />
                        </form>
                    </div>
                </div>
            </>
        );
}

export default Signuplandlord;