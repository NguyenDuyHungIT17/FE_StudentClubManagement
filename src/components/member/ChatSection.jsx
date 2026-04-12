import React from "react";
import { MessageCircle } from "lucide-react";

const ChatSection = () => {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 60, border: "1px solid #e2e8f0", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <MessageCircle size={40} color="#94a3b8" />
      </div>
      <h2 style={{ color: "#0f172a", marginBottom: 10 }}>Kênh Thảo luận Realtime</h2>
      <p style={{ color: "#64748b", maxWidth: 400, margin: "0 auto" }}>
        Tính năng nhắn tin nhóm và trò chuyện trực tiếp (WebSocket/SignalR) đang trong quá trình phát triển. Vui lòng quay lại sau!
      </p>
    </div>
  );
};

export default ChatSection;