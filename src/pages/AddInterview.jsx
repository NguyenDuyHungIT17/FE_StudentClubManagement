import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import logo from "../assets/logo.png";
import clb1 from "../assets/clb1.png";
import clb2 from "../assets/clb2.png";
import clb3 from "../assets/clb3.png";
import clb4 from "../assets/clb4.png";
import clb5 from "../assets/clb5.png";
import clb6 from "../assets/clb6.png";

const clubLogos = [clb1, clb2, clb3, clb4, clb5, clb6];

const ORANGE = "#fb923c";
const ORANGE_DARK = "#ea580c";
const BG = "#fff7ed";
const BORDER = "#fed7aa";
const CARD_SHADOW = "0 2px 16px #fb923c22";
const ACCENT = "#f59e42";
const ACCENT_BG = "#fffbe6";

const basicQuestions = [
  "Bạn hãy giới thiệu ngắn gọn về bản thân?",
  "Tại sao bạn muốn tham gia CLB này?",
  "Bạn biết đến CLB qua đâu?",
  "Bạn có từng tham gia CLB/đội nhóm nào trước đây chưa?",
  "Thế mạnh của bạn là gì?",
  "Bạn nghĩ điểm yếu của bản thân là gì?",
  "Bạn mong muốn học hỏi điều gì khi tham gia CLB?",
  "Bạn có sẵn sàng dành bao nhiêu thời gian/tuần cho hoạt động CLB?",
  "Bạn thích tham gia mảng nào trong CLB (truyền thông, sự kiện, chuyên môn…)?",
  "Bạn kỳ vọng CLB sẽ mang lại cho bạn điều gì trong quá trình học đại học?",
];

const mediumQuestions = [
  "Nếu nhóm bạn đang làm việc nhưng có người không hợp tác, bạn sẽ xử lý thế nào?",
  "Bạn có thể mô tả một lần làm việc nhóm mà bạn thấy thành công nhất?",
  "Khi bạn phải lựa chọn giữa học tập và hoạt động CLB, bạn sẽ sắp xếp thế nào?",
  "Bạn đã từng gặp áp lực trong việc tổ chức sự kiện hoặc hoạt động chưa? Bạn vượt qua như thế nào?",
  "Bạn nghĩ kỹ năng nào quan trọng nhất để gắn bó lâu dài với CLB?",
  "Nếu được giao một nhiệm vụ mà bạn chưa có kinh nghiệm, bạn sẽ làm gì?",
  "Bạn có thể chia sẻ một ý tưởng để cải thiện hoạt động của CLB không?",
  "Bạn nghĩ CLB nên tạo ra giá trị gì cho sinh viên?",
  "Bạn sẽ thuyết phục bạn bè tham gia CLB này như thế nào?",
  "Nếu CLB giao cho bạn nhiệm vụ gấp trong thời gian ngắn, bạn sẽ phản ứng thế nào?",
];

const advancedQuestions = [
  "Theo bạn, sự khác biệt lớn nhất giữa một CLB mạnh và một CLB yếu là gì?",
  "Trong 1–2 năm tới, bạn muốn đóng góp vai trò gì cho CLB?",
  "Nếu bạn là chủ nhiệm CLB, bạn sẽ làm gì để phát triển CLB?",
  "Bạn có sẵn sàng đảm nhận vai trò lãnh đạo khi CLB cần không? Vì sao?",
  "Hãy mô tả một mục tiêu dài hạn của bạn và CLB có thể giúp bạn đạt được như thế nào?",
];

const AddInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clubId = location.state?.clubId || "";
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);

  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    evaluation: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Edit states
  const [editingInterview, setEditingInterview] = useState(null);
  const [editForm, setEditForm] = useState({
    applicantName: "",
    applicantEmail: "",
    evaluation: "",
    result: "Pending",
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch club and interviews
  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://localhost:7251/api/Clubs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Lỗi khi lấy thông tin CLB");
        const data = await res.json();
        const found = data.find((c) => String(c.clubId) === String(clubId));
        setClub(found || null);
      } catch (err) {
        setClub(null);
      } finally {
        setLoading(false);
      }
    };
    if (clubId) fetchClub();
  }, [clubId]);

  // Fetch interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch(`https://localhost:7251/api/Interviews?clubId=${clubId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setInterviews(data || []);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách phỏng vấn:", err);
      }
    };
    if (clubId) fetchInterviews();
  }, [clubId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("https://localhost:7251/api/Interviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubId: parseInt(clubId),
          applicantName: form.applicantName,
          applicantEmail: form.applicantEmail,
          evaluation: form.evaluation,
        }),
      });
      if (!res.ok) throw new Error("Lỗi khi thêm phỏng vấn");
      setSuccess("Thêm phỏng vấn thành công!");
      setForm({ applicantName: "", applicantEmail: "", evaluation: "" });
      
      // Refresh interviews list
      const updatedRes = await fetch(`https://localhost:7251/api/Interviews?clubId=${clubId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (updatedRes.ok) {
        const data = await updatedRes.json();
        setInterviews(data || []);
      }
      
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditInterview = (interview) => {
    setEditingInterview(interview.interviewId);
    setEditForm({
      applicantName: interview.applicantName,
      applicantEmail: interview.applicantEmail,
      evaluation: interview.evaluation,
      result: interview.result || "Pending",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`https://localhost:7251/api/Interviews/${editingInterview}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubId: parseInt(clubId),
          applicantName: editForm.applicantName,
          applicantEmail: editForm.applicantEmail,
          evaluation: editForm.evaluation,
          result: editForm.result,
        }),
      });
      if (!res.ok) throw new Error("Lỗi khi cập nhật phỏng vấn");
      alert("Cập nhật phỏng vấn thành công!");
      setShowEditModal(false);
      
      // Refresh interviews list
      const updatedRes = await fetch(`https://localhost:7251/api/Interviews?clubId=${clubId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (updatedRes.ok) {
        const data = await updatedRes.json();
        setInterviews(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phỏng vấn này?")) {
      try {
        const res = await fetch(`https://localhost:7251/api/Interviews/${interviewId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Lỗi khi xóa phỏng vấn");
        alert("Xóa phỏng vấn thành công!");
        
        // Refresh interviews list
        const updatedRes = await fetch(`https://localhost:7251/api/Interviews?clubId=${clubId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setInterviews(data || []);
        }
      } catch (err) {
        alert(err.message);
      }
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
      background: ACCENT_BG,
      borderRadius: "18px",
      padding: "28px",
      width: "520px",
      maxHeight: "90vh",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      position: "relative",
      boxShadow: CARD_SHADOW,
      border: `2px solid ${ACCENT}`,
    },
    input: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `2px solid ${ACCENT}`,
      fontSize: "15px",
      outline: "none",
      background: "#fff",
      marginBottom: "8px",
      color: "#1f2937",
      fontWeight: "500",
      transition: "border 0.2s",
      width: "100%",
      boxSizing: "border-box",
    },
    select: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `2px solid ${ACCENT}`,
      fontSize: "15px",
      background: "#fff",
      color: ORANGE_DARK,
      fontWeight: "500",
      marginBottom: "8px",
      transition: "border 0.2s",
      width: "100%",
      boxSizing: "border-box",
    },
    modalLabel: {
      color: ORANGE_DARK,
      fontWeight: "bold",
      fontSize: "14px",
      marginTop: "6px",
      marginBottom: "4px",
      letterSpacing: 0.5,
    },
    saveButton: {
      background: ORANGE_DARK,
      color: "#fff",
      border: "none",
      padding: "12px 20px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      marginTop: "16px",
      boxShadow: "0 2px 8px #fb923c22",
      letterSpacing: 1,
      transition: "background 0.2s",
      width: "100%",
      boxSizing: "border-box",
    },
    closeButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: ORANGE_DARK,
      fontSize: 22,
      padding: "4px",
    },
    modalTitle: {
      fontWeight: "bold",
      fontSize: "20px",
      color: ORANGE_DARK,
      marginBottom: "12px",
      textAlign: "center",
      letterSpacing: 1,
      paddingRight: "24px",
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, width: "100vw", overflowX: "hidden" }}>
      {/* Header */}
      <nav
        style={{
          background: ORANGE,
          padding: "0 0 0 0",
          width: "100vw",
          boxShadow: "0 2px 12px #ea580c22",
        }}
        className="d-flex align-items-center justify-content-between"
      >
        <div className="d-flex align-items-center px-4 py-2">
          <img src={logo} alt="logo" style={{ height: 48, borderRadius: 12, background: "#fff", marginRight: 14 }} />
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: 26, letterSpacing: 1 }}>
            Student Club Admin
          </span>
        </div>
        <button
          className="btn"
          style={{
            background: "#fff",
            color: ORANGE_DARK,
            fontWeight: "bold",
            borderRadius: 12,
            marginRight: 24,
            fontSize: 16,
            letterSpacing: 1,
            border: "none",
            boxShadow: "0 2px 8px #ea580c22",
          }}
          onClick={() => navigate("/admin")}
        >
          Quay lại Dashboard
        </button>
      </nav>

      <div style={{ padding: "32px 20px", width: "100%", boxSizing: "border-box" }}>
        <h2 className="fw-bold mb-5 text-center" style={{ color: ORANGE_DARK, fontSize: 32 }}>
          Thêm mới phỏng vấn ứng viên
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : !club ? (
          <div className="text-center py-5 text-danger fw-bold fs-4">
            Không tìm thấy thông tin câu lạc bộ!
          </div>
        ) : (
          <>
            {/* Form + Questions Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", width: "100%", maxWidth: "1600px", margin: "0 auto", marginBottom: "40px" }}>
              
              {/* Left: Club info + Interview form */}
              <div
                className="shadow-lg border-0"
                style={{
                  borderRadius: "22px",
                  background: "#fff",
                  color: "#1f2937",
                  boxShadow: CARD_SHADOW,
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  height: "fit-content",
                }}
              >
                {/* Club Header */}
                <div className="d-flex align-items-center mb-4">
                  <img
                    src={clubLogos[(club.clubId - 1) % clubLogos.length]}
                    alt="clb"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 14,
                      objectFit: "cover",
                      boxShadow: "0 2px 8px #ea580c22",
                      marginRight: 14,
                    }}
                  />
                  <div>
                    <h5 className="fw-bold mb-0" style={{ fontSize: 20, color: ORANGE_DARK }}>
                      {club.clubName}
                    </h5>
                    <div style={{ color: "#7c4700", fontWeight: 500, fontSize: 14, marginTop: 2 }}>
                      Trưởng: {club.leaderName}
                    </div>
                  </div>
                </div>

                <hr style={{ margin: "12px 0" }} />

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: ORANGE_DARK, fontSize: 14 }}>
                      Tên ứng viên
                    </label>
                    <input
                      type="text"
                      name="applicantName"
                      className="form-control"
                      style={{ fontSize: 15, padding: "10px 14px", borderRadius: "10px", border: `1.5px solid ${BORDER}` }}
                      placeholder="Nhập tên ứng viên..."
                      value={form.applicantName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: ORANGE_DARK, fontSize: 14 }}>
                      Email ứng viên
                    </label>
                    <input
                      type="email"
                      name="applicantEmail"
                      className="form-control"
                      style={{ fontSize: 15, padding: "10px 14px", borderRadius: "10px", border: `1.5px solid ${BORDER}` }}
                      placeholder="Nhập email ứng viên..."
                      value={form.applicantEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: ORANGE_DARK, fontSize: 14 }}>
                      Đánh giá ứng viên
                    </label>
                    <textarea
                      name="evaluation"
                      className="form-control"
                      style={{
                        borderRadius: "10px",
                        fontSize: 15,
                        padding: "10px 14px",
                        minHeight: 100,
                        border: `1.5px solid ${BORDER}`,
                        resize: "vertical",
                      }}
                      placeholder="Nhập đánh giá tổng quan..."
                      value={form.evaluation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {error && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 14 }}>{error}</div>}
                  {success && (
                    <div className="alert alert-success py-2 mb-3 text-center fw-bold" style={{ fontSize: 14 }}>
                      {success}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn w-100 fw-bold"
                    style={{
                      backgroundColor: ORANGE_DARK,
                      color: "#fff",
                      fontSize: 15,
                      padding: "11px",
                      borderRadius: "10px",
                      letterSpacing: 0.5,
                    }}
                    disabled={saving}
                  >
                    {saving ? "Đang lưu..." : "Lưu phỏng vấn"}
                  </button>
                </form>
              </div>

              {/* Middle: Basic Questions */}
              <div
                className="shadow-lg border-0"
                style={{
                  borderRadius: "22px",
                  background: "#fff",
                  color: "#1f2937",
                  boxShadow: CARD_SHADOW,
                  padding: "28px",
                  overflowY: "auto",
                  maxHeight: "70vh",
                }}
              >
                <h5 className="fw-bold mb-3" style={{ color: ORANGE_DARK, fontSize: 18 }}>
                  🟡 Cấp độ Cơ bản
                </h5>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {basicQuestions.map((q, idx) => (
                    <li key={idx} style={{ marginBottom: 10, fontSize: 15, lineHeight: "1.5", color: "#374151" }}>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Medium + Advanced Questions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Medium Questions */}
                <div
                  className="shadow-lg border-0"
                  style={{
                    borderRadius: "22px",
                    background: "#fff",
                    color: "#1f2937",
                    boxShadow: CARD_SHADOW,
                    padding: "28px",
                    overflowY: "auto",
                    maxHeight: "50vh",
                  }}
                >
                  <h5 className="fw-bold mb-3" style={{ color: ORANGE_DARK, fontSize: 18 }}>
                    🟠 Cấp độ Trung bình
                  </h5>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {mediumQuestions.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: 10, fontSize: 15, lineHeight: "1.5", color: "#374151" }}>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Advanced Questions */}
                <div
                  className="shadow-lg border-0"
                  style={{
                    borderRadius: "22px",
                    background: "#fff",
                    color: "#1f2937",
                    boxShadow: CARD_SHADOW,
                    padding: "28px",
                    overflowY: "auto",
                    flex: 1,
                  }}
                >
                  <h5 className="fw-bold mb-3" style={{ color: ORANGE_DARK, fontSize: 18 }}>
                    🔴 Cấp độ Nâng cao
                  </h5>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {advancedQuestions.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: 10, fontSize: 15, lineHeight: "1.5", color: "#374151" }}>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Interviews Table */}
            <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
              <h3 className="fw-bold mb-4" style={{ color: ORANGE_DARK, fontSize: 28 }}>
                📋 Danh sách phỏng vấn
              </h3>
              {interviews.length > 0 ? (
                <div className="table-responsive" style={{ borderRadius: "22px", overflow: "hidden", boxShadow: CARD_SHADOW }}>
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: ORANGE, color: "#fff" }}>
                      <tr>
                        <th style={{ padding: "16px" }}>ID</th>
                        <th style={{ padding: "16px" }}>Ứng viên</th>
                        <th style={{ padding: "16px" }}>Email</th>
                        <th style={{ padding: "16px" }}>Đánh giá</th>
                        <th style={{ padding: "16px" }}>Kết quả</th>
                        <th style={{ padding: "16px" }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map((interview) => (
                        <tr key={interview.interviewId} style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td style={{ padding: "16px", fontWeight: "bold" }}>{interview.interviewId}</td>
                          <td style={{ padding: "16px", fontWeight: "600", color: ORANGE_DARK }}>
                            {interview.applicantName}
                          </td>
                          <td style={{ padding: "16px", fontSize: "14px" }}>{interview.applicantEmail}</td>
                          <td style={{ padding: "16px", fontSize: "13px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {interview.evaluation?.substring(0, 50)}...
                          </td>
                          <td style={{ padding: "16px" }}>
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                backgroundColor:
                                  interview.result === "Passed"
                                    ? "#d1fae5"
                                    : interview.result === "Failed"
                                    ? "#fee2e2"
                                    : "#fef3c7",
                                color:
                                  interview.result === "Passed"
                                    ? "#065f46"
                                    : interview.result === "Failed"
                                    ? "#7f1d1d"
                                    : "#92400e",
                              }}
                            >
                              {interview.result || "Pending"}
                            </span>
                          </td>
                          <td style={{ padding: "16px" }}>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: ORANGE,
                                color: "#fff",
                                marginRight: "8px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                padding: "6px 12px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                              onClick={() => handleEditInterview(interview)}
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#ef4444",
                                color: "#fff",
                                borderRadius: "8px",
                                fontSize: "12px",
                                padding: "6px 12px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                              onClick={() => handleDeleteInterview(interview.interviewId)}
                            >
                              🗑️ Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="text-center py-5"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "22px",
                    boxShadow: CARD_SHADOW,
                  }}
                >
                  <p style={{ color: "#9ca3af", fontSize: "16px", margin: 0 }}>Chưa có phỏng vấn nào</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeButton}
              onClick={() => setShowEditModal(false)}
            >
              <X />
            </button>
            <div style={styles.modalTitle}>Sửa thông tin phỏng vấn</div>

            <form onSubmit={handleEditSubmit}>
              <label style={styles.modalLabel}>Tên ứng viên</label>
              <input
                style={styles.input}
                type="text"
                name="applicantName"
                placeholder="Nhập tên ứng viên"
                value={editForm.applicantName}
                onChange={handleEditChange}
                required
              />

              <label style={styles.modalLabel}>Email ứng viên</label>
              <input
                style={styles.input}
                type="email"
                name="applicantEmail"
                placeholder="Nhập email ứng viên"
                value={editForm.applicantEmail}
                onChange={handleEditChange}
                required
              />

              <label style={styles.modalLabel}>Đánh giá</label>
              <textarea
                style={{...styles.input, minHeight: 100, resize: "vertical"}}
                name="evaluation"
                placeholder="Nhập đánh giá"
                value={editForm.evaluation}
                onChange={handleEditChange}
                required
              />

              <label style={styles.modalLabel}>Kết quả</label>
              <select
                style={styles.select}
                name="result"
                value={editForm.result}
                onChange={handleEditChange}
              >
                <option value="Pending">Pending</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <button
                type="submit"
                style={styles.saveButton}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Cập nhật"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: ORANGE_DARK }} className="text-white text-center py-3 mt-5">
        <p className="mb-0" style={{ letterSpacing: 1, fontSize: 14 }}>© 2025 Student Club - All rights reserved</p>
      </footer>
    </div>
  );
};

export default AddInterview;