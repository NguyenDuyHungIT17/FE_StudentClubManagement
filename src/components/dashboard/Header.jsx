import React from 'react';
import { Users, Layers, ClipboardList } from 'lucide-react';
import { COLORS } from '../../styles/colors';

const Header = ({ activeTab, setActiveTab }) => {
  const styles = {
    header: {
      display: "flex",
      alignItems: "center",
      padding: "18px 32px",
      background: COLORS.BLUE,
      borderBottom: `2px solid ${COLORS.BORDER}`,
      borderRadius: "0 0 24px 24px",
      boxShadow: "0 2px 8px #3b82f622",
      marginBottom: 32,
      gap: 18,
      width: "100%",
      boxSizing: "border-box",
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 12,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
      fontWeight: "bold",
      color: COLORS.BLUE,
    },
    title: {
      fontWeight: "bold",
      fontSize: 28,
      color: "#fff",
      letterSpacing: 1,
      flex: 1,
    },
    nav: {
      display: "flex",
      gap: 12,
    },
    navBtn: (active) => ({
      background: active ? COLORS.BLUE_DARK : "#fff",
      color: active ? "#fff" : COLORS.BLUE_DARK,
      border: `1.5px solid ${COLORS.BORDER}`,
      borderRadius: 12,
      padding: "8px 18px",
      fontWeight: "bold",
      fontSize: 16,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
      boxShadow: active ? "0 2px 8px #3b82f622" : "none",
      transition: "all 0.2s",
    }),
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>👑</div>
      <span style={styles.title}>LEADER DASHBOARD</span>
      <nav style={styles.nav}>
        <button
          style={styles.navBtn(activeTab === "users")}
          onClick={() => setActiveTab("users")}
        >
          <Users /> Tài khoản
        </button>
        <button
          style={styles.navBtn(activeTab === "clubs")}
          onClick={() => setActiveTab("clubs")}
        >
          <Layers /> Câu lạc bộ
        </button>
        <button
          style={styles.navBtn(activeTab === "interviews")}
          onClick={() => setActiveTab("interviews")}
        >
          <ClipboardList /> Phỏng vấn
        </button>
      </nav>
    </header>
  );
};

export default Header;