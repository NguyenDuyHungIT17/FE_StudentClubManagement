import React from "react";
import Modal from "../common/Modal";
import { CheckCircle, AlertCircle, X } from "lucide-react";

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

  // Event props:
  showEventModal, setShowEventModal, eventForm, setEventForm,
  editingEvent, handleSaveEvent, showViewEventModal, setShowViewEventModal,
  viewingEvent, eventErrors, setEventErrors,

  //event registration
  showRegModal, setShowRegModal, regForm, setRegForm,
  editingReg, handleSaveReg, showViewRegModal, setShowViewRegModal,
  viewingReg, regErrors, setRegErrors, events, 
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
            
            {/* Ô HỌ TÊN */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Họ tên *</label>
              <input 
                className="input-control" 
                style={{ borderColor: userErrors?.fullName ? '#ef4444' : '' }} 
                placeholder="Nhập họ tên" 
                value={userForm.fullName} 
                onChange={e => {
                  setUserForm({ ...userForm, fullName: e.target.value });
                  if (userErrors?.fullName) setUserErrors({ ...userErrors, fullName: null });
                }} 
              />
              {userErrors?.fullName && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.fullName}</span>}
            </div>
            
            {/* Ô EMAIL */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Email *</label>
              <input 
                className="input-control" 
                style={{ borderColor: userErrors?.email ? '#ef4444' : '' }} 
                type="email" 
                placeholder="Nhập email" 
                value={userForm.email} 
                disabled={!!editingUser} 
                onChange={e => {
                  setUserForm({ ...userForm, email: e.target.value });
                  if (userErrors?.email) setUserErrors({ ...userErrors, email: null });
                }} 
              />
              {userErrors?.email && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.email}</span>}
            </div>

            {/* Ô MẬT KHẨU (CHỈ HIỆN KHI THÊM MỚI) */}
            {!editingUser && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mật khẩu *</label>
                <input 
                  className="input-control" 
                  style={{ borderColor: userErrors?.password ? '#ef4444' : '' }} 
                  type="password" 
                  placeholder="Nhập mật khẩu" 
                  value={userForm.password} 
                  onChange={e => {
                    setUserForm({ ...userForm, password: e.target.value });
                    if (userErrors?.password) setUserErrors({ ...userErrors, password: null });
                  }} 
                />
                {userErrors?.password && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.password}</span>}
              </div>
            )}

            {/* Ô CÂU LẠC BỘ (CHỈ HIỆN KHI THÊM MỚI) */}
            {!editingUser && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Thuộc Câu lạc bộ *</label>
                <select 
                  className="input-control" 
                  style={{ borderColor: userErrors?.clubId ? '#ef4444' : '' }} 
                  value={userForm.clubId} 
                  onChange={e => {
                    setUserForm({ ...userForm, clubId: e.target.value });
                    if (userErrors?.clubId) setUserErrors({ ...userErrors, clubId: null });
                  }}
                >
                  <option value="">-- Vui lòng chọn Câu lạc bộ --</option>
                  {clubs && clubs.map(c => (
                    <option key={c.clubId} value={c.clubId}>{c.clubName}</option>
                  ))}
                </select>
                {userErrors?.clubId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.clubId}</span>}
              </div>
            )}

            {/* Ô VAI TRÒ */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Vai trò *</label>
              <select 
                className="input-control" 
                style={{ borderColor: userErrors?.role ? '#ef4444' : '' }} 
                value={userForm.role} 
                onChange={e => {
                  setUserForm({ ...userForm, role: e.target.value });
                  if (userErrors?.role) setUserErrors({ ...userErrors, role: null });
                }}
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="member">Member</option>
                <option value="leader">Leader</option>
                <option value="admin">Admin</option>
              </select>
              {userErrors?.role && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.role}</span>}
            </div>

            {/* Ô TRẠNG THÁI */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Trạng thái *</label>
              <select 
                className="input-control" 
                style={{ borderColor: userErrors?.isActive ? '#ef4444' : '' }} 
                value={userForm.isActive} 
                onChange={e => {
                  setUserForm({ ...userForm, isActive: parseInt(e.target.value) });
                  if (userErrors?.isActive) setUserErrors({ ...userErrors, isActive: null });
                }}
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              {userErrors?.isActive && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{userErrors.isActive}</span>}
            </div>

            {/* NÚT LƯU */}
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
            
            {/* TÊN CLB */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên CLB *</label>
              <input 
                className="input-control" 
                style={{ borderColor: clubErrors?.clubName ? '#ef4444' : '' }}
                placeholder="Nhập tên CLB (VD: IT-Supporter)" 
                value={clubForm.clubName} 
                onChange={e => {
                  setClubForm({ ...clubForm, clubName: e.target.value });
                  if (clubErrors?.clubName) setClubErrors({ ...clubErrors, clubName: null });
                }} 
              />
              {clubErrors?.clubName && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{clubErrors.clubName}</span>}
            </div>
            
            {/* TIÊU ĐỀ */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tiêu đề (Title) *</label>
              <input 
                className="input-control" 
                style={{ borderColor: clubErrors?.title ? '#ef4444' : '' }}
                placeholder="Nhập tiêu đề" 
                value={clubForm.title} 
                onChange={e => {
                  setClubForm({ ...clubForm, title: e.target.value });
                  if (clubErrors?.title) setClubErrors({ ...clubErrors, title: null });
                }} 
              />
              {clubErrors?.title && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{clubErrors.title}</span>}
            </div>

            {/* MÔ TẢ */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mô tả</label>
              <textarea 
                className="input-control" 
                style={{ borderColor: clubErrors?.description ? '#ef4444' : '' }}
                placeholder="Mô tả ngắn gọn" rows={4} 
                value={clubForm.description} 
                onChange={e => {
                  setClubForm({ ...clubForm, description: e.target.value });
                  if (clubErrors?.description) setClubErrors({ ...clubErrors, description: null });
                }} 
              />
              {clubErrors?.description && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{clubErrors.description}</span>}
            </div>
            
            {/* TRƯỞNG CLB */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Trưởng CLB (Tuỳ chọn)</label>
              <select 
                className="input-control" 
                style={{ borderColor: clubErrors?.leaderId ? '#ef4444' : '' }}
                value={clubForm.leaderId || ""} 
                onChange={e => {
                  setClubForm({ ...clubForm, leaderId: e.target.value });
                  if (clubErrors?.leaderId) setClubErrors({ ...clubErrors, leaderId: null });
                }}
              >
                <option value="">-- Chưa có Trưởng CLB (Bỏ trống) --</option>
                {users && users.filter(u => u.role === 'leader' || u.role === 'admin').map(u => (
                  <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>
                ))}
              </select>
              {clubErrors?.leaderId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{clubErrors.leaderId}</span>}
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
            
            {/* CÂU LẠC BỘ */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ *</label>
              <select 
                className="input-control" 
                style={{ 
                  borderColor: memberErrors?.clubId ? '#ef4444' : '',
                  backgroundColor: editingMember ? '#f3f4f6' : 'white',
                  cursor: editingMember ? 'not-allowed' : 'auto'
                }} 
                value={memberForm.clubId || ""} 
                disabled={!!editingMember} // KHÓA KHI ĐANG SỬA
                onChange={e => { 
                  setMemberForm({ ...memberForm, clubId: e.target.value }); 
                  if (memberErrors?.clubId) setMemberErrors({ ...memberErrors, clubId: null }); 
                }}
              >
                <option value="">-- Chọn Câu lạc bộ --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
              {memberErrors?.clubId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{memberErrors.clubId}</span>}
            </div>

            {/* TÀI KHOẢN USER */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tài khoản User *</label>
              <select 
                className="input-control" 
                style={{ 
                  borderColor: memberErrors?.userId ? '#ef4444' : '',
                  backgroundColor: editingMember ? '#f3f4f6' : 'white',
                  cursor: editingMember ? 'not-allowed' : 'auto'
                }} 
                value={memberForm.userId || ""} 
                disabled={!!editingMember} // KHÓA KHI ĐANG SỬA
                onChange={e => { 
                  setMemberForm({ ...memberForm, userId: e.target.value }); 
                  if (memberErrors?.userId) setMemberErrors({ ...memberErrors, userId: null }); 
                }}
              >
                <option value="">-- Chọn Người dùng --</option>
                {users && users.map(u => <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>)}
              </select>
              {memberErrors?.userId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{memberErrors.userId}</span>}
            </div>

            {/* VAI TRÒ TRONG CLB */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Vai trò trong CLB *</label>
              <select 
                className="input-control" 
                style={{ borderColor: memberErrors?.memberRole ? '#ef4444' : '' }} 
                value={memberForm.memberRole} 
                onChange={e => { 
                  setMemberForm({ ...memberForm, memberRole: e.target.value }); 
                  if (memberErrors?.memberRole) setMemberErrors({ ...memberErrors, memberRole: null }); 
                }}
              >
                <option value="member">Thành viên (Member)</option>
                <option value="leader">Trưởng CLB (Leader)</option>
              </select>
              {memberErrors?.memberRole && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{memberErrors.memberRole}</span>}
            </div>

            {/* NGÀY THAM GIA */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Ngày tham gia</label>
              <input 
                type="datetime-local" 
                className="input-control" 
                value={memberForm.joinAt} 
                onChange={e => setMemberForm({ ...memberForm, joinAt: e.target.value })} 
              />
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveMember}>
              {editingMember ? "Cập nhật" : "Thêm vào CLB"}
            </button>
          </div>
        </Modal>
      )}

      {/* 3.2 VIEW MEMBER */}
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

      {/* ========================================= */}
      {/* 4. MODALS CHO SỰ KIỆN (EVENTS)            */}
      {/* ========================================= */}
      
      {/* 4.1 ADD/EDIT EVENT */}
      {showEventModal && (
        <Modal title={editingEvent ? "Sửa Sự kiện" : "Tạo Sự kiện mới"} onClose={() => setShowEventModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ tổ chức *</label>
              <select className="input-control" style={{ borderColor: eventErrors?.clubId ? '#ef4444' : '', backgroundColor: editingEvent ? '#f3f4f6' : 'white', cursor: editingEvent ? 'not-allowed' : 'auto' }} value={eventForm.clubId || ""} disabled={!!editingEvent} onChange={e => { setEventForm({ ...eventForm, clubId: e.target.value }); if (eventErrors?.clubId) setEventErrors({ ...eventErrors, clubId: null }); }}>
                <option value="">-- Chọn Câu lạc bộ --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
              {eventErrors?.clubId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{eventErrors.clubId}</span>}
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên sự kiện *</label>
              <input type="text" className="input-control" style={{ borderColor: eventErrors?.title ? '#ef4444' : '' }} placeholder="Nhập tên sự kiện..." value={eventForm.title} onChange={e => { setEventForm({ ...eventForm, title: e.target.value }); if (eventErrors?.title) setEventErrors({ ...eventErrors, title: null }); }} />
              {eventErrors?.title && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{eventErrors.title}</span>}
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Thời gian diễn ra *</label>
              <input type="datetime-local" className="input-control" style={{ borderColor: eventErrors?.eventDate ? '#ef4444' : '' }} value={eventForm.eventDate} onChange={e => { setEventForm({ ...eventForm, eventDate: e.target.value }); if (eventErrors?.eventDate) setEventErrors({ ...eventErrors, eventDate: null }); }} />
              {eventErrors?.eventDate && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{eventErrors.eventDate}</span>}
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Phạm vi</label>
                <select className="input-control" value={eventForm.isPrivate} onChange={e => setEventForm({ ...eventForm, isPrivate: e.target.value === 'true' })}>
                  <option value={'true'}>Nội bộ CLB</option>
                  <option value={'false'}>Công khai</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mức ưu tiên</label>
                <select className="input-control" value={eventForm.priority} onChange={e => setEventForm({ ...eventForm, priority: parseInt(e.target.value) })}>
                  <option value={1}>Thấp (Low)</option>
                  <option value={2}>Trung bình (Medium)</option>
                  <option value={3}>Cao (High)</option>
                  <option value={4}>Khẩn cấp (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Mô tả chi tiết</label>
              <textarea className="input-control" rows={4} placeholder="Nội dung sự kiện..." value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} />
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveEvent}>{editingEvent ? "Cập nhật Sự kiện" : "Tạo Sự kiện"}</button>
          </div>
        </Modal>
      )}

      {/* 4.2 VIEW EVENT */}
      {showViewEventModal && viewingEvent && (
        <Modal title="Chi tiết Sự kiện" onClose={() => setShowViewEventModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: 14 }}>
            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: 18 }}>{viewingEvent.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>ID Sự kiện:</strong> <span>#{viewingEvent.id}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Thời gian:</strong> <span>{viewingEvent.eventDate ? new Date(viewingEvent.eventDate).toLocaleString('vi-VN') : "Chưa cập nhật"}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong style={{ color: 'var(--text-sub)' }}>Phạm vi:</strong> <span><span className={`badge ${viewingEvent.isPrivate ? 'warning' : 'success'}`}>{viewingEvent.isPrivate ? 'Nội bộ' : 'Công khai'}</span></span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Mức ưu tiên:</strong> 
              <span style={{ 
                color: viewingEvent.priority === 4 ? '#ef4444' : // Khẩn cấp -> Đỏ
                       viewingEvent.priority === 3 ? '#f59e0b' : // Cao -> Cam
                       viewingEvent.priority === 2 ? '#3b82f6' : // Trung bình -> Xanh
                       '#6b7280', fontWeight: 600                // Thấp -> Xám
              }}>
                {viewingEvent.priority === 1 ? 'Thấp' : 
                 viewingEvent.priority === 2 ? 'Trung bình' : 
                 viewingEvent.priority === 3 ? 'Cao' : 
                 viewingEvent.priority === 4 ? 'Khẩn cấp' : viewingEvent.priority}
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

      {/* ========================================= */}
      {/* 5. MODALS CHO ĐĂNG KÝ SỰ KIỆN (REGISTRATIONS) */}
      {/* ========================================= */}
      
      {/* 5.1 ADD/EDIT REGISTRATION */}
      {showRegModal && (
        <Modal title={editingReg ? "Cập nhật Đăng ký" : "Đăng ký Tham gia"} onClose={() => setShowRegModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* CHỌN SỰ KIỆN */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Sự kiện đăng ký *</label>
              <select className="input-control" style={{ borderColor: regErrors?.eventId ? '#ef4444' : '', backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} value={regForm.eventId || ""} disabled>
                {events && events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>

            {/* TOGGLE LOẠI NGƯỜI DÙNG */}
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

            {/* RENDER FORM DỰA VÀO LOẠI NGƯỜI DÙNG */}
            {!regForm.isGuest ? (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Chọn Tài khoản User *</label>
                <select className="input-control" style={{ borderColor: regErrors?.userId ? '#ef4444' : '', backgroundColor: editingReg ? '#f3f4f6' : 'white' }} value={regForm.userId || ""} disabled={!!editingReg} onChange={e => { setRegForm({ ...regForm, userId: e.target.value }); if (regErrors?.userId) setRegErrors({ ...regErrors, userId: null }); }}>
                  <option value="">-- Chọn User --</option>
                  {users && users.map(u => <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>)}
                </select>
                {regErrors?.userId && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{regErrors.userId}</span>}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên Khách *</label>
                  <input type="text" className="input-control" style={{ borderColor: regErrors?.guestName ? '#ef4444' : '' }} placeholder="Nhập tên..." value={regForm.guestName} onChange={e => { setRegForm({ ...regForm, guestName: e.target.value }); if (regErrors?.guestName) setRegErrors({ ...regErrors, guestName: null }); }} />
                  {regErrors?.guestName && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{regErrors.guestName}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Email Khách *</label>
                  <input type="email" className="input-control" style={{ borderColor: regErrors?.guestEmail ? '#ef4444' : '' }} placeholder="Nhập email..." value={regForm.guestEmail} onChange={e => { setRegForm({ ...regForm, guestEmail: e.target.value }); if (regErrors?.guestEmail) setRegErrors({ ...regErrors, guestEmail: null }); }} />
                  {regErrors?.guestEmail && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{regErrors.guestEmail}</span>}
                </div>
              </div>
            )}

            {/* MỨC ĐỘ QUAN TÂM (IsCare) */}
            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>
                {/* Checkbox ánh xạ: 1 là Có quan tâm, 0 là Không */}
                <input 
                  type="checkbox" 
                  checked={regForm.isCare === 1} 
                  onChange={e => setRegForm({ ...regForm, isCare: e.target.checked ? 1 : 0 })} 
                  style={{ width: 16, height: 16 }} 
                />
                Khách có quan tâm đến Sự kiện
              </label>
            </div>

            {/* TRẠNG THÁI ĐIỂM DANH */}
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

      {/* 5.2 VIEW REGISTRATION DETAILS */}
      {showViewRegModal && viewingReg && (
        <Modal title="Chi tiết Đăng ký Tham gia" onClose={() => setShowViewRegModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: 14 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>ID Đăng ký:</strong> 
              <span style={{ fontWeight: 600 }}>#{viewingReg.id}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Sự kiện:</strong> 
              <span>{events?.find(e => e.id === viewingReg.eventId)?.title || `ID Sự kiện: ${viewingReg.eventId}`}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Loại tài khoản:</strong> 
              <span>
                <span className={`badge ${viewingReg.userId && viewingReg.userId > 0 ? 'primary' : 'warning'}`}>
                  {viewingReg.userId && viewingReg.userId > 0 ? 'Thành viên Hệ thống' : 'Khách vãng lai'}
                </span>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Người tham gia:</strong> 
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {viewingReg.userId && viewingReg.userId > 0 
                  ? (users?.find(u => u.userId === viewingReg.userId)?.fullName || `User ID: ${viewingReg.userId}`) 
                  : viewingReg.guestName}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Email liên hệ:</strong> 
              <span>
                {viewingReg.userId && viewingReg.userId > 0 
                  ? (users?.find(u => u.userId === viewingReg.userId)?.email || "N/A") 
                  : viewingReg.guestEmail}
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Mức độ quan tâm:</strong> 
              <span>{viewingReg.isCare === 1 ? <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Có quan tâm</span> : 'Không quan tâm'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Trạng thái:</strong> 
              <span>
                <span className={`badge ${viewingReg.checkedIn ? 'success' : 'error'}`}>
                  {viewingReg.checkedIn ? 'Đã đến (Check-in)' : 'Chưa đến'}
                </span>
              </span>
            </div>

            {viewingReg.checkedIn && viewingReg.checkName && (
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
                <strong style={{ color: 'var(--text-sub)' }}>Người điểm danh:</strong> 
                <span>{viewingReg.checkName}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
              <strong style={{ color: 'var(--text-sub)' }}>Ngày đăng ký:</strong> 
              <span>{viewingReg.registeredAt ? new Date(viewingReg.registeredAt).toLocaleString('vi-VN') : "Chưa cập nhật"}</span>
            </div>

          </div>
        </Modal>
      )}

      {/* VIEW MODAL (Cơ bản tương tự các view khác) */}
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