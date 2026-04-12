import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/interviewService';
import { getUserIdFromToken } from '../../utils/tokenUtils';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const ApplySection = () => {
  const userId = getUserIdFromToken();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, [userId]);

  const fetchInterviews = async () => {
    if (!userId) return;
    try {
      // Giả sử service có method getByUserId(userId, pageNumber, pageSize)
      // Tạm thời nếu chưa có thì dùng getAll
      if(interviewService.getByUserId) {
        const res = await interviewService.getByUserId(userId, 1, 10);
        if (res.data) setInterviews(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: return <Clock size={16} className="text-warning" />;
      case 2: return <CheckCircle size={16} className="text-success" />;
      case 3: return <XCircle size={16} className="text-danger" />;
      default: return <FileText size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return "Chờ duyệt";
      case 2: return "Đã duyệt";
      case 3: return "Từ chối";
      default: return "Không xác định";
    }
  };

  return (
    <div className="section-content fade-in">
      <h2>Hồ sơ ứng tuyển & Phỏng vấn</h2>
      <p className="text-sub">Theo dõi trạng thái các đơn ứng tuyển của bạn vào CLB</p>
      
      {loading ? (
        <div className="loading-state">Đang tải...</div>
      ) : interviews.length === 0 ? (
        <div className="empty-state">
           <FileText size={48} color="#cbd5e1" />
           <p>Bạn chưa có đơn ứng tuyển nào</p>
        </div>
      ) : (
        <div className="apply-list">
          {interviews.map(inv => (
            <div className="apply-card" key={inv.interviewId}>
              <div className="apply-info">
                <h3>Ứng tuyển CLB ID: {inv.clubId}</h3>
                <p>Nộp ngày: {new Date(inv.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`apply-status status-${inv.status}`}>
                 {getStatusIcon(inv.status)} {getStatusText(inv.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplySection;
