import React, { useState, useEffect } from "react";
import { ChevronRight, Megaphone, Building2, Calendar, MapPin } from "lucide-react";
import { API_BASE_URL } from "../services/api";
import { useNavigate } from "react-router-dom";

import "../styles/PublicPortal.css"; 

import PublicHeader, { UNI_BLUE, UNI_RED } from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";

const DOMAIN_URL = API_BASE_URL.replace('/api', '');

const PublicHome = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const resClubs = await fetch(`${API_BASE_URL}/Clubs`);
      const dataClubs = await resClubs.json().catch(() => []);
      setClubs(Array.isArray(dataClubs) ? dataClubs : (dataClubs?.data || dataClubs?.items || []));

      const resEvents = await fetch(`${DOMAIN_URL}/publicEvents`);
      const dataEvents = await resEvents.json().catch(() => []);
      const eventsArray = Array.isArray(dataEvents) ? dataEvents : (dataEvents?.data || dataEvents?.items || []);
      setEvents(eventsArray.slice(0, 5)); 

      const resCamps = await fetch(`${API_BASE_URL}/Campaign?isActive=true&pageSize=10`);
      const dataCamps = await resCamps.json().catch(() => []);
      setCampaigns(Array.isArray(dataCamps) ? dataCamps : (dataCamps?.data || dataCamps?.items || []));
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const getClubName = (id) => clubs.find(c => c.clubId === id)?.clubName || "Câu lạc bộ";
  const getImageUrl = (rawUrl) => {
    if (!rawUrl) return "";
    if (String(rawUrl).startsWith("http")) return rawUrl;
    return `${DOMAIN_URL}${rawUrl}`;
  };

  const openClubDetailPage = (club) => {
    navigate(`/public/clubs/${club.clubId}`, { state: { club } });
  };

  const onOpenCampaignApplyPage = (camp) => {
    navigate(`/public/apply/${camp.campaignId}`, {
      state: {
        campaign: camp,
        clubName: camp.clubName || getClubName(camp.clubId)
      }
    });
  };

  const onOpenEventDetailPage = (evt) => {
    navigate(`/public/events/${evt.id}`, {
      state: {
        event: evt,
        clubName: getClubName(evt.clubId)
      }
    });
  };

  return (
    <div className="public-portal-escape">
      <PublicHeader />

      <main style={{ padding: "60px 0 40px" }}>
        <div className="portal-container">
          <div className="portal-row">
            
            {/* CỘT TRÁI: CHIẾN DỊCH */}
            <div id="campaigns" className="portal-col-8">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
                <Megaphone size={32} color={UNI_BLUE} />
                <h3 style={{ margin: 0, fontWeight: "900", fontSize: "28px", color: "#0f172a" }}>Đợt Tuyển Đang Mở</h3>
              </div>

              {loading ? <div style={{textAlign: "center", padding: "40px", color: "#64748b"}}>Đang tải dữ liệu hệ thống...</div> : (
                <div className="portal-row">
                  {campaigns.length === 0 ? <div className="portal-col-12"><div style={{padding: "30px", background: "#fff", borderRadius: "20px", border: "1px dashed #cbd5e1", textAlign: "center", color: "#64748b"}}>Hiện chưa có chiến dịch tuyển sinh nào.</div></div> : campaigns.map(camp => (
                    <div key={camp.campaignId} className="portal-col-6" style={{ marginBottom: "30px" }}>
                      <div className="portal-card">
                        <div style={{ height: "160px", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                          {camp.photoUrl ? (
                            <img src={getImageUrl(camp.photoUrl)} alt={camp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <Building2 size={56} color="#94a3b8" opacity={0.5} />
                          )}
                          <span className="portal-badge" style={{ position: "absolute", top: "16px", left: "16px" }}>HOT</span>
                        </div>
                        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                          <h5 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "12px", lineHeight: "1.4" }}>{camp.title}</h5>
                          <div style={{ fontSize: "14px", color: "#475569", marginBottom: "12px", display: "flex", gap: "8px" }}>
                            <Building2 size={16} color={UNI_BLUE}/> 
                            <span style={{ color: UNI_BLUE, cursor: 'pointer', fontWeight: "700" }} onClick={() => openClubDetailPage({ clubId: camp.clubId, clubName: camp.clubName || getClubName(camp.clubId) })}>{camp.clubName || getClubName(camp.clubId)}</span>
                          </div>
                          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", display: "flex", gap: "8px" }}>
                            <Calendar size={16}/> Hạn nộp: {camp.endDate ? new Date(camp.endDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                          </div>
                          <button className="portal-btn" style={{ marginTop: "auto", width: "100%" }} onClick={() => onOpenCampaignApplyPage(camp)}>
                            Nộp Hồ Sơ Ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: SỰ KIỆN */}
            <div id="events" className="portal-col-4">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
                <Calendar size={32} color={UNI_RED} />
                <h3 style={{ margin: 0, fontWeight: "900", fontSize: "28px", color: "#0f172a" }}>Sự Kiện Sắp Tới</h3>
              </div>

              {loading ? <div style={{textAlign: "center", color: "#64748b"}}>Đang tải...</div> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {events.length === 0 ? <div style={{color: "#64748b", fontSize: "14px", padding: "20px", background: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e1", textAlign: "center"}}>Không có sự kiện mới.</div> : events.map(evt => (
                    <div key={evt.id} style={{ display: "flex", gap: "20px", padding: "20px", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "0.2s", cursor: "pointer" }} onClick={() => onOpenEventDetailPage(evt)}>
                      <div style={{ minWidth: "88px", width: "88px", height: "88px", borderRadius: "14px", overflow: "hidden", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                        {evt.photoUrl ? (
                          <img src={getImageUrl(evt.photoUrl)} alt={evt.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ background: "#fef2f2", border: `1px solid #fecaca`, textAlign: "center", width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                            <div style={{ background: UNI_RED, color: "#fff", fontSize: "12px", padding: "6px", fontWeight: "800" }}>TH {new Date(evt.eventDate).getMonth() + 1}</div>
                            <div style={{ fontSize: "24px", fontWeight: "900", color: UNI_RED, padding: "10px 0" }}>{new Date(evt.eventDate).getDate()}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h6 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0", lineHeight: "1.4" }}>{evt.title}</h6>
                        <div style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14}/> Xem chi tiết sự kiện</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* DANH SÁCH CÂU LẠC BỘ */}
      <section id="clubs" style={{ padding: "80px 0", background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div className="portal-container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h3 style={{ fontSize: "32px", fontWeight: "900", color: "#0f172a", margin: "0 0 16px 0" }}>Khám Phá Câu Lạc Bộ</h3>
            <p style={{ color: "#64748b", fontSize: "18px", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>Tìm kiếm cộng đồng sinh viên năng động nhất. Nơi bạn phát triển bản thân và tạo ra những kỷ niệm đáng nhớ tại HaUI.</p>
          </div>
          
          <div className="portal-row">
            {(Array.isArray(clubs) ? clubs : []).slice(0, 8).map(club => (
              <div key={club.clubId} className="portal-col-3" style={{ marginBottom: "30px" }}>
                <div className="portal-card" style={{ cursor: "pointer", padding: "40px 20px", alignItems: "center", textAlign: "center" }} onClick={() => openClubDetailPage(club)}>
                  <div style={{ width: "72px", height: "72px", background: "#f0f9ff", color: UNI_BLUE, borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "900", marginBottom: "20px", border: "1px solid #bae6fd", overflow: "hidden" }}>
                    {club.photoUrl ? (
                      <img src={getImageUrl(club.photoUrl)} alt={club.clubName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      club.clubName ? club.clubName.charAt(0) : "C"
                    )}
                  </div>
                  <h6 style={{ fontWeight: "800", fontSize: "18px", color: "#0f172a", marginBottom: "10px" }}>{club.clubName}</h6>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>{club.title || "Tổ chức Sinh viên"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />

    </div>
  );
};

export default PublicHome;