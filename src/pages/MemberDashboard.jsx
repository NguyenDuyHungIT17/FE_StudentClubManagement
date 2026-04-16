import React, { useState, useEffect } from "react";
import { User, Users, CalendarDays, MessageCircle, Star, ClipboardList, LogOut, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/MemberDashboard.css";

// Components
import ProfileSection from "../components/member/ProfileSection";
import ClubsSection from "../components/member/ClubsSection";
import EventsSection from "../components/member/EventsSection";
import ChatSection from "../components/member/ChatSection";
import FeedbackSection from "../components/member/FeedbackSection";
import ApplySection from "../components/member/ApplySection";

import { getUserIdFromToken, decodeToken } from "../utils/tokenUtils";
import { userService } from "../services/userService";

const SIDEBAR_ITEMS = [
  { id: "profile", label: "Hồ sơ cá nhân", icon: <User size={22} /> },
  { id: "clubs", label: "CLB của tôi", icon: <Users size={22} /> },
  { id: "events", label: "Khám phá sự kiện", icon: <CalendarDays size={22} /> },
  { id: "chat", label: "Thảo luận", icon: <MessageCircle size={22} /> },
  { id: "feedback", label: "Đánh giá", icon: <Star size={22} /> },
  { id: "apply", label: "Ứng tuyển", icon: <ClipboardList size={22} /> },
];

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    const userId = getUserIdFromToken();
    if (!userId) {
      navigate("/login");
      return;
    }
    
    try {
      const decoded = decodeToken(localStorage.getItem("token"));
      const tokenClubId = decoded?.ClubId || decoded?.clubId || null;

      const res = await userService.getById(userId);
      const userData = res?.data || res?.value || res;
      
      if (userData) {
        setUserProfile({
          ...userData,
          clubId: tokenClubId ? parseInt(tokenClubId) : null 
        });
      }
    } catch (e) {
      console.error("Lỗi lấy thông tin user", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="mdash-layout">
      {/* Sidebar */}
      <aside className={`mdash-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="mdash-sidebar-header">
          <div className="mdash-logo-container">
            <div className="mdash-logo-icon">SCM</div>
            {isSidebarOpen && <span className="mdash-logo-text">StudentClub</span>}
          </div>
          <button className="mdash-toggle-sidebar" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className="mdash-user-snippet">
          <div className="mdash-avatar-wrap">
            <img src={userProfile?.photoUrl || `https://ui-avatars.com/api/?name=${userProfile?.fullName || 'User'}&background=6366f1&color=fff`} alt="avatar" />
            <div className="mdash-status-dot"></div>
          </div>
          {isSidebarOpen && (
            <div className="mdash-user-info">
              <h4>{loading ? 'Đang tải...' : (userProfile?.fullName || 'Thành viên')}</h4>
              <span>{userProfile?.role || 'Thành viên'}</span>
            </div>
          )}
        </div>

        <nav className="mdash-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.id} className={`mdash-nav-btn ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)} title={!isSidebarOpen ? item.label : ""}>
              <div className="mdash-nav-icon">{item.icon}</div>
              {isSidebarOpen && <span className="mdash-nav-label">{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && <div className="mdash-active-indicator"></div>}
            </button>
          ))}
        </nav>

        <div className="mdash-sidebar-footer">
          <button className="mdash-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mdash-main">
        <header className="mdash-topbar">
          <div className="mdash-page-title">
            <h1>{SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}</h1>
            <p className="mdash-date">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="mdash-top-actions">
            <button className="mdash-notif-btn">
              <Bell size={20} />
              <span className="mdash-notif-badge">3</span>
            </button>
          </div>
        </header>

        <div className="mdash-content-area">
          {/* 👉 CHẶN LẠI NẾU ĐANG TẢI */}
          {loading ? (
             <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Đang tải dữ liệu...</div>
          ) : (
            <>
              {activeTab === "profile" && <ProfileSection userProfile={userProfile} onProfileUpdate={fetchUser} />}
              {activeTab === "clubs" && <ClubsSection userId={userProfile?.userId} clubId={userProfile?.clubId} />}
              {activeTab === "events" && <EventsSection clubId={userProfile?.clubId} />}
              {activeTab === "chat" && <ChatSection userId={userProfile?.userId} clubId={userProfile?.clubId} currentUserName={userProfile?.fullName} />}
              
              {/* Truyền cả User Profile xuống Feedback để lấy ID */}
              {activeTab === "feedback" && <FeedbackSection userProfile={userProfile} />}
              
              {activeTab === "apply" && <ApplySection userId={userProfile?.userId} userEmail={userProfile?.email} userName={userProfile?.fullName} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
