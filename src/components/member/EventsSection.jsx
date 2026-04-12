import React, { useState, useEffect } from "react";
import { CalendarDays, MapPin, Clock, Info } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

const DOMAIN_URL = API_BASE_URL.replace("/api", "");

const EventsSection = ({ clubId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (rawUrl) => {
    if (!rawUrl) return "";
    if (String(rawUrl).startsWith("http")) return rawUrl;
    return `${DOMAIN_URL}${rawUrl}`;
  };

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }
    fetchEvents(clubId);
  }, [clubId]);

  const fetchEvents = async (cId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Dùng API chung lấy tất cả Events
      const res = await fetch(`${API_BASE_URL}/Event`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        const allEvents = Array.isArray(data) ? data : (data?.data || data?.items || []);
        // Lọc sự kiện thuộc CLB của mình
        setEvents(allEvents.filter(e => e.clubId === cId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải danh sách sự kiện...</div>;

  if (!clubId) return (
    <div style={{ padding: 40, textAlign: "center", background: "#f8fafc", borderRadius: 12, border: "1px dashed #cbd5e1" }}>
      <CalendarDays size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
      <h3 style={{ color: "#334155", margin: "0 0 8px 0" }}>Chưa thể khám phá sự kiện</h3>
      <p style={{ color: "#64748b", fontSize: 14 }}>Bạn cần tham gia một Câu lạc bộ để xem lịch trình của họ.</p>
    </div>
  );

  return (
    <div>
      <div style={{ background: "#eff6ff", padding: "16px 20px", borderRadius: 12, marginBottom: 24, display: "flex", gap: 12, alignItems: "center", border: "1px solid #bfdbfe", color: "#1e3a8a" }}>
        <Info size={24} />
        <div>
          <strong style={{ display: "block" }}>Sự kiện nội bộ & Công khai</strong>
          <span style={{ fontSize: 14 }}>Tại đây hiển thị toàn bộ lịch trình hoạt động của Câu lạc bộ bạn. Bao gồm cả các buổi họp kín (Private) dành riêng cho thành viên.</span>
        </div>
      </div>
      
      {events.length === 0 ? (
        <div style={{ padding: 40, background: "#f8fafc", borderRadius: 16, textAlign: "center", color: "#64748b", border: "1px solid #e2e8f0" }}>
          CLB hiện chưa có sự kiện nào sắp diễn ra.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {events.map(ev => (
            <div key={ev.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 4px rgba(0,0,0,0.04)" }}>
              {/* Header Card chứa Ảnh Cover */}
              <div style={{ height: 160, background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", position: "relative" }}>
                {ev.photoUrl && (
                  <img src={getImageUrl(ev.photoUrl)} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
                )}
                <span style={{ position: "absolute", top: 12, right: 12, background: ev.isPrivate ? "#f59e0b" : "#10b981", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                  {ev.isPrivate ? "Nội bộ (Private)" : "Công khai"}
                </span>
              </div>

              {/* Thân Card */}
              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: 18, color: "#0f172a", lineHeight: 1.4, fontWeight: 800 }}>{ev.title}</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569", fontSize: 14 }}>
                    <Clock size={16} color="#64748b"/> 
                    <span style={{ fontWeight: 600 }}>{ev.eventDate ? new Date(ev.eventDate).toLocaleString('vi-VN') : "Chưa ấn định"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "#475569", fontSize: 14 }}>
                    <MapPin size={16} color="#64748b" style={{ marginTop: 2 }}/> 
                    <span>{ev.location || "Online / Đang cập nhật địa điểm"}</span>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: "#64748b", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
                  {ev.description || "Không có mô tả chi tiết."}
                </p>

                <div style={{ marginTop: "auto", paddingTop: 16 }}>
                  {/* Button có thể dùng để xem chi tiết / Mở Modal đăng ký sau này */}
                  <button style={{ width: "100%", padding: "10px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 8, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => {e.target.style.background="#e2e8f0"; e.target.style.color="#0f172a"}} onMouseOut={e => {e.target.style.background="#f1f5f9"; e.target.style.color="#334155"}}>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsSection;