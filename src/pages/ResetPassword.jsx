import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, ShieldCheck } from "lucide-react";
import "../styles/AuthTheme.css";
import logo from "../assets/logo_ngang.svg";
import { API_BASE_URL } from "../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = useMemo(() => location.state?.email || "", [location.state]);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Vui lòng nhập email xác thực.");
      return;
    }
    if (!code.trim()) {
      setError("Vui lòng nhập mã xác thực.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          newPassword,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Không thể đặt lại mật khẩu.");
      }

      const responseText = await res.text();
      setMessage(responseText || "Đặt lại mật khẩu thành công.");
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1800);
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
        <div className="auth-box" style={{ maxWidth: 480 }}>
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

          <h2 className="auth-title">Đặt lại mật khẩu</h2>
          <p className="auth-subtitle" style={{ marginBottom: 24, lineHeight: 1.6 }}>
            Nhập mã xác thực đã nhận trong email, sau đó đặt mật khẩu mới cho tài khoản của bạn.
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
              Mã xác thực thường là mã ngắn được gửi tới email
            </div>
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Sau khi đổi thành công, hệ thống sẽ tự động đưa bạn về trang đăng nhập.
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {showSuccess && (
            <div
              style={{
                background: "#ecfdf5",
                color: "#047857",
                padding: 14,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 20,
                border: "1px solid #a7f3d0",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <CheckCircle2 size={18} />
              {message}
            </div>
          )}

          {!showSuccess && (
            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label>Email xác thực</label>
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

              <div className="auth-input-group">
                <label>Mã xác thực</label>
                <div className="auth-input-wrapper">
                  <ShieldCheck size={18} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Nhập mã đã nhận qua email"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    disabled={loading}
                    maxLength={12}
                    style={{ letterSpacing: "0.08em" }}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Mật khẩu mới</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Xác nhận mật khẩu mới</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
              </button>
            </form>
          )}

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

export default ResetPassword;
