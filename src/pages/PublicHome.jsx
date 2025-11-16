import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, LogIn, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import bg from "../assets/bg.jpg";
import clb1 from "../assets/clb1.png";
import clb2 from "../assets/clb2.png";
import clb3 from "../assets/clb3.png";
import clb4 from "../assets/clb4.png";
import clb5 from "../assets/clb5.png";
import clb6 from "../assets/clb6.png";

const clubLogos = [clb1, clb2, clb3, clb4, clb5, clb6];
const CARD_BG = ["#fff7ed", "#fef9c3", "#e0f2fe", "#fce7f3", "#f1f5f9", "#f3e8ff"];
const ORANGE = "#fb923c";
const ORANGE_DARK = "#ea580c"; 

const PublicHome = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const clubsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch("https://localhost:7251/api/Clubs");
        if (!res.ok) throw new Error("Lỗi khi lấy danh sách CLB");
        const data = await res.json();
        setClubs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const indexOfLast = currentPage * clubsPerPage;
  const indexOfFirst = indexOfLast - clubsPerPage;
  const currentClubs = clubs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(clubs.length / clubsPerPage);

  return (
    <div style={{ minHeight: "100vh", background: "#fff7ed", width: "100%" }}>
      {/* Sticky Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "#fff",
          borderBottom: "2px solid #fed7aa",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Top bar */}
        <div 
          style={{
            background: ORANGE_DARK,
            color: "#fff",
            padding: "8px 0",
            fontSize: "14px"
          }}
        >
          <div className="container-fluid px-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>📱 Tải ứng dụng</div>
              <div>
                <span className="me-3">📞 Hotline: 1900 xxxx</span>
                <span>📧 Email: support@studentclub.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="container-fluid px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: "50px",
                  width: "50px",
                  borderRadius: "12px",
                  marginRight: "16px",
                }}  
              />
              <h1
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: ORANGE_DARK,
                  letterSpacing: "0.5px",
                }}
              >
                Student Club
              </h1>
            </div>

            {/* Search bar */}
            <div 
              className="d-none d-md-flex"
              style={{
                flex: "0 1 400px",
                marginLeft: "32px",
                marginRight: "32px"
              }}
            >
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm câu lạc bộ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderRadius: "12px 0 0 12px",
                    border: `1px solid ${ORANGE}`,
                    padding: "10px 16px"
                  }}
                />
                <button
                  className="btn"
                  style={{
                    background: ORANGE,
                    color: "#fff",
                    borderRadius: "0 12px 12px 0",
                    border: "none"
                  }}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="d-none d-md-flex align-items-center">
              <div className="dropdown me-3">
                <button
                  className="btn fw-bold d-flex align-items-center"
                  style={{ color: ORANGE_DARK }}
                >
                  Danh mục <ChevronDown size={20} className="ms-1" />
                </button>
              </div>
              <button
                className="btn fw-bold"
                style={{
                  background: ORANGE,
                  color: "#fff",
                  padding: "10px 24px",
                  borderRadius: "12px",
                  border: "none",
                  letterSpacing: "0.5px",
                  boxShadow: "0 2px 8px #fb923c33",
                }}
                onClick={() => navigate("/login")}
              >
                <LogIn size={20} className="me-2" />
                Đăng nhập
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="btn d-md-none"
              onClick={() => setShowMenu(!showMenu)}
              style={{ color: ORANGE_DARK }}
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {showMenu && (
            <div
              className="d-md-none"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                padding: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm câu lạc bộ..."
                  style={{
                    borderRadius: "12px",
                    border: `1px solid ${ORANGE}`,
                    padding: "10px 16px"
                  }}
                />
              </div>
              <button
                className="btn w-100 fw-bold mb-2"
                style={{ color: ORANGE_DARK }}
              >
                Danh mục
              </button>
              <button
                className="btn w-100 fw-bold"
                style={{
                  background: ORANGE,
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "12px",
                }}
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
            </div>
          )}
        </nav>
      </header>      {/* Main content with padding for fixed header */}
      <main style={{ paddingTop: "140px" }}>
        {/* Hero Section */}
        <section
          style={{
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            padding: "80px 0",
            color: "#fff",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div className="container">
            <h1 className="display-4 fw-bold mb-4" style={{ letterSpacing: "1px" }}>
              Khám phá các Câu lạc bộ
            </h1>
            <p className="lead" style={{ maxWidth: "700px", margin: "0 auto", fontSize: "18px" }}>
              Tham gia các câu lạc bộ để phát triển kỹ năng, mở rộng mạng lưới và tạo nên những kỷ niệm đáng nhớ
            </p>
          </div>
        </section>

        {/* Clubs Section */}
        <section className="py-5">
          <div className="container-fluid px-4">
            <h2 className="text-center fw-bold mb-5" style={{ color: ORANGE_DARK, fontSize: "32px" }}>
              Danh sách Câu lạc bộ
            </h2>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {currentClubs.map((club, index) => (
                    <div key={club.clubId} className="col-sm-6 col-lg-4 col-xl-3">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          background: CARD_BG[index % CARD_BG.length],
                          borderRadius: "20px",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow = "0 10px 20px rgba(251, 146, 60, 0.2)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                        }}
                        onClick={() => navigate(`/club/${club.clubId}`)}
                      >
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <img
                              src={clubLogos[index % clubLogos.length]}
                              alt={club.clubName}
                              style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "16px",
                                marginRight: "16px",
                                objectFit: "cover",
                                background: "#fff",
                                padding: "8px",
                              }}
                            />
                            <div>
                              <h5
                                className="card-title mb-1 fw-bold"
                                style={{ fontSize: "20px", color: "#1f2937" }}
                              >
                                {club.clubName}
                              </h5>
                              <p
                                className="card-subtitle"
                                style={{ color: "#4b5563", fontSize: "14px" }}
                              >
                                Trưởng CLB: {club.leaderName || "Cập nhật sau"}
                              </p>
                            </div>
                          </div>
                          <p
                            className="card-text"
                            style={{
                              color: "#374151",
                              fontSize: "15px",
                              lineHeight: "1.5",
                              marginBottom: "0",
                            }}
                          >
                            {club.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                              background: "#fff",
                              color: ORANGE,
                              border: `1px solid ${ORANGE}`,
                              borderRadius: "8px",
                              margin: "0 4px",
                              padding: "8px 16px",
                            }}
                          >
                            Trước
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(index + 1)}
                              style={{
                                background: currentPage === index + 1 ? ORANGE : "#fff",
                                color: currentPage === index + 1 ? "#fff" : ORANGE,
                                border: `1px solid ${ORANGE}`,
                                borderRadius: "8px",
                                margin: "0 4px",
                                padding: "8px 16px",
                                fontWeight: "500",
                              }}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                              background: "#fff",
                              color: ORANGE,
                              border: `1px solid ${ORANGE}`,
                              borderRadius: "8px",
                              margin: "0 4px",
                              padding: "8px 16px",
                            }}
                          >
                            Sau
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
                {/* Enhanced Footer */}
      <footer style={{ background: ORANGE_DARK, color: "#fff", padding: "48px 0 24px" }}>
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <h5 className="fw-bold mb-3">Về Student Club</h5>
              <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                Nền tảng kết nối và phát triển tài năng sinh viên thông qua các hoạt động câu lạc bộ đa dạng và phong phú.
              </p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold mb-3">Liên hệ</h5>
              <p style={{ fontSize: "14px", marginBottom: "8px" }}>📞 Hotline: 1900 xxxx</p>
              <p style={{ fontSize: "14px", marginBottom: "8px" }}>📧 Email: support@studentclub.com</p>
              <p style={{ fontSize: "14px" }}>🏢 Địa chỉ: TP. Hồ Chí Minh</p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold mb-3">Theo dõi chúng tôi</h5>
              <div className="d-flex gap-3">
                <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Facebook</a>
                <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Instagram</a>
                <a href="#" style={{ color: "#fff", textDecoration: "none" }}>LinkedIn</a>
              </div>
            </div>
          </div>
          <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <p className="text-center mb-0" style={{ fontSize: "14px", marginTop: "24px" }}>
            © 2025 Student Club - All rights reserved
          </p>
        </div>
      </footer>
      </main>
    </div>
  );
};
export default PublicHome;
