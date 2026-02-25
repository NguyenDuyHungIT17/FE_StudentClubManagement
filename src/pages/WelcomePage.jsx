import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Globe } from "lucide-react"; // Dùng icon của lucide-react cho đồng bộ

// Import các Component và Style dùng chung của module Auth
import AuthBanner from "../components/auth/AuthBanner";
import "../styles/WelcomePageTheme.css"; 

import bg from "../assets/logo_ngang.svg";
import logo from "../assets/logo_haui.png";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-layout">
      {/* 1. CỘT TRÁI - BANNER (Tái sử dụng Component AuthBanner) */}
      <AuthBanner 
        image={bg}
        title="Khám phá UniClubs"
        description="Nền tảng kết nối và quản lý câu lạc bộ sinh viên hàng đầu. Mở ra vô vàn cơ hội học hỏi và giao lưu!"
      />

      {/* 2. CỘT PHẢI - NỘI DUNG WELCOME */}
      <div className="auth-form-container">
        <div className="auth-box" style={{ textAlign: 'center' }}>
          
          {/* Logo & Tiêu đề */}
          <img 
            src={logo} 
            alt="UniClubs Logo" 
            style={{ width: 80, marginBottom: 24, borderRadius: 16, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} 
          />
          <h2 className="auth-title" style={{ marginBottom: 12 }}>Xin chào! 👋</h2>
          <p className="auth-subtitle" style={{ marginBottom: 40 }}>
            Bạn muốn truy cập hệ thống dưới tư cách nào?
          </p>

          {/* Các nút hành động */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Nút Đăng nhập (Dùng class auth-btn đã định nghĩa trong AuthTheme.css) */}
            <button
              onClick={() => navigate("/login")}
              className="auth-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <User size={20} /> Đăng nhập hệ thống
            </button>

            {/* Nút Khách (Nút Outline / Secondary) */}
            <button
              onClick={() => navigate("/public")}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                background: 'transparent', color: '#3b82f6', border: '2px solid #3b82f6'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Globe size={20} /> Tiếp tục với tư cách Khách
            </button>

          </div>

          {/* Footer nhỏ */}
          <p style={{ marginTop: '48px', fontSize: '13px', color: '#94a3b8' }}>
            © 2024-2025 UniClubs. All rights reserved.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;