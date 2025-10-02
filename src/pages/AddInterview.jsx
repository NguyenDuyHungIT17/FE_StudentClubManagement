import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    evaluation: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      setTimeout(() => {
        navigate("/admin");
      }, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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

      <div className="container-fluid py-5" style={{ maxWidth: "1400px" }}>
        <h2 className="fw-bold mb-4 text-center" style={{ color: ORANGE_DARK, fontSize: 30 }}>
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
          <div
            className="d-flex flex-row gap-4"
            style={{
              minHeight: 480,
              width: "100%",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {/* Left: Club info + Interview form */}
            <div
              className="shadow-lg border-0"
              style={{
                borderRadius: "22px",
                background: "#fff7ed",
                color: "#1f2937",
                minWidth: 340,
                maxWidth: 420,
                flex: "0 1 420px",
                boxShadow: CARD_SHADOW,
                padding: "32px 28px",
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignSelf: "flex-start",
                width: "fit-content",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <img
                  src={clubLogos[(club.clubId - 1) % clubLogos.length]}
                  alt="clb"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 16,
                    objectFit: "cover",
                    boxShadow: "0 2px 8px #ea580c22",
                    marginRight: 18,
                    background: "#fff",
                  }}
                />
                <div>
                  <h5 className="fw-bold mb-1" style={{ fontSize: 22, color: ORANGE_DARK }}>
                    {club.clubName}
                  </h5>
                  <div style={{ color: "#7c4700", fontWeight: 500, fontSize: 15 }}>
                    Trưởng CLB: {club.leaderName}
                  </div>
                  <div style={{ color: "#374151", fontSize: 16, marginTop: 4 }}>
                    {club.description}
                  </div>
                </div>
              </div>
              <hr />
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: ORANGE_DARK }}>
                    Tên ứng viên
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    className="form-control rounded-pill"
                    style={{ fontSize: 16, padding: "14px" }}
                    placeholder="Nhập tên ứng viên..."
                    value={form.applicantName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: ORANGE_DARK }}>
                    Email ứng viên
                  </label>
                  <input
                    type="email"
                    name="applicantEmail"
                    className="form-control rounded-pill"
                    style={{ fontSize: 16, padding: "14px" }}
                    placeholder="Nhập email ứng viên..."
                    value={form.applicantEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: ORANGE_DARK }}>
                    Đánh giá ứng viên
                  </label>
                  <textarea
                    name="evaluation"
                    className="form-control"
                    style={{
                      borderRadius: "14px",
                      fontSize: 16,
                      padding: "14px",
                      minHeight: 120,
                    }}
                    placeholder="Nhập đánh giá tổng quan..."
                    value={form.evaluation}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                {success && (
                  <div className="alert alert-success py-2 text-center fw-bold">
                    {success}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn w-100 fw-bold rounded-pill"
                  style={{
                    backgroundColor: ORANGE_DARK,
                    color: "#fff",
                    fontSize: 17,
                    padding: "12px",
                    letterSpacing: 1,
                    marginTop: "8px",
                  }}
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu phỏng vấn"}
                </button>
              </form>
            </div>
            {/* Right: Interview questions */}
            <div
              className="shadow-lg border-0"
              style={{
                borderRadius: "22px",
                background: "#fff",
                color: "#1f2937",
                minWidth: 340,
                maxWidth: 600,
                flex: "1 1 420px",
                boxShadow: CARD_SHADOW,
                padding: "32px 28px",
                marginTop: 12,
                overflowY: "auto",
                height: "100%",
              }}
            >
              <h4 className="fw-bold mb-3" style={{ color: ORANGE_DARK }}>
                Bộ câu hỏi phỏng vấn ứng viên
              </h4>
              <div className="mb-4">
                <div className="fw-bold mb-2" style={{ color: "#fbbf24", fontSize: 18 }}>
                  🟡 Cấp độ Cơ bản (10 câu)
                </div>
                <ul style={{ paddingLeft: 18 }}>
                  {basicQuestions.map((q, idx) => (
                    <li key={idx} style={{ marginBottom: 8, fontSize: 16 }}>{q}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <div className="fw-bold mb-2" style={{ color: "#f97316", fontSize: 18 }}>
                  🟡 Cấp độ Trung bình (10 câu)
                </div>
                <ul style={{ paddingLeft: 18 }}>
                  {mediumQuestions.map((q, idx) => (
                    <li key={idx} style={{ marginBottom: 8, fontSize: 16 }}>{q}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="fw-bold mb-2" style={{ color: "#ef4444", fontSize: 18 }}>
                  🔴 Cấp độ Nâng cao (5 câu)
                </div>
                <ul style={{ paddingLeft: 18 }}>
                  {advancedQuestions.map((q, idx) => (
                    <li key={idx} style={{ marginBottom: 8, fontSize: 16 }}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <footer style={{ backgroundColor: ORANGE_DARK }} className="text-white text-center py-3 mt-0">
        <p className="mb-0" style={{ letterSpacing: 1 }}>© 2025 Student Club - All rights reserved</p>
      </footer>
    </div>
  );
};

export default AddInterview;