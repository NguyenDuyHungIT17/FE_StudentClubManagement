import React, { useState } from "react";
import "../styles/UniClubsTheme.css"; // Import CSS Global

// Components
import Sidebar from "../components/common/Sidebar";
import StatsSection from "../components/dashboard/StatsSection";
import EventList from "../components/tables/EventList";
import ChatWidget from "../components/chat/ChatWidget";

// Logic Hook
import { useMemberDashboard } from "../hooks/useMemberDashboard";

// Icons
import { Bell, Plus } from "lucide-react";

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

  // Lấy dữ liệu và hàm từ Hook
  const { 
    events, 
    registeredEventIds, 
    handleRegister, 
    userData 
  } = useMemberDashboard();

  return (
    <div className="dashboard-layout">
      {/* 1. Sidebar bên trái */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Content bên phải */}
      <main className="main-content">
        
        {/* Header */}
        <header className="flex-between" style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>System Overview</h1>
          
          <div className="flex-center" style={{ gap: 20 }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-sub)" />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span>
            </div>
            <button className="btn-primary">
              <Plus size={18} /> New Club
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <StatsSection />

        {/* Main List (Event Directory) */}
        {activeTab === "events" && (
          <EventList 
            events={events}
            registeredIds={registeredEventIds}
            onRegister={handleRegister}
          />
        )}
        
        {/* Chat Widgets (Giữ nguyên logic cũ của bạn) */}
        <ChatWidget clubId={userData.userClubId} clubName="Community Chat" />
        
        {/* Nếu có logic private chat state, bạn có thể truyền vào đây từ hook */}
        {/* <PrivateChatWidget ... /> */}

      </main>
    </div>
  );
};

export default MemberDashboard;