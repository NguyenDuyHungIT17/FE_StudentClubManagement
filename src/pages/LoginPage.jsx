import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import "../styles/LoginPage.css"; // Nhớ import CSS
import logo from "../assets/logo.png";
import bg from "../assets/bg.jpg"; // Dùng làm ảnh minh họa bên trái

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Thêm state ẩn/hiện pass
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://localhost:7251/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Email hoặc mật khẩu không đúng.");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullName", data.fullName);

      // Điều hướng thông minh
      switch (data.role) {
        case "admin": navigate("/admin"); break;
        case "leader": navigate("/leader"); break;
        case "member": navigate("/member"); break;
        default: navigate("/home");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* 1. LEFT SIDE - BANNER & IMAGE */}
      <div className="login-banner">
        <div className="banner-content">
          <img src={bg} alt="Community" className="banner-img" />
          <h1 style={{fontSize: '36px', fontWeight: 800, marginBottom: '16px'}}>Welcome to UniClubs</h1>
          <p style={{fontSize: '16px', lineHeight: 1.6, opacity: 0.9}}>
            Nền tảng kết nối, quản lý và phát triển cộng đồng sinh viên hàng đầu. 
            Tham gia ngay để không bỏ lỡ các sự kiện hấp dẫn!
          </p>
        </div>
      </div>

      {/* 2. RIGHT SIDE - LOGIN FORM */}
      <div className="login-form-container">
        <div className="login-box">
          {/* Logo Brand */}
          <div className="brand-header">
            <img src={logo} alt="Logo" className="brand-logo" />
            <span className="brand-name">UniClubs</span>
          </div>

          <div className="welcome-text">
            <h2>Đăng nhập</h2>
            <p>Vui lòng nhập thông tin để tiếp tục.</p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="error-msg">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="input-group-custom">
              <label className="input-label">Email</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-group-custom">
              <label className="input-label">Mật khẩu</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span 
                className="forgot-link" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </span>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Đang xử lý..." : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Đăng nhập <ArrowRight size={20} />
                </span>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
            Chưa có tài khoản?{' '}
            <span 
              style={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => navigate('/register')} // Nếu có trang đăng ký
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;