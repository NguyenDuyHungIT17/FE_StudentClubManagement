import React, { useState, useRef } from 'react';
import { Send, X, MessageCircle, AlertCircle } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

/**
 * Component for guests to chat with club leaders
 * @param {string} clubId - ID của câu lạc bộ
 * @param {string} clubName - Tên câu lạc bộ
 */
const GuestChatWidget = ({ clubId, clubName = 'Chat CLB' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const { isConnected, isLoading, error, sendGuestMessage, clearError } = useChat(clubId);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!guestName.trim()) {
      alert('Vui lòng nhập tên của bạn');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      alert('Vui lòng nhập email hợp lệ');
      return;
    }
    if (!messageInput.trim()) {
      alert('Vui lòng nhập nội dung tin nhắn');
      return;
    }

    sendGuestMessage(messageInput, guestName, guestEmail);
    setMessageSent(true);
    
    // Reset sau 2s
    setTimeout(() => {
      setGuestName('');
      setGuestEmail('');
      setMessageInput('');
      setIsOpen(false);
      setMessageSent(false);
    }, 2000);
  };

  if (!clubId) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="guest-chat-button"
          style={{
            position: 'fixed',
            bottom: '110px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 998,
            transition: 'all 0.3s ease',
            fontSize: '24px'
          }}
          title="Chat với leader"
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '400px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 5px 40px rgba(0, 0, 0, 0.16)',
            padding: '24px',
            zIndex: 999,
            animation: 'slideUp 0.3s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              Liên hệ với {clubName}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: '#6b7280'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Success Message */}
          {messageSent ? (
            <div
              style={{
                padding: '20px',
                background: '#d1fae5',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#065f46'
              }}
            >
              <p style={{ margin: 0, fontWeight: '600' }}>✅ Tin nhắn đã được gửi!</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                Leader sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>
            </div>
          ) : (
            <>
              {/* Info Alert */}
              <div
                style={{
                  padding: '12px',
                  background: '#eff6ff',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start'
                }}
              >
                <AlertCircle size={16} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>
                  Gửi tin nhắn đến leader của câu lạc bộ. Bạn không cần đăng nhập.
                </p>
              </div>

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Tên của bạn *"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />

                <input
                  type="email"
                  placeholder="Email của bạn *"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />

                <textarea
                  placeholder="Nội dung tin nhắn *"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    minHeight: '100px',
                    resize: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />

                {error && (
                  <div
                    style={{
                      padding: '10px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      borderRadius: '6px',
                      fontSize: '13px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>⚠️ {error}</span>
                    <button
                      onClick={clearError}
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSend}
                  disabled={isLoading || !isConnected}
                  style={{
                    padding: '12px',
                    background: isConnected && !isLoading ? '#10b981' : '#d1d5db',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isConnected && !isLoading ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (isConnected && !isLoading) e.target.style.background = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    if (isConnected && !isLoading) e.target.style.background = '#10b981';
                  }}
                >
                  <Send size={18} /> Gửi tin nhắn
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default GuestChatWidget;