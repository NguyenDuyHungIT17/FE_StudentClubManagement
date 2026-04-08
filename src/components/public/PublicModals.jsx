import React from "react";
import { X, Calendar, Megaphone, Info, Building2, MapPin } from "lucide-react";
import { UNI_BLUE, UNI_RED } from "./PublicHeader";

const PublicModals = ({
  // Club
  showClubModal, setShowClubModal, selectedClub, clubEvents, loadingClubEvents,
  clubCampaigns, onApplyFromClub,
  onOpenEventReg
}) => {
  return (
    <>
      {/* MODAL CHI TIẾT CÂU LẠC BỘ */}
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