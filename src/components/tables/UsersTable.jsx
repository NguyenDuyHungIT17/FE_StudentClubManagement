import React from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

const UsersTable = ({ users, filterRole, onFilterChange, onAdd, onEdit, onDelete, onView }) => {
  const filtered = filterRole === "all" ? users : users.filter(u => u.role === filterRole);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Table Toolbar */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
        <select 
          className="input-control" 
          style={{ width: 200 }} 
          value={filterRole} 
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="leader">Leader</option>
          <option value="member">Member</option>
        </select>
        <button className="btn btn-primary" onClick={onAdd}><Plus size={16}/> Thêm mới</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.userId}>
                <td>#{user.userId}</td>
                <td style={{ fontWeight: 600 }}>{user.fullName}</td>
                <td>{user.email}</td>
                <td><span className="badge warning">{user.role}</span></td>
                <td>
                  <span className={`badge ${user.isActive ? 'success' : 'error'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-icon" onClick={() => onView(user)}><Eye size={16}/></button>
                  <button className="btn-icon" style={{color: 'var(--primary)'}} onClick={() => onEdit(user)}><Edit size={16}/></button>
                  <button className="btn-icon" style={{color: '#ef4444'}} onClick={() => onDelete(user.userId)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;