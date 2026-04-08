import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft, CheckCircle2 } from "lucide-react";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import { API_BASE_URL } from "../services/api";
import { eventRegistrationService } from "../services/eventRegistrationService";
import { eventService } from "../services/eventService";
import "../styles/PublicPortal.css";

const DOMAIN_URL = API_BASE_URL.replace("/api", "");

const PublicEventDetail = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(location.state?.event || null);
  const [clubName, setClubName] = useState(location.state?.clubName || "Câu lạc bộ");
  const [loading, setLoading] = useState(!location.state?.event);

  const [form, setForm] = useState({ guestName: "", guestEmail: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const getImageUrl = (rawUrl) => {
    if (!rawUrl) return "";
    if (String(rawUrl).startsWith("http")) return rawUrl;
    return `${DOMAIN_URL}${rawUrl}`;
  };

  useEffect(() => {
    if (eventData) return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const found = await eventService.getByIdPublic(eventId);
        setEventData(found || null);
      } catch {
        try {
          const res = await fetch(`${DOMAIN_URL}/publicEvents`);
          const json = await res.json().catch(() => []);
          const list = Array.isArray(json) ? json : (json?.data || json?.items || []);
          const found = list.find((e) => String(e.id) === String(eventId));
          setEventData(found || null);
        } catch {
          setEventData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, eventData]);

  const eventDateText = useMemo(() => {
    if (!eventData?.eventDate) return "Đang cập nhật";
    return new Date(eventData.eventDate).toLocaleString("vi-VN");
  }, [eventData]);

  const onSubmitGuestCheckIn = async (e) => {
    e.preventDefault();
    if (!eventData) return;

    setSubmitting(true);
    setError("");
    try {
      await eventRegistrationService.registerGuest({
        eventId: Number(eventData.id),
        userId: 0,
        isGuest: true,
        guestName: form.guestName.trim(),
        guestEmail: form.guestEmail.trim(),
        checkedIn: false,
        isCare: 1
      });
      setSuccess(true);
      setForm({ guestName: "", guestEmail: "" });
    } catch (err) {
      setError(err?.message || "Không thể đăng ký lúc này.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-portal-escape">
      <PublicHeader />

      <main style={{ padding: "44px 0 60px" }}>
        <div className="portal-container">
          <button className="portal-btn portal-btn-outline" onClick={() => navigate("/public")} style={{ marginBottom: 20 }}>
            <ArrowLeft size={16} /> Quay lại trang Public
          </button>

          {loading ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #e2e8f0" }}>Đang tải sự kiện...</div>
          ) : !eventData ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #fee2e2", color: "#b91c1c" }}>
              Không tìm thấy sự kiện. Có thể endpoint public chưa trả item này.
            </div>
          ) : (
            <div className="portal-row">
              <div className="portal-col-7">
                <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0", padding: 28, boxShadow: "0 10px 30px rgba(2,6,23,0.05)" }}>
                  <div className="portal-badge" style={{ marginBottom: 10 }}>PUBLIC EVENT</div>
                  <h1 style={{ margin: "0 0 10px 0", fontSize: 34, lineHeight: 1.2, color: "#0f172a", fontWeight: 900 }}>{eventData.title}</h1>
                  <div style={{ color: "#475569", marginBottom: 20, fontWeight: 700 }}>{clubName}</div>

                  {eventData.photoUrl && (
                    <div style={{ marginBottom: 16, borderRadius: 14, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <img src={getImageUrl(eventData.photoUrl)} alt={eventData.title} style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }} />
                    </div>
                  )}

                  <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#334155" }}>
                      <Calendar size={16} /> {eventDateText}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#334155" }}>
                      <MapPin size={16} /> Trực tiếp tại trường / theo thông báo CLB
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 8, paddingTop: 18 }}>
                    <h3 style={{ margin: "0 0 10px", fontSize: 18, color: "#0f172a" }}>Nội dung sự kiện</h3>
                    <div style={{ whiteSpace: "pre-wrap", color: "#334155", lineHeight: 1.7 }}>
                      {eventData.description || "Đang cập nhật nội dung chi tiết. Bạn vẫn có thể check-in để nhận thông báo."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="portal-col-5">
                <div style={{ background: "linear-gradient(145deg,#fff,#f8fafc)", borderRadius: 24, border: "1px solid #e2e8f0", padding: 24, boxShadow: "0 10px 30px rgba(2,6,23,0.05)" }}>
                  <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a", fontWeight: 900 }}>Check-in khách tham gia</h2>
                  <p style={{ color: "#64748b", marginTop: 8, marginBottom: 16 }}>Điền thông tin để đăng ký tham gia sự kiện.</p>

                  {success && (
                    <div style={{ background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#047857", borderRadius: 12, padding: 12, marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
                      <CheckCircle2 size={18} /> Đăng ký thành công. Hẹn gặp bạn tại sự kiện!
                    </div>
                  )}

                  {error && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                      {error}
                    </div>
                  )}

                  {!success && (
                    <form onSubmit={onSubmitGuestCheckIn} style={{ display: "grid", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Họ tên</label>
                        <input
                          required
                          className="portal-input"
                          value={form.guestName}
                          onChange={(e) => setForm((p) => ({ ...p, guestName: e.target.value }))}
                          placeholder="Nhập họ tên của bạn"
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Email</label>
                        <input
                          required
                          type="email"
                          className="portal-input"
                          value={form.guestEmail}
                          onChange={(e) => setForm((p) => ({ ...p, guestEmail: e.target.value }))}
                          placeholder="you@example.com"
                        />
                      </div>

                      <button className="portal-btn" type="submit" disabled={submitting} style={{ marginTop: 4 }}>
                        {submitting ? "Đang gửi..." : "Xác nhận tham gia"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicEventDetail;
