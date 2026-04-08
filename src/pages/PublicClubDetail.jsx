import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, CalendarDays, Users, Sparkles, ClipboardList } from "lucide-react";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import { API_BASE_URL } from "../services/api";
import { clubService } from "../services/clubService";
import { campaignService } from "../services/campaignService";
import "../styles/PublicPortal.css";

const DOMAIN_URL = API_BASE_URL.replace("/api", "");

const PublicClubDetail = () => {
  const { clubId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [club, setClub] = useState(location.state?.club || null);
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [memberCount, setMemberCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const getImageUrl = (rawUrl) => {
    if (!rawUrl) return "";
    if (String(rawUrl).startsWith("http")) return rawUrl;
    return `${DOMAIN_URL}${rawUrl}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clubRes, eventRes, campaignRes] = await Promise.all([
          clubService.getById(clubId).catch(() => null),
          fetch(`${DOMAIN_URL}/publicEvents/club?clubId=${clubId}`).then((r) => r.json().catch(() => [])).catch(() => []),
          campaignService.getAll("", clubId, "all", 1, 100).catch(() => ({ data: [] }))
        ]);

        if (clubRes) setClub(clubRes);

        const eventList = Array.isArray(eventRes) ? eventRes : (eventRes?.data || eventRes?.items || []);
        setEvents(eventList);
        setCampaigns(campaignRes?.data || []);

        try {
          // Nếu endpoint members không public thì sẽ fallback về null
          const memberRes = await fetch(`${API_BASE_URL}/Members?clubId=${clubId}&PageNumber=1&PageSize=1`, { headers: { Accept: "application/json" } });
          const pagination = memberRes.headers.get("X-Pagination");
          const parsed = pagination ? JSON.parse(pagination) : null;
          setMemberCount(parsed?.TotalCount ?? parsed?.totalCount ?? null);
        } catch {
          setMemberCount(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubId]);

  const interviewSchedule = useMemo(() => {
    if (!campaigns.length) return [];
    return campaigns.map((c) => ({
      id: c.campaignId,
      title: c.title,
      from: c.startDate ? new Date(c.startDate).toLocaleDateString("vi-VN") : "Đang cập nhật",
      to: c.endDate ? new Date(c.endDate).toLocaleDateString("vi-VN") : "Không giới hạn",
      isActive: c.isActive
    }));
  }, [campaigns]);

  return (
    <div className="public-portal-escape">
      <PublicHeader />

      <main style={{ padding: "44px 0 60px" }}>
        <div className="portal-container">
          <button className="portal-btn portal-btn-outline" onClick={() => navigate("/public")} style={{ marginBottom: 20 }}>
            <ArrowLeft size={16} /> Quay lại trang Public
          </button>

          {loading ? (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 24 }}>Đang tải thông tin CLB...</div>
          ) : !club ? (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #fee2e2", color: "#b91c1c", padding: 24 }}>Không tìm thấy CLB.</div>
          ) : (
            <>
              <section style={{ background: "radial-gradient(circle at top right,#dbeafe 0,#eff6ff 40%,#fff 100%)", border: "1px solid #dbeafe", borderRadius: 26, padding: 28, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                  <div>
                    <div className="portal-badge" style={{ marginBottom: 10 }}><Sparkles size={14} /> CLUB PROFILE</div>
                    <h1 style={{ margin: "0 0 8px", fontSize: 36, lineHeight: 1.15, color: "#0f172a", fontWeight: 900 }}>{club.clubName}</h1>
                    <div style={{ color: "#334155", fontWeight: 700 }}>{club.title || "Tổ chức sinh viên năng động"}</div>
                    <div style={{ marginTop: 12, color: "#64748b" }}>Trưởng CLB: <strong style={{ color: "#0f172a" }}>{club.leaderName || "Đang cập nhật"}</strong></div>
                  </div>

                  <div style={{ minWidth: 220, display: "grid", gap: 10 }}>
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "flex", gap: 8, alignItems: "center", color: "#0f172a", fontWeight: 700 }}>
                      <Users size={16} /> Thành viên: {memberCount ?? "Đang cập nhật"}
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "flex", gap: 8, alignItems: "center", color: "#0f172a", fontWeight: 700 }}>
                      <CalendarDays size={16} /> Sự kiện public: {events.length}
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "flex", gap: 8, alignItems: "center", color: "#0f172a", fontWeight: 700 }}>
                      <ClipboardList size={16} /> Đợt tuyển: {campaigns.length}
                    </div>
                  </div>
                </div>

                {club.photoUrl && (
                  <div style={{ marginTop: 16, borderRadius: 16, overflow: "hidden", border: "1px solid #bfdbfe" }}>
                    <img src={getImageUrl(club.photoUrl)} alt={club.clubName} style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block" }} />
                  </div>
                )}

                <div style={{ marginTop: 18, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#334155" }}>
                  {club.description || "CLB đang cập nhật mô tả chi tiết."}
                </div>
              </section>

              <div className="portal-row">
                <div className="portal-col-6">
                  <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 22, height: "100%" }}>
                    <h3 style={{ margin: "0 0 14px", color: "#0f172a", fontSize: 21, fontWeight: 900 }}><CalendarDays size={18} /> Sự kiện của CLB</h3>
                    {events.length === 0 ? (
                      <div style={{ color: "#64748b" }}>Chưa có sự kiện public nào.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 12 }}>
                        {events.map((e) => (
                          <button key={e.id} onClick={() => navigate(`/public/events/${e.id}`, { state: { event: e, clubName: club.clubName } })} style={{ textAlign: "left", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, cursor: "pointer" }}>
                            {e.photoUrl && (
                              <img src={getImageUrl(e.photoUrl)} alt={e.title} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, marginBottom: 8 }} />
                            )}
                            <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{e.title}</div>
                            <div style={{ color: "#64748b", fontSize: 13 }}>{e.eventDate ? new Date(e.eventDate).toLocaleString("vi-VN") : "Đang cập nhật"}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="portal-col-6">
                  <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 22, height: "100%" }}>
                    <h3 style={{ margin: "0 0 14px", color: "#0f172a", fontSize: 21, fontWeight: 900 }}><Building2 size={18} /> Lịch phỏng vấn / tuyển thành viên</h3>
                    {interviewSchedule.length === 0 ? (
                      <div style={{ color: "#64748b" }}>Chưa có lịch tuyển/phỏng vấn công khai.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 12 }}>
                        {interviewSchedule.map((i) => (
                          <div key={i.id} style={{ background: i.isActive ? "#ecfdf5" : "#f8fafc", border: `1px solid ${i.isActive ? "#bbf7d0" : "#e2e8f0"}`, borderRadius: 12, padding: 12 }}>
                            {campaigns.find((c) => c.campaignId === i.id)?.photoUrl && (
                              <img src={getImageUrl(campaigns.find((c) => c.campaignId === i.id)?.photoUrl)} alt={i.title} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
                            )}
                            <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{i.title}</div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>Từ {i.from} đến {i.to}</div>
                            {i.isActive && (
                              <button className="portal-btn" style={{ marginTop: 8 }} onClick={() => navigate(`/public/apply/${i.id}`, { state: { campaign: campaigns.find((c) => c.campaignId === i.id), clubName: club.clubName } })}>
                                Đăng ký phỏng vấn
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicClubDetail;
