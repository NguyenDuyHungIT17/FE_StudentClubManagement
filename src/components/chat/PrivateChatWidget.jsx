import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

/**
 * Component for private chat between members
 * @param {string} otherUserId - ID của user muốn chat
 * @param {string} otherUserName - Tên user
 * @param {boolean} isOpen - Trạng thái mở
 * @param {function} onClose - Callback đóng
 */
const PrivateChatWidget = ({ otherUserId, otherUserName, isOpen, onClose }) => {
  const [messageInput, setMessageInput] = useState('');
  const { messages, isConnected, sendPrivateMessage } = useChat(null, otherUserId);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (messageInput.trim()) {
      sendPrivateMessage(otherUserId, messageInput);
      setMessageInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '480px',
        width: '400px',
        height: '550px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 5px 40px rgba(0, 0, 0, 0.16)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 999,
        animation: 'slideUp 0.3s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          color: '#fff',
          padding: '16px',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{otherUserName}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
            {isConnected ? '🟢 Online' : '🔴 Offline'}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#9ca3af'
            }}
          >
            Chưa có tin nhắn
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 12px',
                background: '#e9d5ff',
                borderRadius: '12px',
                maxWidth: '85%',
                wordWrap: 'break-word'
              }}
            >
              <div style={{ fontSize: '13px', color: '#333' }}>{msg.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px'
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tin nhắn..."
          disabled={!isConnected}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!isConnected}
          style={{
            background: isConnected ? '#8b5cf6' : '#d1d5db',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px',
            cursor: isConnected ? 'pointer' : 'not-allowed'
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default PrivateChatWidget;