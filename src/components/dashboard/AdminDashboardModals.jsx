import React, { useCallback } from "react";
import Modal from "../common/Modal";
import { CheckCircle, AlertCircle, X, FileText, XCircle, UserCheck, UploadCloud } from "lucide-react";
import PhotoGallery from "../common/PhotoGallery";

// 👉 TÁCH RIÊNG COMPONENT ĐỂ MEMOIZE
const MultiImageUploader = React.memo(({ formState, setFormState, entityType = "user" }) => {
  const files = formState.uploadFiles || [];
  const existingPhotos = formState.existingPhotos || [];
  const isUserUploader = entityType === "user";

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({ file, title: "", type: entityType === "club" ? "1" : entityType === "event" ? "2" : "1" }));
    setFormState(prev => ({ ...prev, uploadFiles: [...files, ...newFiles] }));
    e.target.value = null; 
  }, [files, setFormState, entityType]);

  const removeFile = useCallback((indexToRemove) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFormState(prev => ({ ...prev, uploadFiles: newFiles }));
  }, [files, setFormState]);

  const updateFileTitle = useCallback((index, title) => {
    const newFiles = [...files];
    newFiles[index].title = title;
    setFormState(prev => ({ ...prev, uploadFiles: newFiles }));
  }, [files, setFormState]);

  const updateFileType = useCallback((index, type) => {
    const newFiles = [...files];
    newFiles[index].type = type;
    setFormState(prev => ({ ...prev, uploadFiles: newFiles }));
  }, [files, setFormState]);

  return (
    <div style={{ marginTop: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 8, display: 'block' }}>
        Ảnh đính kèm (Có thể chọn nhiều)
      </label>
      
      <div style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: '20px', textAlign: 'center', background: '#f8fafc', position: 'relative', transition: '0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
        <UploadCloud size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 600 }}>Click để chọn ảnh hoặc Kéo thả vào đây</div>
        <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4 }}>Hỗ trợ JPG, PNG, WEBP</div>
        <input type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
      </div>

      {existingPhotos.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 10 }}>
            Ảnh hiện có
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {existingPhotos.map((photo) => {
              const pid = photo.photoId || photo.id;
              return (
                <div key={pid} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                  <img src={photo.url} alt={photo.title || 'photo'} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {photo.title || 'Không có tiêu đề'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-sub)', marginTop: 4 }}>
                      {Number(photo.type) === 1 ? 'Main' : Number(photo.type) === 2 ? 'Cover' : Number(photo.type) === 3 ? 'Side' : 'Other'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {files.map((item, index) => {
            const objectUrl = URL.createObjectURL(item.file);
            return (
              <ImageUploadItem 
                key={index}
                item={item}
                index={index}
                objectUrl={objectUrl}
                onTitleChange={updateFileTitle}
                onTypeChange={updateFileType}
                onRemove={removeFile}
                titleAsTextarea={isUserUploader}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});

MultiImageUploader.displayName = "MultiImageUploader";

// 👉 COMPONENT CHO TỪNG ẢNH
const ImageUploadItem = React.memo(({ item, index, objectUrl, onTitleChange, onTypeChange, onRemove, titleAsTextarea = false }) => (
  <div style={{ display: 'flex', gap: 12, padding: 12, border: '1px solid var(--border)', borderRadius: 8, background: '#f8fafc' }}>
    <img src={objectUrl} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {titleAsTextarea ? (
        <textarea
          placeholder="Nhập tiêu đề ảnh (có thể xuống dòng)"
          value={item.title}
          onChange={(e) => onTitleChange(index, e.target.value)}
          rows={3}
          style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, resize: 'vertical' }}
        />
      ) : (
        <input 
          type="text" 
          placeholder="Nhập tiêu đề ảnh" 
          value={item.title} 
          onChange={(e) => onTitleChange(index, e.target.value)}
          style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13 }}
        />
      )}
      <select 
        value={item.type} 
        onChange={(e) => onTypeChange(index, e.target.value)}
        style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13 }}
      >
        <option value="1">Main (Chính)</option>
        <option value="2">Cover (Bìa)</option>
        <option value="3">Side (Phụ)</option>
      </select>
      <button 
        type="button" 
        onClick={() => onRemove(index)} 
        style={{ alignSelf: 'flex-start', background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
      >
        Xóa
      </button>
    </div>
  </div>
));

ImageUploadItem.displayName = "ImageUploadItem";

const AdminDashboardModals = ({
  showUserModal, setShowUserModal, userForm, setUserForm, handleSaveUser, editingUser,
  showViewUserModal, setShowViewUserModal, viewingUser, userErrors, setUserErrors,
  
  showClubModal, setShowClubModal, clubForm, setClubForm, handleSaveClub, editingClub, users, leaderUsers, clubs,
  showViewClubModal, setShowViewClubModal, viewingClub, clubErrors, setClubErrors,
  
  showMemberModal, setShowMemberModal, memberForm, setMemberForm, editingMember, handleSaveMember, 
  showViewMemberModal, setShowViewMemberModal, viewingMember, memberErrors, setMemberErrors,
  
  showEventModal, setShowEventModal, eventForm, setEventForm, editingEvent, handleSaveEvent, 
  showViewEventModal, setShowViewEventModal, viewingEvent, eventErrors, setEventErrors,
  
  showRegModal, setShowRegModal, regForm, setRegForm, editingReg, handleSaveReg, 
  showViewRegModal, setShowViewRegModal, viewingReg, regErrors, setRegErrors, events, 
  
  showCampaignModal, setShowCampaignModal, campaignForm, setCampaignForm, editingCampaign, handleSaveCampaign, 
  showViewCampaignModal, setShowViewCampaignModal, viewingCampaign, campaignErrors, setCampaignErrors, campaigns,
  
  showInterviewModal, setShowInterviewModal, interviewForm, setInterviewForm, editingInterview, handleSaveInterview, interviewErrors, setInterviewErrors,
  showStartModal, setShowStartModal, startForm, setStartForm, handleStartInterview, startErrors, setStartErrors,
  showFinishModal, setShowFinishModal, finishForm, setFinishForm, handleFinishInterview, finishErrors, setFinishErrors, isUpdatingResult,
  showViewInterviewModal, setShowViewInterviewModal, viewingInterview,
  
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
        input[type="datetime-local"]::-webkit-calendar-picker-indicator { opacity: 1 !important; display: block !important; cursor: pointer !important; filter: invert(0.6) !important; }
      `}</style>

      {/* ================= USER MODALS ================= */}
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
            
            <MultiImageUploader formState={userForm} setFormState={setUserForm} entityType="user" />

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
          <PhotoGallery entityType="user" entityId={viewingUser.userId} readOnly={true} />
          <button className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)', marginTop: 24 }} onClick={() => setShowViewUserModal(false)}>Đóng</button>
        </Modal>
      )}

      {/* ================= CLUB MODALS ================= */}
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
              <select className="input-control" style={{ borderColor: clubErrors?.leaderId ? '#ef4444' : '' }} value={clubForm.leaderId ?? ""} onChange={e => { setClubForm({ ...clubForm, leaderId: e.target.value }); if (clubErrors?.leaderId) setClubErrors({ ...clubErrors, leaderId: null }); }}>
                <option value="">-- Chưa có Trưởng CLB (Bỏ trống) --</option>
                {(leaderUsers?.length ? leaderUsers : users?.filter(u => ['leader', 'admin'].includes(String(u.role || '').toLowerCase())) || []).map(u => ( <option key={u.userId} value={String(u.userId)}>{u.fullName} ({u.email})</option> ))}
              </select>
            </div>
            
            <MultiImageUploader formState={clubForm} setFormState={setClubForm} entityType="club" />

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
          <PhotoGallery entityType="club" entityId={viewingClub.clubId} />
          <button className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)', marginTop: 24 }} onClick={() => setShowViewClubModal(false)}>Đóng</button>
        </Modal>
      )}

      {/* ================= MEMBER MODALS ================= */}
      {showMemberModal && (
        <Modal title={editingMember ? "Sửa Thành viên" : "Thêm Thành viên"} onClose={() => setShowMemberModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: memberErrors?.clubId ? '#ef4444' : '', backgroundColor: editingMember ? '#f3f4f6' : 'white', cursor: editingMember ? 'not-allowed' : 'auto' }} value={memberForm.clubId || ""} disabled={!!editingMember} onChange={e => { setMemberForm({ ...memberForm, clubId: e.target.value }); if (memberErrors?.clubId) setMemberErrors({ ...memberErrors, clubId: null }); }}>
                <option value="">-- Chọn Câu lạc bộ --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tài khoản User <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: memberErrors?.userId ? '#ef4444' : '', backgroundColor: editingMember ? '#f3f4f6' : 'white', cursor: editingMember ? 'not-allowed' : 'auto' }} value={memberForm.userId || ""} disabled={!!editingMember} onChange={e => { setMemberForm({ ...memberForm, userId: e.target.value }); if (memberErrors?.userId) setMemberErrors({ ...memberErrors, userId: null }); }}>
                <option value="">-- Chọn Người dùng --</option>
                {users && users.map(u => <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Vai trò trong CLB <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: memberErrors?.memberRole ? '#ef4444' : '' }} value={memberForm.memberRole} onChange={e => { setMemberForm({ ...memberForm, memberRole: e.target.value }); if (memberErrors?.memberRole) setMemberErrors({ ...memberErrors, memberRole: null }); }}>
                <option value="member">Thành viên (Member)</option>
                <option value="leader">Trưởng CLB (Leader)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Ngày tham gia</label>
              <input type="datetime-local" className="input-control" style={{ colorScheme: 'light' }} value={memberForm.joinAt} onChange={e => setMemberForm({ ...memberForm, joinAt: e.target.value })} />
            </div>
            
            <MultiImageUploader formState={memberForm} setFormState={setMemberForm} entityType="member" />

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
          <PhotoGallery entityType="clubMember" entityId={viewingMember.clubMemberId} />
        </Modal>
      )}

      {/* ================= EVENT MODALS ================= */}
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
            
            <MultiImageUploader formState={eventForm} setFormState={setEventForm} entityType="event" />

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
            <PhotoGallery entityType="event" entityId={viewingEvent.id} />
          </div>
        </Modal>
      )}

      {/* ================= REGISTRATION MODALS ================= */}
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
              </div>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên Khách <RequiredStar/></label>
                  <input type="text" className="input-control" style={{ borderColor: regErrors?.guestName ? '#ef4444' : '' }} placeholder="Nhập tên..." value={regForm.guestName} onChange={e => { setRegForm({ ...regForm, guestName: e.target.value }); if (regErrors?.guestName) setRegErrors({ ...regErrors, guestName: null }); }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Email Khách <RequiredStar/></label>
                  <input type="email" className="input-control" style={{ borderColor: regErrors?.guestEmail ? '#ef4444' : '' }} placeholder="Nhập email..." value={regForm.guestEmail} onChange={e => { setRegForm({ ...regForm, guestEmail: e.target.value }); if (regErrors?.guestEmail) setRegErrors({ ...regErrors, guestEmail: null }); }} />
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

      {/* ================= CAMPAIGN MODALS ================= */}
      {showCampaignModal && (
        <Modal title={editingCampaign ? "Sửa Đợt Tuyển" : "Tạo Đợt Tuyển Mới"} onClose={() => setShowCampaignModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: campaignErrors?.clubId ? '#ef4444' : '', backgroundColor: editingCampaign ? '#f3f4f6' : 'white', cursor: editingCampaign ? 'not-allowed' : 'auto' }} value={campaignForm.clubId || ""} disabled={!!editingCampaign} onChange={e => { setCampaignForm({ ...campaignForm, clubId: e.target.value }); if (campaignErrors?.clubId) setCampaignErrors({ ...campaignErrors, clubId: null }); }}>
                <option value="">-- Chọn Câu lạc bộ --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Tên Đợt tuyển (VD: Tuyển Gen 10) <RequiredStar/></label>
              <input type="text" className="input-control" style={{ borderColor: campaignErrors?.title ? '#ef4444' : '' }} value={campaignForm.title} onChange={e => { setCampaignForm({ ...campaignForm, title: e.target.value }); if (campaignErrors?.title) setCampaignErrors({ ...campaignErrors, title: null }); }} />
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Ngày bắt đầu</label>
                <input type="date" className="input-control" style={{ colorScheme: 'light', borderColor: campaignErrors?.startDate ? '#ef4444' : '' }} value={campaignForm.startDate} onChange={e => { setCampaignForm({ ...campaignForm, startDate: e.target.value }); if (campaignErrors?.startDate) setCampaignErrors({ ...campaignErrors, startDate: null }); }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Ngày kết thúc</label>
                <input type="date" className="input-control" style={{ colorScheme: 'light', borderColor: campaignErrors?.endDate ? '#ef4444' : '' }} value={campaignForm.endDate} onChange={e => { setCampaignForm({ ...campaignForm, endDate: e.target.value }); if (campaignErrors?.endDate) setCampaignErrors({ ...campaignErrors, endDate: null }); }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Trạng thái <RequiredStar/></label>
              <select className="input-control" value={campaignForm.isActive ? "true" : "false"} onChange={e => setCampaignForm({ ...campaignForm, isActive: e.target.value === 'true' })}>
                <option value="true">Đang mở (Active)</option>
                <option value="false">Đã đóng</option>
              </select>
            </div>

            <MultiImageUploader formState={campaignForm} setFormState={setCampaignForm} entityType="campaign" />
            
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
          <PhotoGallery entityType="campaign" entityId={viewingCampaign.campaignId} readOnly={true} />
        </Modal>
      )}

      {/* ================= INTERVIEWS MODALS ================= */}
      {showInterviewModal && (
        <Modal title={editingInterview ? "Sửa Ứng Viên" : "Tạo Walk-in Mới"} onClose={() => setShowInterviewModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Câu lạc bộ <RequiredStar/></label>
              <select className="input-control" style={{ borderColor: interviewErrors?.clubId ? '#ef4444' : '' }} value={interviewForm.clubId} disabled={!!editingInterview} onChange={e => { setInterviewForm({...interviewForm, clubId: e.target.value, campaignId: ""}); if (interviewErrors?.clubId) setInterviewErrors({...interviewErrors, clubId: null}); }}>
                <option value="">-- Chọn CLB --</option>
                {clubs && clubs.map(c => <option key={c.clubId} value={c.clubId}>{c.clubName}</option>)}
              </select>
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

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4, display: 'block' }}>Thời gian Phỏng vấn dự kiến</label>
              <input type="datetime-local" className="input-control" style={{ colorScheme: 'light', borderColor: interviewErrors?.interviewDate ? '#ef4444' : '' }} value={interviewForm.interviewDate} onChange={e => { setInterviewForm({...interviewForm, interviewDate: e.target.value}); if (interviewErrors?.interviewDate) setInterviewErrors({...interviewErrors, interviewDate: null}); }} />
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSaveInterview}>Lưu Thông tin</button>
          </div>
        </Modal>
      )}

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
            </div>

            <button className="btn btn-primary" onClick={handleStartInterview}>Vào Phỏng Vấn</button>
          </div>
        </Modal>
      )}

      {/* FULL SCREEN WORKSPACE ĐÁNH GIÁ */}
      {showFinishModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', width: '95vw', maxWidth: '1400px', height: '90vh', borderRadius: 16, display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={24} /> {isUpdatingResult ? "CẬP NHẬT KẾT QUẢ ĐÁNH GIÁ" : "WORKSPACE ĐÁNH GIÁ ỨNG VIÊN"}
              </h2>
              <button onClick={() => setShowFinishModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.2s' }}>
                <X size={24} color="var(--text-sub)"/>
              </button>
            </div>
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ flex: '0 0 450px', borderRight: '1px solid var(--border)', padding: 32, overflowY: 'auto', background: '#f1f5f9' }}>
                <div style={{ background: 'white', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ background: '#eff6ff', padding: 12, borderRadius: '50%' }}><UserCheck size={28} color="var(--primary)"/></div>
                    <h3 style={{ margin: 0, fontSize: 22, color: 'var(--text-main)' }}>{finishForm.applicantName || "Đang tải..."}</h3>
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div><strong>Email:</strong> {finishForm.applicantEmail || "N/A"}</div>
                    <div><strong>SĐT:</strong> {finishForm.applicantPhone || "N/A"}</div>
                  </div>
                </div>
                
                <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-main)', fontSize: 16 }}>🎯 Ngân hàng Câu hỏi Gợi ý</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}><strong>Ice-breaker:</strong> Hãy giới thiệu 3 từ mô tả chính xác nhất về bản thân bạn?</div>
                  <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}><strong>Kinh nghiệm:</strong> Kể về một dự án hoặc bài tập khó khăn nhất bạn từng tham gia và cách bạn vượt qua?</div>
                </div>
              </div>
              
              <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, background: 'white' }}>
                <div>
                  <label style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'block' }}>Quyết định cuối cùng <RequiredStar/></label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <label style={{ flex: 1, border: finishForm.result === 0 ? '2px solid #f59e0b' : '1px solid var(--border)', background: finishForm.result === 0 ? '#fffbeb' : 'white', padding: '16px 12px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: finishForm.result === 0 ? '#f59e0b' : 'var(--text-main)' }}>
                      <input type="radio" checked={finishForm.result === 0} onChange={() => setFinishForm({...finishForm, result: 0})} style={{ display: 'none' }} />
                      <AlertCircle size={20} /> PENDING
                    </label>
                    <label style={{ flex: 1, border: finishForm.result === 1 ? '2px solid #10b981' : '1px solid var(--border)', background: finishForm.result === 1 ? '#f0fdf4' : 'white', padding: '16px 12px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: finishForm.result === 1 ? '#10b981' : 'var(--text-main)' }}>
                      <input type="radio" checked={finishForm.result === 1} onChange={() => setFinishForm({...finishForm, result: 1})} style={{ display: 'none' }} />
                      <CheckCircle size={20} /> CHỌN (PASS)
                    </label>
                    <label style={{ flex: 1, border: finishForm.result === 2 ? '2px solid #ef4444' : '1px solid var(--border)', background: finishForm.result === 2 ? '#fef2f2' : 'white', padding: '16px 12px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: finishForm.result === 2 ? '#ef4444' : 'var(--text-main)' }}>
                      <input type="radio" checked={finishForm.result === 2} onChange={() => setFinishForm({...finishForm, result: 2})} style={{ display: 'none' }} />
                      <XCircle size={20} /> LOẠI (FAIL)
                    </label>
                  </div>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'block' }}>Biên bản nhận xét (Evaluation) <RequiredStar/></label>
                  <textarea className="input-control" value={finishForm.evaluation} onChange={e => setFinishForm({...finishForm, evaluation: e.target.value})} style={{ flex: 1, minHeight: '200px', resize: 'none', background: '#f8fafc', fontSize: 15, padding: 16 }} />
                </div>
                
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', gap: 16 }}>
                  <button className="btn" style={{ flex: 1, padding: '18px', fontSize: 16, fontWeight: 600, background: '#f1f5f9' }} onClick={() => setShowFinishModal(false)}>Hủy & Đóng</button>
                  <button className="btn btn-primary" style={{ flex: 2, padding: '18px', fontSize: 16, fontWeight: 700 }} onClick={handleFinishInterview}>{isUpdatingResult ? "LƯU CẬP NHẬT KẾT QUẢ" : "CHỐT KẾT QUẢ"}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* ================= EMAIL & RESULT ================= */}
      {showEmailModal && (
        <Modal title="Gửi Email Thông báo" onClose={() => setShowEmailModal(false)} maxWidth="420px">
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ marginBottom: 24, color: 'var(--text-main)' }}>Bạn muốn gửi email thông báo kết quả cho nhóm ứng viên nào?</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn" style={{ flex: 1, background: '#10b981', color: 'white', justifyContent: 'center' }} onClick={() => handleSendEmail('Pass')} disabled={emailSending}>{emailSending ? 'Đang gửi...' : 'Gửi cho Pass'}</button>
              <button className="btn" style={{ flex: 1, background: '#ef4444', color: 'white', justifyContent: 'center' }} onClick={() => handleSendEmail('Fail')} disabled={emailSending}>{emailSending ? 'Đang gửi...' : 'Gửi cho Fail'}</button>
            </div>
          </div>
        </Modal>
      )}

      {showResultModal && emailResult && (
        <Modal title="Thông báo" onClose={handleResultOk} maxWidth="400px">
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{emailResult.success ? (<CheckCircle size={64} color="#10b981" />) : (<AlertCircle size={64} color="#ef4444" />)}</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 20, color: emailResult.success ? '#10b981' : '#ef4444' }}>{emailResult.success ? "Thành công!" : "Có lỗi xảy ra!"}</h3>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-hover)', padding: 12, borderRadius: 8 }}>{emailResult.message}</p>
            <button className="btn btn-primary" style={{ margin: '24px auto 0', width: '100%', justifyContent: 'center' }} onClick={handleResultOk}>Đóng và Quay lại</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminDashboardModals;