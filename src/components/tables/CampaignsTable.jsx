import React from "react";
import { Edit, Trash2, Eye, Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const CampaignsTable = ({ 
  campaigns, clubs, filterClub, onFilterClubChange, filterIsActive, onFilterIsActiveChange,
  keyword, onSearch, page, totalPages, onPageChange, onAdd, onEdit, onDelete, onView
}) => {
  const getClubName = (id) => clubs?.find(c => c.clubId === id)?.clubName || `ID: ${id}`;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", gap: "16px", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: "220px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-sub)" }} />
            <input type="text" className="input-control" placeholder="Tìm chiến dịch..." value={keyword} onChange={(e) => onSearch(e.target.value)} style={{ paddingLeft: 36, margin: 0 }} />
          </div>
          <select className="input-control" value={filterClub} onChange={(e) => onFilterClubChange(e.target.value)} style={{ margin: 0, width: 160 }}>
            <option value="all">Tất cả Câu lạc bộ</option>
            {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
          </select>
          <select className="input-control" value={filterIsActive} onChange={(e) => onFilterIsActiveChange(e.target.value)} style={{ margin: 0, width: 140 }}>
            <option value="all">Mọi trạng thái</option>
            <option value="true">Đang Active</option>
            <option value="false">Đã đóng</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={onAdd}><Plus size={16}/> Thêm Chiến dịch</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Đợt tuyển</th>
              <th>Câu lạc bộ</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(item => (
              <tr key={item.campaignId}>
                <td>#{item.campaignId}</td>
                <td style={{ fontWeight: 600 }}>{item.title}</td>
                <td>{getClubName(item.clubId)}</td>
                <td style={{ fontSize: 13 }}>
                  {item.startDate ? new Date(item.startDate).toLocaleDateString('vi-VN') : '...'} - {item.endDate ? new Date(item.endDate).toLocaleDateString('vi-VN') : '...'}
                </td>
                <td><span className={`badge ${item.isActive ? 'success' : 'error'}`}>{item.isActive ? 'Active' : 'Closed'}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon" onClick={() => onView(item)}><Eye size={16}/></button>
                  <button className="btn-icon" onClick={() => onEdit(item)} style={{ color: 'var(--primary)' }}><Edit size={16}/></button>
                  <button className="btn-icon" onClick={() => onDelete(item.campaignId)} style={{ color: '#ef4444' }}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CampaignsTable;