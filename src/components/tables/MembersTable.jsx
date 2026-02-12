import React from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

const MembersTable = ({ members, clubs, selectedClubId, onSelectClub, onAdd, onEdit, onDelete, onView }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Chọn CLB:</span>
          <select 
            className="input-control" 
            style={{ width: 200 }} 
            value={selectedClubId} 
            onChange={(e) => onSelectClub(e.target.value)}
          >
            <option value="">-- Chọn CLB --</option>
            {clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={onAdd}><Plus size={16}/> Thêm Thành viên</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thành viên</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>Không có thành viên hoặc chưa chọn CLB</td></tr>
            ) : members.map(member => (
              <tr key={member.clubMemberId}>
                <td>#{member.clubMemberId}</td>
                <td style={{ fontWeight: 600 }}>{member.userName}</td>
                <td>
                  <span className={`badge ${member.memberRole === 'leader' ? 'success' : 'warning'}`}>
                    {member.memberRole === 'leader' ? '👑 Leader' : '👤 Member'}
                  </span>
                </td>
                <td>{member.joinAt ? new Date(member.joinAt).toLocaleDateString('vi-VN') : '-'}</td>
                <td style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-icon" onClick={() => onView(member)}><Eye size={16}/></button>
                  <button className="btn-icon" style={{color: 'var(--primary)'}} onClick={() => onEdit(member)}><Edit size={16}/></button>
                  <button className="btn-icon" style={{color: '#ef4444'}} onClick={() => onDelete(member.clubMemberId)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;