import React, { useState } from "react";
import { ArrowLeft, ArrowRight, AlertCircle, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthTheme.css";
import logo from "../assets/logo_ngang.svg";
import { API_BASE_URL } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/Auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Không gửi được mã xác thực.");
      }

      setSuccess("Mã xác thực đã được gửi. Chuyển sang bước đặt lại mật khẩu...");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 800);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-banner">
        <img src={logo} alt="Logo" style={{ width: 420, maxWidth: "90%" }} />
      </div>

      <div className="auth-form-section">
        <div className="auth-box" style={{ maxWidth: 460 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
              marginBottom: 20,
            }}
          >
            <KeyRound size={28} />
          </div>

          <h2 className="auth-title">Quên mật khẩu</h2>
          <p className="auth-subtitle" style={{ marginBottom: 24, lineHeight: 1.6 }}>
            Nhập email đăng nhập để nhận mã xác thực và chuyển sang bước đặt lại mật khẩu.
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              marginBottom: 24,
              padding: 18,
              borderRadius: 16,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center", color: "#334155", fontSize: 14, fontWeight: 600 }}>
              <ShieldCheck size={18} color="#16a34a" />
              Hệ thống sẽ gửi mã xác thực về email của bạn
            </div>
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Sau khi nhận mã, bạn sẽ được chuyển sang màn hình nhập mã và đổi mật khẩu mới.
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "#ecfdf5",
                color: "#047857",
                padding: 12,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 20,
                border: "1px solid #a7f3d0",
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Đang gửi..." : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Gửi mã xác thực <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              marginTop: 18,
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
