import React from "react";
import { Edit, Trash2, Eye, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const MembersTable = ({ 
  members, clubs, users,
  filterClub, onFilterClubChange, 
  filterRole, onFilterRoleChange,
  page, totalPages, onPageChange,
  onAdd, onEdit, onDelete, onView 
}) => {
  const safeMembers = Array.isArray(members) ? members : [];

  // Hàm dịch ID sang Tên
  const getClubName = (id) => clubs?.find(c => c.clubId === id)?.clubName || `ID: ${id}`;
  const getUserName = (id) => {
    const u = users?.find(user => user.userId === id);
    return u ? `${u.fullName} (${u.email})` : `ID: ${id}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa cập nhật";
    return new Date(dateStr).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* HEADER: LỌC KÉP + NÚT THÊM */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          {/* Lọc CLB */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-sub)" />
            <select className="input-control" value={filterClub} onChange={(e) => onFilterClubChange(e.target.value)} style={{ margin: 0, minWidth: '180px' }}>
              <option value="all">Tất cả Câu lạc bộ</option>
              {Array.isArray(clubs) && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
            </select>
          </div>
          
          {/* Lọc Vai trò */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-sub)" />
            <select className="input-control" value={filterRole} onChange={(e) => onFilterRoleChange(e.target.value)} style={{ margin: 0, minWidth: '150px' }}>
              <option value="all">Tất cả vai trò</option>
              <option value="leader">Trưởng CLB (Leader)</option>
              <option value="member">Thành viên (Member)</option>
            </select>
          </div>
        </div>

        {/* <button className="btn btn-primary" onClick={onAdd} style={{ whiteSpace: "nowrap" }}>
          <Plus size={16}/> Thêm Thành viên
        </button> */}
      </div>

      {/* BODY BẢNG */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã thẻ</th>
              <th>Thành viên</th>
              <th>Câu lạc bộ</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {safeMembers.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-sub)" }}>Không tìm thấy thành viên nào</td></tr>
            ) : safeMembers.map(item => (
              <tr key={item.clubMemberId}>
                <td>#{item.clubMemberId}</td>
                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{getUserName(item.userId)}</td>
                <td>{getClubName(item.clubId)}</td>
                <td>
                  <span className={`badge ${item.memberRole === 'leader' ? 'warning' : 'primary'}`}>
                    {item.memberRole}
                  </span>
                </td>
                <td>{formatDate(item.joinAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-icon" title="Xem" onClick={() => onView(item)}><Eye size={16}/></button>
                    <button className="btn-icon" title="Sửa" style={{ color: 'var(--primary)' }} onClick={() => onEdit(item)}><Edit size={16}/></button>
                    <button className="btn-icon" title="Xóa" style={{ color: '#ef4444' }} onClick={() => onDelete(item.clubMemberId)}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG */}
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

export default MembersTable;