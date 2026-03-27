import React, { useState, useEffect } from "react";
import { ChevronRight, Megaphone, Building2, Calendar, MapPin } from "lucide-react";
import { API_BASE_URL } from "../services/api";

import "../styles/PublicPortal.css"; 

import PublicHeader, { UNI_BLUE, UNI_RED } from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import PublicModals from "../components/public/PublicModals";

const DOMAIN_URL = API_BASE_URL.replace('/api', '');

const PublicHome = () => {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Áp dụng Đợt Tuyển
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [applyForm, setApplyForm] = useState({ applicantName: "", applicantEmail: "", applicantPhone: "" });
  const [applySuccess, setApplySuccess] = useState(false);

  // Xem Chi tiết CLB
  const [showClubModal, setShowClubModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);
  const [clubCampaigns, setClubCampaigns] = useState([]);
  const [loadingClubEvents, setLoadingClubEvents] = useState(false);

  // Đăng ký Sự kiện (Event Registration)
  const [showEventRegModal, setShowEventRegModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventRegForm, setEventRegForm] = useState({ guestName: "", guestEmail: "" });
  const [eventRegSuccess, setEventRegSuccess] = useState(false);

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

  const openClubDetail = async (club) => {
    setSelectedClub(club);
    setShowClubModal(true);
    setLoadingClubEvents(true);
    try {
      const resEvt = await fetch(`${DOMAIN_URL}/publicEvents/club?clubId=${club.clubId}`);
      const dataEvt = await resEvt.json().catch(() => []);
      setClubEvents(Array.isArray(dataEvt) ? dataEvt : (dataEvt?.data || dataEvt?.items || []));

      const resCamp = await fetch(`${API_BASE_URL}/Campaign?clubId=${club.clubId}&isActive=true`);
      const dataCamp = await resCamp.json().catch(() => []);
      setClubCampaigns(Array.isArray(dataCamp) ? dataCamp : (dataCamp?.data || dataCamp?.items || []));
    } catch (error) { setClubEvents([]); setClubCampaigns([]); } 
    finally { setLoadingClubEvents(false); }
  };

  // Submit Xin vào CLB (Interview Walk-in)
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/interviews/walkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubId: selectedCampaign.clubId,
          campaignId: selectedCampaign.campaignId,
          applicantName: applyForm.applicantName,
          applicantEmail: applyForm.applicantEmail,
          applicantPhone: applyForm.applicantPhone
        })
      });
      if (res.ok) {
        setApplySuccess(true);
        setTimeout(() => { setShowApplyModal(false); setApplySuccess(false); setApplyForm({ applicantName: "", applicantEmail: "", applicantPhone: "" }); }, 2000);
      } else { alert("Đăng ký thất bại."); }
    } catch (err) { alert("Lỗi mạng."); }
  };

  // Submit Đăng ký Sự kiện (Event Registration Guest)
  const handleEventRegSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/EventRegistrations`, { // Tùy API của bạn, có thể là /EventRegistration
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          userId: 0, // 0 = Khách vãng lai
          guestName: eventRegForm.guestName,
          guestEmail: eventRegForm.guestEmail,
          checkedIn: false,
          isCare: 1 // Có quan tâm
        })
      });
      if (res.ok) {
        setEventRegSuccess(true);
        setTimeout(() => { setShowEventRegModal(false); setEventRegSuccess(false); setEventRegForm({ guestName: "", guestEmail: "" }); }, 2000);
      } else { alert("Có lỗi xảy ra, thử lại sau."); }
    } catch (err) { alert("Lỗi mạng."); }
  };

  const onOpenEventReg = (evt) => {
    setSelectedEvent(evt);
    setShowEventRegModal(true);
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
                        <div style={{ height: "160px", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                          <Building2 size={56} color="#94a3b8" opacity={0.5} />
                          <span className="portal-badge" style={{ position: "absolute", top: "16px", left: "16px" }}>HOT</span>
                        </div>
                        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                          <h5 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "12px", lineHeight: "1.4" }}>{camp.title}</h5>
                          <div style={{ fontSize: "14px", color: "#475569", marginBottom: "12px", display: "flex", gap: "8px" }}>
                            <Building2 size={16} color={UNI_BLUE}/> 
                            <span style={{ color: UNI_BLUE, cursor: 'pointer', fontWeight: "700" }} onClick={() => openClubDetail({ clubId: camp.clubId, clubName: camp.clubName || getClubName(camp.clubId) })}>{camp.clubName || getClubName(camp.clubId)}</span>
                          </div>
                          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", display: "flex", gap: "8px" }}>
                            <Calendar size={16}/> Hạn nộp: {camp.endDate ? new Date(camp.endDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                          </div>
                          <button className="portal-btn" style={{ marginTop: "auto", width: "100%" }} onClick={() => { setSelectedCampaign(camp); setShowApplyModal(true); }}>
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
                    <div key={evt.id} style={{ display: "flex", gap: "20px", padding: "20px", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "0.2s", cursor: "pointer" }} onClick={() => onOpenEventReg(evt)}>
                      <div style={{ background: "#fef2f2", border: `1px solid #fecaca`, borderRadius: "16px", textAlign: "center", minWidth: "70px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <div style={{ background: UNI_RED, color: "#fff", fontSize: "12px", padding: "6px", fontWeight: "800" }}>TH {new Date(evt.eventDate).getMonth() + 1}</div>
                        <div style={{ fontSize: "24px", fontWeight: "900", color: UNI_RED, padding: "10px 0" }}>{new Date(evt.eventDate).getDate()}</div>
                      </div>
                      <div>
                        <h6 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0", lineHeight: "1.4" }}>{evt.title}</h6>
                        <div style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14}/> Click để đăng ký</div>
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
                <div className="portal-card" style={{ cursor: "pointer", padding: "40px 20px", alignItems: "center", textAlign: "center" }} onClick={() => openClubDetail(club)}>
                  <div style={{ width: "72px", height: "72px", background: "#f0f9ff", color: UNI_BLUE, borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "900", marginBottom: "20px", border: "1px solid #bae6fd" }}>
                    {club.clubName ? club.clubName.charAt(0) : "C"}
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

      <PublicModals 
        showApplyModal={showApplyModal} setShowApplyModal={setShowApplyModal} applySuccess={applySuccess}
        handleApplySubmit={handleApplySubmit} applyForm={applyForm} setApplyForm={setApplyForm} selectedCampaign={selectedCampaign} getClubName={getClubName}
        showClubModal={showClubModal} setShowClubModal={setShowClubModal} selectedClub={selectedClub} clubEvents={clubEvents} loadingClubEvents={loadingClubEvents}
        clubCampaigns={clubCampaigns} onApplyFromClub={(camp) => { setSelectedCampaign(camp); setShowApplyModal(true); }}
        showEventRegModal={showEventRegModal} setShowEventRegModal={setShowEventRegModal} selectedEvent={selectedEvent} eventRegForm={eventRegForm} setEventRegForm={setEventRegForm} handleEventRegSubmit={handleEventRegSubmit} eventRegSuccess={eventRegSuccess} onOpenEventReg={onOpenEventReg}
      />
    </div>
  );
};

export default PublicHome;