import React from "react";
import { X, CheckCircle, Calendar, Megaphone, Info, Building2, MapPin } from "lucide-react";
import { UNI_BLUE, UNI_RED } from "./PublicHeader";

const PublicModals = ({
  // Campaign
  showApplyModal, setShowApplyModal, applySuccess, handleApplySubmit,
  applyForm, setApplyForm, selectedCampaign, getClubName,
  
  // Club
  showClubModal, setShowClubModal, selectedClub, clubEvents, loadingClubEvents,
  clubCampaigns, onApplyFromClub,
  
  // Event
  showEventRegModal, setShowEventRegModal, selectedEvent, eventRegForm, setEventRegForm,
  handleEventRegSubmit, eventRegSuccess, onOpenEventReg
}) => {
  return (
    <>
      {/* 1. MODAL ĐĂNG KÝ PHỎNG VẤN (WALK-IN) */}
      {showApplyModal && selectedCampaign && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(5px)" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "520px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: UNI_BLUE }}>Nộp Hồ Sơ Ứng Tuyển</h5>
              <div onClick={() => setShowApplyModal(false)} style={{ cursor: "pointer", background: "#f1f5f9", padding: "8px", borderRadius: "50%", display: "flex" }}><X size={18} color="#64748b" /></div>
            </div>
            <div style={{ padding: "24px" }}>
              {applySuccess ? (
                <div style={{ textAlign: "center", padding: "30px 0" }}>
                  <CheckCircle size={60} color="#10b981" style={{ marginBottom: "15px" }} />
                  <h5 style={{ color: "#0f172a", fontWeight: "800", fontSize: "22px", margin: "0 0 10px 0" }}>Đăng ký thành công!</h5>
                  <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6" }}>Hồ sơ đã được lưu. Ban tuyển sự kiện sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ background: "#f0f9ff", borderRadius: "16px", padding: "16px", fontSize: "14px", border: "1px solid #bae6fd", color: "#1e3a8a", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div><span style={{opacity: 0.7}}>CLB:</span> <strong style={{color: UNI_BLUE}}>{selectedCampaign.clubName || getClubName(selectedCampaign.clubId)}</strong></div>
                    <div><span style={{opacity: 0.7}}>Đợt tuyển:</span> <strong>{selectedCampaign.title}</strong></div>
                  </div>
                  <div><label style={{ fontSize: "14px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>Họ và tên <span style={{color: UNI_RED}}>*</span></label><input required type="text" className="portal-input" value={applyForm.applicantName} onChange={e => setApplyForm({...applyForm, applicantName: e.target.value})} /></div>
                  <div><label style={{ fontSize: "14px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>Email liên hệ <span style={{color: UNI_RED}}>*</span></label><input required type="email" className="portal-input" value={applyForm.applicantEmail} onChange={e => setApplyForm({...applyForm, applicantEmail: e.target.value})} /></div>
                  <div><label style={{ fontSize: "14px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>Số điện thoại <span style={{color: UNI_RED}}>*</span></label><input required type="text" className="portal-input" value={applyForm.applicantPhone} onChange={e => setApplyForm({...applyForm, applicantPhone: e.target.value})} /></div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                    <button type="button" className="portal-btn portal-btn-outline" style={{ flex: 1 }} onClick={() => setShowApplyModal(false)}>Hủy</button>
                    <button type="submit" className="portal-btn" style={{ flex: 2 }}>Gửi Hồ Sơ</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 👉 THÊM MỚI: 2. MODAL ĐĂNG KÝ SỰ KIỆN TỪ KHÁCH VÃNG LAI */}
      {showEventRegModal && selectedEvent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(5px)" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "520px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: UNI_BLUE }}>Đăng ký tham gia Sự kiện</h5>
              <div onClick={() => setShowEventRegModal(false)} style={{ cursor: "pointer", background: "#f1f5f9", padding: "8px", borderRadius: "50%", display: "flex" }}><X size={18} color="#64748b" /></div>
            </div>
            <div style={{ padding: "24px" }}>
              {eventRegSuccess ? (
                <div style={{ textAlign: "center", padding: "30px 0" }}>
                  <CheckCircle size={60} color="#10b981" style={{ marginBottom: "15px" }} />
                  <h5 style={{ color: "#0f172a", fontWeight: "800", fontSize: "22px", margin: "0 0 10px 0" }}>Đăng ký thành công!</h5>
                  <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6" }}>Cảm ơn bạn đã quan tâm. Hãy nhớ thời gian và địa điểm diễn ra sự kiện nhé!</p>
                </div>
              ) : (
                <form onSubmit={handleEventRegSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ background: "#fff7ed", borderRadius: "16px", padding: "16px", fontSize: "14px", border: "1px solid #fed7aa", color: "#c2410c", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div><span style={{opacity: 0.7}}>Sự kiện:</span> <strong>{selectedEvent.title}</strong></div>
                    <div><span style={{opacity: 0.7}}>Thời gian:</span> <strong>{new Date(selectedEvent.eventDate).toLocaleString('vi-VN')}</strong></div>
                  </div>
                  <div><label style={{ fontSize: "14px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>Tên Khách mời <span style={{color: UNI_RED}}>*</span></label><input required type="text" className="portal-input" value={eventRegForm.guestName} onChange={e => setEventRegForm({...eventRegForm, guestName: e.target.value})} /></div>
                  <div><label style={{ fontSize: "14px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>Email liên hệ <span style={{color: UNI_RED}}>*</span></label><input required type="email" className="portal-input" value={eventRegForm.guestEmail} onChange={e => setEventRegForm({...eventRegForm, guestEmail: e.target.value})} /></div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                    <button type="button" className="portal-btn portal-btn-outline" style={{ flex: 1 }} onClick={() => setShowEventRegModal(false)}>Hủy</button>
                    <button type="submit" className="portal-btn" style={{ flex: 2, background: "#ea580c" }}>Xác Nhận Tham Gia</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL CHI TIẾT CÂU LẠC BỘ */}
      {showClubModal && selectedClub && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", zIndex: 999998, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(5px)" }}>
          <div style={{ background: "#f8fafc", width: "100%", maxWidth: "1000px", height: "85vh", borderRadius: "30px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ background: "#fff", padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: UNI_BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "900" }}>{selectedClub.clubName.charAt(0)}</div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: "900", fontSize: "22px", color: "#0f172a" }}>{selectedClub.clubName}</h4>
                  <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px", fontWeight: "600" }}>{selectedClub.title || "Tổ chức Sinh viên"}</div>
                </div>
              </div>
              <div onClick={() => setShowClubModal(false)} style={{ cursor: "pointer", background: "#f1f5f9", padding: "10px", borderRadius: "50%", display: "flex", transition: "0.2s" }}><X size={24} color="#475569" /></div>
            </div>
            
            <div style={{ padding: "40px", overflowY: "auto", flex: 1 }}>
              <h5 style={{ fontWeight: "800", color: "#0f172a", margin: "0 0 16px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}><Info size={20} color={UNI_BLUE}/> Giới thiệu chung</h5>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #e2e8f0", marginBottom: "40px" }}>
                <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#475569", margin: 0 }}>{selectedClub.description || "Đang cập nhật..."}</p>
              </div>

              <h5 style={{ fontWeight: "800", color: "#0f172a", margin: "0 0 20px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}><Megaphone size={20} color={UNI_RED}/> Đợt Tuyển Sinh Đang Mở</h5>
              {loadingClubEvents ? <div style={{ fontSize: "14px", color: "#64748b", marginBottom: 30 }}>Đang tải...</div> : clubCampaigns && clubCampaigns.length > 0 ? (
                <div className="portal-row" style={{ marginBottom: "40px" }}>
                  {clubCampaigns.map(camp => (
                    <div key={camp.campaignId} className="portal-col-6">
                      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: UNI_RED }}></div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}><span className="portal-badge">HOT</span><span style={{ fontWeight: "800", fontSize: "18px", color: "#0f172a" }}>{camp.title}</span></div>
                        <div style={{ fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}><Calendar size={16}/> Hạn nộp: {camp.endDate ? new Date(camp.endDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}</div>
                        <button className="portal-btn" style={{ marginTop: "auto" }} onClick={() => onApplyFromClub(camp)}>Nộp Đơn Ứng Tuyển Ngay</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div style={{ padding: "20px", background: "#f1f5f9", borderRadius: "16px", border: "1px dashed #cbd5e1", marginBottom: "40px", textAlign: "center", color: "#64748b" }}>Hiện tại CLB chưa có đợt tuyển nào.</div>}

              {/* LỊCH SỰ KIỆN - CLICK ĐỂ ĐĂNG KÝ */}
              <h5 style={{ fontWeight: "800", color: "#0f172a", margin: "0 0 20px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}><Calendar size={20} color="#10b981"/> Lịch Sự Kiện Public</h5>
              {loadingClubEvents ? <div style={{ fontSize: "14px", color: "#64748b" }}>Đang tải...</div> : clubEvents.length === 0 ? (
                <div style={{ padding: "20px", background: "#f1f5f9", borderRadius: "16px", border: "1px dashed #cbd5e1", textAlign: "center", color: "#64748b" }}>CLB chưa có sự kiện công khai nào trong tháng này.</div>
              ) : (
                <div className="portal-row">
                  {clubEvents.map(e => (
                     <div key={e.id} className="portal-col-6">
                       {/* Thêm onClick vào Box Sự kiện để gọi hàm Đăng ký */}
                       <div style={{ border: "1px solid #e2e8f0", borderRadius: "20px", padding: "20px", background: "#fff", display: "flex", gap: "20px", alignItems: "center", cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }} onClick={() => onOpenEventReg(e)}>
                         <div style={{ background: "#f0fdf4", borderRadius: "16px", width: "65px", height: "65px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #bcf0da" }}>
                           <span style={{ fontSize: "12px", fontWeight: "800", color: "#059669" }}>TH {new Date(e.eventDate).getMonth() + 1}</span>
                           <span style={{ fontSize: "24px", fontWeight: "900", color: "#059669" }}>{new Date(e.eventDate).getDate()}</span>
                         </div>
                         <div style={{ flex: 1 }}>
                           <div style={{ fontWeight: "800", fontSize: "16px", color: "#0f172a", marginBottom: "6px", lineHeight: "1.4" }}>{e.title}</div>
                           <div style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={14}/> Click để đăng ký tham gia</div>
                         </div>
                       </div>
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicModals;