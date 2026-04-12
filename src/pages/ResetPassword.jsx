import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import bg from "../assets/bg.jpg";
import { API_BASE_URL } from "../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tự động điền email từ trang ForgotPassword truyền sang
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm trường confirm pass
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate cục bộ trước khi gọi API
    if (newPassword !== confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp.");
    }
    if (newPassword.length < 6) {
      return setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      
      if (!res.ok) {
        const errData = await res.text();
        throw new Error(errData || "Mã xác nhận không hợp lệ hoặc đã hết hạn.");
      }
      
      const msg = await res.text();
      setMessage(msg || "Đặt lại mật khẩu thành công!");
      setShowSuccess(true);
      
      // Hiệu ứng: sau 2.5 giây tự động chuyển về màn hình đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow-lg p-5"
        style={{
          width: "420px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          position: "relative",
        }}
      >
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: "80px" }} />
          <h3 className="mt-3 fw-bold" style={{ color: "#ff7a18" }}>
            Student Club
          </h3>
        </div>
        <h5 className="fw-bold mb-3 text-center" style={{ color: "#ff7a18" }}>
          Đặt Lại Mật Khẩu
        </h5>

        {error && <div className="alert alert-danger py-2 px-3 text-center" style={{fontSize: 14}}>{error}</div>}
        
        {message && showSuccess && (
          <div
            className="alert alert-success py-3 text-center animate__animated animate__fadeInDown"
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#16a34a",
              background: "#dcfce7",
              borderRadius: "12px",
              border: "2px solid #bbf7d0",
            }}
          >
            <span>✅ {message}</span>
            <br />
            <span style={{ fontSize: "14px", color: "#374151", fontWeight: "normal", display: "inline-block", marginTop: 8 }}>
              Đang tự động chuyển về Đăng nhập...
            </span>
          </div>
        )}

        {!showSuccess && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{fontSize: 14}}>Email xác thực</label>
              <input
                type="email"
                className="form-control rounded-pill px-3 bg-light"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly // Không cho sửa email ở bước này
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{fontSize: 14}}>Mã xác thực (6 số)</label>
              <input
                type="text"
                className="form-control rounded-pill px-3 text-center"
                placeholder="VD: 123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
                style={{ letterSpacing: 2, fontWeight: "bold" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold" style={{fontSize: 14}}>Mật khẩu mới</label>
              <input
                type="password"
                className="form-control rounded-pill px-3"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold" style={{fontSize: 14}}>Xác nhận mật khẩu</label>
              <input
                type="password"
                className="form-control rounded-pill px-3"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold rounded-pill shadow-sm"
              style={{ backgroundColor: "#ff7a18", color: "#fff", padding: "10px 0" }}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        )}

        {!showSuccess && (
          <div className="text-center mt-4">
            <button
              className="btn btn-link fw-bold p-0"
              style={{ color: "#ff7a18", textDecoration: "none", fontSize: 14 }}
              onClick={() => navigate("/login")}
            >
              Hủy bỏ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;