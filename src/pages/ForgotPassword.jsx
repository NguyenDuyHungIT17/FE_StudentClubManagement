import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bg from "../assets/bg.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7251/api/Auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const errData = await res.text();
        throw new Error(errData || "Lỗi gửi email");
      }
      // Nếu gửi thành công, chuyển luôn sang trang reset-password
      navigate("/reset-password", { state: { email } });
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
        }}
      >
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: "80px" }} />
          <h3 className="mt-3 fw-bold" style={{ color: "#ff7a18" }}>
            Student Club
          </h3>
        </div>
        <h5 className="fw-bold mb-3 text-center" style={{ color: "#ff7a18" }}>
          Quên mật khẩu
        </h5>
        <p className="text-center mb-3" style={{ color: "#374151" }}>
          Nhập email để nhận mã xác thực đổi mật khẩu.
        </p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
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
          <button
            type="submit"
            className="btn w-100 fw-bold rounded-pill"
            style={{ backgroundColor: "#ff7a18", color: "#fff" }}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi mã xác thực"}
          </button>
        </form>
        <div className="text-center mt-3">
          <button
            className="btn btn-link fw-bold"
            style={{ color: "#ff7a18", textDecoration: "underline" }}
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;