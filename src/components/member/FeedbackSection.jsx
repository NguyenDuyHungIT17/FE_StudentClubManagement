import React, { useState, useEffect } from "react";
import { Star, Send, MessageSquare } from "lucide-react";

const FeedbackSection = ({ userProfile }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State dựa theo CreateFeedbackRequestDto
  const [form, setForm] = useState({ eventId: "", rating: 5, comments: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      // 1. Lấy danh sách sự kiện để hiển thị trong Dropdown
      const resEvt = await fetch("https://localhost:7251/api/Event", { headers: { Authorization: `Bearer ${token}` } });
      if (resEvt.ok) {
        const dataEvt = await resEvt.json();
        setEvents(dataEvt?.data || dataEvt?.items || dataEvt || []);
      }

      // 2. Lấy danh sách Feedback cá nhân (Từ API GET GetAllFeedbacks)
      const resFb = await fetch("https://localhost:7251/api/Feedback", { headers: { Authorization: `Bearer ${token}` } });
      if (resFb.ok) {
        const dataFb = await resFb.json();
        // Lọc ra feedback do mình viết
        const allFb = Array.isArray(dataFb) ? dataFb : (dataFb?.data || []);
        setFeedbacks(allFb.filter(f => f.userId === userProfile?.userId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.eventId) return alert("Vui lòng chọn Sự kiện!");
    if (!form.comments.trim()) return alert("Vui lòng viết nội dung đánh giá!");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7251/api/Feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        // Payload map với CreateFeedbackRequestDto
        body: JSON.stringify({
          eventId: parseInt(form.eventId),
          rating: parseInt(form.rating),
          comments: form.comments
        })
      });

      if (res.ok) {
        alert("Gửi đánh giá thành công! Cảm ơn bạn.");
        setForm({ eventId: "", rating: 5, comments: "" });
        fetchInitialData(); // Load lại danh sách
      } else {
        const err = await res.json();
        alert(err.message || "Có lỗi xảy ra khi gửi đánh giá.");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
      
      {/* CỘT TRÁI: FORM VIẾT ĐÁNH GIÁ */}
      <div style={{ flex: "1 1 400px", background: "#fff", padding: 30, borderRadius: 16, border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Star color="#f59e0b" fill="#f59e0b" /> Viết Đánh Giá Mới
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>Sự kiện tham gia *</label>
            <select className="input-control" value={form.eventId} onChange={e => setForm({...form, eventId: e.target.value})} style={{ width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: 8 }}>
              <option value="">-- Chọn sự kiện bạn muốn đánh giá --</option>
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title} ({new Date(ev.eventDate).toLocaleDateString('vi-VN')})</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>Mức độ hài lòng *</label>
            <div style={{ display: "flex", gap: 10 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <div key={star} onClick={() => setForm({...form, rating: star})} style={{ cursor: "pointer" }}>
                  <Star size={28} color={star <= form.rating ? "#f59e0b" : "#cbd5e1"} fill={star <= form.rating ? "#f59e0b" : "none"} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>Nội dung góp ý *</label>
            <textarea value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} placeholder="Sự kiện tổ chức thế nào? Cần cải thiện gì không?" rows={5} style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: 8, resize: "none", outline: "none", fontFamily: "inherit" }}></textarea>
          </div>

          <button type="submit" disabled={submitting} style={{ background: "#3b82f6", color: "#fff", padding: "12px", border: "none", borderRadius: 8, fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, cursor: submitting ? "not-allowed" : "pointer" }}>
            {submitting ? "Đang gửi..." : <><Send size={18}/> Gửi Đánh Giá</>}
          </button>
        </form>
      </div>

      {/* CỘT PHẢI: LỊCH SỬ ĐÁNH GIÁ */}
      <div style={{ flex: "1 1 400px" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare color="#10b981" /> Lịch sử Góp ý
        </h3>

        {loading ? <div>Đang tải lịch sử...</div> : feedbacks.length === 0 ? (
          <div style={{ padding: 20, background: "#f8fafc", borderRadius: 12, border: "1px dashed #cbd5e1", color: "#64748b", textAlign: "center" }}>Bạn chưa gửi đánh giá nào.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {feedbacks.map(fb => (
              <div key={fb.id || fb.feedbackId} style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong style={{ color: "#0f172a" }}>{events.find(e => e.id === fb.eventId)?.title || `Sự kiện #${fb.eventId}`}</strong>
                  <div style={{ display: "flex" }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color={s <= fb.rating ? "#f59e0b" : "#e2e8f0"} fill={s <= fb.rating ? "#f59e0b" : "none"} />)}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.5 }}>{fb.comments}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 10, textAlign: "right" }}>{new Date(fb.createdAt || Date.now()).toLocaleDateString('vi-VN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;