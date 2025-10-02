import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";
import bg from "../assets/bg.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        throw new Error(errData.message || "Sai email hoặc mật khẩu");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullName", data.fullName);

      // Chuyển trang theo role
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "leader") navigate("/leader");
      else if (data.role === "member") navigate("/member");
      else navigate("/home");
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
        {/* Logo + App Name */}
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: "80px" }} />
          <h3 className="mt-3 fw-bold" style={{ color: "#ff7a18" }}>
            Student Club
          </h3>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Quản lý CLB sinh viên dễ dàng
          </p>
        </div>

        <h5 className="fw-bold mb-3 text-center" style={{ color: "#ff7a18" }}>
          Đăng nhập
        </h5>

        {/* Error */}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        {/* Login Form */}
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
            <label className="form-label fw-semibold">Mật khẩu</label>
            <input
              type="password"
              className="form-control rounded-pill"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold rounded-pill"
            style={{ backgroundColor: "#ff7a18", color: "#fff" }}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <div className="text-center mt-3">
          <button
            className="btn btn-link fw-bold"
            style={{ color: "#ff7a18", textDecoration: "underline" }}
            onClick={() => navigate("/forgot-password")}
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
