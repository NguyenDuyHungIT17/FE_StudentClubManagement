import { COLORS } from './colors';

export const commonStyles = {
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
  button: {
    background: COLORS.ACCENT,
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 2px 8px #3b82f622",
    transition: "background 0.2s",
  },
};