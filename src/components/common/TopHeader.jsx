import React from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const TopHeader = ({ title }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      height: "var(--header-height)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 30
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
        {title === 'users' ? 'Quản lý Tài khoản' : 
         title === 'clubs' ? 'Quản lý Câu lạc bộ' : 
         title === 'interviews' ? 'Quản lý Phỏng vấn' : 'Thành viên CLB'}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button onClick={toggleTheme} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-sub)" }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={20} color="var(--text-sub)" />
          <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: "#ef4444", borderRadius: "50%" }}></span>
        </div>
        <div style={{ width: 36, height: 36, background: "var(--bg-card)", borderRadius: "50%", border: "1px solid var(--border)" }}>
           {/* Avatar Placeholder */}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;