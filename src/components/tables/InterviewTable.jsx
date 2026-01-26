import React from 'react';
import { Edit } from 'lucide-react';
import { COLORS } from '../../styles/colors';

const InterviewTable = ({ interviews, loading, onEdit }) => {
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
            <th style={styles.th}>Tên ứng viên</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Đánh giá</th>
            <th style={styles.th}>Kết quả</th>
            <th style={styles.th}>Ngày tạo</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((iv) => (
            <tr key={iv.interviewId}>
              <td style={styles.td}>{iv.interviewId}</td>
              <td style={styles.td}>{iv.applicantName}</td>
              <td style={styles.td}>{iv.applicantEmail}</td>
              <td style={styles.td}>{iv.evaluation}</td>
              <td style={styles.td}>{iv.result}</td>
              <td style={styles.td}>
                {iv.createdAt
                  ? new Date(iv.createdAt).toLocaleString()
                  : ""}
              </td>
              <td style={styles.td}>
                {onEdit && (
                  <button
                    style={styles.actionButton(COLORS.BLUE_DARK)}
                    onClick={() => onEdit(iv)}
                    title="Sửa"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterviewTable;