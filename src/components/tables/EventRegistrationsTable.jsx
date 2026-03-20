// src/components/tables/EventRegistrationsTable.jsx
import React from "react";
import { Edit, Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const EventRegistrationsTable = ({ 
  registrations, events, users,
  selectedEventId, onEventChange, 
  keyword, onSearch, 
  page, totalPages, onPageChange,
  onAdd, onEdit, onDelete, onView 
}) => {
  const safeData = Array.isArray(registrations) ? registrations : [];

  // Logic hiển thị Tên: Ưu tiên User Hệ thống, nếu là Guest (userId = 0) thì lấy GuestName
  const getDisplayName = (reg) => {
    if (reg.userId && reg.userId > 0) {
      const u = users?.find(user => user.userId === reg.userId);
      return u ? `${u.fullName} (User)` : `User ID: ${reg.userId}`;
    }
    return `${reg.guestName} (Khách)`;
  };

  const getDisplayEmail = (reg) => {
    if (reg.userId && reg.userId > 0) {
      return users?.find(user => user.userId === reg.userId)?.email || "N/A";
    }
    return reg.guestEmail;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* HEADER: CHỌN SỰ KIỆN VÀ TÌM KIẾM */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", backgroundColor: "#f8fafc" }}>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          {/* Ô BẮT BUỘC: CHỌN SỰ KIỆN */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: '250px' }}>
            <BookOpen size={18} color="var(--primary)" />
            <select 
              className="input-control" 
              value={selectedEventId} 
              onChange={(e) => onEventChange(e.target.value)} 
              style={{ margin: 0, width: '100%', borderColor: 'var(--primary)', fontWeight: 600 }}
            >
              <option value="">-- HÃY CHỌN SỰ KIỆN ĐỂ XEM DANH SÁCH --</option>
              {Array.isArray(events) && events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div style={{ position: "relative", width: "250px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
            <input type="text" className="input-control" placeholder="Tìm tên/email khách..." value={keyword} onChange={(e) => onSearch(e.target.value)} style={{ paddingLeft: 36, margin: 0, width: "100%" }} disabled={!selectedEventId} />
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAdd} disabled={!selectedEventId} style={{ whiteSpace: "nowrap", opacity: !selectedEventId ? 0.5 : 1 }}>
          <Plus size={16}/> Thêm Người tham gia
        </button>
      </div>

      {/* BODY BẢNG */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Đăng ký</th>
              <th>Người tham gia</th>
              <th>Email</th>
              <th>Điểm danh</th>
              <th>Ngày đăng ký</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {!selectedEventId ? (
               <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--primary)", fontWeight: 600 }}>Vui lòng chọn Sự kiện ở phía trên để xem danh sách.</td></tr>
            ) : safeData.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-sub)" }}>Chưa có người đăng ký nào</td></tr>
            ) : safeData.map(item => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{getDisplayName(item)}</td>
                <td>{getDisplayEmail(item)}</td>
                <td>
                  <span className={`badge ${item.checkedIn ? 'success' : 'warning'}`}>
                    {item.checkedIn ? 'Đã đến' : 'Chưa đến'}
                  </span>
                </td>
                <td>{formatDate(item.registeredAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-icon" title="Xem" onClick={() => onView(item)}><Eye size={16}/></button>
                    <button className="btn-icon" title="Sửa" style={{ color: 'var(--primary)' }} onClick={() => onEdit(item)}><Edit size={16}/></button>
                    <button className="btn-icon" title="Xóa" style={{ color: '#ef4444' }} onClick={() => onDelete(item.id)}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && selectedEventId && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", backgroundColor: "var(--bg-main)" }}>
          <button className="btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}><ChevronLeft size={16} /> Trước</button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>Trang {page} / {totalPages}</span>
          <button className="btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}>Sau <ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationsTable;