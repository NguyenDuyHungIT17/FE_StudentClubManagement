import React from "react";
import { Edit, Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const MembersTable = ({ 
  members, clubs, 
  filterClub, onFilterChange, 
  keyword, onSearch, 
  page, totalPages, onPageChange,
  onAdd, onEdit, onDelete, onView 
}) => {
  const safeMembers = Array.isArray(members) ? members : [];
  
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* HEADER TÌM KIẾM & LỌC */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          <div style={{ position: "relative", width: "250px", maxWidth: "100%" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
            <input 
              type="text" 
              className="input-control"
              placeholder="Tìm tên thành viên..." 
              value={keyword}
              onChange={(e) => onSearch(e.target.value)}
              style={{ paddingLeft: 36, margin: 0, width: "100%" }} 
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-sub)" />
            <select 
              className="input-control" 
              value={filterClub} 
              onChange={(e) => onFilterChange(e.target.value)}
              style={{ margin: 0, minWidth: '200px' }}
            >
              <option value="all">Tất cả Câu lạc bộ</option>
              {clubs && clubs.map(c => (
                <option key={c.clubId} value={c.clubId}>{c.clubName}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAdd} style={{ whiteSpace: "nowrap" }}>
          <Plus size={16}/> Thêm Thành viên
        </button>
      </div>

      {/* BODY BẢNG */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên User</th>
              <th>Câu lạc bộ</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {safeMembers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-sub)" }}>
                  Không tìm thấy thành viên nào
                </td>
              </tr>
            ) : safeMembers.map(member => (
              <tr key={member.memberId || member.id}>
                <td>#{member.memberId || member.id}</td>
                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{member.userFullName || member.fullName}</td>
                <td>{member.clubName}</td>
                <td><span className="badge primary">{member.roleInClub || 'Thành viên'}</span></td>
                <td>
                  <span className={`badge ${member.isActive ? 'success' : 'error'}`}>
                    {member.isActive ? 'Đang hoạt động' : 'Đã rời'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-icon" title="Xem" onClick={() => onView(member)}><Eye size={16}/></button>
                    <button className="btn-icon" title="Sửa" style={{ color: 'var(--primary)' }} onClick={() => onEdit(member)}><Edit size={16}/></button>
                    <button className="btn-icon" title="Xóa" style={{ color: '#ef4444' }} onClick={() => onDelete(member.memberId || member.id)}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER PHÂN TRANG */}
      {totalPages > 1 && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", backgroundColor: "var(--bg-main)" }}>
          <button 
            className="btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}
            style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          ><ChevronLeft size={16} /> Trước</button>
          
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>Trang {page} / {totalPages}</span>
          
          <button 
            className="btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
            style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white", opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >Sau <ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
};

export default MembersTable;