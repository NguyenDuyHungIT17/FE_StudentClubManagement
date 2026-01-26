import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { COLORS } from '../../styles/colors';

const UserTable = ({ users, loading, onEdit, onDelete }) => {
  const styles = {
    tableWrap: {
      background: COLORS.CARD,
      borderRadius: 16,
      boxShadow: COLORS.CARD_SHADOW,
      padding: 0,
      overflow: "auto",
      border: `1.5px solid ${COLORS.BORDER}`,
      width: "100vw",
      boxSizing: "border-box",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "transparent",
      minWidth: 900,
    },
    th: {
      padding: "12px",
      textAlign: "left",
      background: COLORS.ACCENT_BG,
      color: COLORS.BLUE_DARK,
      fontWeight: "bold",
      border: "none",
      fontSize: "15px",
      letterSpacing: 1,
    },
    td: {
      padding: "12px",
      borderBottom: `1px solid ${COLORS.BORDER}`,
      color: COLORS.TEXT,
      fontSize: "15px",
      background: "transparent",
    },
    actionButton: (color) => ({
      cursor: "pointer",
      color,
      marginRight: "10px",
      border: "none",
      background: "none",
      padding: 0,
      transition: "color 0.2s",
      fontSize: 16,
    }),
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Đang tải...</div>;
  }

  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Tên</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Trạng thái</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td style={styles.td}>{user.userId}</td>
              <td style={styles.td}>{user.fullName}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{user.role}</td>
              <td style={styles.td}>
                {user.isActive ? "Active" : "Inactive"}
              </td>
              <td style={styles.td}>
                <button
                  style={styles.actionButton(COLORS.BLUE_DARK)}
                  onClick={() => onEdit(user)}
                  title="Sửa"
                >
                  <Edit size={16} />
                </button>
                <button
                  style={styles.actionButton(COLORS.RED)}
                  onClick={() => onDelete(user.userId)}
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;