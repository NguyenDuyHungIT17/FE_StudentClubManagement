import React from "react";
import { Edit, Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight, Filter, CheckCircle, PlayCircle, XCircle, UserX, Mail } from "lucide-react";

const InterviewsTable = ({ 
  interviews, clubs,
  filterClub, onFilterClubChange, filterStatus, onFilterStatusChange, filterResult, onFilterResultChange,
  keyword, onSearch, page, totalPages, onPageChange,
  onAddWalkIn, onEdit, onDelete, onView,
  onCheckIn, onOpenStart, onOpenFinish, onNoShow, onCancel, onSendEmail
}) => {
  const safeData = Array.isArray(interviews) ? interviews : [];

  const getClubName = (id) => clubs?.find(c => c.clubId === id)?.clubName || `ID: ${id}`;

  const getStatusBadge = (status) => {
    switch(status) {
      case 0: return <span className="badge" style={{background: '#f1f5f9', color: '#475569'}}>Đăng ký mới</span>;
      case 1: return <span className="badge warning">Đã Check-in</span>;
      case 2: return <span className="badge primary">Đang Phỏng vấn</span>;
      case 3: return <span className="badge success">Hoàn thành</span>;
      case 4: return <span className="badge error">Không đến</span>;
      case 5: return <span className="badge error">Đã Hủy</span>;
      default: return <span className="badge">N/A</span>;
    }
  };

  const getResultBadge = (result) => {
    if (result === 1) return <span className="badge success">Pass</span>;
    if (result === 2) return <span className="badge error">Fail</span>;
    return <span className="badge" style={{background: '#f1f5f9', color: '#475569'}}>Pending</span>;
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
            <div style={{ position: "relative", width: "200px" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
              <input type="text" className="input-control" placeholder="Tìm ứng viên..." value={keyword} onChange={(e) => onSearch(e.target.value)} style={{ paddingLeft: 36, margin: 0 }} />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Filter size={16} color="var(--text-sub)" />
              <select className="input-control" value={filterClub} onChange={(e) => onFilterClubChange(e.target.value)} style={{ margin: 0, width: 140 }}>
                <option value="all">Tất cả CLB</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
              <select className="input-control" value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)} style={{ margin: 0, width: 140 }}>
                <option value="all">Mọi trạng thái</option>
                <option value="0">Đăng ký mới</option>
                <option value="1">Đã Check-in</option>
                <option value="2">Đang Phỏng vấn</option>
                <option value="3">Hoàn thành</option>
              </select>
              <select className="input-control" value={filterResult} onChange={(e) => onFilterResultChange(e.target.value)} style={{ margin: 0, width: 120 }}>
                <option value="all">Mọi kết quả</option>
                <option value="0">Pending</option>
                <option value="1">Pass</option>
                <option value="2">Fail</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={() => onSendEmail()} style={{ border: '1px solid var(--primary)', color: 'var(--primary)', background: 'white' }}>
              <Mail size={16}/> Gửi Email Báo KQ
            </button>
            <button className="btn btn-primary" onClick={onAddWalkIn}><Plus size={16}/> Tạo Walk-in</button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ứng viên</th>
              <th>Câu lạc bộ</th>
              <th>Thời gian PV</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Kết quả</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {safeData.length === 0 ? <tr><td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "var(--text-sub)" }}>Chưa có lịch phỏng vấn nào</td></tr> : safeData.map(item => (
              <tr key={item.interviewId}>
                <td>#{item.interviewId}</td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.applicantName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>{item.applicantEmail || item.applicantPhone}</div>
                </td>
                <td>{getClubName(item.clubId)}</td>
                <td>{item.interviewDate ? new Date(item.interviewDate).toLocaleString('vi-VN') : 'Chưa xếp'}</td>
                <td>{item.applicationType === 0 ? 'Online' : 'Walk-in'}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td>{getResultBadge(item.result)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                    {item.status === 0 && <button className="btn-icon" title="Xác nhận Check-in" onClick={() => onCheckIn(item.interviewId)}><CheckCircle size={18} color="#10b981"/></button>}
                    {item.status === 1 && <button className="btn-icon" title="Bắt đầu PV" onClick={() => onOpenStart(item)}><PlayCircle size={18} color="#3b82f6"/></button>}
                    {item.status === 2 && <button className="btn-icon" title="Hoàn thành & Đánh giá" onClick={() => onOpenFinish(item)}><CheckCircle size={18} color="#8b5cf6"/></button>}
                    {(item.status === 0 || item.status === 1) && <button className="btn-icon" title="Ứng viên không đến" onClick={() => onNoShow(item.interviewId)}><UserX size={18} color="#f59e0b"/></button>}
                    {item.status !== 3 && item.status !== 5 && <button className="btn-icon" title="Hủy lịch" onClick={() => onCancel(item.interviewId)}><XCircle size={18} color="#ef4444"/></button>}
                    
                    <button className="btn-icon" title="Chi tiết" onClick={() => onView(item)}><Eye size={16}/></button>
                    {item.status !== 3 && item.status !== 4 && item.status !== 5 && <button className="btn-icon" title="Sửa" onClick={() => onEdit(item)} style={{ color: 'var(--primary)' }}><Edit size={16}/></button>}
                    {item.status !== 3 && <button className="btn-icon" title="Xóa" onClick={() => onDelete(item.interviewId)} style={{ color: '#ef4444' }}><Trash2 size={16}/></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", backgroundColor: "var(--bg-main)" }}>
          <button className="btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? "not-allowed" : "pointer" }}><ChevronLeft size={16} /> Trước</button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>Trang {page} / {totalPages}</span>
          <button className="btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer" }}>Sau <ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
};
export default InterviewsTable;