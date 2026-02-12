import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GuestChatWidget from "../components/chat/GuestChatWidget";
import { 
  Search, LogIn, X, Star, Calendar, MapPin, 
  Users, Info, ArrowLeft, Home, MessageSquare, CheckCircle2,
  ChevronRight, Sparkles, Globe, ShieldCheck
} from "lucide-react";

// Tông màu hiện đại: Indigo & Slate thay vì chỉ Cam đơn thuần
const PRIMARY = "#6366f1"; // Indigo hiện đại
const ACCENT = "#fb923c"; // Orange để giữ brand cũ
const DARK = "#0f172a";

const PublicHome = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showClubModal, setShowClubModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => { fetchClubs(); }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch("https://localhost:7251/api/Clubs");
      const data = await res.json();
      setClubs(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div style={{ 
      backgroundColor: "#f8fafc", 
      minHeight: "100vh", 
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: "#1e293b"
    }}>
      
      {/* 1. NAVBAR - GLASSMORPHISM EFFECT */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 1000,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", height: "80px" }} className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-5">
            <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
              <div style={{ background: PRIMARY, padding: "8px", borderRadius: "12px", marginRight: "12px" }}>
                <Globe color="#fff" size={24} />
              </div>
              <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px", color: DARK }}>STUDENT<span style={{ color: PRIMARY }}>PORTAL</span></span>
            </div>
            
            <div className="d-none d-xl-flex gap-4">
              {["Khám phá", "Sự kiện", "Về chúng tôi"].map(item => (
                <a key={item} href="#" style={{ textDecoration: "none", color: "#64748b", fontWeight: "600", fontSize: "15px" }}>{item}</a>
              ))}
            </div>
          </div>

          <div className="d-flex align-items-center gap-4 flex-grow-1 justify-content-end">
            <div style={{ position: "relative", width: "300px" }} className="d-none d-lg-block">
              <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={16}/>
              <input 
                className="form-control border-0 ps-5" 
                placeholder="Tìm tên câu lạc bộ..." 
                style={{ background: "#f1f5f9", height: "45px", borderRadius: "25px", fontSize: "14px" }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn" 
              style={{ background: DARK, color: "#fff", borderRadius: "25px", padding: "10px 24px", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
              onClick={() => navigate("/login")}
            >
              <LogIn size={16}/> Đăng nhập
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION - BENTO STYLE */}
      <main style={{ paddingTop: "80px" }}>
        <section style={{ padding: "60px 2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ 
            background: `linear-gradient(135deg, ${DARK} 0%, #1e293b 100%)`,
            borderRadius: "32px", padding: "80px 60px", position: "relative", overflow: "hidden",
            minHeight: "450px", display: "flex", alignItems: "center"
          }}>
            {/* Background Decor */}
            <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "400px", height: "400px", background: PRIMARY, filter: "blur(150px)", opacity: 0.2 }}></div>
            
            <div style={{ position: "relative", zIndex: 1, maxWidth: "700px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: "100px", color: PRIMARY, marginBottom: "24px", fontSize: "14px", fontWeight: "600" }}>
                <Sparkles size={16}/> Nền tảng kết nối sinh viên thế hệ mới
              </div>
              <h1 style={{ fontSize: "64px", fontWeight: "850", color: "#fff", lineHeight: 1.1, marginBottom: "24px", letterSpacing: "-2px" }}>
                Khơi nguồn sáng tạo, <span style={{ color: PRIMARY }}>kết nối</span> đam mê.
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "18px", marginBottom: "40px", lineHeight: "1.6" }}>
                Hệ thống quản lý và tham gia câu lạc bộ hiện đại nhất dành cho sinh viên. Khám phá hàng trăm sự kiện và cộng đồng đang chờ đón bạn.
              </p>
              <div className="d-flex gap-3">
                <button className="btn" style={{ background: PRIMARY, color: "#fff", borderRadius: "12px", padding: "14px 32px", fontWeight: "700" }}>Bắt đầu ngay</button>
                <button className="btn" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "12px", padding: "14px 32px", fontWeight: "700" }}>Xem hướng dẫn</button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CLUB GRID - MODERN CARDS */}
        <section style={{ padding: "40px 2rem 100px", maxWidth: "1400px", margin: "0 auto" }}>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 style={{ fontSize: "32px", fontWeight: "800", color: DARK }}>Câu lạc bộ nổi bật</h2>
              <p style={{ color: "#64748b" }}>Những cộng đồng năng động nhất trong tuần này</p>
            </div>
            <button className="btn text-primary fw-bold d-flex align-items-center gap-2">Tất cả CLB <ChevronRight size={20}/></button>
          </div>

          <div className="row g-4">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="col-3"><div style={{ height: "300px", background: "#edf2f7", borderRadius: "24px" }} className="placeholder-glow"></div></div>)
            ) : (
              clubs.filter(c => c.clubName.toLowerCase().includes(searchTerm.toLowerCase())).map((club, idx) => (
                <div key={club.clubId} className="col-12 col-md-6 col-xl-3">
                  <div 
                    onClick={() => { setSelectedClub(club); setShowClubModal(true); }}
                    style={{ 
                      background: "#fff", borderRadius: "24px", padding: "24px", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer", border: "1px solid #f1f5f9", height: "100%", position: "relative"
                    }}
                    className="club-card-hover shadow-sm"
                  >
                    <div style={{ 
                      width: "60px", height: "60px", borderRadius: "16px", background: "#f8fafc",
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px",
                      border: "1px solid #e2e8f0"
                    }}>
                      {/* Logo giả lập */}
                      <span style={{ fontWeight: "800", color: PRIMARY }}>{club.clubName.charAt(0)}</span>
                    </div>
                    <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: DARK }}>{club.clubName}</h4>
                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5", marginBottom: "20px", height: "63px", overflow: "hidden" }}>
                      {club.description || "Tham gia để cùng phát triển các kỹ năng mềm và mở rộng mạng lưới quan hệ..."}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between pt-3" style={{ borderTop: "1px dashed #e2e8f0" }}>
                      <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px" }}>
                        <Users size={14} /> <span>120+ thành viên</span>
                      </div>
                      <div style={{ background: `${PRIMARY}15`, color: PRIMARY, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      {/* ✅ THÊM: Guest Chat Widget */}
      <GuestChatWidget clubId="default-club" clubName="StudentPortal Support" />
      
      {/* 4. MODAL - FULLSCREEN OVERLAY STYLE */}
      {showClubModal && (
        <div style={{ 
          position: "fixed", inset: 0, zIndex: 2000, 
          background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{ 
            width: "100%", maxWidth: "1200px", height: "90vh", background: "#fff", 
            borderRadius: "32px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            display: "flex"
          }}>
            {/* Modal Left: Info */}
            <div style={{ width: "35%", background: DARK, color: "#fff", padding: "60px", position: "relative" }}>
               <button onClick={() => setShowClubModal(false)} className="btn text-white p-0 mb-5 opacity-50"><ArrowLeft /> Quay lại</button>
               <h2 style={{ fontSize: "40px", fontWeight: "800", marginBottom: "24px" }}>{selectedClub?.clubName}</h2>
               <p style={{ color: "#94a3b8", lineHeight: "1.8", fontSize: "16px" }}>{selectedClub?.description}</p>
               <div style={{ marginTop: "40px" }}>
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <ShieldCheck color={PRIMARY} />
                    <div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Leader</div>
                      <div style={{ fontWeight: "600" }}>{selectedClub?.leaderName || "Admin User"}</div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Modal Right: Events */}
            <div style={{ flex: 1, padding: "60px", overflowY: "auto", background: "#f8fafc" }}>
               <div className="d-flex justify-content-between align-items-center mb-5">
                  <h3 style={{ fontWeight: "800", color: DARK }}>Sự kiện sắp tới</h3>
                  <X style={{ cursor: "pointer" }} onClick={() => setShowClubModal(false)} />
               </div>
               {/* Event Card Example */}
               <div style={{ background: "#fff", padding: "30px", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className="badge" style={{ background: `${PRIMARY}15`, color: PRIMARY, marginBottom: "12px" }}>Technical Event</span>
                      <h4 style={{ fontWeight: "700" }}>Workshop: UI/UX Design Trends 2026</h4>
                      <div className="d-flex gap-4 mt-3 text-muted" style={{ fontSize: "14px" }}>
                        <span className="d-flex align-items-center gap-1"><Calendar size={14}/> 20/05/2026</span>
                        <span className="d-flex align-items-center gap-1"><MapPin size={14}/> Hall A1, Campus</span>
                      </div>
                    </div>
                    <button className="btn" style={{ background: PRIMARY, color: "#fff", alignSelf: "center", borderRadius: "12px", padding: "12px 24px", fontWeight: "600" }}>Đăng ký ngay</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom CSS for animations */}
      <style>{`
        .club-card-hover:hover {
          transform: translateY(-10px);
          border-color: ${PRIMARY} !important;
          box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04) !important;
        }
      `}</style>
    </div>
  );
};

export default PublicHome;