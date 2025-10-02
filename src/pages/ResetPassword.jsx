import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import bg from "../assets/bg.jpg";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7251/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      if (!res.ok) {
        const errData = await res.text();
        throw new Error(errData || "Lỗi đổi mật khẩu");
      }
      const msg = await res.text();
      setMessage(msg);
      setShowSuccess(true);
      // Hiệu ứng: sau 2 giây tự động chuyển về màn hình đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
          width: "400px",
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
          Đổi mật khẩu
        </h5>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {message && showSuccess && (
          <div
            className="alert alert-success py-2 text-center animate__animated animate__fadeInDown"
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#16a34a",
              background: "#dcfce7",
              borderRadius: "12px",
              border: "2px solid #bbf7d0",
              boxShadow: "0 2px 8px #16a34a22",
              transition: "all 0.5s",
            }}
          >
            <span>✅ {message}</span>
            <br />
            <span style={{ fontSize: "15px", color: "#374151" }}>
              Đang chuyển về màn hình đăng nhập...
            </span>
          </div>
        )}
        {!showSuccess && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control rounded-pill"
                placeholder="Nhập email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mã xác thực</label>
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder="Nhập mã xác thực..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mật khẩu mới</label>
              <input
                type="password"
                className="form-control rounded-pill"
                placeholder="Nhập mật khẩu mới..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn w-100 fw-bold rounded-pill"
              style={{ backgroundColor: "#ff7a18", color: "#fff" }}
              disabled={loading}
            >
              {loading ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </form>
        )}
        {!showSuccess && (
          <div className="text-center mt-3">
            <button
              className="btn btn-link fw-bold"
              style={{ color: "#ff7a18", textDecoration: "underline" }}
              onClick={() => navigate("/login")}
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;