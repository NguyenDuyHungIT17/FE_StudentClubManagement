import React, { useEffect, useMemo, useState } from "react";
import { Building2, CalendarDays, Users, Sparkles, ClipboardList, MapPin, Clock } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

const DOMAIN_URL = API_BASE_URL.replace("/api", "");

const ClubsSection = ({ userId, clubId }) => {
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [clubPhotos, setClubPhotos] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Lấy thông tin CLB
        const clubRes = await fetch(`${API_BASE_URL}/Clubs/${clubId}`, { headers }).then(r => r.ok ? r.json() : null);
        if (clubRes) setClub(clubRes?.data || clubRes?.value || clubRes);

        // 2. Lấy TẤT CẢ sự kiện (Bao gồm cả Private)
        const eventRes = await fetch(`${API_BASE_URL}/Event`, { headers }).then(r => r.ok ? r.json() : []);
        const allEvents = Array.isArray(eventRes) ? eventRes : (eventRes?.data || eventRes?.items || []);
        setEvents(allEvents.filter(e => e.clubId === clubId));

        // 3. Lấy Đợt tuyển (Campaigns)
        const campRes = await fetch(`${API_BASE_URL}/Campaign`, { headers }).then(r => r.ok ? r.json() : []);
        const allCamps = Array.isArray(campRes) ? campRes : (campRes?.data || campRes?.items || []);
        setCampaigns(allCamps.filter(c => c.clubId === clubId));

        // 4. Lấy số lượng thành viên
        const memberRes = await fetch(`${API_BASE_URL}/ClubMembers/club/${clubId}`, { headers }).then(r => r.ok ? r.json() : []);
        setMemberCount(Array.isArray(memberRes) ? memberRes.length : 0);

        // 5. Lấy Ảnh thư viện
        const photoRes = await fetch(`${API_BASE_URL}/Photos/club/${clubId}`, { headers }).then(r => r.ok ? r.json() : []);
        setClubPhotos(Array.isArray(photoRes) ? photoRes : (photoRes?.data || photoRes?.value || []));

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu CLB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubId]);

  // Gộp ảnh Avatar và ảnh Thư viện
  const clubImages = useMemo(() => {
    const images = [];
    if (club?.photoUrl) {
      const resolved = getImageUrl(club.photoUrl);
      if (resolved) images.push({ url: resolved, title: "Ảnh đại diện" });
    }
    (clubPhotos || []).forEach((p) => {
      const resolved = getImageUrl(p?.url);
      if (!resolved || images.some((img) => img.url === resolved)) return;
      images.push({ url: resolved, title: p?.title || "" });
    });
    return images;
  }, [club?.photoUrl, clubPhotos]);

  // Auto xoay ảnh Slider
  useEffect(() => {
    if (!clubImages || clubImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % clubImages.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [clubImages]);

  const goPrevImage = () => setActiveImageIndex((prev) => (prev - 1 + clubImages.length) % clubImages.length);
  const goNextImage = () => setActiveImageIndex((prev) => (prev + 1) % clubImages.length);

  const interviewSchedule = useMemo(() => {
    return campaigns.map((c) => ({
      id: c.campaignId,
      title: c.title,
      from: c.startDate ? new Date(c.startDate).toLocaleDateString("vi-VN") : "Đang cập nhật",
      to: c.endDate ? new Date(c.endDate).toLocaleDateString("vi-VN") : "Không giới hạn",
      isActive: c.isActive,
      photoUrl: c.photoUrl
    }));
  }, [campaigns]);

  // NẾU CHƯA CÓ CLB
  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Đang tải dữ liệu Câu lạc bộ...</div>;
  if (!clubId || !club) return (
    <div style={{ padding: 60, textAlign: "center", background: "#f8fafc", borderRadius: 16, border: "2px dashed #cbd5e1" }}>
      <Building2 size={64} color="#94a3b8" style={{ marginBottom: 16 }} />
      <h2 style={{ color: "#334155", margin: "0 0 10px 0" }}>Bạn chưa tham gia Câu lạc bộ nào</h2>
      <p style={{ color: "#64748b", fontSize: 15 }}>Hãy sang mục "Ứng tuyển" để tìm kiếm CLB phù hợp và tham gia nhé!</p>
    </div>
  );

  // GIAO DIỆN CHÍNH
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. HEADER CLB */}
      <section style={{ background: "radial-gradient(circle at top right,#dbeafe 0,#eff6ff 40%,#fff 100%)", border: "1px solid #dbeafe", borderRadius: 26, padding: 28 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
          {/* Thông tin chữ */}
          <div style={{ flex: "1 1 500px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
              <Sparkles size={14} /> CÂU LẠC BỘ CỦA BẠN
            </div>
            <h1 style={{ margin: "0 0 8px", fontSize: 36, lineHeight: 1.15, color: "#0f172a", fontWeight: 900 }}>{club.clubName}</h1>
            <div style={{ color: "#334155", fontWeight: 700, fontSize: 16 }}>{club.title || "Tổ chức sinh viên năng động"}</div>
            <div style={{ marginTop: 12, color: "#64748b" }}>Trưởng CLB: <strong style={{ color: "#0f172a" }}>{club.leaderName || "Đang cập nhật"}</strong></div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", color: "#0f172a", fontWeight: 800 }}>
                <Users size={18} color="#3b82f6" /> {memberCount} Thành viên
              </div>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", color: "#0f172a", fontWeight: 800 }}>
                <CalendarDays size={18} color="#10b981" /> {events.length} Sự kiện
              </div>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", color: "#0f172a", fontWeight: 800 }}>
                <ClipboardList size={18} color="#f59e0b" /> {campaigns.length} Đợt tuyển
              </div>
            </div>

            <div style={{ marginTop: 20, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 20 }}>
              <div style={{ fontWeight: 900, color: "#0f172a", marginBottom: 10 }}>Giới thiệu CLB</div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#475569", fontSize: 15 }}>
                {club.description || "CLB đang cập nhật mô tả chi tiết."}
              </div>
            </div>
          </div>

          {/* Slider Ảnh */}
          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {clubImages.length > 0 ? (
              <div style={{ width: "100%", maxWidth: 400 }}>
                <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #bfdbfe", background: "#fff", aspectRatio: "1 / 1", position: "relative" }}>
                  <img src={clubImages[activeImageIndex]?.url} alt="club-img" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {clubImages.length > 1 && (
                    <div style={{ position: "absolute", inset: 12, display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "none" }}>
                      <button type="button" onClick={goPrevImage} style={{ pointerEvents: "auto", width: 36, height: 36, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>‹</button>
                      <button type="button" onClick={goNextImage} style={{ pointerEvents: "auto", width: 36, height: 36, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>›</button>
                    </div>
                  )}
                  <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, background: "rgba(15,23,42,0.6)", color: "#fff", borderRadius: 8, padding: "6px 10px", display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, backdropFilter: "blur(4px)" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clubImages[activeImageIndex]?.title || "Ảnh hoạt động"}</span>
                    <span>{activeImageIndex + 1}/{clubImages.length}</span>
                  </div>
                </div>
                {/* Thumbnails */}
                {clubImages.length > 1 && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                    {clubImages.map((img, idx) => (
                      <img key={idx} src={img.url} alt="thumb" onClick={() => setActiveImageIndex(idx)} style={{ flex: "0 0 auto", width: 50, height: 50, borderRadius: 8, objectFit: "cover", cursor: "pointer", border: idx === activeImageIndex ? "2px solid #1d4ed8" : "1px solid #cbd5e1" }} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ width: "100%", maxWidth: 400, aspectRatio: "1", background: "#f8fafc", borderRadius: 16, border: "2px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chưa có hình ảnh</div>
            )}
          </div>
        </div>
      </section>

      {/* 2. SỰ KIỆN & ĐỢT TUYỂN BÊN DƯỚI */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {/* Cột Sự kiện */}
        <div style={{ flex: "1 1 400px", background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", color: "#0f172a", fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><CalendarDays color="#3b82f6" /> Lịch Sự Kiện</h3>
          {events.length === 0 ? (
            <div style={{ color: "#64748b", background: "#f8fafc", padding: 20, borderRadius: 12, textAlign: "center" }}>Chưa có sự kiện nào.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {events.map((e) => (
                <div key={e.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 16 }}>{e.title}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 12, background: e.isPrivate ? "#fef3c7" : "#dcfce3", color: e.isPrivate ? "#d97706" : "#166534" }}>
                      {e.isPrivate ? "Nội bộ" : "Công khai"}
                    </span>
                  </div>
                  <div style={{ color: "#475569", fontSize: 14, display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Clock size={14}/> {e.eventDate ? new Date(e.eventDate).toLocaleString("vi-VN") : "Đang cập nhật"}</div>
                  {e.location && <div style={{ color: "#475569", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14}/> {e.location}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cột Đợt Tuyển */}
        <div style={{ flex: "1 1 400px", background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", color: "#0f172a", fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><ClipboardList color="#f59e0b" /> Các Đợt Tuyển</h3>
          {interviewSchedule.length === 0 ? (
            <div style={{ color: "#64748b", background: "#f8fafc", padding: 20, borderRadius: 12, textAlign: "center" }}>Chưa có đợt tuyển nào.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {interviewSchedule.map((i) => (
                <div key={i.id} style={{ background: i.isActive ? "#ecfdf5" : "#f8fafc", border: `1px solid ${i.isActive ? "#bbf7d0" : "#e2e8f0"}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 6, fontSize: 16 }}>{i.title}</div>
                  <div style={{ fontSize: 14, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                    <CalendarDays size={14}/> Từ {i.from} - {i.to}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: i.isActive ? "#10b981" : "#94a3b8" }}>
                    {i.isActive ? "● Đang mở đăng ký" : "● Đã đóng"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubsSection;