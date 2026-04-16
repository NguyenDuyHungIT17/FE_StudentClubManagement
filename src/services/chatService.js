import { getToken } from '../utils/tokenUtils';
import { API_BASE_URL, apiRequest } from './api';

class ChatService {
  constructor() {
    this.ws = null;
    this.messageListeners = [];
    this.connectionListeners = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.connectionKey = null;
  }

  /**
   * Kết nối tới WebSocket server
   * @param {string|number} clubId - ID của câu lạc bộ
   */
  async connect(clubId = null) {
    return new Promise((resolve, reject) => {
      try {
        const token = getToken();
        
        if (!token) {
          console.warn('❌ No token found');
          this._notifyConnectionStatus(false);
          reject(new Error('No authentication token'));
          return;
        }

        if (this.ws?.readyState === WebSocket.OPEN) {
          this._notifyConnectionStatus(true);
          resolve(true);
          return;
        }

        const origin = API_BASE_URL.replace(/\/api$/, '');
        const wsBase = origin.replace(/^http/, 'ws');
        const url = `${wsBase}/ws/chat?access_token=${encodeURIComponent(token)}`;

        console.log('🔌 Connecting to:', url);
        this.connectionKey = clubId ?? 'global';

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('✅ WebSocket Connected');
          this.reconnectAttempts = 0;
          this._notifyConnectionStatus(true);
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            // console.log('📨 Message received:', message);
            this._notifyMessageListeners(message);
          } catch (err) {
            console.error('❌ Failed to parse message:', err);
          }
        };

        this.ws.onerror = (error) => {
          console.error('⚠️ WebSocket error:', error);
          this._notifyConnectionStatus(false);
          // Không reject ở đây để tránh Uncaught Promise nếu lỗi xảy ra sau khi đã connect
        };

        this.ws.onclose = () => {
          console.log('❌ WebSocket Closed');
          this._notifyConnectionStatus(false);
          this._attemptReconnect(clubId);
        };

        // Timeout 10s nếu không connect được
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('Connection timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('❌ Connection error:', error);
        this._notifyConnectionStatus(false);
        reject(error);
      }
    });
  }

  /**
   * Gửi tin nhắn nhóm CLB
   * @param {string|number} clubId - Phải chuyển sang INT
   * @param {string} content
   */
  sendGroupMessage(clubId, content) {
    return this.createMessage({
      messageType: 1,
      content,
      clubId: parseInt(clubId, 10),
      recipientId: null,
    });
  }

  /**
   * Gửi tin nhắn riêng tư
   * @param {string|number} toUserId - Phải chuyển sang INT
   * @param {string} content
   */
  sendPrivateMessage(toUserId, content) {
    return this.createMessage({
      messageType: 2,
      content,
      clubId: null,
      recipientId: parseInt(toUserId, 10),
    });
  }

  /**
   * Gửi tin nhắn từ khách tới leader
   * Vì ChatCommand Backend không có trường GuestName/Email, ta gộp vào Content
   */
  sendGuestMessage(clubId, content, guestName, guestEmail) {
    const clubIdInt = parseInt(clubId, 10);

    // Format tin nhắn để Leader biết ai gửi
    const formattedContent = `[KHÁCH]\nTên: ${guestName}\nEmail: ${guestEmail}\nNội dung: ${content}`;

    return this.createMessage({
      messageType: 3,
      content: formattedContent,
      clubId: clubIdInt,
      recipientId: null,
    });
  }

  createMessage(payload) {
    return apiRequest('/Chat/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Hàm gửi nội bộ (Generic send)
   */
  send(command) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not connected. Command queued:', command);
      return;
    }

    try {
      // Gửi object JSON lên server
      this.ws.send(JSON.stringify(command));
      console.log('✉️ Message sent:', command);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  }

  // --- Các hàm Listener giữ nguyên ---

  onMessage(callback) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(fn => fn !== callback);
    };
  }

  onConnectionChange(callback) {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(fn => fn !== callback);
    };
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionKey = null;
  }

  getPrivateMessages(userId, pageNumber = 1, pageSize = 50) {
    return apiRequest('/Chat/messages/private', {
      method: 'POST',
      body: JSON.stringify({
        userId: parseInt(userId, 10),
        pageNumber,
        pageSize,
      }),
    });
  }

  getGroupMessages(clubId, pageNumber = 1, pageSize = 50) {
    return apiRequest('/Chat/messages/group', {
      method: 'POST',
      body: JSON.stringify({
        clubId: parseInt(clubId, 10),
        pageNumber,
        pageSize,
      }),
    });
  }

  getConversations(pageNumber = 1, pageSize = 20) {
    return apiRequest(`/Chat/conversations?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
    });
  }

  _notifyMessageListeners(message) {
    this.messageListeners.forEach(fn => fn(message));
  }

  _notifyConnectionStatus(isConnected) {
    this.connectionListeners.forEach(fn => fn(isConnected));
  }

  _attemptReconnect(clubId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(clubId).catch(err => console.error('Reconnection failed:', err));
      }, this.reconnectDelay);
    }
  }
}

export default new ChatService();
