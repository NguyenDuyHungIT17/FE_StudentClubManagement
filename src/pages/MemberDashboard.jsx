import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, Users, MessageSquare, LogOut, CheckCircle2, 
  Clock, MapPin, Star, ShieldCheck, User as UserIcon,
  ChevronRight, Filter, Bell, Search, LayoutDashboard, X
} from "lucide-react";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("fullName") || "Thành viên";
  const userId = localStorage.getItem("userId") || "0";

  useEffect(() => {
    if (!token) navigate("/login");
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API lấy sự kiện (Bao gồm cả private vì có Bearer Token)
      const res = await fetch("https://localhost:7251/api/Event", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEvents(data || []);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    setActionLoading(true);
    try {
      const res = await fetch("https://localhost:7251/api/EventRegistrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: parseInt(userId),
          checkedIn: false,
          checkName: fullName
        })
      });
      if (res.ok) {
        setRegisteredEventIds([...registeredEventIds, eventId]);
        alert("Đăng ký tham gia thành công!");
      }
    } catch (err) { alert("Lỗi đăng ký"); }
    finally { setActionLoading(false); }
  };

  const handleFeedback = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("https://localhost:7251/api/Feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: showFeedbackModal.eventId,
          clubId: showFeedbackModal.clubId || 1, // Giả định ClubId
          comment: feedbackInput,
          rating: ratingInput
        })
      });
      if (res.ok) {
        setShowFeedbackModal(null);
        setFeedbackInput("");
        alert("Gửi phản hồi thành công!");
      }
    } catch (err) { alert("Lỗi feedback"); }
    finally { setActionLoading(false); }
  };

  const filteredEvents = events.filter(ev => {
    if (activeTab === "private") return ev.isPrivate;
    if (activeTab === "public") return !ev.isPrivate;
    return true;
  });

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f0f2f5', display: 'flex', overflow: 'hidden' }}>
      
      {/* 1. SIDEBAR (Full Height) */}
      <aside style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', padding: '30px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
          <div style={{ background: '#10b981', padding: '10px', borderRadius: '12px' }}>
            <ShieldCheck color="white" size={28} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#111827', letterSpacing: '-0.5px' }}>MEMBER HUB</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button style={btnSidebarActive}><LayoutDashboard size={20}/> Tổng quan</button>
          <button style={btnSidebar}><Calendar size={20}/> Sự kiện của tôi</button>
          <button style={btnSidebar}><MessageSquare size={20}/> Phản hồi</button>
          <button style={btnSidebar}><Bell size={20}/> Thông báo</button>
        </nav>

        <button onClick={() => {localStorage.clear(); navigate('/login')}} style={btnLogout}>
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      {/* 2. MAIN CONTENT (16:9 Area) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', overflowY: 'auto' }}>
        
        {/* Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', margin: 0 }}>Chào buổi sáng, {fullName.split(' ').pop()}!</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>Hôm nay có {events.length} sự kiện đang chờ bạn khám phá.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'white', padding: '10px 20px', borderRadius: '50px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Search size={20} color="#9ca3af"/>
            <input placeholder="Tìm kiếm nhanh..." style={{ border: 'none', outline: 'none', width: '200px' }} />
          </div>
        </header>

        {/* Filters & Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setActiveTab("all")} style={activeTab === "all" ? tabActive : tabNormal}>Tất cả</button>
            <button onClick={() => setActiveTab("private")} style={activeTab === "private" ? tabActive : tabNormal}>Sự kiện nội bộ</button>
            <button onClick={() => setActiveTab("public")} style={activeTab === "public" ? tabActive : tabNormal}>Công khai</button>
          </div>
          <button style={tabNormal}><Filter size={16}/> Lọc nâng cao</button>
        </div>

        {/* BENTO GRID OF EVENTS */}
        {loading ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' }}>
            {filteredEvents.map((ev) => (
              <div key={ev.eventId} style={cardStyle}>
                <div style={{ position: 'relative', height: '160px', background: ev.isPrivate ? '#fef3c7' : '#dcfce7', borderRadius: '20px', marginBottom: '20px', overflow: 'hidden' }}>
                   <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.8)', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                      {ev.isPrivate ? "Lãnh đạo & Member" : "Public"}
                   </div>
                   <div style={{ padding: '30px' }}>
                      <Calendar size={40} color={ev.isPrivate ? '#d97706' : '#059669'} />
                   </div>
                </div>

                <div style={{ padding: '0 5px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px', color: '#1f2937' }}>{ev.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', height: '45px', overflow: 'hidden' }}>{ev.description}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
                    <div style={infoRow}><Clock size={16}/> {new Date(ev.eventDate).toLocaleString('vi-VN')}</div>
                    <div style={infoRow}><MapPin size={16}/> Hội trường SICT / Online</div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleRegister(ev.eventId)}
                      disabled={registeredEventIds.includes(ev.eventId)}
                      style={registeredEventIds.includes(ev.eventId) ? btnDisabled : btnPrimary}
                    >
                      {registeredEventIds.includes(ev.eventId) ? <CheckCircle2 size={18}/> : "Tham gia"}
                    </button>
                    <button onClick={() => setShowFeedbackModal(ev)} style={btnIcon}><MessageSquare size={20}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '800' }}>Cảm ơn bạn đã tham gia!</h3>
              <button onClick={() => setShowFeedbackModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X/></button>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '25px' }}>Hãy cho chúng tôi biết cảm nhận của bạn về sự kiện <b>{showFeedbackModal.title}</b></p>
            
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '10px' }}>Đánh giá của bạn</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
              {[1,2,3,4,5].map(num => (
                <Star 
                  key={num} 
                  size={32} 
                  onClick={() => setRatingInput(num)}
                  style={{ cursor: 'pointer', fill: ratingInput >= num ? '#fbbf24' : 'none', color: '#fbbf24' }}
                />
              ))}
            </div>

            <label style={{ fontWeight: '600', display: 'block', marginBottom: '10px' }}>Ý kiến đóng góp</label>
            <textarea 
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              placeholder="Nhập nhận xét..." 
              style={textareaStyle}
            />

            <button onClick={handleFeedback} disabled={actionLoading} style={btnPrimary}>
              {actionLoading ? "Đang gửi..." : "Gửi phản hồi ngay"}
            </button>
          </div>
        </div>
      )}

      {/* Global CSS for spinner */}
      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #e5e7eb;
          border-top: 5px solid #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// --- STYLES OBJECTS ---
const btnSidebar = {
  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 18px',
  border: 'none', background: 'transparent', borderRadius: '12px', color: '#4b5563',
  fontWeight: '600', cursor: 'pointer', transition: '0.2s'
};
const btnSidebarActive = { ...btnSidebar, background: '#ecfdf5', color: '#059669' };
const btnLogout = { ...btnSidebar, marginTop: 'auto', color: '#ef4444', background: '#fef2f2' };

const tabNormal = { padding: '10px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', background: 'white', fontWeight: '600', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const tabActive = { ...tabNormal, background: '#111827', color: 'white', border: '1px solid #111827' };

const cardStyle = { background: 'white', borderRadius: '30px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', transition: '0.3s hover' };
const infoRow = { display: 'flex', alignItems: 'center', gap: '10px', color: '#6b7280', fontSize: '13px' };

const btnPrimary = { flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' };
const btnDisabled = { ...btnPrimary, background: '#d1d5db', cursor: 'not-allowed' };
const btnIcon = { background: '#f3f4f6', border: 'none', padding: '14px', borderRadius: '16px', cursor: 'pointer' };

const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { background: 'white', width: '500px', borderRadius: '32px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const textareaStyle = { width: '100%', height: '120px', borderRadius: '16px', padding: '15px', border: '1px solid #e5e7eb', background: '#f9fafb', marginBottom: '25px', outline: 'none' };

export default MemberDashboard;