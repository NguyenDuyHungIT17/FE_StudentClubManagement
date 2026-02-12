import React, { useState } from 'react';
import { MessageSquare, Inbox, Users, Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

/**
 * Panel quản lý chat cho leader
 * @param {string} clubId - ID câu lạc bộ
 * @param {string} clubName - Tên câu lạc bộ
 */
const LeaderChatPanel = ({ clubId, clubName = 'Câu lạc bộ' }) => {
  const [activeTab, setActiveTab] = useState('guests'); // guests, group, private
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  const {
    messages,
    isConnected,
    sendGroupMessage,
    sendPrivateMessage,
    clearError
  } = useChat(clubId);

  // Filter messages by type
  const guestMessages = messages.filter(m => m.type === 'GUEST_MESSAGE');
  const groupMessages = messages.filter(m => m.type === 'GROUP_MESSAGE');

  const tabs = [
    { id: 'guests', label: 'Khách hàng', icon: Inbox, count: guestMessages.length },
    { id: 'group', label: 'Nhóm CLB', icon: Users, count: groupMessages.length },
    { id: 'private', label: 'Riêng tư', icon: MessageSquare, count: 0 }
  ];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937'
          }}
        >
          <MessageSquare size={24} color="#3b82f6" />
          Quản lý Chat - {clubName}
        </h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid #3b82f6' : 'none',
                color: isActive ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={18} />
              {tab.label}
              {tab.count > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Connection Status */}
      <div
        style={{
          padding: '12px',
          background: isConnected ? '#d1fae5' : '#fee2e2',
          color: isConnected ? '#065f46' : '#991b1b',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '13px',
          fontWeight: '500'
        }}
      >
        {isConnected ? '✅ Đang kết nối' : '❌ Mất kết nối'}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '400px' }}>
        {/* GUESTS TAB */}
        {activeTab === 'guests' && (
          <div>
            {guestMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                <Inbox size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>Chưa có tin nhắn từ khách</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '16px', height: '400px' }}>
                {/* Guest List */}
                <div
                  style={{
                    width: '200px',
                    borderRight: '1px solid #e5e7eb',
                    overflowY: 'auto',
                    paddingRight: '12px'
                  }}
                >
                  {guestMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedGuest(msg)}
                      style={{
                        padding: '12px',
                        background: selectedGuest === msg ? '#dbeafe' : '#f9fafb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '8px',
                        borderLeft: selectedGuest === msg ? '3px solid #3b82f6' : 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => !selectedGuest && (e.currentTarget.style.background = '#f3f4f6')}
                      onMouseLeave={(e) => !selectedGuest && (e.currentTarget.style.background = '#f9fafb')}
                    >
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#1f2937' }}>
                        {msg.senderName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{msg.senderEmail}</div>
                    </div>
                  ))}
                </div>

                {/* Guest Details */}
                {selectedGuest && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                      <h3 style={{ margin: '0 0 4px 0', color: '#1f2937' }}>
                        {selectedGuest.senderName}
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                        {selectedGuest.senderEmail}
                      </p>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', marginBottom: '12px' }}>
                      <div
                        style={{
                          padding: '12px',
                          background: '#f0fdf4',
                          borderRadius: '8px',
                          borderLeft: '3px solid #10b981'
                        }}
                      >
                        <p style={{ margin: 0, color: '#1f2937', lineHeight: '1.5' }}>
                          {selectedGuest.content}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Trả lời khách..."
                        style={{
                          flex: 1,
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          resize: 'none',
                          outline: 'none'
                        }}
                      />
                      <button
                        style={{
                          padding: '10px 16px',
                          background: '#3b82f6',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Send size={16} /> Gửi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GROUP TAB */}
        {activeTab === 'group' && (
          <div>
            {groupMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>Chưa có tin nhắn trong nhóm</p>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginBottom: '16px',
                    paddingRight: '8px'
                  }}
                >
                  {groupMessages.map((msg, idx) => (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                        <strong>{msg.fromUserName || 'Anonymous'}</strong>
                      </div>
                      <div
                        style={{
                          padding: '10px 12px',
                          background: '#dbeafe',
                          borderRadius: '8px',
                          fontSize: '14px',
                          color: '#1f2937'
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Gửi tin nhắn cho nhóm..."
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      minHeight: '60px',
                      resize: 'none',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (replyMessage.trim()) {
                        sendGroupMessage(replyMessage);
                        setReplyMessage('');
                      }
                    }}
                    disabled={!isConnected}
                    style={{
                      padding: '10px 16px',
                      background: isConnected ? '#3b82f6' : '#d1d5db',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: isConnected ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={16} /> Gửi
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRIVATE TAB */}
        {activeTab === 'private' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Chưa có tin nhắn riêng tư</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderChatPanel;