import React, { useState } from "react";

const AIChatPage = () => {
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hello! I can help you find gear for your Towson courses. What are you looking for today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5001/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: "ai", text: "Sorry, I'm having trouble connecting. Please try again." }]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="d-flex flex-column" style={{ minHeight: "calc(100vh - 56px)" }}>
            <div className="flex-grow-1 overflow-auto p-4" style={{ paddingBottom: '100px' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`d-flex mb-4 ${msg.sender === "user" ? "justify-content-end" : ""}`}>
                            <div
                                style={{
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: '18px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    background: msg.sender === "user" ? "#E87722" : "#f5f5f5",
                                    color: '#111111',
                                }}
                            >
                                {msg.sender === "ai" && (
                                    <p style={{ color: "#E87722", fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>
                                        CampusCart AI
                                    </p>
                                )}
                                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: msg.sender === "user" ? "#fff" : "#111111" }}>
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="d-flex mb-4">
                            <div style={{ background: "#f5f5f5", padding: '12px 16px', borderRadius: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                <p style={{ color: "#E87722", fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>CampusCart AI</p>
                                <p style={{ margin: 0, color: '#555', fontSize: '0.95rem' }}>Typing…</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed-bottom border-top p-3" style={{ background: '#1a1a1a' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div style={{ display: 'flex', borderRadius: '50px', overflow: 'hidden', border: '2px solid #E87722', background: '#fff' }}>
                                <input
                                    type="text"
                                    style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 20px', fontSize: '0.95rem', color: '#111', background: 'transparent' }}
                                    placeholder="Message CampusCart AI..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    style={{ background: '#E87722', border: 'none', color: '#fff', fontWeight: 700, padding: '0 24px', cursor: 'pointer' }}
                                    onClick={sendMessage}
                                >
                                    Send
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <small style={{ fontSize: '0.7rem', color: '#888' }}>
                                    AI can make mistakes. Verify important course requirements.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatPage;