import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../../styles/colors';

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "member",
    isActive: 1,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        password: "",
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleSave = async () => {
    const success = user 
      ? await onSave(user.userId, { ...formData, password: undefined })
      : await onSave(formData);
    
    if (success) {
      onClose();
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
          {user ? "Sửa thông tin user" : "Thêm user mới"}
        </div>
        
        <label style={styles.label}>Họ tên</label>
        <input
          style={styles.input}
          placeholder="Nhập họ tên"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
        
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          placeholder="Nhập email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        
        {!user && (
          <>
            <label style={styles.label}>Mật khẩu</label>
            <input
              style={styles.input}
              placeholder="Nhập mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </>
        )}
        
        <label style={styles.label}>Vai trò</label>
        <select
          style={styles.select}
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
        >
          <option value="admin">Admin</option>
          <option value="leader">Leader</option>
          <option value="member">Member</option>
        </select>
        
        <label style={styles.label}>Trạng thái</label>
        <select
          style={styles.select}
          value={formData.isActive}
          onChange={(e) =>
            setFormData({
              ...formData,
              isActive: parseInt(e.target.value),
            })
          }
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
        
        <button style={styles.saveButton} onClick={handleSave}>
          {user ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </div>
  );
};

export default UserModal;