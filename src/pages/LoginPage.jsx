import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { useLogin } from "../hooks/useLogin"; // Import Logic
import "../styles/AuthTheme.css"; // Import UI
import logo from "../assets/logo_ngang.svg";
import bg from "../assets/bg.jpg"; 

const LoginPage = () => {
  // Lấy toàn bộ State và Function từ Custom Hook
  const {
    email, setEmail,
    password, setPassword,
    error, loading,
    handleLoginSubmit, navigate
  } = useLogin();

  // Giao diện (State ẩn hiện pass chỉ thuộc về UI, nên để ở đây là hợp lý)
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-container">
      {/* CỘT TRÁI: BANNER */}
      <div className="auth-banner">
        <img src={logo} alt="Logo" style={{ width: 500, marginBottom: 100 }} />
        {/* <h1 style={{ fontSize: 36, fontWeight: 800 }}>UniClubs Platform</h1>
        <p style={{ opacity: 0.8, textAlign: 'center', maxWidth: 400, marginTop: 10, lineHeight: 1.6 }}>
          Nền tảng kết nối, quản lý và phát triển cộng đồng sinh viên hàng đầu. Đăng nhập để bắt đầu!
        </p> */}
      </div>

      {/* CỘT PHẢI: FORM */}
      <div className="auth-form-section">
        <div className="auth-box">
          <h2 className="auth-title">Đăng nhập</h2>
          <p className="auth-subtitle">Chào mừng trở lại! Vui lòng nhập thông tin.</p>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            {/* Input Email */}
            <div className="auth-input-group">
              <label>Email</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@university.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="auth-input-group">
              <label>Mật khẩu</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <span 
                onClick={() => navigate("/forgot-password")}
                style={{ color: '#3b82f6', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Quên mật khẩu?
              </span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Đang xác thực..." : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Đăng nhập <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;