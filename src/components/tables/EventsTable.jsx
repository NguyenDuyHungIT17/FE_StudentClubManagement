import React from "react";
import { Edit, Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

const EventsTable = ({
  events,
  keyword,
  onSearch,
  page,
  totalPages,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  onView,
  clubs
}) => {
  const getClubName = (id) => clubs?.find(c => c.clubId === id)?.clubName || id;

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 1: return <span className="badge" style={{ background: '#f3f4f6', color: '#4b5563' }}>Low</span>;
      case 2: return <span className="badge" style={{ background: '#dbeafe', color: '#2563eb' }}>Medium</span>;
      case 3: return <span className="badge" style={{ background: '#fef3c7', color: '#d97706' }}>High</span>;
      case 4: return <span className="badge error">Urgent</span>;
      default: return priority;
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* HEADER */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>Danh sách Sự kiện</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ position: "relative", width: "260px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
            <input type="text" className="input-control" placeholder="Tìm kiếm sự kiện..." value={keyword} onChange={(e) => onSearch(e.target.value)} style={{ paddingLeft: 36, margin: 0 }} />
          </div>
          <button className="btn btn-primary" onClick={onAdd} style={{ whiteSpace: "nowrap" }}>
            <Plus size={16}/> Thêm Sự kiện
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th style={{ width: "60px", textAlign: "center" }}><ImageIcon size={16} color="var(--text-sub)" /></th>
              <th>Sự kiện</th>
              <th>Câu lạc bộ</th>
              <th>Thời gian</th>
              <th>Loại</th>
              <th>Ưu tiên</th>
              <th style={{ textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>Không tìm thấy sự kiện nào</td></tr>
            ) : events.map(event => (
              <tr key={event.id}>
                <td>#{event.id}</td>
                
                {/* 👉 CỘT HÌNH ẢNH SỰ KIỆN */}
                <td style={{ textAlign: "center" }}>
                  {event.photoUrl ? (
                    <img 
                      src={event.photoUrl} 
                      alt={event.title} 
                      style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--border)", display: "block", margin: "0 auto" }} 
                    />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontSize: "16px", fontWeight: "bold", margin: "0 auto" }}>
                      E
                    </div>
                  )}
                </td>

                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{event.title}</td>
                <td style={{ color: "var(--primary)", fontWeight: 600 }}>{getClubName(event.clubId)}</td>
                <td>{event.eventDate ? new Date(event.eventDate).toLocaleString('vi-VN') : "-"}</td>
                <td><span className={`badge ${event.isPrivate ? 'warning' : 'success'}`}>{event.isPrivate ? 'Nội bộ' : 'Public'}</span></td>
                <td>{getPriorityLabel(event.priority)}</td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn-icon" title="Xem chi tiết & Quản lý ảnh" onClick={() => onView(event)}><Eye size={16}/></button>
                    <button className="btn-icon" title="Sửa" style={{ color: 'var(--primary)' }} onClick={() => onEdit(event)}><Edit size={16}/></button>
                    <button className="btn-icon" title="Xóa" style={{ color: '#ef4444' }} onClick={() => onDelete(event.id)}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      {totalPages > 1 && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", backgroundColor: "var(--bg-main)" }}>
          <button className="btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
            <ChevronLeft size={16} /> Trước
          </button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>Trang {page} / {totalPages}</span>
          <button className="btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
            Sau <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsTable;