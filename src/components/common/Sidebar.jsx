import React from "react";
import { Users, Layers, ClipboardList, LogOut, Calendar, UserCheck, Megaphone } from "lucide-react";
import logo from "../../assets/logo.png"; 

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "users", label: "Tài khoản", icon: Users },
    { id: "clubs", label: "Câu lạc bộ", icon: Layers },
    { id: "members", label: "Thành viên", icon: Users },
    { id: "campaigns", label: "Đợt tuyển", icon: Megaphone },
    { id: "interviews", label: "Phỏng vấn", icon: ClipboardList },
    { id: "events", label: "Sự kiện", icon: Calendar },
    { id: "event_registrations", label: "Check-in", icon: UserCheck },
  ];

  return (
    <aside style={{
      width: "var(--sidebar-width)", height: "100vh", background: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border)", position: "fixed", top: 0, left: 0,
      display: "flex", flexDirection: "column", padding: "24px", zIndex: 50
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <img src={logo} alt="Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main)" }}>UniClubs</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-sub)", letterSpacing: 1, marginBottom: 8 }}>MENU</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              background: activeTab === item.id ? "rgba(59, 130, 246, 0.1)" : "transparent",
              border: "none", borderRadius: 8,
              color: activeTab === item.id ? "var(--primary)" : "var(--text-sub)",
              cursor: "pointer", fontWeight: 500, fontSize: 14,
              borderLeft: activeTab === item.id ? "3px solid var(--primary)" : "3px solid transparent",
              transition: "all 0.2s"
            }}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </div>

      <button onClick={() => { localStorage.clear(); window.location.href='/login'; }}
        style={{ marginTop: "auto", background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
        <LogOut size={18} /> Đăng xuất
      </button>
    </aside>
  );
};
export default Sidebar;