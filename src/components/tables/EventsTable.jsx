// src/components/tables/EventsTable.jsx
import React from "react";
import { Edit, Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const EventsTable = ({ 
  events, clubs,
  filterClub, onFilterClubChange, 
  filterIsPrivate, onFilterIsPrivateChange,
  keyword, onSearch, 
  page, totalPages, onPageChange,
  onAdd, onEdit, onDelete, onView 
}) => {
  const safeEvents = Array.isArray(events) ? events : [];

  const getClubName = (id) => clubs?.find(c => c.clubId === id)?.clubName || `ID: ${id}`;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa cập nhật";
    return new Date(dateStr).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 1: return <span className="badge" style={{ backgroundColor: '#f3f4f6', color: '#4b5563' }}>Thấp</span>;
      case 2: return <span className="badge primary">Trung bình</span>;
      case 3: return <span className="badge warning">Cao</span>;
      case 4: return <span className="badge error">Khẩn cấp</span>;
      default: return <span className="badge">Chưa rõ</span>;
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* HEADER: TÌM KIẾM + LỌC KÉP */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          <div style={{ position: "relative", width: "250px", maxWidth: "100%" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
            <input type="text" className="input-control" placeholder="Tìm tên sự kiện..." value={keyword} onChange={(e) => onSearch(e.target.value)} style={{ paddingLeft: 36, margin: 0, width: "100%" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-sub)" />
            <select className="input-control" value={filterClub} onChange={(e) => onFilterClubChange(e.target.value)} style={{ margin: 0, minWidth: '180px' }}>
              <option value="all">Tất cả Câu lạc bộ</option>
              {Array.isArray(clubs) && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
            </select>
            
            <select className="input-control" value={filterIsPrivate} onChange={(e) => onFilterIsPrivateChange(e.target.value)} style={{ margin: 0, minWidth: '150px' }}>
              <option value="all">Mọi phạm vi</option>
              <option value="false">Công khai</option>
              <option value="true">Nội bộ CLB</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAdd} style={{ whiteSpace: "nowrap" }}>
          <Plus size={16}/> Thêm Sự kiện
        </button>
      </div>

      {/* BODY: BẢNG DỮ LIỆU */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sự kiện</th>
              <th>Câu lạc bộ</th>
              <th>Thời gian</th>
              <th>Phạm vi</th>
              <th>Mức ưu tiên</th> {/* 👉 Thêm cột này */}
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {safeEvents.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "var(--text-sub)" }}>Không tìm thấy sự kiện nào</td></tr>
            ) : safeEvents.map(item => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{item.title}</td>
                <td>{getClubName(item.clubId)}</td>
                <td>{formatDate(item.eventDate)}</td>
                <td>
                  <span className={`badge ${item.isPrivate ? 'warning' : 'success'}`}>
                    {item.isPrivate ? 'Nội bộ' : 'Công khai'}
                  </span>
                </td>
                <td>{getPriorityBadge(item.priority)}</td> {/* 👉 Gọi hàm lấy huy hiệu ở đây */}
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

      {/* FOOTER: PHÂN TRANG */}
      {totalPages > 1 && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", backgroundColor: "var(--bg-main)" }}>
          <button className="btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}><ChevronLeft size={16} /> Trước</button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>Trang {page} / {totalPages}</span>
          <button className="btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}>Sau <ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
};

export default EventsTable;