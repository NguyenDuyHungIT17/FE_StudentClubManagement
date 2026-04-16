import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Users, UserRound, Send, Wifi, WifiOff } from "lucide-react";
import chatService from "../../services/chatService";
import { API_BASE_URL } from "../../services/api";
import { userService } from "../../services/userService";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.value)) return payload.value;
  if (Array.isArray(payload?.value?.items)) return payload.value.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const normalizeMessage = (message, currentUserId, resolveSenderName) => {
  if (!message) return null;

  const senderId =
    message.fromUserId ??
    message.FromUserId ??
    message.senderId ??
    message.SenderId ??
    message.userId ??
    message.UserId ??
    message.createdBy ??
    message.CreatedBy ??
    null;
  const recipientId =
    message.toUserId ??
    message.ToUserId ??
    message.recipientId ??
    message.RecipientId ??
    null;
  const clubId =
    message.clubId ??
    message.ClubId ??
    message.groupId ??
    message.GroupId ??
    null;
  const content = message.content ?? message.Content ?? message.message ?? message.Message ?? "";
  const senderName =
    message.fromUserName ??
    message.FromUserName ??
    message.senderName ??
    message.SenderName ??
    message.fullName ??
    message.FullName ??
    resolveSenderName?.(senderId) ??
    (senderId ? `User #${senderId}` : "Người dùng");
  const timestamp =
    message.timestamp ??
    message.Timestamp ??
    message.createdAt ??
    message.CreatedAt ??
    message.sentAt ??
    message.SentAt ??
    new Date().toISOString();
  const messageId =
    message.messageId ??
    message.MessageId ??
    message.id ??
    message.Id ??
    `${senderId || "u"}-${timestamp}-${content}`;
  const rawType = String(message.type ?? message.Type ?? message.messageType ?? message.MessageType ?? "").toUpperCase();

  let kind = "private";
  if (rawType.includes("GROUP") || rawType === "1" || message.messageType === 1) kind = "group";
  if (rawType.includes("PRIVATE") || rawType === "2" || message.messageType === 2) kind = "private";

  return {
    id: messageId,
    content,
    senderId: senderId ? Number(senderId) : null,
    recipientId: recipientId ? Number(recipientId) : null,
    clubId: clubId ? Number(clubId) : null,
    senderName,
    timestamp,
    kind,
    isMine: Number(senderId) === Number(currentUserId),
  };
};

const dedupeMessages = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (!item) return false;
    const key = `${item.id}|${item.timestamp}|${item.senderId}|${item.content}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const buildMessageSignature = (items) =>
  items.map((item) => `${item.id}|${item.timestamp}|${item.senderId}|${item.content}`).join("||");

const updateMessageNames = (items, resolveSenderName) =>
  items.map((item) => {
    const resolvedName = resolveSenderName?.(item.senderId);
    if (!resolvedName || item.senderName === resolvedName) return item;
    if (item.senderName && !String(item.senderName).startsWith("User #")) return item;
    return { ...item, senderName: resolvedName };
  });

const ChatSection = ({ userId, clubId, currentUserName }) => {
  const [activeTab, setActiveTab] = useState("group");
  const [groupMessages, setGroupMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const groupSignatureRef = useRef("");
  const privateSignatureRef = useRef("");
  const lastVisibleSignatureRef = useRef("");
  const allMembersRef = useRef([]);
  const currentUserNameRef = useRef(currentUserName);
  const selectedMemberIdRef = useRef(selectedMemberId);
  const userNameMapRef = useRef({});
  const loadingUserNamesRef = useRef(new Set());

  const selectedMember = useMemo(
    () => members.find((m) => Number(m.userId) === Number(selectedMemberId)) || null,
    [members, selectedMemberId]
  );

  useEffect(() => {
    allMembersRef.current = allMembers;
  }, [allMembers]);

  useEffect(() => {
    currentUserNameRef.current = currentUserName;
  }, [currentUserName]);

  useEffect(() => {
    selectedMemberIdRef.current = selectedMemberId;
  }, [selectedMemberId]);

  const resolveSenderName = useCallback(
    (senderId) => {
      const numericSenderId = Number(senderId);
      if (!numericSenderId) return null;
      if (numericSenderId === Number(userId)) return currentUserNameRef.current || "Bạn";
      if (userNameMapRef.current[numericSenderId]) return userNameMapRef.current[numericSenderId];
      return allMembersRef.current.find((m) => Number(m.userId) === numericSenderId)?.fullName || null;
    },
    [userId]
  );

  useEffect(() => {
    setGroupMessages((prev) => {
      const nextMessages = updateMessageNames(prev, resolveSenderName);
      const nextSignature = buildMessageSignature(nextMessages);
      groupSignatureRef.current = nextSignature;
      return nextMessages;
    });

    setPrivateMessages((prev) => {
      const nextMessages = updateMessageNames(prev, resolveSenderName);
      const nextSignature = buildMessageSignature(nextMessages);
      privateSignatureRef.current = nextSignature;
      return nextMessages;
    });
  }, [resolveSenderName]);

  const ensureUserNames = useCallback(async (senderIds) => {
    const idsToFetch = [...new Set(senderIds.map(Number).filter(Boolean))].filter((id) => {
      if (id === Number(userId)) return false;
      if (resolveSenderName(id)) return false;
      if (loadingUserNamesRef.current.has(id)) return false;
      return true;
    });

    if (idsToFetch.length === 0) return;

    try {
      idsToFetch.forEach((id) => loadingUserNamesRef.current.add(id));
      const results = await Promise.all(
        idsToFetch.map(async (id) => {
          try {
            const res = await userService.getById(id);
            const user = res?.data || res?.value || res;
            return {
              id,
              fullName: user?.fullName || user?.FullName || user?.email || `User #${id}`,
            };
          } catch {
            return { id, fullName: `User #${id}` };
          }
        })
      );

      const nextMap = { ...userNameMapRef.current };
      results.forEach(({ id, fullName }) => {
        nextMap[id] = fullName;
        loadingUserNamesRef.current.delete(id);
      });
      userNameMapRef.current = nextMap;

      setGroupMessages((prev) => updateMessageNames(prev, resolveSenderName));
      setPrivateMessages((prev) => updateMessageNames(prev, resolveSenderName));
    } finally {
      idsToFetch.forEach((id) => loadingUserNamesRef.current.delete(id));
    }
  }, [resolveSenderName, userId]);

  const loadGroupMessages = useCallback(async () => {
    if (!clubId || !userId) return;
    const groupRes = await chatService.getGroupMessages(clubId, 1, 50);
    const nextMessages = dedupeMessages(normalizeList(groupRes).map((msg) => normalizeMessage(msg, userId, resolveSenderName))).sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    const nextSignature = buildMessageSignature(nextMessages);
    if (groupSignatureRef.current === nextSignature) return;
    groupSignatureRef.current = nextSignature;
    setGroupMessages(nextMessages);
  }, [clubId, userId, resolveSenderName]);

  const loadPrivateMessages = useCallback(async () => {
    if (!selectedMemberId || !userId) {
      setPrivateMessages([]);
      return;
    }

    const privateRes = await chatService.getPrivateMessages(selectedMemberId, 1, 50);
    const nextMessages = dedupeMessages(normalizeList(privateRes).map((msg) => normalizeMessage(msg, userId, resolveSenderName))).sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    const nextSignature = buildMessageSignature(nextMessages);
    if (privateSignatureRef.current === nextSignature) return;
    privateSignatureRef.current = nextSignature;
    setPrivateMessages(nextMessages);
  }, [selectedMemberId, userId, resolveSenderName]);

  useEffect(() => {
    if (!userId || !clubId) {
      setLoading(false);
      return;
    }

    const loadInitial = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

        const memberRes = await fetch(`${API_BASE_URL}/ClubMembers/club/${clubId}`, { headers });
        const memberData = await memberRes.json().catch(() => []);
        const normalizedMembers = normalizeList(memberData)
          .map((item) => ({
            userId:
              item.userId ??
              item.UserId ??
              item.memberId ??
              item.MemberId ??
              item.id ??
              item.Id ??
              item.user?.userId ??
              item.user?.UserId,
            fullName:
              item.fullName ??
              item.FullName ??
              item.userName ??
              item.UserName ??
              item.name ??
              item.Name ??
              item.user?.fullName ??
              item.user?.FullName ??
              item.email ??
              item.Email ??
              item.user?.email ??
              item.user?.Email ??
              (item.userId || item.UserId ? `User #${item.userId ?? item.UserId}` : "Người dùng"),
            email: item.email ?? item.Email ?? item.user?.email ?? item.user?.Email ?? "",
            memberRole: item.memberRole ?? item.MemberRole ?? "",
          }))
          .filter((item) => item.userId);

        setAllMembers(normalizedMembers);
        const otherMembers = normalizedMembers.filter((item) => Number(item.userId) !== Number(userId));

        setMembers(otherMembers);
        if (otherMembers.length > 0 && !selectedMemberIdRef.current) {
          setSelectedMemberId(otherMembers[0].userId);
        }

        await loadGroupMessages();

      } catch (e) {
        setError(e.message || "Không thể tải dữ liệu chat.");
      } finally {
        setLoading(false);
      }
    };

    loadInitial();

    return undefined;
  }, [userId, clubId, loadGroupMessages]);

  useEffect(() => {
    if (!userId || !clubId) return undefined;

    let unsubMessage = () => {};
    let unsubConnection = () => {};

    const setupRealtime = async () => {
      try {
        await chatService.connect(clubId);

        unsubMessage = chatService.onMessage((incoming) => {
          const normalized = normalizeMessage(incoming, userId, resolveSenderName);
          if (!normalized) return;

          if (normalized.kind === "group" && Number(normalized.clubId || clubId) === Number(clubId)) {
            setGroupMessages((prev) =>
              {
                const nextMessages = dedupeMessages([...prev, { ...normalized, clubId: Number(normalized.clubId || clubId) }]).sort(
                  (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );
                groupSignatureRef.current = buildMessageSignature(nextMessages);
                return nextMessages;
              }
            );
          }

          const isPrivateRelated =
            normalized.kind === "private" &&
            ((Number(normalized.senderId) === Number(selectedMemberIdRef.current) && Number(normalized.recipientId) === Number(userId)) ||
              (Number(normalized.senderId) === Number(userId) && Number(normalized.recipientId) === Number(selectedMemberIdRef.current)));

          if (isPrivateRelated) {
            setPrivateMessages((prev) =>
              {
                const nextMessages = dedupeMessages([...prev, normalized]).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                privateSignatureRef.current = buildMessageSignature(nextMessages);
                return nextMessages;
              }
            );
          }
        });

        unsubConnection = chatService.onConnectionChange(setIsConnected);
        setIsConnected(chatService.isConnected());
      } catch (e) {
        setError(e.message || "Không thể kết nối realtime.");
      }
    };

    setupRealtime();

    return () => {
      unsubMessage();
      unsubConnection();
    };
  }, [userId, clubId, resolveSenderName]);

  useEffect(() => {
    const run = async () => {
      if (!selectedMemberId || !userId) {
        setPrivateMessages([]);
        return;
      }

      setLoadingMessages(true);
      try {
        await loadPrivateMessages();
      } catch (e) {
        setError(e.message || "Không thể tải tin nhắn riêng.");
      } finally {
        setLoadingMessages(false);
      }
    };

    run();
  }, [selectedMemberId, userId, loadPrivateMessages]);

  useEffect(() => {
    if (!userId || !clubId) return undefined;

    const timer = window.setInterval(() => {
      if (activeTab === "group") {
        loadGroupMessages().catch(() => {});
      } else if (activeTab === "private" && selectedMemberId) {
        loadPrivateMessages().catch(() => {});
      }
    }, 10000);

    return () => window.clearInterval(timer);
  }, [activeTab, clubId, userId, selectedMemberId, loadGroupMessages, loadPrivateMessages]);

  useEffect(() => {
    const visibleMessages = activeTab === "group" ? groupMessages : privateMessages;
    const visibleSignature = buildMessageSignature(visibleMessages);
    if (!visibleSignature || lastVisibleSignatureRef.current === visibleSignature) return;
    lastVisibleSignatureRef.current = visibleSignature;
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [groupMessages, privateMessages, activeTab]);

  useEffect(() => {
    const unresolvedIds = [...groupMessages, ...privateMessages]
      .filter((message) => String(message.senderName || "").startsWith("User #"))
      .map((message) => message.senderId);

    ensureUserNames(unresolvedIds).catch(() => {});
  }, [groupMessages, privateMessages, ensureUserNames]);

  const currentMessages = activeTab === "group" ? groupMessages : privateMessages;

  const pushOptimisticMessage = (kind) => {
    const optimistic = {
      id: `local-${Date.now()}`,
      content: messageInput.trim(),
      senderId: Number(userId),
      recipientId: kind === "private" ? Number(selectedMemberId) : null,
      clubId: kind === "group" ? Number(clubId) : null,
      senderName: "Bạn",
      timestamp: new Date().toISOString(),
      kind,
      isMine: true,
    };

    if (kind === "group") {
      setGroupMessages((prev) => {
        const nextMessages = dedupeMessages([...prev, optimistic]);
        groupSignatureRef.current = buildMessageSignature(nextMessages);
        return nextMessages;
      });
    } else {
      setPrivateMessages((prev) => {
        const nextMessages = dedupeMessages([...prev, optimistic]);
        privateSignatureRef.current = buildMessageSignature(nextMessages);
        return nextMessages;
      });
    }
  };

  const handleSend = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    try {
      if (activeTab === "group") {
        await chatService.sendGroupMessage(clubId, trimmed);
        pushOptimisticMessage("group");
        await loadGroupMessages();
      } else if (selectedMemberId) {
        await chatService.sendPrivateMessage(selectedMemberId, trimmed);
        pushOptimisticMessage("private");
        await loadPrivateMessages();
      }
      setMessageInput("");
    } catch (e) {
      setError(e.message || "Không gửi được tin nhắn.");
    }
  };

  const panelStyle = {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    padding: 20,
    minHeight: 0,
  };

  if (!clubId) {
    return (
      <div style={{ ...panelStyle, textAlign: "center", padding: 60 }}>
        <MessageCircle size={44} color="#94a3b8" />
        <h3 style={{ color: "#0f172a" }}>Bạn chưa thuộc CLB nào</h3>
        <p style={{ color: "#64748b", margin: 0 }}>Chat nhóm CLB chỉ khả dụng khi member đã tham gia câu lạc bộ.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, height: "calc(100vh - 210px)", minHeight: 620, maxHeight: "calc(100vh - 210px)", overflow: "hidden" }}>
      <div style={{ ...panelStyle, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>Kênh chat</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: isConnected ? "#047857" : "#b91c1c", fontSize: 13, fontWeight: 700 }}>
            {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
            {isConnected ? "Đã kết nối" : "Mất kết nối"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0, flex: 1 }}>
          <button
            type="button"
            onClick={() => setActiveTab("group")}
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              border: activeTab === "group" ? "1px solid #2563eb" : "1px solid #e2e8f0",
              background: activeTab === "group" ? "#eff6ff" : "#fff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Users size={18} color="#2563eb" />
              <strong>Nhóm CLB</strong>
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>Thảo luận chung của thành viên trong câu lạc bộ.</div>
          </button>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, minHeight: 0, display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#0f172a", fontWeight: 800 }}>
              <UserRound size={18} color="#0f766e" />
              Chat riêng giữa member
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", minHeight: 0, flex: 1, paddingRight: 4 }}>
              {members.length === 0 && (
                <div style={{ color: "#64748b", fontSize: 14, background: "#f8fafc", padding: 14, borderRadius: 12 }}>
                  Chưa có thành viên khác trong CLB để bắt đầu chat riêng.
                </div>
              )}

              {members.map((member) => (
                <button
                  key={member.userId}
                  type="button"
                  onClick={() => {
                    setActiveTab("private");
                    setSelectedMemberId(member.userId);
                  }}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: activeTab === "private" && Number(selectedMemberId) === Number(member.userId) ? "1px solid #0f766e" : "1px solid #e2e8f0",
                    background: activeTab === "private" && Number(selectedMemberId) === Number(member.userId) ? "#ecfdf5" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{member.fullName}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    {member.memberRole || "member"} {member.email ? `• ${member.email}` : ""}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...panelStyle, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, color: "#0f172a", fontSize: 20 }}>
              {activeTab === "group" ? "Phòng chat nhóm CLB" : `Chat với ${selectedMember?.fullName || "thành viên"}`}
            </h3>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
              {activeTab === "group"
                ? "Tin nhắn được chia sẻ cho toàn bộ thành viên trong CLB."
                : "Tin nhắn riêng tư giữa bạn và thành viên đã chọn."}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {(loading || loadingMessages) && <div style={{ color: "#64748b", textAlign: "center", padding: 16 }}>Đang tải tin nhắn...</div>}

          {!loading && !loadingMessages && currentMessages.length === 0 && (
            <div style={{ color: "#64748b", textAlign: "center", padding: 30 }}>
              {activeTab === "group" ? "Chưa có tin nhắn nhóm nào." : "Chưa có tin nhắn riêng nào với thành viên này."}
            </div>
          )}

          {currentMessages.map((message) => (
            <div
              key={`${message.id}-${message.timestamp}`}
              style={{
                alignSelf: message.isMine ? "flex-end" : "flex-start",
                maxWidth: "72%",
                background: message.isMine ? "#2563eb" : "#fff",
                color: message.isMine ? "#fff" : "#0f172a",
                border: message.isMine ? "none" : "1px solid #e2e8f0",
                borderRadius: 16,
                padding: "12px 14px",
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 6,
                  color: message.isMine ? "rgba(255,255,255,0.92)" : "#475569",
                  textAlign: message.isMine ? "right" : "left",
                }}
              >
                {message.senderName}
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{message.content}</div>
              <div style={{ marginTop: 6, fontSize: 11, opacity: 0.8 }}>
                {new Date(message.timestamp).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={activeTab === "group" ? "Nhập tin nhắn nhóm..." : "Nhập tin nhắn riêng..."}
            style={{
              flex: 1,
              minHeight: 58,
              maxHeight: 120,
              resize: "vertical",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: 14,
              fontFamily: "inherit",
            }}
            disabled={!isConnected || (activeTab === "private" && !selectedMemberId)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!messageInput.trim() || !isConnected || (activeTab === "private" && !selectedMemberId)}
            style={{
              width: 56,
              border: "none",
              borderRadius: 14,
              background: !messageInput.trim() || !isConnected ? "#cbd5e1" : "#2563eb",
              color: "#fff",
              cursor: !messageInput.trim() || !isConnected ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
