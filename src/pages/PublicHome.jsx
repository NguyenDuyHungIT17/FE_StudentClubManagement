import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bg from "../assets/bg.jpg";

// Import logo CLB (giả sử đã có các file clb1.png, clb2.png,...)
import clb1 from "../assets/clb1.png";
import clb2 from "../assets/clb2.png";
import clb3 from "../assets/clb3.png";
import clb4 from "../assets/clb4.png";
import clb5 from "../assets/clb5.png";
import clb6 from "../assets/clb6.png";
// ...existing code...

const clubLogos = [clb1, clb2, clb3, clb4, clb5, clb6];


const CARD_BG = [
  "#fff7ed", "#fef9c3", "#e0f2fe", "#fce7f3", "#f1f5f9", "#f3e8ff"
];

const PublicHome = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://localhost:7251/api/Clubs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Lỗi khi lấy danh sách CLB");
        const data = await res.json();
        setClubs(data);
      } catch (err) {
        setClubs([]);
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
    <div style={{ minHeight: "100vh", background: "#f8fafc", width: "100vw", overflowX: "hidden" }}>
      {/* Header */}
      <nav
        style={{
          background: "#ea580c",
          padding: "0 0 0 0",
          width: "100vw",
          boxShadow: "0 2px 12px #ea580c22",
        }}
        className="d-flex align-items-center justify-content-between"
      >
        <div className="d-flex align-items-center px-4 py-2">
          <img src={logo} alt="logo" style={{ height: 48, borderRadius: 12, background: "#fff", marginRight: 14 }} />
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: 26, letterSpacing: 1 }}>
            Student Club
          </span>
        </div>
      </nav>

      {/* Banner */}
      <div
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "320px",
          width: "100vw",
        }}
      >
        <div style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          padding: "30px 50px",
          borderRadius: "18px",
          maxWidth: 700,
          margin: "0 auto"
        }}>
          <h1 className="fw-bold" style={{ fontSize: 38, letterSpacing: 1 }}>Chào mừng đến với Student Club</h1>
          <p className="fs-5" style={{ fontSize: 20 }}>Kết nối – Học hỏi – Phát triển</p>
        </div>
      </div>

      {/* Danh sách CLB */}
      <div className="container-fluid py-5" style={{ maxWidth: 1400 }}>
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#ea580c", fontSize: 32, letterSpacing: 1 }}>
          Danh sách Câu lạc bộ
        </h2>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
          <div className="row justify-content-center" style={{ minHeight: 400 }}>
            {currentClubs.map((club, idx) => (
              <div
                key={club.clubId}
                className="col-12 col-md-6 col-lg-5 px-4 mb-5"
                style={{
                  marginTop: idx % 2 === 1 ? "50px" : "0px",
                  flex: "1 0 45%",
                  minWidth: 320,
                  maxWidth: 480,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  className="shadow-lg border-0"
                  style={{
                    borderRadius: "20px",
                    background: CARD_BG[idx % CARD_BG.length],
                    color: "#1f2937",
                    width: "100%",
                    minHeight: 260,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 8px 32px #ea580c22",
                    transition: "all 0.3s",
                  }}
                >
                  <div className="d-flex align-items-center px-4 pt-4 pb-2">
                    <img
                      src={clubLogos[idx % clubLogos.length]}
                      alt="clb"
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 16,
                        objectFit: "cover",
                        boxShadow: "0 2px 8px #ea580c22",
                        marginRight: 18,
                        background: "#fff",
                      }}
                    />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ fontSize: 22, color: "#ea580c" }}>
                        {club.clubName}
                      </h5>
                      <div style={{ color: "#7c4700", fontWeight: 500, fontSize: 15 }}>
                        Trưởng CLB: {club.leaderName}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-2" style={{ fontSize: 16, color: "#374151" }}>
                    {club.description}
                  </div>
                  <div className="px-4 pb-4 mt-auto text-end">
                    <button
                      className="btn"
                      style={{
                        background: "#ea580c",
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: 12,
                        padding: "8px 22px",
                        fontSize: 16,
                        boxShadow: "0 2px 8px #ea580c22",
                        letterSpacing: 1,
                      }}
                      onClick={() => navigate(`/clubs/${club.clubId}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Thêm các thẻ rỗng để lấp đầy nếu cần */}
            {currentClubs.length < 4 &&
              [...Array(4 - currentClubs.length)].map((_, idx) => (
                <div key={`empty-${idx}`} className="col-12 col-md-6 col-lg-5 px-4 mb-5" style={{ visibility: "hidden" }}></div>
              ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="w-100" style={{ backgroundColor: "#fff7ed" }}>
        <nav>
          <ul className="pagination justify-content-center m-0 py-3">
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className="page-item"
                style={{ cursor: "pointer", margin: "0 5px" }}
                onClick={() => setCurrentPage(i + 1)}
              >
                <span
                  className="page-link"
                  style={{
                    borderRadius: "50%",
                    width: "42px",
                    height: "42px",
                    lineHeight: "42px",
                    textAlign: "center",
                    backgroundColor: currentPage === i + 1 ? "#ea580c" : "#fff",
                    color: currentPage === i + 1 ? "#fff" : "#ea580c",
                    fontWeight: "600",
                    border: "none",
                    transition: "all 0.3s",
                  }}
                >
                  {i + 1}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#ea580c" }} className="text-white text-center py-3 mt-0">
        <p className="mb-0" style={{ letterSpacing: 1 }}>© 2025 Student Club - All rights reserved</p>
      </footer>
    </div>
  );
};

export default PublicHome;