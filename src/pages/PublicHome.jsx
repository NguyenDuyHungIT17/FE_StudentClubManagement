import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, LogIn, X, Star, Calendar, MapPin, 
  Users, Info, ArrowLeft, Home, MessageSquare, CheckCircle2 
} from "lucide-react";
import logo from "../assets/logo.png";
import bg from "../assets/bg.jpg";

// Assets
import clb1 from "../assets/clb1.png";
import clb2 from "../assets/clb2.png";
import clb3 from "../assets/clb3.png";
import clb4 from "../assets/clb4.png";
import clb5 from "../assets/clb5.png";
import clb6 from "../assets/clb6.png";

const clubLogos = [clb1, clb2, clb3, clb4, clb5, clb6];
const ORANGE = "#fb923c";
const ORANGE_DARK = "#ea580c";

const PublicHome = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showClubModal, setShowClubModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRegisterForEvent, setShowRegisterForEvent] = useState(null);
  const [showFeedbackForEvent, setShowFeedbackForEvent] = useState(null);
  const [checkNameInput, setCheckNameInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [actionSuccessMap, setActionSuccessMap] = useState({});
  const [actionErrorMap, setActionErrorMap] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch("https://localhost:7251/api/Clubs");
      const data = await res.json();
      setClubs(data);
    } catch (err) {
      console.error("Lỗi fetch CLB:", err);
    } finally {
      setLoading(false);
    }
  };

  const openClubModal = async (club) => {
    setSelectedClub(club);
    setShowClubModal(true);
    setEventLoading(true);
    try {
      const token = localStorage.getItem("token");
      let res = await fetch(`https://localhost:7251/api/Event/event/${club.clubId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      let data = [];
      if (res.ok) data = await res.json();
      
      if (!data || data.length === 0) {
        res = await fetch(`https://localhost:7251/publicEvents/club?clubId=${club.clubId}`);
        if (res.ok) data = await res.json();
      }

      const normalized = (data || []).map((e) => ({
        ...e,
        eventId: e.eventId || e.EventId || e.id || null,
      }));
      setClubEvents(normalized);
    } catch (err) {
      setClubEvents([]);
    } finally {
      setEventLoading(false);
    }
  };

  const getToken = () => localStorage.getItem("token");

  const getUserIdFromToken = () => {
    try {
      const token = getToken();
      if (!token) return 0;
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      return parseInt(decoded.sub || decoded.userId || 0, 10) || 0;
    } catch (e) { return 0; }
  };

  const handleRegisterConfirm = async (ev) => {
    setActionLoading(true);
    const eventKey = ev.eventId || ev.id || ev.title;
    setActionErrorMap((m) => ({ ...m, [eventKey]: null }));
    setActionSuccessMap((m) => ({ ...m, [eventKey]: null }));
    
    try {
      const token = getToken();
      const userId = getUserIdFromToken();
      const eventId = Number(ev.eventId || ev.EventId || ev.id);
      const checkName = checkNameInput.trim() || localStorage.getItem("fullName") || "Khách ẩn danh";

      const res = await fetch("https://localhost:7251/api/EventRegistrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ eventId, userId: userId || 0, checkedIn: true, checkName }),
      });

      if (!res.ok) throw new Error("Đăng ký thất bại");

      setRegisteredEvents((s) => [...new Set([...s, eventId])]);
      setActionSuccessMap((m) => ({ ...m, [eventId]: `Đã đăng ký thành công!` }));
      setShowRegisterForEvent(null);
      setCheckNameInput("");
    } catch (err) {
      setActionErrorMap((m) => ({ ...m, [eventKey]: err.message }));
    } finally { setActionLoading(false); }
  };

  const handleFeedbackConfirm = async (ev) => {
    setActionLoading(true);
    const eventKey = `fb-${ev.eventId || ev.id || ev.title}`;
    try {
      const token = getToken();
      const body = {
        clubId: selectedClub.clubId,
        eventId: Number(ev.eventId || ev.id),
        comment: feedbackInput.trim() || "Tốt",
        rating: Number(ratingInput),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await fetch("https://localhost:7251/api/Feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Gửi feedback thất bại");

      setActionSuccessMap((m) => ({ ...m, [eventKey]: "Cảm ơn bạn!" }));
      setTimeout(() => setShowFeedbackForEvent(null), 1500);
    } catch (err) {
      setActionErrorMap((m) => ({ ...m, [eventKey]: err.message }));
    } finally { setActionLoading(false); }
  };

  const closeClubModal = () => {
    setShowClubModal(false);
    setShowRegisterForEvent(null);
    setShowFeedbackForEvent(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", width: "100%", overflowX: "hidden", fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- NAVIGATION BAR --- */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000, background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0" }}>
        <nav style={{ padding: "12px 5%" }} className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
              <img src={logo} alt="Logo" style={{ height: "42px", marginRight: "10px" }} />
              <span style={{ fontSize: "22px", fontWeight: "800", color: ORANGE_DARK, letterSpacing: "-1px" }}>STUDENT CLUB</span>
            </div>
            
            <button 
              onClick={() => navigate("/")}
              className="btn d-none d-md-flex align-items-center gap-2 fw-semibold" 
              style={{ color: "#64748b", transition: "0.2s" }}
            >
              <Home size={18} /> Trang chủ
            </button>
          </div>

          <div className="d-none d-lg-flex flex-grow-1 mx-5" style={{ maxWidth: "500px" }}>
            <div className="position-relative w-100">
              <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18}/>
              <input 
                className="form-control border-0 ps-5" 
                placeholder="Tìm kiếm CLB..." 
                style={{ background: "#f1f5f9", height: "45px", borderRadius: "12px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn fw-bold px-4 d-flex align-items-center gap-2" 
              style={{ background: ORANGE_DARK, color: "#fff", borderRadius: "10px", height: "45px", boxShadow: `0 4px 12px ${ORANGE}44` }}
              onClick={() => navigate("/login")}
            >
              <LogIn size={18}/> <span>Đăng nhập</span>
            </button>
          </div>
        </nav>
      </header>

      <main style={{ paddingTop: "80px" }}>
        {/* --- HERO SECTION --- */}
        <section style={{ 
          height: "420px", 
          background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${bg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textAlign: "center"
        }}>
          <div style={{ maxWidth: "800px", padding: "0 20px" }}>
            <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: "-1px" }}>Khám phá cộng đồng của bạn</h1>
            <p className="fs-5 opacity-75 mb-0">Nơi kết nối đam mê, rèn luyện kỹ năng và tạo nên những kỷ niệm đáng nhớ tại Student Club Portal.</p>
          </div>
        </section>

        {/* --- CLUB LIST --- */}
        <section style={{ padding: "60px 5%" }}>
          <div className="mb-5">
            <h2 className="fw-bold text-dark mb-1">Câu lạc bộ nổi bật</h2>
            <p className="text-muted">Lựa chọn môi trường phù hợp để phát triển bản thân</p>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
          ) : (
            <div className="row g-4">
              {clubs.filter(c => c.clubName.toLowerCase().includes(searchTerm.toLowerCase())).map((club, idx) => (
                <div key={club.clubId} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div 
                    className="card h-100 border-0" 
                    onClick={() => openClubModal(club)}
                    style={{ 
                      borderRadius: "20px", padding: "10px", transition: "0.3s", cursor: "pointer",
                      background: "#fff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div className="card-body">
                      <div className="mb-3 overflow-hidden shadow-sm" style={{ width: "64px", height: "64px", borderRadius: "14px", background: "#fff" }}>
                        <img src={clubLogos[idx % 6]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="logo" />
                      </div>
                      <h5 className="fw-bold text-dark mb-2 text-truncate">{club.clubName}</h5>
                      <p className="text-muted small mb-4" style={{ height: "60px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                        {club.description || "Chưa có mô tả chi tiết cho câu lạc bộ này."}
                      </p>
                      <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                         <span className="badge" style={{ background: `${ORANGE}22`, color: ORANGE_DARK }}>Xem chi tiết</span>
                         <div className="text-muted small d-flex align-items-center gap-1"><Users size={14}/> {Math.floor(Math.random() * 50) + 10}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* --- CLUB DETAIL MODAL --- */}
      {showClubModal && selectedClub && (
        <div className="modal d-block" style={{ background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)", zIndex: 1050 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-2xl" style={{ borderRadius: "24px", overflow: "hidden", height: "85vh" }}>
              <div className="row g-0 h-100">
                {/* Sidebar Info */}
                <div className="col-lg-4 p-5 d-none d-lg-flex flex-column" style={{ background: `linear-gradient(135deg, ${ORANGE_DARK}, ${ORANGE})`, color: "#fff" }}>
                  <button onClick={closeClubModal} className="btn text-white p-0 mb-5 d-flex align-items-center gap-2 opacity-75 hover-opacity-100">
                    <ArrowLeft size={20}/> Quay lại
                  </button>
                  <h2 className="fw-bold mb-3">{selectedClub.clubName}</h2>
                  <p className="opacity-90 mb-5" style={{ lineHeight: "1.7" }}>{selectedClub.description}</p>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-4" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <Users size={24}/> <span>Trưởng CLB: <b>{selectedClub.leaderName || "Admin"}</b></span>
                    </div>
                  </div>
                </div>

                {/* Main Content (Events) */}
                <div className="col-lg-8 p-4 p-md-5 bg-white position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <h4 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                      <Calendar color={ORANGE_DARK}/> Danh sách sự kiện
                    </h4>
                    <button className="btn-close d-lg-none" onClick={closeClubModal}></button>
                  </div>

                  {eventLoading ? (
                    <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
                  ) : clubEvents.length === 0 ? (
                    <div className="text-center py-5 bg-light rounded-4">
                      <Info size={40} className="text-muted mb-2"/>
                      <p className="text-muted m-0">Hiện chưa có sự kiện nào được công bố.</p>
                    </div>
                  ) : (
                    <div className="pe-2">
                      {clubEvents.map((ev, idx) => {
                        const eid = Number(ev.eventId || ev.id || 0);
                        const fbKey = `fb-${eid || ev.title}`;
                        return (
                          <div key={idx} className="mb-4 p-4 border rounded-4 shadow-sm position-relative" style={{ transition: "0.3s" }}>
                            <div className="row align-items-start">
                              <div className="col-md-8">
                                 <span className="badge mb-2" style={{ background: "#f1f5f9", color: "#475569", padding: "6px 12px" }}>
                                    {new Date(ev.eventDate).toLocaleDateString('vi-VN')}
                                 </span>
                                 <h5 className="fw-bold text-dark mb-2">{ev.title}</h5>
                                 <p className="text-muted small mb-0">{ev.description}</p>
                              </div>
                              <div className="col-md-4 text-end d-flex flex-column gap-2">
                                 {registeredEvents.includes(eid) ? (
                                   <button className="btn btn-success fw-bold w-100 rounded-pill disabled d-flex align-items-center justify-content-center gap-2">
                                     <CheckCircle2 size={16}/> Đã tham gia
                                   </button>
                                 ) : (
                                   <button className="btn btn-warning fw-bold w-100 rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => setShowRegisterForEvent(ev)}>
                                     Check-in
                                   </button>
                                 )}
                                 <button className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => setShowFeedbackForEvent(ev)}>
                                   <MessageSquare size={16}/> Feedback
                                 </button>
                              </div>
                            </div>

                            {/* --- FORMS --- */}
                            {showRegisterForEvent === ev && (
                              <div className="mt-3 p-3 bg-light rounded-4 border-0">
                                <label className="form-label small fw-bold text-dark">Họ và tên của bạn:</label>
                                <div className="d-flex gap-2">
                                  <input className="form-control border-0 shadow-sm" value={checkNameInput} onChange={(e) => setCheckNameInput(e.target.value)} placeholder="Nhập tên để điểm danh..." style={{ borderRadius: "10px" }} />
                                  <button className="btn btn-primary px-4 shadow-sm" style={{ borderRadius: "10px" }} onClick={() => handleRegisterConfirm(ev)} disabled={actionLoading}>Lưu</button>
                                  <button className="btn btn-white border shadow-sm" style={{ borderRadius: "10px" }} onClick={() => setShowRegisterForEvent(null)}>Hủy</button>
                                </div>
                                {actionSuccessMap[eid] && <div className="text-success small mt-2 fw-bold">{actionSuccessMap[eid]}</div>}
                              </div>
                            )}

                            {showFeedbackForEvent === ev && (
                              <div className="mt-3 p-3 bg-light rounded-4 border-0">
                                <textarea className="form-control border-0 shadow-sm mb-2" rows="2" value={feedbackInput} onChange={(e) => setFeedbackInput(e.target.value)} placeholder="Cảm nghĩ của bạn về sự kiện..." style={{ borderRadius: "10px" }}></textarea>
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex gap-1">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                      <Star key={n} size={20} style={{ cursor: "pointer" }} fill={ratingInput >= n ? ORANGE : "none"} color={ORANGE} onClick={() => setRatingInput(n)} />
                                    ))}
                                  </div>
                                  <div className="d-flex gap-2">
                                    <button className="btn btn-primary btn-sm px-4" style={{ borderRadius: "8px" }} onClick={() => handleFeedbackConfirm(ev)} disabled={actionLoading}>Gửi</button>
                                    <button className="btn btn-white btn-sm border" style={{ borderRadius: "8px" }} onClick={() => setShowFeedbackForEvent(null)}>Hủy</button>
                                  </div>
                                </div>
                                {actionSuccessMap[fbKey] && <div className="text-success small mt-2 fw-bold">{actionSuccessMap[fbKey]}</div>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "40px 5% 20px" }}>
         <div className="text-center">
            <img src={logo} alt="logo" style={{ height: "40px", opacity: 0.8, marginBottom: "20px" }} />
            <p className="small mb-0">© 2025 Student Club Portal • Hệ thống quản lý CLB Sinh viên thông minh</p>
         </div>
      </footer>
    </div>
  );
};

export default PublicHome;