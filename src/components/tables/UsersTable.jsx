import React from "react";
import { Edit, Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight, Filter, User as UserIcon } from "lucide-react";

const UsersTable = ({ 
  users,
  filterRole = "all",
  onFilterChange,
  filterIsActive = "1",
  onFilterActiveChange,
  keyword = "",
  onSearch,
  page = 1,
  totalPages = 1,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  onView 
}) => {
  // CHỐNG SẬP BẢNG: Đảm bảo dữ liệu luôn là mảng
  const safeUsers = Array.isArray(users) ? users : [];
  
  // KHÔNG CẦN LỌC BẰNG TAY Ở ĐÂY NỮA, VÌ BACKEND ĐÃ LỌC CHO RỒI!

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* HEADER: TÌM KIẾM + LỌC + NÚT THÊM */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          {/* Ô Tìm Kiếm */}
          <div style={{ position: "relative", width: "250px", maxWidth: "100%" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
            <input 
              type="text" 
              className="input-control"
              placeholder="Tìm kiếm tài khoản..." 
              value={keyword}
              onChange={(e) => onSearch?.(e.target.value)}
              style={{ paddingLeft: 36, margin: 0, width: "100%" }} 
            />
          </div>

          {/* Ô Lọc Vai Trò */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-sub)" />
            <select 
              className="input-control" 
              value={filterRole} 
              onChange={(e) => onFilterChange?.(e.target.value)}
              style={{ margin: 0, minWidth: '150px' }}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="leader">Leader</option>
              <option value="member">Member</option>
            </select>
          </div>

          {/* Ô Lọc Trạng Thái */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color="var(--text-sub)" />
            <select
              className="input-control"
              value={filterIsActive}
              onChange={(e) => onFilterActiveChange?.(e.target.value)}
              style={{ margin: 0, minWidth: '150px' }}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => onAdd?.()} style={{ whiteSpace: "nowrap" }}>
          <Plus size={16}/> Thêm mới
        </button>
      </div>

      {/* BODY: BẢNG DỮ LIỆU */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              {/* 👉 Thêm tiêu đề cột Avatar */}
              <th style={{ width: "60px", textAlign: "center" }}><UserIcon size={16} color="var(--text-sub)" /></th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {safeUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "var(--text-sub)" }}>
                  Không tìm thấy tài khoản nào phù hợp
                </td>
              </tr>
            ) : safeUsers.map(user => (
              <tr key={user.userId}>
                <td>#{user.userId}</td>
                
                {/* 👉 CỘT AVATAR NGƯỜI DÙNG */}
                <td style={{ textAlign: "center" }}>
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.fullName} 
                      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)", display: "block", margin: "0 auto" }} 
                    />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px", fontWeight: "bold", margin: "0 auto" }}>
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </td>

                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'error' : user.role === 'leader' ? 'warning' : 'primary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.isActive ? 'success' : 'error'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: 'flex', gap: 10, justifyContent: "flex-end" }}>
                    <button className="btn-icon" title="Xem chi tiết & Quản lý ảnh" onClick={() => onView?.(user)}><Eye size={16}/></button>
                    <button className="btn-icon" title="Sửa" style={{ color: 'var(--primary)' }} onClick={() => onEdit?.(user)}><Edit size={16}/></button>
                    {user.role !== 'admin' && (
                      <button className="btn-icon" title="Xóa" style={{ color: '#ef4444' }} onClick={() => onDelete?.(user.userId)}><Trash2 size={16}/></button>
                    )}
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
          <button 
            className="btn"
            disabled={page <= 1} 
            onClick={() => onPageChange?.(page - 1)}
            style={{ 
              padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white",
              opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px"
            }}
          >
            <ChevronLeft size={16} /> Trước
          </button>
          
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>
            Trang {page} / {totalPages}
          </span>
          
          <button 
            className="btn"
            disabled={page >= totalPages} 
            onClick={() => onPageChange?.(page + 1)}
            style={{ 
              padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px", backgroundColor: "white",
              opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px"
            }}
          >
            Sau <ChevronRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
};

export default UsersTable;