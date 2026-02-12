import React from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

const ClubsTable = ({ clubs, onAdd, onEdit, onDelete, onView }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>Danh sách Câu lạc bộ</h3>
        <button className="btn btn-primary" onClick={onAdd}><Plus size={16}/> Thêm CLB</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên CLB</th>
              <th>Mô tả</th>
              <th>Trưởng CLB</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {clubs.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Chưa có dữ liệu</td></tr>
            ) : clubs.map(club => (
              <tr key={club.clubId}>
                <td>#{club.clubId}</td>
                <td style={{ fontWeight: 600 }}>{club.clubName}</td>
                <td>{club.description?.substring(0, 40)}...</td>
                <td>{club.leaderName || <span style={{color: 'var(--text-sub)', fontStyle: 'italic'}}>Chưa có</span>}</td>
                <td>{club.createdAt ? new Date(club.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                <td style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-icon" onClick={() => onView(club)}><Eye size={16}/></button>
                  <button className="btn-icon" style={{color: 'var(--primary)'}} onClick={() => onEdit(club)}><Edit size={16}/></button>
                  <button className="btn-icon" style={{color: '#ef4444'}} onClick={() => onDelete(club.clubId)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubsTable;