import React from "react";
import { Edit, Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

const ClubsTable = ({ 
  clubs, 
  keyword, 
  onSearch, 
  page, 
  totalPages, 
  onPageChange, 
  onAdd, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* --- HEADER: TIÊU ĐỀ + TÌM KIẾM + NÚT THÊM --- */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>Danh sách Câu lạc bộ</h3>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Ô Tìm Kiếm */}
          <div style={{ position: "relative", width: "260px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
            <input 
              type="text" 
              className="input-control"
              placeholder="Tìm kiếm câu lạc bộ..." 
              value={keyword}
              onChange={(e) => onSearch(e.target.value)}
              style={{ paddingLeft: 36, margin: 0 }} 
            />
          </div>

          <button className="btn btn-primary" onClick={onAdd} style={{ whiteSpace: "nowrap" }}>
            <Plus size={16}/> Thêm CLB
          </button>
        </div>
      </div>

      {/* --- BODY: BẢNG DỮ LIỆU --- */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên CLB</th>
              <th>Tiêu đề</th>
              <th>Mô tả</th>
              <th>Trưởng CLB</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {clubs.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-sub)' }}>Không tìm thấy câu lạc bộ nào phù hợp</td></tr>
            ) : clubs.map(club => (
              <tr key={club.clubId}>
                <td>#{club.clubId}</td>
                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{club.clubName}</td>
                <td>{club.title || "-"}</td>
                
                {/* Dùng thuộc tính title của HTML để khi hover chuột vào sẽ hiện Full Text */}
                <td title={club.description}>
                  {club.description?.length > 40 ? `${club.description.substring(0, 40)}...` : club.description || "-"}
                </td>
                
                <td>{club.leaderName || <span style={{ color: 'var(--text-sub)', fontStyle: 'italic' }}>Chưa có</span>}</td>
                <td>{club.createdAt ? new Date(club.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                
                <td>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-icon" title="Xem chi tiết" onClick={() => onView(club)}><Eye size={16}/></button>
                    <button className="btn-icon" title="Sửa" style={{ color: 'var(--primary)' }} onClick={() => onEdit(club)}><Edit size={16}/></button>
                    <button className="btn-icon" title="Xóa" style={{ color: '#ef4444' }} onClick={() => onDelete(club.clubId)}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: PHÂN TRANG --- */}
      {totalPages > 1 && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", backgroundColor: "var(--bg-main)" }}>
          <button 
            className="btn"
            disabled={page <= 1} 
            onClick={() => onPageChange(page - 1)}
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
            onClick={() => onPageChange(page + 1)}
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

export default ClubsTable;