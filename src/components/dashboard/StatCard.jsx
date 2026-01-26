import React from 'react';
import { Users, Layers, ClipboardList } from 'lucide-react';
import { COLORS } from '../../styles/colors';

const StatCard = ({ icon, title, description }) => {
  const getIcon = () => {
    switch (icon) {
      case 'users':
        return <Users size={28} />;
      case 'layers':
        return <Layers size={28} />;
      case 'clipboard':
        return <ClipboardList size={28} />;
      default:
        return <Users size={28} />;
    }
  };

  const styles = {
    card: {
      background: COLORS.CARD,
      borderRadius: 18,
      boxShadow: COLORS.CARD_SHADOW,
      padding: 24,
      marginBottom: 28,
      display: "flex",
      alignItems: "center",
      gap: 18,
      border: `1.5px solid ${COLORS.BORDER}`,
      width: "100%",
      boxSizing: "border-box",
      maxWidth: "100vw",
    },
    cardIcon: {
      background: COLORS.BLUE,
      color: "#fff",
      borderRadius: 12,
      width: 48,
      height: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
    },
    cardContent: { 
      flex: 1 
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: COLORS.BLUE_DARK,
      marginBottom: 6,
    },
    cardDesc: { 
      fontSize: 15, 
      color: "#1e3a8a" 
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardIcon}>
        {getIcon()}
      </div>
      <div style={styles.cardContent}>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardDesc}>{description}</div>
      </div>
    </div>
  );
};

export default StatCard;