import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../../styles/colors';

const ClubModal = ({ club, users, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clubName: "",
    description: "",
    leaderId: "",
  });

  useEffect(() => {
    if (club) {
      let leaderId = "";
      if (club.leaderName && club.leaderName !== "Cập nhật sau") {
        const leader = users.find(
          (u) => u.fullName === club.leaderName || u.email === club.leaderName
        );
        leaderId = leader ? leader.userId : "";
      }
      
      setFormData({
        clubName: club.clubName,
        description: club.description,
        leaderId: leaderId,
      });
    }
  }, [club, users]);

  const handleSave = async () => {
    let dataToSend;
    
    if (club) {
      dataToSend = {
        id: club.clubId,
        clubName: formData.clubName,
        description: formData.description,
        leaderId: formData.leaderId ? parseInt(formData.leaderId) : null,
      };
      const success = await onSave(club.clubId, dataToSend);
      if (success) onClose();
    } else {
      dataToSend = {
        clubName: formData.clubName,
        description: formData.description,
      };
      const success = await onSave(dataToSend);
      if (success) onClose();
    }
  };

  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#0005",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    modal: {
      background: COLORS.ACCENT_BG,
      borderRadius: "18px",
      padding: "32px",
      width: "420px",
      maxWidth: "90vw",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      position: "relative",
      boxShadow: COLORS.CARD_SHADOW,
      border: `2px solid ${COLORS.ACCENT}`,
    },
    closeButton: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: COLORS.BLUE_DARK,
      fontSize: 22,
    },
    modalTitle: {
      fontWeight: "bold",
      fontSize: "22px",
      color: COLORS.BLUE_DARK,
      marginBottom: "8px",
      textAlign: "center",
      letterSpacing: 1,
    },
    label: {
      color: COLORS.BLUE_DARK,
      fontWeight: "bold",
      fontSize: "14px",
    },
    input: {
      padding: "14px",
      borderRadius: "10px",
      border: `2px solid ${COLORS.ACCENT}`,
      fontSize: "16px",
      outline: "none",
      background: "#fff",
      marginBottom: "2px",
      color: COLORS.TEXT,
      fontWeight: "500",
      transition: "border 0.2s",
    },
    select: {
      padding: "14px",
      borderRadius: "10px",
      border: `2px solid ${COLORS.ACCENT}`,
      fontSize: "16px",
      background: "#fff",
      color: COLORS.BLUE_DARK,
      fontWeight: "500",
      marginBottom: "2px",
      transition: "border 0.2s",
    },
    saveButton: {
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
    },
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          <X />
        </button>
        <div style={styles.modalTitle}>
          {club ? "Sửa câu lạc bộ" : "Thêm câu lạc bộ"}
        </div>
        
        <label style={styles.label}>Tên câu lạc bộ</label>
        <input
          style={styles.input}
          placeholder="Nhập tên câu lạc bộ"
          value={formData.clubName}
          onChange={(e) =>
            setFormData({ ...formData, clubName: e.target.value })
          }
        />
        
        <label style={styles.label}>Mô tả</label>
        <input
          style={styles.input}
          placeholder="Nhập mô tả"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        
        {club && (
          <>
            <label style={styles.label}>Trưởng CLB</label>
            <select
              style={styles.select}
              value={formData.leaderId}
              onChange={(e) =>
                setFormData({ ...formData, leaderId: e.target.value })
              }
            >
              <option value="">-- Chọn trưởng CLB --</option>
              {users
                .filter((u) => u.role === "leader" || u.role === "admin")
                .map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
            </select>
          </>
        )}
        
        <button style={styles.saveButton} onClick={handleSave}>
          {club ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </div>
  );
};

export default ClubModal;