import React, { Component } from "react";
import './ForgotPassword.css';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";
import { forgotPassword } from "../services/fetch/ApiUtils";
import { toast } from "react-toastify";


class ForgotPassword extends Component {
    render() {
        return (
            <>
                <div className="forgot-password-container">
                    {/* Lớp phủ tối */}
                    <div className="background-overlay"></div>

                    {/* Nội dung chính */}
                    <div className="body-content">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <div className="mb-4 text-center">
                                        <h3 style={{ fontWeight: 'bold'}}>Quên mật khẩu</h3>
                                        <p className="mb-4" style={{textAlign: 'left' }}>Bằng việc thực hiện đổi mật khẩu, bạn đã đồng ý với <a href="/terms" style={{ color: '#28a745', textDecoration: 'underline' }}>Điều khoản dịch vụ</a> và <a href="/privacy" style={{ color: '#28a745', textDecoration: 'underline' }}>Chính sách bảo mật</a> của RentMate.
                                        </p>
                                    </div>
                                    <ForgotPasswordForm />

                                    <p className="mb-4">
                                        Nếu bạn chưa có tài khoản, <a href="/signup" style={{ textDecoration: 'underline', color: '#28a745' }}>Đăng ký tài khoản mới</a>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </>
        );
    }
}




function ForgotPasswordForm() {
    const history = useNavigate();
    const [formState, setFormState] = useState({
        email: '',
    });

    const handleInputChange = event => {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        setFormState(prevState => ({
            ...prevState,
            [inputName]: inputValue
        }));
    };

    const handleSubmit = event => {
        event.preventDefault();

        const emailRequest = { ...formState };

        forgotPassword(emailRequest)
            .then(response => {
                toast.success(response.message);
                history("/");
            }).catch(error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            });


    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group first">
                <span>Email</span>
                <input type="email" className="form-control" name="email" value={formState.email} onChange={handleInputChange} required />

            </div>
            <input type="submit" value="Gửi yêu cầu" className="btn text-white btn-block btn-primary" />
        </form>
    )
}

export default ForgotPassword;