import React from "react";
import Modal from "../common/Modal";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const AdminDashboardModals = ({
  // --- USER PROPS ---
  showUserModal, setShowUserModal, userForm, setUserForm, handleSaveUser, editingUser,
  showViewUserModal, setShowViewUserModal, viewingUser,

  // --- CLUB PROPS ---
  showClubModal, setShowClubModal, clubForm, setClubForm, handleSaveClub, editingClub, users, clubs,
  showViewClubModal, setShowViewClubModal, viewingClub,

  // --- MEMBER PROPS ---
  showMemberModal, setShowMemberModal, memberForm, setMemberForm, handleSaveMember, editingMember, availableUsers,
  showViewMemberModal, setShowViewMemberModal, viewingMember,

  // --- INTERVIEW PROPS ---
  showInterviewModal, setShowInterviewModal, interviewForm, setInterviewForm, handleSaveInterview, editingInterview,
  showViewInterviewModal, setShowViewInterviewModal, viewingInterview,

  // --- EMAIL & RESULT PROPS ---
  showEmailModal, setShowEmailModal, handleSendEmail, emailSending,
  showResultModal, emailResult, handleResultOk
}) => {

  // Style helper cho View modal để code gọn hơn
  const ViewItem = ({ label, value }) => (
    <div style={{ marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sub)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: 'var(--text-main)', wordBreak: 'break-word' }}>{value || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Chưa có dữ liệu</span>}</div>
    </div>
  );

  return (
    <>
      {/* ==================================================================================
          1. USER MODALS
         ================================================================================== */}
      
      {/* 1.1 ADD/EDIT USER */}
      {showUserModal && (
        <Modal title={editingUser ? "Sửa thông tin tài khoản" : "Thêm tài khoản mới"} onClose={() => setShowUserModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Họ tên *</label>
              <input className="input-control" placeholder="Nhập họ tên" value={userForm.fullName} onChange={e => setUserForm({ ...userForm, fullName: e.target.value })} />
            </div>
            
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Email *</label>
              <input className="input-control" type="email" placeholder="Nhập email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} disabled={!!editingUser} /* Tuỳ chọn: Có thể cấm sửa email nếu muốn bằng cách thêm disabled={!!editingUser} */ />
            </div>

            {/* ⚠️ CHỈ HIỆN Ô MẬT KHẨU KHI THÊM MỚI (!editingUser) */}
            {!editingUser && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mật khẩu *</label>
                <input className="input-control" type="password" placeholder="Nhập mật khẩu" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
              </div>
            )}

            {!editingUser && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Thuộc Câu lạc bộ</label>
                <select className="input-control" value={userForm.clubId} onChange={e => setUserForm({ ...userForm, clubId: e.target.value })}>
                  <option value="">-- Không tham gia CLB nào --</option>
                  {clubs && clubs.map(c => (
                    <option key={c.clubId} value={c.clubId}>{c.clubName}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Vai trò</label>
              <select className="input-control" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="member">Member</option>
                <option value="leader">Leader</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Trạng thái</label>
              <select className="input-control" value={userForm.isActive} onChange={e => setUserForm({ ...userForm, isActive: parseInt(e.target.value) })}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveUser}>
              {editingUser ? "Cập nhật tài khoản" : "Tạo tài khoản"}
            </button>
          </div>
        </Modal>
      )}

      {/* 1.2 VIEW USER DETAILS */}
      {showViewUserModal && viewingUser && (
        <Modal title="Chi tiết Người dùng" onClose={() => setShowViewUserModal(false)}>
          <ViewItem label="ID" value={viewingUser.userId} />
          <ViewItem label="Họ tên" value={viewingUser.fullName} />
          <ViewItem label="Email" value={viewingUser.email} />
          <ViewItem label="Vai trò" value={viewingUser.role} />
          <ViewItem label="Trạng thái" value={viewingUser.isActive ? "Active" : "Inactive"} />
          <button className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)', marginTop: 10 }} onClick={() => setShowViewUserModal(false)}>Đóng</button>
        </Modal>
      )}


      {/* ==================================================================================
          2. CLUB MODALS
         ================================================================================== */}

      {/* 2.1 ADD/EDIT CLUB */}
      {showClubModal && (
        <Modal title={editingClub ? "Sửa Câu lạc bộ" : "Thêm Câu lạc bộ"} onClose={() => setShowClubModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên CLB *</label>
              <input className="input-control" placeholder="Nhập tên CLB (VD: IT-Supporter)" value={clubForm.clubName} onChange={e => setClubForm({ ...clubForm, clubName: e.target.value })} />
            </div>
            
            {/* ✅ THÊM Ô TIÊU ĐỀ THEO ĐÚNG API CỦA BẠN */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tiêu đề (Title)</label>
              <input className="input-control" placeholder="Nhập tiêu đề" value={clubForm.title} onChange={e => setClubForm({ ...clubForm, title: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mô tả</label>
              <textarea className="input-control" placeholder="Mô tả ngắn gọn" rows={4} value={clubForm.description} onChange={e => setClubForm({ ...clubForm, description: e.target.value })} />
            </div>
            
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Trưởng CLB (Tuỳ chọn)</label>
              <select className="input-control" value={clubForm.leaderId || ""} onChange={e => setClubForm({ ...clubForm, leaderId: e.target.value })}>
                <option value="">-- Chưa có Trưởng CLB (Bỏ trống) --</option>
                {users && users.filter(u => u.role === 'leader' || u.role === 'admin').map(u => (
                  <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>
                ))}
              </select>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveClub}>
              {editingClub ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </Modal>
      )}
      
      {/* 2.2 VIEW CLUB DETAILS */}
      {showViewClubModal && viewingClub && (
        <Modal title="Chi tiết Câu lạc bộ" onClose={() => setShowViewClubModal(false)}>
          <ViewItem label="ID" value={viewingClub.clubId} />
          <ViewItem label="Tên CLB" value={viewingClub.clubName} />
          <ViewItem label="Mô tả" value={viewingClub.description} />
          <ViewItem label="Trưởng CLB" value={viewingClub.leaderName} />
          <ViewItem label="Ngày tạo" value={viewingClub.createdAt ? new Date(viewingClub.createdAt).toLocaleString('vi-VN') : null} />
          <button className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)', marginTop: 10 }} onClick={() => setShowViewClubModal(false)}>Đóng</button>
        </Modal>
      )}


      {/* ==================================================================================
          3. MEMBER MODALS
         ================================================================================== */}

      {/* 3.1 ADD/EDIT MEMBER */}
      {showMemberModal && (
        <Modal title={editingMember ? "Sửa Thành viên" : "Thêm Thành viên"} onClose={() => setShowMemberModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Người dùng</label>
              <select className="input-control" value={memberForm.userId} onChange={e => setMemberForm({ ...memberForm, userId: e.target.value })} disabled={!!editingMember}>
                <option value="">-- Chọn User --</option>
                {(editingMember ? users : availableUsers).map(u => (
                  <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Vai trò trong CLB</label>
              <select className="input-control" value={memberForm.memberRole} onChange={e => setMemberForm({ ...memberForm, memberRole: e.target.value })}>
                <option value="member">Member</option>
                <option value="leader">Leader</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveMember}>
              {editingMember ? "Cập nhật" : "Thêm vào CLB"}
            </button>
          </div>
        </Modal>
      )}

      {/* 3.2 VIEW MEMBER DETAILS */}
      {showViewMemberModal && viewingMember && (
        <Modal title="Chi tiết Thành viên" onClose={() => setShowViewMemberModal(false)}>
          <ViewItem label="ID Thành viên" value={viewingMember.clubMemberId} />
          <ViewItem label="Họ tên" value={viewingMember.userName} />
          <ViewItem label="Email" value={viewingMember.userEmail} />
          <ViewItem label="Vai trò" value={viewingMember.memberRole} />
          <ViewItem label="Ngày tham gia" value={viewingMember.joinAt ? new Date(viewingMember.joinAt).toLocaleDateString('vi-VN') : null} />
          <button className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)', marginTop: 10 }} onClick={() => setShowViewMemberModal(false)}>Đóng</button>
        </Modal>
      )}


      {/* ==================================================================================
          4. INTERVIEW MODALS
         ================================================================================== */}

      {/* 4.1 ADD/EDIT INTERVIEW */}
      {showInterviewModal && (
        <Modal title={editingInterview ? "Sửa Phỏng vấn" : "Thêm Phỏng vấn"} onClose={() => setShowInterviewModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên ứng viên</label>
              <input className="input-control" placeholder="Nhập tên" value={interviewForm.applicantName} onChange={e => setInterviewForm({ ...interviewForm, applicantName: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Email ứng viên</label>
              <input className="input-control" placeholder="Nhập email" value={interviewForm.applicantEmail} onChange={e => setInterviewForm({ ...interviewForm, applicantEmail: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Đánh giá</label>
              <textarea className="input-control" placeholder="Nhận xét buổi phỏng vấn" rows={4} value={interviewForm.evaluation} onChange={e => setInterviewForm({ ...interviewForm, evaluation: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Kết quả</label>
              <select className="input-control" value={interviewForm.result} onChange={e => setInterviewForm({ ...interviewForm, result: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveInterview}>
              {editingInterview ? "Cập nhật" : "Lưu phỏng vấn"}
            </button>
          </div>
        </Modal>
      )}

      {/* 4.2 VIEW INTERVIEW DETAILS */}
      {showViewInterviewModal && viewingInterview && (
        <Modal title="Chi tiết Phỏng vấn" onClose={() => setShowViewInterviewModal(false)}>
          <ViewItem label="ID Phỏng vấn" value={viewingInterview.interviewId} />
          <ViewItem label="ID CLB" value={viewingInterview.clubId} />
          <ViewItem label="Ứng viên" value={viewingInterview.applicantName} />
          <ViewItem label="Email" value={viewingInterview.applicantEmail} />
          <ViewItem label="Đánh giá" value={viewingInterview.evaluation} />
          <ViewItem label="Kết quả" value={viewingInterview.result} />
          <ViewItem label="Ngày tạo" value={viewingInterview.createdAt ? new Date(viewingInterview.createdAt).toLocaleString('vi-VN') : null} />
          <button className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)', marginTop: 10 }} onClick={() => setShowViewInterviewModal(false)}>Đóng</button>
        </Modal>
      )}


      {/* ==================================================================================
          5. EMAIL & RESULT MODALS
         ================================================================================== */}

      {/* 5.1 SEND EMAIL CONFIGURATION */}
      {showEmailModal && (
        <Modal title="Gửi Email Thông báo" onClose={() => setShowEmailModal(false)} maxWidth="420px">
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ marginBottom: 24, color: 'var(--text-main)' }}>
              Bạn muốn gửi email thông báo kết quả cho nhóm ứng viên nào?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn"
                style={{ flex: 1, background: '#10b981', color: 'white', justifyContent: 'center', opacity: emailSending ? 0.7 : 1 }}
                onClick={() => handleSendEmail('Pass')}
                disabled={emailSending}
              >
                {emailSending ? 'Đang gửi...' : 'Gửi cho Pass'}
              </button>
              <button
                className="btn"
                style={{ flex: 1, background: '#ef4444', color: 'white', justifyContent: 'center', opacity: emailSending ? 0.7 : 1 }}
                onClick={() => handleSendEmail('Fail')}
                disabled={emailSending}
              >
                {emailSending ? 'Đang gửi...' : 'Gửi cho Fail'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5.2 OPERATION RESULT (SUCCESS/ERROR) */}
      {showResultModal && emailResult && (
        <Modal title="Thông báo" onClose={handleResultOk} maxWidth="400px">
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              {emailResult.success ? (
                <CheckCircle size={64} color="#10b981" />
              ) : (
                <AlertCircle size={64} color="#ef4444" />
              )}
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 20, color: emailResult.success ? '#10b981' : '#ef4444' }}>
              {emailResult.success ? "Thành công!" : "Có lỗi xảy ra!"}
            </h3>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-hover)', padding: 12, borderRadius: 8 }}>
              {emailResult.message}
            </p>
            <button className="btn btn-primary" style={{ margin: '24px auto 0', width: '100%', justifyContent: 'center' }} onClick={handleResultOk}>
              Đóng và Quay lại
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminDashboardModals;