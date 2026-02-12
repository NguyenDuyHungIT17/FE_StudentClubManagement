import { useState, useEffect, useCallback, useRef } from 'react';
import chatService from '../services/chatService';
import { getToken } from '../utils/tokenUtils';

export const useChat = (clubId = null, otherUserId = null) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(() => {});
  const unsubscribeConnectionRef = useRef(() => {});

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('No authentication token');
      return;
    }

    setIsLoading(true);
    
    // Connect
    chatService
      .connect(clubId)
      .then(() => {
        setIsLoading(false);
        setError(null);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });

    // Subscribe nhận tin nhắn
    unsubscribeRef.current = chatService.onMessage((message) => {
      
      // 🔥 LOGIC LỌC TIN NHẮN (QUAN TRỌNG)
      // Backend trả về message.fromUserId là INT, nhưng otherUserId có thể là STRING
      // Nên ta dùng toán tử == (so sánh lỏng) thay vì ===
      
      // 1. Tin nhắn Group (User & Guest)
      if (clubId && (message.type === 'GROUP_MESSAGE' || message.type === 'GUEST_MESSAGE')) {
          // Vì BE không trả về clubId trong payload tin nhắn, ta mặc định
          // tin nhắn từ socket này là thuộc về club này.
          setMessages(prev => [...prev, message]);
      } 
      
      // 2. Tin nhắn Riêng tư
      // Kiểm tra: message.type đúng VÀ message.fromUserId trùng với người mình đang chat
      else if (otherUserId && message.type === 'PRIVATE_MESSAGE' && message.fromUserId == otherUserId) {
        setMessages(prev => [...prev, message]);
      }
    });

    unsubscribeConnectionRef.current = chatService.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    return () => {
      unsubscribeRef.current();
      unsubscribeConnectionRef.current();
    };
  }, [clubId, otherUserId]);

  // Các hàm gửi tin nhắn (Wrapper)
  const sendGroupMessage = useCallback((content) => {
    if (!clubId) return setError('clubId required');
    if (!content?.trim()) return;
    
    chatService.sendGroupMessage(clubId, content);
  }, [clubId]);

  const sendPrivateMessage = useCallback((toUserId, content) => {
    if (!toUserId) return setError('toUserId required');
    if (!content?.trim()) return;

    chatService.sendPrivateMessage(toUserId, content);
  }, []);

  const sendGuestMessage = useCallback((content, guestName, guestEmail) => {
    if (!clubId) return setError('clubId required');
    chatService.sendGuestMessage(clubId, content, guestName, guestEmail);
  }, [clubId]);

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    sendGroupMessage,
    sendPrivateMessage,
    sendGuestMessage,
    clearError
  };
};