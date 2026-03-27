import React, { useState } from "react";
import { Plus, Search, Filter, CheckCircle, PlayCircle, XCircle, UserX, Mail, FileText, Eye, Kanban, List, Edit } from "lucide-react";

const InterviewBoard = ({ 
  interviews, clubs, campaigns, // 👉 NHẬN THÊM CAMPAIGNS
  filterClub, onFilterClubChange, filterCampaign, onFilterCampaignChange, // 👉 NHẬN THÊM FILTER CAMPAIGN
  filterStatus, onFilterStatusChange, filterResult, onFilterResultChange, keyword, onSearch,
  onAddWalkIn, onCheckIn, onOpenStart, onOpenFinish, onOpenUpdateResult, onNoShow, onCancel, onSendEmail, onView
}) => {
  const [viewMode, setViewMode] = useState("kanban"); 
  const safeData = Array.isArray(interviews) ? interviews : [];

  const activeInterviews = safeData.filter(i => i.status < 3);
  const historyInterviews = safeData.filter(i => i.status >= 3);

  const columns = [
    { id: 0, title: "📥 Đăng ký mới", color: "#64748b", bg: "#f8fafc", borderColor: "#e2e8f0" },
    { id: 1, title: "⏳ Đã Check-in (Chờ PV)", color: "#d97706", bg: "#fffbeb", borderColor: "#fde68a" },
    { id: 2, title: "🎙️ Đang Phỏng vấn & Chờ Kết quả", color: "#2563eb", bg: "#eff6ff", borderColor: "#bfdbfe" }
  ];

  const getClubName = (id) => clubs?.find(c => c.clubId === id)?.clubName || `CLB ${id}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 20 }}>
      
      {/* HEADER ĐIỀU KHIỂN & BỘ LỌC ĐẦY ĐỦ */}
      <div className="card" style={{ padding: '16px 20px', display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          
          <div style={{ display: 'flex', background: '#f1f5f9', padding: 4, borderRadius: 8 }}>
            <button onClick={() => setViewMode("kanban")} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', background: viewMode === "kanban" ? 'white' : 'transparent', borderRadius: 6, fontWeight: 600, color: viewMode === "kanban" ? 'var(--primary)' : 'var(--text-sub)', boxShadow: viewMode === "kanban" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              <Kanban size={16}/> Tiến trình
            </button>
            <button onClick={() => setViewMode("history")} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', background: viewMode === "history" ? 'white' : 'transparent', borderRadius: 6, fontWeight: 600, color: viewMode === "history" ? 'var(--primary)' : 'var(--text-sub)', boxShadow: viewMode === "history" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              <List size={16}/> Lịch sử & Kết quả
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn" onClick={onSendEmail} style={{ border: '1px solid var(--primary)', color: 'var(--primary)', background: 'white' }}><Mail size={16}/> Gửi Email Báo KQ</button>
            <button className="btn btn-primary" onClick={onAddWalkIn}><Plus size={16}/> Tạo Walk-in</button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BỘ LỌC THÔNG MINH (CASCADING DROPDOWN)                    */}
        {/* ========================================================= */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          
          <div style={{ position: "relative", width: "200px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
            <input type="text" className="input-control" placeholder="Tìm ứng viên..." value={keyword} onChange={(e) => onSearch(e.target.value)} style={{ paddingLeft: 36, margin: 0 }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-sub)" />
            
            {/* 1. CHỌN CÂU LẠC BỘ TRƯỚC */}
            <select 
              className="input-control" 
              value={filterClub} 
              onChange={(e) => {
                onFilterClubChange(e.target.value);
                // RẤT QUAN TRỌNG: Khi đổi CLB, tự động Reset Đợt tuyển về "all"
                if (onFilterCampaignChange) onFilterCampaignChange("all");
              }} 
              style={{ margin: 0, minWidth: '150px' }}
            >
              <option value="all">-- Chọn Câu lạc bộ --</option>
              {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
            </select>

            {/* 2. RỒI MỚI CHỌN ĐỢT TUYỂN (Bị khóa nếu chưa chọn CLB) */}
            <select 
              className="input-control" 
              value={filterCampaign} 
              onChange={(e) => onFilterCampaignChange(e.target.value)} 
              disabled={!filterClub || filterClub === "all"} // 👉 Khóa ô này nếu filterClub = "all"
              style={{ 
                margin: 0, minWidth: '180px', 
                backgroundColor: (!filterClub || filterClub === "all") ? '#f1f5f9' : 'white', // Đổi màu xám nếu bị khóa
                cursor: (!filterClub || filterClub === "all") ? 'not-allowed' : 'pointer'
              }}
            >
              {/* Hiển thị Text hướng dẫn tùy theo trạng thái */}
              {(!filterClub || filterClub === "all") ? (
                <option value="all">Vui lòng chọn CLB trước</option>
              ) : (
                <>
                  <option value="all">Tất cả Đợt tuyển</option>
                  {campaigns && campaigns
                    .filter(c => c.clubId.toString() === filterClub.toString()) // Lọc đợt tuyển theo CLB
                    .map(c => (
                      <option key={c.campaignId} value={c.campaignId}>
                        {c.title} {c.isActive ? "(Đang mở)" : "(Đã đóng)"}
                      </option>
                  ))}
                </>
              )}
            </select>

            {/* 3. LỌC STATUS */}
            <select className="input-control" value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)} style={{ margin: 0, width: 140 }}>
              <option value="all">Mọi trạng thái PV</option>
              <option value="0">Đăng ký mới</option>
              <option value="1">Đã Check-in</option>
              <option value="2">Đang Phỏng vấn</option>
              <option value="3">Hoàn thành</option>
              <option value="4">Không đến</option>
              <option value="5">Đã hủy</option>
            </select>

            {/* 4. LỌC RESULT */}
            <select className="input-control" value={filterResult} onChange={(e) => onFilterResultChange(e.target.value)} style={{ margin: 0, width: 120 }}>
              <option value="all">Mọi Kết quả</option>
              <option value="0">Pending</option>
              <option value="1">Pass (Đậu)</option>
              <option value="2">Fail (Rớt)</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === "kanban" && (
        <div style={{ display: 'flex', gap: 24, paddingBottom: 10, flex: 1, alignItems: 'stretch', width: '100%' }}>
          {columns.map(col => {
            const columnItems = activeInterviews.filter(item => item.status === col.id);
            return (
              <div key={col.id} style={{ flex: '1 1 0%', minWidth: '300px', background: col.bg, borderRadius: 12, border: `1px solid ${col.borderColor}`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px', borderBottom: `1px solid ${col.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: col.color, margin: 0 }}>{col.title}</h3>
                  <span style={{ background: 'white', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', border: `1px solid ${col.borderColor}` }}>{columnItems.length}</span>
                </div>

                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', flex: 1 }}>
                  {columnItems.length === 0 ? <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-sub)', fontSize: 13 }}>Trống</div> : (
                    columnItems.map(item => (
                      <div key={item.interviewId} style={{ background: 'white', padding: 16, borderRadius: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)' }}>{item.applicationType === 0 ? '💻 Online' : '🚶 Walk-in'}</span>
                          <button className="btn-icon" onClick={() => onView(item)} style={{ padding: 0 }}><Eye size={16} color="var(--primary)"/></button>
                        </div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: 16, color: 'var(--text-main)' }}>{item.applicantName}</h4>
                        <div style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 8 }}>{item.applicantEmail || item.applicantPhone}</div>
                        <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 16 }}>{getClubName(item.clubId)}</div>

                        <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                          {col.id === 0 && (
                            <>
                              <button className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: 13 }} onClick={() => onCheckIn(item.interviewId)}><CheckCircle size={16}/> Check-in</button>
                              <button className="btn-icon" title="Không đến" onClick={() => onNoShow(item.interviewId)}><UserX size={18} color="#f59e0b"/></button>
                              <button className="btn-icon" title="Hủy" onClick={() => onCancel(item.interviewId)}><XCircle size={18} color="#ef4444"/></button>
                            </>
                          )}
                          {col.id === 1 && (
                            <>
                              <button className="btn" style={{ flex: 1, padding: '8px', fontSize: 13, background: '#3b82f6', color: 'white' }} onClick={() => onOpenStart(item)}><PlayCircle size={16}/> Gọi PV</button>
                              <button className="btn-icon" title="Không đến" onClick={() => onNoShow(item.interviewId)}><UserX size={18} color="#f59e0b"/></button>
                            </>
                          )}
                          {col.id === 2 && (
                            <button className="btn" style={{ flex: 1, padding: '10px', fontSize: 14, fontWeight: 600, background: '#8b5cf6', color: 'white', display: 'flex', justifyContent: 'center' }} onClick={() => onOpenFinish(item)}>
                              <FileText size={16}/> Mở Workspace Đánh giá
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LỊCH SỬ KẾT QUẢ */}
      {viewMode === "history" && (
        <div className="card table-container" style={{ padding: 0, flex: 1 }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ứng viên</th>
                <th>Câu lạc bộ</th>
                <th>Ngày cập nhật</th>
                <th>Trạng thái</th>
                <th>Kết quả</th>
                <th>Đánh giá của BGK</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {historyInterviews.length === 0 ? <tr><td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>Chưa có lịch sử kết quả nào</td></tr> : 
                historyInterviews.map(item => (
                <tr key={item.interviewId}>
                  <td>#{item.interviewId}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.applicantName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>{item.applicantEmail}</div>
                  </td>
                  <td>{getClubName(item.clubId)}</td>
                  <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>
                    {item.status === 3 && <span className="badge success">Hoàn thành PV</span>}
                    {item.status === 4 && <span className="badge warning">Không đến</span>}
                    {item.status === 5 && <span className="badge error">Đã Hủy</span>}
                  </td>
                  <td>
                    {item.result === 1 && <span style={{ color: '#10b981', fontWeight: 700, padding: '4px 10px', background: '#d1fae5', borderRadius: 6 }}>PASS</span>}
                    {item.result === 2 && <span style={{ color: '#ef4444', fontWeight: 700, padding: '4px 10px', background: '#fee2e2', borderRadius: 6 }}>FAIL</span>}
                    {item.result === 0 && <span style={{ color: '#f59e0b', fontWeight: 700, padding: '4px 10px', background: '#fef3c7', borderRadius: 6 }}>PENDING</span>}
                  </td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-sub)', fontSize: 13 }}>
                    {item.evaluation || "Không có nhận xét"}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {item.status === 3 && (
                      <button className="btn-icon" title="Cập nhật kết quả" onClick={() => onOpenUpdateResult(item)} style={{ color: 'var(--primary)' }}>
                        <Edit size={16}/>
                      </button>
                    )}
                    <button className="btn-icon" onClick={() => onView(item)}><Eye size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InterviewBoard;