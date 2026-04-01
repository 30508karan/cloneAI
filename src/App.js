// import { useState } from 'react';

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const userMessage = { role: 'user', content: input };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);
//     try {
//     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer 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`,
//     'HTTP-Referer': 'http://localhost:3000', // required
//     'X-Title': 'ChatGPT Clone' // optional but recommended
//   },
//   body: JSON.stringify({
//     model: 'nvidia/nemotron-3-super-120b-a12b:free', // gpt-3.5 won't work here
//     messages: [...messages, userMessage]
//   })
// });
//       const data = await response.json();
//       const aiMessage = { role: 'assistant', content: data.choices[0].message.content };
//       setMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//       console.error(error);
//       setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Unable to get response.' }]);
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//       <h1>ChatGPT Clone</h1>
//       <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//         {messages.map((msg, index) => (
//           <div key={index} style={{ marginBottom: '10px' }}>
//             <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong> {msg.content}
//           </div>
//         ))}
//         {loading && <div>AI is thinking...</div>}
//       </div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//         placeholder="Type your message..."
//         style={{ width: '70%', padding: '10px' }}
//       />
//       <button onClick={sendMessage} disabled={loading} style={{ padding: '10px' }}>Send</button>
//     </div>
//   );
// }

// export default App;
import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ChatGPT Clone'
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-super-120b-a12b:free',
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.choices[0].message.content };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: Unable to get response. Please try again.' 
      }]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="url(#gradient)"/>
              <defs>
                <linearGradient id="gradient" x1="2" y1="2" x2="22" y2="22">
                  <stop offset="0%" stopColor="#00ffff"/>
                  <stop offset="100%" stopColor="#0080ff"/>
                </linearGradient>
              </defs>
            </svg>
            <h1>AI Chat Assistant</h1>
          </div>
          <button className="clear-btn" onClick={clearChat}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
            Clear Chat
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages-wrapper">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="url(#gradient2)" strokeWidth="2"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="url(#gradient2)" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="gradient2" x1="2" y1="2" x2="22" y2="22">
                      <stop offset="0%" stopColor="#00ffff"/>
                      <stop offset="100%" stopColor="#0080ff"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2>How can I help you today?</h2>
              <p>Start a conversation by typing a message below</p>
              <div className="suggestions">
                <button onClick={() => setInput("Explain quantum computing in simple terms")}>
                  Explain quantum computing
                </button>
                <button onClick={() => setInput("Write a creative story about space")}>
                  Write a creative story
                </button>
                <button onClick={() => setInput("Help me learn React hooks")}>
                  Help me learn React
                </button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="#00ffff"/>
                        <path d="M4 20c0-4 3-6 8-6s8 2 8 6" stroke="#00ffff" strokeWidth="2"/>
                      </svg>
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="#0080ff"/>
                      </svg>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="message-text">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message assistant">
                  <div className="message-avatar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="#0080ff"/>
                    </svg>
                  </div>
                  <div className="message-content">
                    <div className="message-header">AI Assistant</div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message here... (Press Enter to send)"
            rows="1"
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="send-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="input-hint">
          Powered by AI Chat Assistant 
        </p>
      </div>
    </div>
  );
}

export default App;