import React from 'react';
import { COLORS } from '../../styles/colors';

const Button = ({ children, onClick, variant = "primary", icon: Icon }) => {
  const styles = {
    primary: {
      background: COLORS.ACCENT,
      color: "#fff",
      border: "none",
      padding: "10px 22px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      boxShadow: "0 2px 8px #3b82f622",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background 0.2s",
    },
    save: {
      background: COLORS.BLUE_DARK,
      color: "#fff",
      border: "none",
      padding: "14px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "17px",
      marginTop: "10px",
      boxShadow: "0 2px 8px #3b82f622",
      letterSpacing: 1,
      transition: "background 0.2s",
      width: "100%",
    },
  };

  return (
    <button style={styles[variant]} onClick={onClick}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;