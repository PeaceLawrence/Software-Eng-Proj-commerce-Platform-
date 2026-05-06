import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { MdSend, MdArrowBack, MdChat } from "react-icons/md";

const CHATS_KEY = "campuscart_chats";

const loadChats = () => {
  try { return JSON.parse(localStorage.getItem(CHATS_KEY)) || []; }
  catch { return []; }
};

const saveChats = (chats) => localStorage.setItem(CHATS_KEY, JSON.stringify(chats));

const getOrCreateChat = (chats, productId, productTitle, productThumbnail, buyerEmail) => {
  const existing = chats.find(c => c.productId === productId && c.buyerEmail === buyerEmail);
  if (existing) return { chats, chat: existing };
  const newChat = {
    id: `chat-${Date.now()}`,
    productId,
    productTitle,
    productThumbnail,
    buyerEmail,
    sellerEmail: "store@towson.edu",
    messages: [],
    updatedAt: Date.now(),
  };
  const updated = [newChat, ...chats];
  saveChats(updated);
  return { chats: updated, chat: newChat };
};

const ChatWindow = ({ chat, userEmail, onBack, onSend }) => {
  const [text, setText] = useState("");
  const endRef = React.useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(chat.id, text.trim());
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isSeller = userEmail === chat.sellerEmail;
  const otherEmail = isSeller ? chat.buyerEmail : chat.sellerEmail;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 p-3" style={{ background: "#1e1e1e", borderBottom: "1px solid #333" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 4 }}>
          <MdArrowBack size={22} />
        </button>
        <img
          src={chat.productThumbnail}
          alt={chat.productTitle}
          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }}
          onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=80&h=80&fit=crop"; }}
        />
        <div>
          <div className="fw-semibold small">{chat.productTitle}</div>
          <div className="text-muted" style={{ fontSize: "0.75rem" }}>{otherEmail}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 p-3" style={{ overflowY: "auto", background: "#111" }}>
        {chat.messages.length === 0 && (
          <div className="text-center text-muted py-5 small">
            Start the conversation about <strong>{chat.productTitle}</strong>
          </div>
        )}
        {chat.messages.map((msg, i) => {
          const isMe = msg.from === userEmail;
          return (
            <div key={i} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
              <div style={{
                maxWidth: "72%",
                padding: "10px 14px",
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: isMe ? "#E87722" : "#2a2a2a",
                color: isMe ? "#fff" : "#f0f0f0",
                fontSize: "0.9rem",
              }}>
                <div>{msg.text}</div>
                <div style={{ fontSize: "0.7rem", opacity: 0.7, marginTop: 4, textAlign: isMe ? "right" : "left" }}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 d-flex gap-2" style={{ background: "#1e1e1e", borderTop: "1px solid #333" }}>
        <textarea
          className="form-control"
          rows={1}
          placeholder="Type a message…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          style={{ resize: "none", borderRadius: 20, fontSize: "0.9rem" }}
        />
        <button
          className="btn btn-primary d-flex align-items-center justify-content-center"
          style={{ borderRadius: "50%", width: 44, height: 44, flexShrink: 0 }}
          onClick={handleSend}
        >
          <MdSend size={18} />
        </button>
      </div>
    </div>
  );
};

const Chat = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [chats, setChats] = useState(loadChats);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    if (state?.product && user) {
      const { product } = state;
      const { chats: updated, chat } = getOrCreateChat(
        chats,
        product.id,
        product.title,
        product.thumbnail,
        user.email
      );
      setChats(updated);
      setActiveChatId(chat.id);
      navigate("/chat", { replace: true, state: null });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userEmail = user?.email;
  const myChats = chats.filter(c => c.buyerEmail === userEmail || c.sellerEmail === userEmail);
  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSend = (chatId, text) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const updated = chats.map(c => c.id !== chatId ? c : {
      ...c,
      messages: [...c.messages, { from: userEmail, text, time }],
      updatedAt: Date.now(),
    });
    setChats(updated);
    saveChats(updated);
  };

  if (activeChat) {
    return (
      <ChatWindow
        chat={activeChat}
        userEmail={userEmail}
        onBack={() => setActiveChatId(null)}
        onSend={handleSend}
      />
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 640, margin: "0 auto" }}>
      <h4 className="fw-bold mb-4">Messages</h4>

      {myChats.length === 0 ? (
        <div className="text-center py-5">
          <MdChat size={64} className="text-muted mb-3" />
          <h6 className="fw-bold mb-2">No conversations yet</h6>
          <p className="text-muted small">Click "Contact Seller" on any product to start a chat.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Browse Products</button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {[...myChats].sort((a, b) => b.updatedAt - a.updatedAt).map(chat => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isSeller = userEmail === chat.sellerEmail;
            const otherEmail = isSeller ? chat.buyerEmail : chat.sellerEmail;
            return (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className="card p-3 text-start w-100 border-0"
                style={{ background: "#222", cursor: "pointer" }}
              >
                <div className="d-flex gap-3 align-items-center">
                  <img
                    src={chat.productThumbnail}
                    alt={chat.productTitle}
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                    onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=80&h=80&fit=crop"; }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-semibold small text-truncate">{chat.productTitle}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>{otherEmail}</div>
                    {lastMsg && (
                      <div className="text-muted text-truncate" style={{ fontSize: "0.78rem", marginTop: 2 }}>
                        {lastMsg.from === userEmail ? "You: " : ""}{lastMsg.text}
                      </div>
                    )}
                  </div>
                  {!lastMsg && (
                    <span className="badge" style={{ background: "rgba(232,119,34,0.15)", color: "#E87722", fontSize: "0.7rem" }}>New</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Chat;
