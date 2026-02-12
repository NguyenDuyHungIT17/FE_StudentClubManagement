import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import '../../styles/ChatWidget.css';

/**
 * Component floating chat widget cho GROUP chat
 * @param {string} clubId - ID câu lạc bộ
 * @param {string} clubName - Tên câu lạc bộ
 */
const ChatWidget = ({ clubId, clubName = 'Chat CLB' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [displayedMessages, setDisplayedMessages] = useState([]);
  
  const { messages, isConnected, isLoading, error, sendGroupMessage, clearError } = useChat(clubId);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Cập nhật displayed messages
  useEffect(() => {
    setDisplayedMessages(messages);
    scrollToBottom();
  }, [messages]);

  // Focus input khi open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;

    sendGroupMessage(trimmedMessage);
    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!clubId) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-widget-button"
          title="Open chat"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            transition: 'all 0.3s ease',
            fontSize: '24px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <MessageCircle size={28} />
          {messages.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {messages.length > 99 ? '99+' : messages.length}
            </span>
          )}
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="chat-widget-panel"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '420px',
            height: '600px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 5px 40px rgba(0, 0, 0, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            animation: 'slideUp 0.3s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              color: '#fff',
              padding: '16px',
              borderRadius: '16px 16px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{clubName}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                {isConnected ? '🟢 Online' : '🔴 Offline'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <X size={20} />
            </button>
          </div>

          {/* Connection Status */}
          {isLoading && (
            <div
              style={{
                padding: '12px',
                background: '#fef3c7',
                color: '#92400e',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Đang kết nối...
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '12px',
                background: '#fee2e2',
                color: '#991b1b',
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

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              backgroundColor: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {displayedMessages.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#9ca3af',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              >
                <p>Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện! 👋</p>
              </div>
            ) : (
              displayedMessages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>
                  <div
                    style={{
                      padding: '12px',
                      background: '#dbeafe',
                      borderRadius: '12px 12px 12px 4px',
                      maxWidth: '90%',
                      wordWrap: 'break-word'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', marginBottom: '4px' }}>
                      {msg.fromUserName || 'Anonymous'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.4' }}>
                      {msg.content}
                    </div>
                    {msg.timestamp && (
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                        {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '8px',
              backgroundColor: '#fff',
              borderRadius: '0 0 16px 16px'
            }}
          >
            <textarea
              ref={inputRef}
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn... (Shift+Enter để xuống dòng)"
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'none',
                maxHeight: '80px'
              }}
              disabled={!isConnected || isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!isConnected || isLoading || !messageInput.trim()}
              style={{
                background: isConnected && !isLoading ? '#3b82f6' : '#d1d5db',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 12px',
                cursor: isConnected && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                minWidth: '40px'
              }}
              onMouseEnter={(e) => {
                if (isConnected && !isLoading) e.target.style.background = '#1e40af';
              }}
              onMouseLeave={(e) => {
                if (isConnected && !isLoading) e.target.style.background = '#3b82f6';
              }}
            >
              <Send size={18} />
            </button>
          </div>
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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .chat-widget-panel::-webkit-scrollbar {
          width: 6px;
        }

        .chat-widget-panel::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-widget-panel::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .chat-widget-panel::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default ChatWidget;