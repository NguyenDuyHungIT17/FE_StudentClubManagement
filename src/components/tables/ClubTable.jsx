import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { COLORS } from '../../styles/colors';

const ClubTable = ({ clubs, loading, onEdit, onDelete }) => {
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
            <th style={styles.th}>Tên CLB</th>
            <th style={styles.th}>Mô tả</th>
            <th style={styles.th}>Trưởng CLB</th>
            <th style={styles.th}>Ngày tạo</th>
            <th style={styles.th}>Ngày cập nhật</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => (
            <tr key={club.clubId}>
              <td style={styles.td}>{club.clubId}</td>
              <td style={styles.td}>{club.clubName}</td>
              <td style={styles.td}>{club.description}</td>
              <td style={styles.td}>{club.leaderName}</td>
              <td style={styles.td}>
                {club.createdAt
                  ? new Date(club.createdAt).toLocaleString()
                  : ""}
              </td>
              <td style={styles.td}>
                {club.updatedAt
                  ? new Date(club.updatedAt).toLocaleString()
                  : ""}
              </td>
              <td style={styles.td}>
                <button
                  style={styles.actionButton(COLORS.BLUE_DARK)}
                  onClick={() => onEdit(club)}
                  title="Sửa"
                >
                  <Edit size={16} />
                </button>
                <button
                  style={styles.actionButton(COLORS.RED)}
                  onClick={() => onDelete(club.clubId)}
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

export default ClubTable;