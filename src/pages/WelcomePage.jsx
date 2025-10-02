import { useNavigate } from "react-router-dom";
import { FaUser, FaUserSecret } from "react-icons/fa";
import logo from "../assets/logo.png"; // logo
import bg from "../assets/bg.jpg";     // ảnh nền giống Login

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card shadow-lg p-5 text-center"
        style={{
          width: "420px",
          borderRadius: "20px",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        {/* Logo + tiêu đề */}
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: "80px" }} />
          <h3 className="mt-3 fw-bold" style={{ color: "#ff7a18" }}>
            Student Club
          </h3>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Quản lý CLB sinh viên dễ dàng
          </p>
        </div>

        {/* Tiêu đề trang Welcome */}
        <h5 className="fw-bold mb-4" style={{ color: "#ff7a18" }}>
          Chọn cách bạn muốn tiếp tục
        </h5>

        {/* Nút hành động */}
        <div className="d-flex flex-column gap-3">
          <button
            onClick={() => navigate("/login")}
            className="btn fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
            style={{ backgroundColor: "#ff7a18", color: "#fff" }}
          >
            <FaUser /> Đăng nhập
          </button>

          <button
            onClick={() => navigate("/public")}
            className="btn fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
            style={{
              border: "2px solid #ff7a18",
              color: "#ff7a18",
              backgroundColor: "#fff",
            }}
          >
            <FaUserSecret /> Tiếp tục với tư cách Khách
          </button>
        </div>

        {/* Footer nhỏ */}
        <p className="mt-4 mb-0 text-muted" style={{ fontSize: "12px" }}>
          © 2025 Student Club. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
