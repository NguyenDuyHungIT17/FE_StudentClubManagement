import React from "react";
import { Edit, Trash2, Eye, Plus, Mail } from "lucide-react";

const InterviewsTable = ({ 
  interviews, clubs, selectedClubId, onSelectClub, 
  filterResult, onFilterResult, 
  onAdd, onEdit, onDelete, onView, onSendEmail 
}) => {
  
  const filtered = filterResult === "all" ? interviews : interviews.filter(i => i.result === filterResult);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <select 
            className="input-control" 
            style={{ width: 180 }} 
            value={selectedClubId} 
            onChange={(e) => onSelectClub(e.target.value)}
          >
            <option value="">-- Chọn CLB --</option>
            {clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
          </select>

          <select 
            className="input-control" 
            style={{ width: 150 }} 
            value={filterResult} 
            onChange={(e) => onFilterResult(e.target.value)}
          >
            <option value="all">Tất cả kết quả</option>
            <option value="Pending">⏳ Pending</option>
            <option value="Pass">✅ Pass</option>
            <option value="Fail">❌ Fail</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={onAdd}><Plus size={16}/> Thêm</button>
          <button className="btn" style={{background: '#10b981', color: 'white'}} onClick={onSendEmail}>
            <Mail size={16}/> Gửi Email
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ứng viên</th>
              <th>Email</th>
              <th>Kết quả</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Không có dữ liệu</td></tr>
            ) : filtered.map(iv => (
              <tr key={iv.interviewId}>
                <td>#{iv.interviewId}</td>
                <td style={{ fontWeight: 600 }}>{iv.applicantName}</td>
                <td>{iv.applicantEmail}</td>
                <td>
                  <span className={`badge ${
                    iv.result === 'Pass' ? 'success' : 
                    iv.result === 'Fail' ? 'error' : 'warning'
                  }`}>
                    {iv.result}
                  </span>
                </td>
                <td>{iv.createdAt ? new Date(iv.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                <td style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-icon" onClick={() => onView(iv)}><Eye size={16}/></button>
                  <button className="btn-icon" style={{color: 'var(--primary)'}} onClick={() => onEdit(iv)}><Edit size={16}/></button>
                  <button className="btn-icon" style={{color: '#ef4444'}} onClick={() => onDelete(iv.interviewId)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewsTable;