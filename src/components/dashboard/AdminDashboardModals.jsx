import React from "react";
import Modal from "../common/Modal";
import { CheckCircle, AlertCircle, X, FileText, XCircle, UserCheck } from "lucide-react";

const AdminDashboardModals = ({
  // --- USER PROPS ---
  showUserModal, setShowUserModal, userForm, setUserForm, handleSaveUser, editingUser,
  showViewUserModal, setShowViewUserModal, viewingUser,
  userErrors, setUserErrors,

  // --- CLUB PROPS ---
  showClubModal, setShowClubModal, clubForm, setClubForm, handleSaveClub, editingClub, users, clubs,
  showViewClubModal, setShowViewClubModal, viewingClub,
  clubErrors, setClubErrors,

  // --- MEMBER PROPS ---
  showMemberModal, setShowMemberModal, memberForm, setMemberForm,
  editingMember, handleSaveMember, showViewMemberModal, setShowViewMemberModal,
  viewingMember, memberErrors, setMemberErrors,

  // --- EVENT PROPS ---
  showEventModal, setShowEventModal, eventForm, setEventForm,
  editingEvent, handleSaveEvent, showViewEventModal, setShowViewEventModal,
  viewingEvent, eventErrors, setEventErrors,

  // --- EVENT REGISTRATION PROPS ---
  showRegModal, setShowRegModal, regForm, setRegForm,
  editingReg, handleSaveReg, showViewRegModal, setShowViewRegModal,
  viewingReg, regErrors, setRegErrors, events, 

  // --- CAMPAIGN PROPS ---
  showCampaignModal, setShowCampaignModal, campaignForm, setCampaignForm,
  editingCampaign, handleSaveCampaign, showViewCampaignModal, setShowViewCampaignModal,
  viewingCampaign, campaignErrors, setCampaignErrors, campaigns,

  // --- INTERVIEW PROPS ---
  showInterviewModal, setShowInterviewModal, interviewForm, setInterviewForm, editingInterview, handleSaveInterview, interviewErrors, setInterviewErrors,
  showStartModal, setShowStartModal, startForm, setStartForm, handleStartInterview, startErrors, setStartErrors,
  showFinishModal, setShowFinishModal, finishForm, setFinishForm, handleFinishInterview, finishErrors, setFinishErrors, isUpdatingResult,
  showViewInterviewModal, setShowViewInterviewModal, viewingInterview,

  // --- EMAIL & RESULT PROPS ---
  showEmailModal, setShowEmailModal, handleSendEmail, emailSending,
  showResultModal, emailResult, handleResultOk
}) => {

  const ViewItem = ({ label, value }) => (
    <div style={{ marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sub)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: 'var(--text-main)', wordBreak: 'break-word' }}>{value || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Chưa có dữ liệu</span>}</div>
    </div>
  );

  const RequiredStar = () => <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>;

  return (
    <>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            opacity: 1 !important;
            display: block !important;
            cursor: pointer !important;
            filter: invert(0.6) !important; 
        }
      `}</style>

      {/* =========================================
          1. USER MODALS
         ========================================= */}
      {showUserModal && (
        <Modal title={editingUser ? "Sửa thông tin tài khoản" : "Thêm tài khoản mới"} onClose={() => setShowUserModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Họ tên <RequiredStar/></label>
              <input className="input-control" style={{ borderColor: userErrors?.fullName ? '#ef4444' : '' }} placeholder="Nhập họ tên" value={userForm.fullName} onChange={e => { setUserForm({ ...userForm, fullName: e.target.value }); if (userErrors?.fullName) setUserErrors({ ...userErrors, fullName: null }); }} />
              {userErrors?.fullName && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.fullName}</span>}
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Email <RequiredStar/></label>
              <input className="input-control" style={{ borderColor: userErrors?.email ? '#ef4444' : '' }} type="email" placeholder="Nhập email" value={userForm.email} disabled={!!editingUser} onChange={e => { setUserForm({ ...userForm, email: e.target.value }); if (userErrors?.email) setUserErrors({ ...userErrors, email: null }); }} />
              {userErrors?.email && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.email}</span>}
            </div>

            {!editingUser && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mật khẩu <RequiredStar/></label>
                <input className="input-control" style={{ borderColor: userErrors?.password ? '#ef4444' : '' }} type="password" placeholder="Nhập mật khẩu" value={userForm.password} onChange={e => { setUserForm({ ...userForm, password: e.target.value }); if (userErrors?.password) setUserErrors({ ...userErrors, password: null }); }} />
                {userErrors?.password && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.password}</span>}
              </div>
            )}

            {!editingUser && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Thuộc Câu lạc bộ <RequiredStar/></label>
                <select className="input-control" style={{ borderColor: userErrors?.clubId ? '#ef4444' : '' }} value={userForm.clubId} onChange={e => { setUserForm({ ...userForm, clubId: e.target.value }); if (userErrors?.clubId) setUserErrors({ ...userErrors, clubId: null }); }}>
                  <option value="">-- Vui lòng chọn Câu lạc bộ --</option>
                  {clubs && clubs.map(c => (<option key={c.clubId} value={c.clubId}>{c.clubName}</option>))}
                </select>
                {userErrors?.clubId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.clubId}</span>}
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Vai trò <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: userErrors?.role ? '#ef4444' : '' }} value={userForm.role} onChange={e => { setUserForm({ ...userForm, role: e.target.value }); if (userErrors?.role) setUserErrors({ ...userErrors, role: null }); }}>
                <option value="">-- Chọn vai trò --</option>
                <option value="member">Member</option>
                <option value="leader">Leader</option>
                <option value="admin">Admin</option>
              </select>
              {userErrors?.role && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.role}</span>}
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Trạng thái <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: userErrors?.isActive ? '#ef4444' : '' }} value={userForm.isActive} onChange={e => { setUserForm({ ...userForm, isActive: parseInt(e.target.value) }); if (userErrors?.isActive) setUserErrors({ ...userErrors, isActive: null }); }}>
                <option value="">-- Chọn trạng thái --</option>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              {userErrors?.isActive && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.isActive}</span>}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveUser}>
              {editingUser ? "Cập nhật tài khoản" : "Tạo tài khoản"}
            </button>
          </div>
        </Modal>
      )}

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

      {/* =========================================
          2. CLUB MODALS
         ========================================= */}
      {showClubModal && (
        <Modal title={editingClub ? "Sửa Câu lạc bộ" : "Thêm Câu lạc bộ"} onClose={() => setShowClubModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên CLB <RequiredStar/></label>
              <input className="input-control" style={{ borderColor: clubErrors?.clubName ? '#ef4444' : '' }} placeholder="Nhập tên CLB (VD: IT-Supporter)" value={clubForm.clubName} onChange={e => { setClubForm({ ...clubForm, clubName: e.target.value }); if (clubErrors?.clubName) setClubErrors({ ...clubErrors, clubName: null }); }} />
              {clubErrors?.clubName && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{clubErrors.clubName}</span>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tiêu đề (Title) <RequiredStar/></label>
              <input className="input-control" style={{ borderColor: clubErrors?.title ? '#ef4444' : '' }} placeholder="Nhập tiêu đề" value={clubForm.title} onChange={e => { setClubForm({ ...clubForm, title: e.target.value }); if (clubErrors?.title) setClubErrors({ ...clubErrors, title: null }); }} />
              {clubErrors?.title && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{clubErrors.title}</span>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mô tả</label>
              <textarea className="input-control" style={{ borderColor: clubErrors?.description ? '#ef4444' : '' }} placeholder="Mô tả ngắn gọn" rows={4} value={clubForm.description} onChange={e => { setClubForm({ ...clubForm, description: e.target.value }); if (clubErrors?.description) setClubErrors({ ...clubErrors, description: null }); }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Trưởng CLB (Tuỳ chọn)</label>
              <select className="input-control" style={{ borderColor: clubErrors?.leaderId ? '#ef4444' : '' }} value={clubForm.leaderId || ""} onChange={e => { setClubForm({ ...clubForm, leaderId: e.target.value }); if (clubErrors?.leaderId) setClubErrors({ ...clubErrors, leaderId: null }); }}>
                <option value="">-- Chưa có Trưởng CLB (Bỏ trống) --</option>
                {users && users.filter(u => u.role === 'leader' || u.role === 'admin').map(u => ( <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option> ))}
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveClub}>{editingClub ? "Cập nhật" : "Tạo mới"}</button>
          </div>
        </Modal>
      )}
      
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

      {/* =========================================
          3. MEMBER MODALS
         ========================================= */}
      {showMemberModal && (
        <Modal title={editingMember ? "Sửa Thành viên" : "Thêm Thành viên"} onClose={() => setShowMemberModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: memberErrors?.clubId ? '#ef4444' : '', backgroundColor: editingMember ? '#f3f4f6' : 'white', cursor: editingMember ? 'not-allowed' : 'auto' }} value={memberForm.clubId || ""} disabled={!!editingMember} onChange={e => { setMemberForm({ ...memberForm, clubId: e.target.value }); if (memberErrors?.clubId) setMemberErrors({ ...memberErrors, clubId: null }); }}>
                <option value="">-- Chọn Câu lạc bộ --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
              {memberErrors?.clubId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{memberErrors.clubId}</span>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tài khoản User <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: memberErrors?.userId ? '#ef4444' : '', backgroundColor: editingMember ? '#f3f4f6' : 'white', cursor: editingMember ? 'not-allowed' : 'auto' }} value={memberForm.userId || ""} disabled={!!editingMember} onChange={e => { setMemberForm({ ...memberForm, userId: e.target.value }); if (memberErrors?.userId) setMemberErrors({ ...memberErrors, userId: null }); }}>
                <option value="">-- Chọn Người dùng --</option>
                {users && users.map(u => <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>)}
              </select>
              {memberErrors?.userId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{memberErrors.userId}</span>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Vai trò trong CLB <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: memberErrors?.memberRole ? '#ef4444' : '' }} value={memberForm.memberRole} onChange={e => { setMemberForm({ ...memberForm, memberRole: e.target.value }); if (memberErrors?.memberRole) setMemberErrors({ ...memberErrors, memberRole: null }); }}>
                <option value="member">Thành viên (Member)</option>
                <option value="leader">Trưởng CLB (Leader)</option>
              </select>
              {memberErrors?.memberRole && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{memberErrors.memberRole}</span>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Ngày tham gia</label>
              <input type="datetime-local" className="input-control" style={{ colorScheme: 'light' }} value={memberForm.joinAt} onChange={e => setMemberForm({ ...memberForm, joinAt: e.target.value })} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveMember}>{editingMember ? "Cập nhật" : "Thêm vào CLB"}</button>
          </div>
        </Modal>
      )}

      {showViewMemberModal && viewingMember && (
        <Modal title="Chi tiết Thành viên" onClose={() => setShowViewMemberModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Mã thẻ:</strong> <span>#{viewingMember.clubMemberId}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Hệ thống ID:</strong> <span>User: {viewingMember.userId} - Club: {viewingMember.clubId}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Vai trò:</strong> <span><span className={`badge ${viewingMember.memberRole === 'leader' ? 'warning' : 'primary'}`}>{viewingMember.memberRole}</span></span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Ngày gia nhập:</strong> <span>{viewingMember.joinAt ? new Date(viewingMember.joinAt).toLocaleString('vi-VN') : "Chưa cập nhật"}</span></div>
          </div>
        </Modal>
      )}

      {/* =========================================
          4. EVENT MODALS
         ========================================= */}
      {showEventModal && (
        <Modal title={editingEvent ? "Sửa Sự kiện" : "Tạo Sự kiện mới"} onClose={() => setShowEventModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ tổ chức <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: eventErrors?.clubId ? '#ef4444' : '', backgroundColor: editingEvent ? '#f3f4f6' : 'white', cursor: editingEvent ? 'not-allowed' : 'auto' }} value={eventForm.clubId || ""} disabled={!!editingEvent} onChange={e => { setEventForm({ ...eventForm, clubId: e.target.value }); if (eventErrors?.clubId) setEventErrors({ ...eventErrors, clubId: null }); }}>
                <option value="">-- Chọn Câu lạc bộ --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
              {eventErrors?.clubId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{eventErrors.clubId}</span>}
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên sự kiện <RequiredStar/></label>
              <input type="text" className="input-control" style={{ borderColor: eventErrors?.title ? '#ef4444' : '' }} placeholder="Nhập tên sự kiện..." value={eventForm.title} onChange={e => { setEventForm({ ...eventForm, title: e.target.value }); if (eventErrors?.title) setEventErrors({ ...eventErrors, title: null }); }} />
              {eventErrors?.title && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{eventErrors.title}</span>}
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Thời gian diễn ra <RequiredStar/></label>
              <input type="datetime-local" className="input-control" style={{ borderColor: eventErrors?.eventDate ? '#ef4444' : '', colorScheme: 'light' }} value={eventForm.eventDate} onChange={e => { setEventForm({ ...eventForm, eventDate: e.target.value }); if (eventErrors?.eventDate) setEventErrors({ ...eventErrors, eventDate: null }); }} />
              {eventErrors?.eventDate && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{eventErrors.eventDate}</span>}
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Phạm vi</label>
                <select className="input-control" value={eventForm.isPrivate} onChange={e => setEventForm({ ...eventForm, isPrivate: e.target.value === 'true' })}>
                  <option value={'true'}>Nội bộ CLB</option>
                  <option value={'false'}>Công khai</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mức ưu tiên</label>
                <select className="input-control" value={eventForm.priority} onChange={e => setEventForm({ ...eventForm, priority: parseInt(e.target.value) })}>
                  <option value={1}>Thấp (Low)</option>
                  <option value={2}>Trung bình (Medium)</option>
                  <option value={3}>Cao (High)</option>
                  <option value={4}>Khẩn cấp (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mô tả chi tiết</label>
              <textarea className="input-control" rows={4} placeholder="Nội dung sự kiện..." value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveEvent}>{editingEvent ? "Cập nhật Sự kiện" : "Tạo Sự kiện"}</button>
          </div>
        </Modal>
      )}

      {showViewEventModal && viewingEvent && (
        <Modal title="Chi tiết Sự kiện" onClose={() => setShowViewEventModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: 14 }}>
            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: 18 }}>{viewingEvent.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>ID Sự kiện:</strong> <span>#{viewingEvent.id}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Thời gian:</strong> <span>{viewingEvent.eventDate ? new Date(viewingEvent.eventDate).toLocaleString('vi-VN') : "Chưa cập nhật"}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Phạm vi:</strong> <span><span className={`badge ${viewingEvent.isPrivate ? 'warning' : 'success'}`}>{viewingEvent.isPrivate ? 'Nội bộ' : 'Công khai'}</span></span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Mức ưu tiên:</strong> 
              <span style={{ color: viewingEvent.priority === 4 ? '#ef4444' : viewingEvent.priority === 3 ? '#f59e0b' : viewingEvent.priority === 2 ? '#3b82f6' : '#6b7280', fontWeight: 600 }}>
                {viewingEvent.priority === 1 ? 'Thấp' : viewingEvent.priority === 2 ? 'Trung bình' : viewingEvent.priority === 3 ? 'Cao' : viewingEvent.priority === 4 ? 'Khẩn cấp' : viewingEvent.priority}
              </span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            <div>
              <strong style={{ color: 'var(--text-sub)', display: 'block', marginBottom: 8 }}>Mô tả:</strong>
              <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap' }}>{viewingEvent.description || "Không có mô tả"}</div>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================
          5. EVENT REGISTRATIONS MODALS
         ========================================= */}
      {showRegModal && (
        <Modal title={editingReg ? "Cập nhật Đăng ký" : "Đăng ký Tham gia"} onClose={() => setShowRegModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Sự kiện đăng ký <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: regErrors?.eventId ? '#ef4444' : '', backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} value={regForm.eventId || ""} disabled>
                {events && events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                <input type="radio" checked={!regForm.isGuest} onChange={() => setRegForm({ ...regForm, isGuest: false, guestName: "", guestEmail: "" })} disabled={!!editingReg} />
                Thành viên Hệ thống
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                <input type="radio" checked={regForm.isGuest} onChange={() => setRegForm({ ...regForm, isGuest: true, userId: "" })} disabled={!!editingReg} />
                Khách vãng lai
              </label>
            </div>

            {!regForm.isGuest ? (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Chọn Tài khoản User <RequiredStar/></label>
                <select className="input-control" style={{ borderColor: regErrors?.userId ? '#ef4444' : '', backgroundColor: editingReg ? '#f3f4f6' : 'white' }} value={regForm.userId || ""} disabled={!!editingReg} onChange={e => { setRegForm({ ...regForm, userId: e.target.value }); if (regErrors?.userId) setRegErrors({ ...regErrors, userId: null }); }}>
                  <option value="">-- Chọn User --</option>
                  {users && users.map(u => <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>)}
                </select>
                {regErrors?.userId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{regErrors.userId}</span>}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên Khách <RequiredStar/></label>
                  <input type="text" className="input-control" style={{ borderColor: regErrors?.guestName ? '#ef4444' : '' }} placeholder="Nhập tên..." value={regForm.guestName} onChange={e => { setRegForm({ ...regForm, guestName: e.target.value }); if (regErrors?.guestName) setRegErrors({ ...regErrors, guestName: null }); }} />
                  {regErrors?.guestName && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{regErrors.guestName}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Email Khách <RequiredStar/></label>
                  <input type="email" className="input-control" style={{ borderColor: regErrors?.guestEmail ? '#ef4444' : '' }} placeholder="Nhập email..." value={regForm.guestEmail} onChange={e => { setRegForm({ ...regForm, guestEmail: e.target.value }); if (regErrors?.guestEmail) setRegErrors({ ...regErrors, guestEmail: null }); }} />
                  {regErrors?.guestEmail && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{regErrors.guestEmail}</span>}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>
                <input type="checkbox" checked={regForm.isCare === 1} onChange={e => setRegForm({ ...regForm, isCare: e.target.checked ? 1 : 0 })} style={{ width: 16, height: 16 }} />
                Khách có quan tâm đến Sự kiện
              </label>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: regForm.checkedIn ? 8 : 0 }}>
                <input type="checkbox" checked={regForm.checkedIn} onChange={e => setRegForm({ ...regForm, checkedIn: e.target.checked })} style={{ width: 16, height: 16 }} />
                Xác nhận Đã tham gia (Check-in)
              </label>
              {regForm.checkedIn && (
                <input type="text" className="input-control" placeholder="Ghi chú (Tên người check-in)..." value={regForm.checkName || ""} onChange={e => setRegForm({ ...regForm, checkName: e.target.value })} />
              )}
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveReg}>{editingReg ? "Cập nhật Thông tin" : "Xác nhận Đăng ký"}</button>
          </div>
        </Modal>
      )}

      {showViewRegModal && viewingReg && (
        <Modal title="Chi tiết Đăng ký Tham gia" onClose={() => setShowViewRegModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>ID Đăng ký:</strong> <span style={{ fontWeight: 600 }}>#{viewingReg.id}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Sự kiện:</strong> <span>{events?.find(e => e.id === viewingReg.eventId)?.title || `ID Sự kiện: ${viewingReg.eventId}`}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Loại tài khoản:</strong> <span><span className={`badge ${viewingReg.userId && viewingReg.userId > 0 ? 'primary' : 'warning'}`}>{viewingReg.userId && viewingReg.userId > 0 ? 'Thành viên Hệ thống' : 'Khách vãng lai'}</span></span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Người tham gia:</strong> <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{viewingReg.userId && viewingReg.userId > 0 ? (users?.find(u => u.userId === viewingReg.userId)?.fullName || `User ID: ${viewingReg.userId}`) : viewingReg.guestName}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Email liên hệ:</strong> <span>{viewingReg.userId && viewingReg.userId > 0 ? (users?.find(u => u.userId === viewingReg.userId)?.email || "N/A") : viewingReg.guestEmail}</span></div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Mức độ quan tâm:</strong> <span>{viewingReg.isCare === 1 ? <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Có quan tâm</span> : 'Không quan tâm'}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Trạng thái:</strong> <span><span className={`badge ${viewingReg.checkedIn ? 'success' : 'error'}`}>{viewingReg.checkedIn ? 'Đã đến (Check-in)' : 'Chưa đến'}</span></span></div>
            {viewingReg.checkedIn && viewingReg.checkName && (
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Người điểm danh:</strong> <span>{viewingReg.checkName}</span></div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Ngày đăng ký:</strong> <span>{viewingReg.registeredAt ? new Date(viewingReg.registeredAt).toLocaleString('vi-VN') : "Chưa cập nhật"}</span></div>
          </div>
        </Modal>
      )}

      {/* =========================================
          6. CAMPAIGN MODALS (ĐỢT TUYỂN)
         ========================================= */}
      {showCampaignModal && (
        <Modal title={editingCampaign ? "Sửa Đợt Tuyển" : "Tạo Đợt Tuyển Mới"} onClose={() => setShowCampaignModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: campaignErrors?.clubId ? '#ef4444' : '', backgroundColor: editingCampaign ? '#f3f4f6' : 'white', cursor: editingCampaign ? 'not-allowed' : 'auto' }} value={campaignForm.clubId || ""} disabled={!!editingCampaign} onChange={e => { setCampaignForm({ ...campaignForm, clubId: e.target.value }); if (campaignErrors?.clubId) setCampaignErrors({ ...campaignErrors, clubId: null }); }}>
                <option value="">-- Chọn Câu lạc bộ --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
              {campaignErrors?.clubId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{campaignErrors.clubId}</span>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên Đợt tuyển (VD: Tuyển Gen 10) <RequiredStar/></label>
              <input type="text" className="input-control" style={{ borderColor: campaignErrors?.title ? '#ef4444' : '' }} value={campaignForm.title} onChange={e => { setCampaignForm({ ...campaignForm, title: e.target.value }); if (campaignErrors?.title) setCampaignErrors({ ...campaignErrors, title: null }); }} />
              {campaignErrors?.title && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{campaignErrors.title}</span>}
            </div>

            {/* ĐÃ BỔ SUNG LỖI CHO 2 Ô NGÀY CHIẾN DỊCH */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Ngày bắt đầu</label>
                <input type="date" className="input-control" style={{ colorScheme: 'light', borderColor: campaignErrors?.startDate ? '#ef4444' : '' }} value={campaignForm.startDate} onChange={e => { setCampaignForm({ ...campaignForm, startDate: e.target.value }); if (campaignErrors?.startDate) setCampaignErrors({ ...campaignErrors, startDate: null }); }} />
                {campaignErrors?.startDate && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{campaignErrors.startDate}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Ngày kết thúc</label>
                <input type="date" className="input-control" style={{ colorScheme: 'light', borderColor: campaignErrors?.endDate ? '#ef4444' : '' }} value={campaignForm.endDate} onChange={e => { setCampaignForm({ ...campaignForm, endDate: e.target.value }); if (campaignErrors?.endDate) setCampaignErrors({ ...campaignErrors, endDate: null }); }} />
                {campaignErrors?.endDate && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{campaignErrors.endDate}</span>}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Trạng thái <RequiredStar/></label>
              <select className="input-control" value={campaignForm.isActive ? "true" : "false"} onChange={e => setCampaignForm({ ...campaignForm, isActive: e.target.value === 'true' })}>
                <option value="true">Đang mở (Active)</option>
                <option value="false">Đã đóng</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveCampaign}>{editingCampaign ? "Cập nhật" : "Tạo Đợt tuyển"}</button>
          </div>
        </Modal>
      )}
      
      {showViewCampaignModal && viewingCampaign && (
        <Modal title="Chi tiết Đợt tuyển" onClose={() => setShowViewCampaignModal(false)}>
          <ViewItem label="Tên đợt tuyển" value={viewingCampaign.title} />
          <ViewItem label="Thuộc CLB" value={viewingCampaign.clubName} />
          <ViewItem label="Thời gian" value={`${viewingCampaign.startDate ? new Date(viewingCampaign.startDate).toLocaleDateString('vi-VN') : '...'} - ${viewingCampaign.endDate ? new Date(viewingCampaign.endDate).toLocaleDateString('vi-VN') : '...'}`} />
          <ViewItem label="Trạng thái" value={viewingCampaign.isActive ? "Đang mở" : "Đã đóng"} />
        </Modal>
      )}

      {/* =========================================
          7. INTERVIEWS MODALS
         ========================================= */}
      {/* 7.1 TẠO/SỬA WALKIN */}
      {showInterviewModal && (
        <Modal title={editingInterview ? "Sửa Ứng Viên" : "Tạo Walk-in Mới"} onClose={() => setShowInterviewModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: interviewErrors?.clubId ? '#ef4444' : '' }} value={interviewForm.clubId} disabled={!!editingInterview} onChange={e => { setInterviewForm({...interviewForm, clubId: e.target.value, campaignId: ""}); if (interviewErrors?.clubId) setInterviewErrors({...interviewErrors, clubId: null}); }}>
                <option value="">-- Chọn CLB --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
              {interviewErrors?.clubId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{interviewErrors.clubId}</span>}
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Thuộc Đợt tuyển (Tùy chọn)</label>
              <select className="input-control" value={interviewForm.campaignId} disabled={!!editingInterview} onChange={e => setInterviewForm({...interviewForm, campaignId: e.target.value})}>
                <option value="">-- Chọn Đợt Tuyển --</option>
                {campaigns && campaigns.filter(camp => interviewForm.clubId ? camp.clubId.toString() === interviewForm.clubId.toString() : true).map(c => (
                  <option key={c.campaignId} value={c.campaignId}>{c.title} {c.isActive ? "(Đang mở)" : "(Đã đóng)"}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Họ tên Ứng viên <RequiredStar/></label>
              <input type="text" className="input-control" style={{ borderColor: interviewErrors?.applicantName ? '#ef4444' : '' }} placeholder="Họ tên Ứng viên" value={interviewForm.applicantName} onChange={e => { setInterviewForm({...interviewForm, applicantName: e.target.value}); if (interviewErrors?.applicantName) setInterviewErrors({...interviewErrors, applicantName: null}); }} />
              {interviewErrors?.applicantName && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{interviewErrors.applicantName}</span>}
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Email liên hệ</label>
                <input type="email" className="input-control" placeholder="Email" value={interviewForm.applicantEmail} onChange={e => setInterviewForm({...interviewForm, applicantEmail: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Số điện thoại</label>
                <input type="text" className="input-control" placeholder="SĐT" value={interviewForm.applicantPhone} onChange={e => setInterviewForm({...interviewForm, applicantPhone: e.target.value})} />
              </div>
            </div>

            {/* 👉 ĐÃ BỔ SUNG LỖI CHO Ô NGÀY PHỎNG VẤN */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Thời gian Phỏng vấn dự kiến</label>
              <input type="datetime-local" className="input-control" style={{ colorScheme: 'light', borderColor: interviewErrors?.interviewDate ? '#ef4444' : '' }} value={interviewForm.interviewDate} onChange={e => { setInterviewForm({...interviewForm, interviewDate: e.target.value}); if (interviewErrors?.interviewDate) setInterviewErrors({...interviewErrors, interviewDate: null}); }} />
              {interviewErrors?.interviewDate && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{interviewErrors.interviewDate}</span>}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveInterview}>Lưu Thông tin</button>
          </div>
        </Modal>
      )}

      {/* 7.2 BẮT ĐẦU PV */}
      {showStartModal && (
        <Modal title="Xác nhận Bắt đầu" onClose={() => setShowStartModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: 12, borderRadius: 8, fontSize: 14 }}>Xác nhận giám khảo thực hiện cuộc phỏng vấn.</div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Giám khảo phụ trách <RequiredStar/></label>
              <select className="input-control" value={startForm.evaluatorId} onChange={(e) => {
                   const uId = parseInt(e.target.value);
                   const uName = users?.find(u => u.userId === uId)?.fullName || "";
                   setStartForm({...startForm, evaluatorId: uId, evaluatorName: uName});
              }}>
                <option value="">-- Chọn Giám khảo --</option>
                {users && users.filter(u => u.role !== "member").map(u => <option key={u.userId} value={u.userId}>{u.fullName}</option>)}
              </select>
              {startErrors?.evaluatorId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{startErrors.evaluatorId}</span>}
            </div>

            <button className="btn btn-primary" onClick={handleStartInterview}>Vào Phỏng Vấn</button>
          </div>
        </Modal>
      )}

      {/* 7.3 WORKSPACE ĐÁNH GIÁ (FULL-SCREEN CUSTOM OVERLAY THAY VÌ DÙNG MODAL CŨ) */}
      {showFinishModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 99999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: 'white', width: '95vw', maxWidth: '1400px', height: '90vh',
            borderRadius: 16, display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden'
          }}>
            {/* Header Workspace */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={24} /> {isUpdatingResult ? "CẬP NHẬT KẾT QUẢ ĐÁNH GIÁ" : "WORKSPACE ĐÁNH GIÁ ỨNG VIÊN"}
              </h2>
              <button onClick={() => setShowFinishModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <X size={24} color="var(--text-sub)"/>
              </button>
            </div>

            {/* Nội dung Workspace chia 2 cột */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              
              {/* CỘT TRÁI: THÔNG TIN & CÂU HỎI MẪU */}
              <div style={{ flex: '0 0 450px', borderRight: '1px solid var(--border)', padding: 32, overflowY: 'auto', background: '#f1f5f9' }}>
                <div style={{ background: 'white', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ background: '#eff6ff', padding: 12, borderRadius: '50%' }}><UserCheck size={28} color="var(--primary)"/></div>
                    <h3 style={{ margin: 0, fontSize: 22, color: 'var(--text-main)' }}>{finishForm.applicantName || "Đang tải..."}</h3>
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div><strong>Email:</strong> {finishForm.applicantEmail || "N/A"}</div>
                    <div><strong>SĐT:</strong> {finishForm.applicantPhone || "N/A"}</div>
                    {finishForm.cvUrl && <a href={finishForm.cvUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, color: 'var(--primary)', fontWeight: 600 }}>🔗 Xem CV / Portfolio của ứng viên</a>}
                  </div>
                </div>

                <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-main)', fontSize: 16 }}>🎯 Ngân hàng Câu hỏi Gợi ý</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}><strong>Ice-breaker:</strong> Hãy giới thiệu 3 từ mô tả chính xác nhất về bản thân bạn?</div>
                  <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}><strong>Kinh nghiệm:</strong> Kể về một dự án hoặc bài tập khó khăn nhất bạn từng tham gia và cách bạn vượt qua?</div>
                  <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}><strong>Xử lý tình huống:</strong> Nếu sát giờ sự kiện mà diễn giả khách mời thông báo hủy lịch, bạn sẽ xử lý thế nào?</div>
                  <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}><strong>Gắn kết:</strong> Bạn nghĩ mình có thể đóng góp giá trị gì khác biệt cho Câu lạc bộ so với những bạn khác?</div>
                  <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}><strong>Cam kết:</strong> Bạn làm sao cân bằng được giữa việc học trên trường, việc làm thêm và hoạt động Câu lạc bộ?</div>
                </div>
              </div>

              {/* CỘT PHẢI: FORM CHỐT KẾT QUẢ */}
              <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, background: 'white' }}>
                
                <div>
                  <label style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'block' }}>Quyết định cuối cùng <RequiredStar/></label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    
                    <label style={{ flex: 1, border: finishForm.result === 0 ? '2px solid #f59e0b' : '1px solid var(--border)', background: finishForm.result === 0 ? '#fffbeb' : 'white', padding: '16px 12px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: finishForm.result === 0 ? '#f59e0b' : 'var(--text-main)', transition: 'all 0.2s', boxShadow: finishForm.result === 0 ? '0 4px 6px -1px rgba(245, 158, 11, 0.2)' : 'none' }}>
                      <input type="radio" checked={finishForm.result === 0} onChange={() => setFinishForm({...finishForm, result: 0})} style={{ display: 'none' }} />
                      <AlertCircle size={20} /> PENDING
                    </label>

                    <label style={{ flex: 1, border: finishForm.result === 1 ? '2px solid #10b981' : '1px solid var(--border)', background: finishForm.result === 1 ? '#f0fdf4' : 'white', padding: '16px 12px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: finishForm.result === 1 ? '#10b981' : 'var(--text-main)', transition: 'all 0.2s', boxShadow: finishForm.result === 1 ? '0 4px 6px -1px rgba(16, 185, 129, 0.2)' : 'none' }}>
                      <input type="radio" checked={finishForm.result === 1} onChange={() => setFinishForm({...finishForm, result: 1})} style={{ display: 'none' }} />
                      <CheckCircle size={20} /> CHỌN (PASS)
                    </label>

                    <label style={{ flex: 1, border: finishForm.result === 2 ? '2px solid #ef4444' : '1px solid var(--border)', background: finishForm.result === 2 ? '#fef2f2' : 'white', padding: '16px 12px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: finishForm.result === 2 ? '#ef4444' : 'var(--text-main)', transition: 'all 0.2s', boxShadow: finishForm.result === 2 ? '0 4px 6px -1px rgba(239, 68, 68, 0.2)' : 'none' }}>
                      <input type="radio" checked={finishForm.result === 2} onChange={() => setFinishForm({...finishForm, result: 2})} style={{ display: 'none' }} />
                      <XCircle size={20} /> LOẠI (FAIL)
                    </label>

                  </div>
                  <div style={{ margin: '12px 0 0 0', padding: '12px 16px', background: '#f8fafc', color: 'var(--text-sub)', borderRadius: 8, fontSize: 13, border: '1px solid var(--border)' }}>
                    <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}/>
                    <strong>Lưu ý:</strong> Nếu chọn PENDING, ứng viên vẫn ở lại cột "Đang PV". Chỉ khi chọn PASS/FAIL, ứng viên mới được chuyển vào danh sách "Lịch sử & Kết quả".
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'block' }}>Biên bản nhận xét (Evaluation) <RequiredStar/></label>
                  <textarea className="input-control" placeholder="Ghi chép chi tiết về điểm mạnh, điểm yếu, đánh giá chuyên môn, thái độ của ứng viên trong buổi phỏng vấn..." value={finishForm.evaluation} onChange={e => setFinishForm({...finishForm, evaluation: e.target.value})} style={{ flex: 1, minHeight: '200px', resize: 'none', background: '#f8fafc', fontSize: 15, padding: 16, lineHeight: 1.6 }} />
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', gap: 16 }}>
                  <button className="btn" style={{ flex: 1, padding: '18px', fontSize: 16, fontWeight: 600, background: '#f1f5f9', color: 'var(--text-main)' }} onClick={() => setShowFinishModal(false)}>
                    Hủy & Đóng
                  </button>
                  <button className="btn btn-primary" style={{ flex: 2, padding: '18px', fontSize: 16, fontWeight: 700, letterSpacing: 1 }} onClick={handleFinishInterview}>
                    {isUpdatingResult ? "LƯU CẬP NHẬT KẾT QUẢ" : "CHỐT KẾT QUẢ & HOÀN THÀNH"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 7.4 VIEW CHI TIẾT */}
      {showViewInterviewModal && viewingInterview && (
        <Modal title="Chi tiết Hồ sơ Phỏng vấn" onClose={() => setShowViewInterviewModal(false)}>
           <div style={{ fontSize: 15, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid var(--border)' }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary)' }}>{viewingInterview.applicantName}</h3>
              <div style={{ color: 'var(--text-sub)', fontSize: 14 }}>{viewingInterview.applicantEmail} | {viewingInterview.applicantPhone}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Kết quả:</strong> 
              {viewingInterview.result === 1 ? <span style={{ color: '#10b981', fontWeight: 700, fontSize: 16 }}>ĐẬU (PASS)</span> : viewingInterview.result === 2 ? <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 16 }}>RỚT (FAIL)</span> : <span style={{ color: '#f59e0b', fontWeight: 600 }}>ĐANG CHỜ</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Giám khảo:</strong> 
              <span style={{ fontWeight: 600 }}>{viewingInterview.evaluatorName || "N/A"}</span>
            </div>

            <div>
              <strong style={{ color: 'var(--text-sub)', display: 'block', marginBottom: 8 }}>Nhận xét chi tiết:</strong> 
              <div style={{ background: 'white', border: '1px solid var(--border)', padding: 12, borderRadius: 6, minHeight: 80, whiteSpace: 'pre-wrap', fontSize: 14 }}>
                {viewingInterview.evaluation || "Chưa có nhận xét nào được ghi lại."}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================
          8. EMAIL & RESULT MODALS (GIỮ NGUYÊN)
         ========================================= */}
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