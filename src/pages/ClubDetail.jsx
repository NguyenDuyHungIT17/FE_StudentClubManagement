import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import club1 from "../assets/clb1.png";
import club2 from "../assets/clb2.png";
import club3 from "../assets/clb3.png";
import club4 from "../assets/clb4.png";
import club5 from "../assets/clb5.png";
import club6 from "../assets/clb6.png";

const clubLogos = [club1, club2, club3, club4, club5, club6];

const ClubDetail = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sự kiện mẫu (fix cứng)
  const events = [
    {
      title: "Workshop: Lập trình Web hiện đại",
      date: "2025-10-10",
      desc: "Buổi chia sẻ về ReactJS, NodeJS và các công nghệ web mới.",
    },
    {
      title: "Teambuilding CLB",
      date: "2025-11-05",
      desc: "Hoạt động gắn kết thành viên CLB tại công viên Yên Sở.",
    },
  ];

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://localhost:7251/api/Clubs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Lỗi khi lấy thông tin CLB");
        const data = await res.json();
        const found = data.find((c) => String(c.clubId) === String(clubId));
        setClub(found || null);
      } catch (err) {
        setClub(null);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [clubId]);

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
        <button
          className="btn"
          style={{
            background: "#fff",
            color: "#ea580c",
            fontWeight: "bold",
            borderRadius: 12,
            marginRight: 24,
            fontSize: 16,
            letterSpacing: 1,
            border: "none",
            boxShadow: "0 2px 8px #ea580c22",
          }}
          onClick={() => navigate("/")}
        >
          Trang chủ
        </button>
      </nav>

      <div className="container py-5" style={{ maxWidth: 900 }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : !club ? (
          <div className="text-center py-5 text-danger fw-bold fs-4">
            Không tìm thấy thông tin câu lạc bộ!
          </div>
        ) : (
          <div
            className="shadow-lg border-0 mx-auto"
            style={{
              borderRadius: "22px",
              background: "#fff7ed",
              color: "#1f2937",
              width: "100%",
              minHeight: 320,
              boxShadow: "0 8px 32px #ea580c22",
              padding: "40px 32px",
              marginTop: 24,
            }}
          >
            <div className="d-flex align-items-center mb-4">
              <img
                src={clubLogos[(club.clubId - 1) % clubLogos.length]}
                alt="clb"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 18,
                  objectFit: "cover",
                  boxShadow: "0 2px 8px #ea580c22",
                  marginRight: 28,
                  background: "#fff",
                }}
              />
              <div>
                <h2 className="fw-bold mb-1" style={{ fontSize: 30, color: "#ea580c" }}>
                  {club.clubName}
                </h2>
                <div style={{ color: "#7c4700", fontWeight: 500, fontSize: 17 }}>
                  Trưởng CLB: {club.leaderName}
                </div>
                <div style={{ color: "#374151", fontSize: 16, marginTop: 8 }}>
                  {club.description}
                </div>
              </div>
            </div>
            <hr />
            <h4 className="fw-bold mb-3" style={{ color: "#ea580c" }}>Sự kiện nổi bật</h4>
            <div>
              {events.map((ev, idx) => (
                <div
                  key={idx}
                  className="mb-4 p-3"
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    boxShadow: "0 2px 8px #ea580c22",
                  }}
                >
                  <div className="fw-bold" style={{ fontSize: 18 }}>{ev.title}</div>
                  <div style={{ color: "#ea580c", fontWeight: 500 }}>{ev.date}</div>
                  <div style={{ color: "#374151" }}>{ev.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#ea580c" }} className="text-white text-center py-3 mt-0">
        <p className="mb-0" style={{ letterSpacing: 1 }}>© 2025 Student Club - All rights reserved</p>
      </footer>
    </div>
  );
};

export default ClubDetail;