import React, { useState, useRef, useCallback } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const messagesEndRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Connection health check
  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/chatbot/health', {
        method: 'GET',
        timeout: 5000
      });
      setIsConnected(response.ok);
      setConnectionStatus(response.ok ? 'connected' : 'disconnected');
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }
  }, []);

  // Auto-clear old chats when opening the chatbot
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Clear previous messages when opening
      setMessages([]);
      setRetryCount(0);
      checkConnection();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!isConnected) {
      setMessages(prev => [...prev, {
        text: '⚠️ Connection lost. Please check your internet connection and try again.',
        sender: 'bot'
      }]);
      return;
    }

    const userMessage = { text: input, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Add typing indicator with better UX
      const typingMessage = { 
        text: isConnected ? 'Typing...' : 'Reconnecting...', 
        sender: 'bot', 
        typing: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, typingMessage]);

      // Call optimized backend API
      const response = await fetch('http://localhost:8080/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Remove typing message and add actual response
        setMessages(prev => {
          const filtered = prev.filter(msg => !msg.typing);
          return [...filtered, { 
            text: data.response, 
            sender: 'bot',
            timestamp: Date.now()
          }];
        });
        setRetryCount(0); // Reset retry count on success
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error generating response:', error);

      // Exponential backoff retry logic
      if (retryCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        setRetryCount(prev => prev + 1);
        
        setMessages(prev => {
          const filtered = prev.filter(msg => !msg.typing);
          return [...filtered, {
            text: `Connection issue. Retrying in ${delay/1000}s... (${retryCount + 1}/3)`,
            sender: 'bot',
            timestamp: Date.now()
          }];
        });

        // Auto-retry after delay
        setTimeout(() => {
          setInput(currentInput);
          handleSend();
        }, delay);
        return;
      }

      // Remove typing message if it exists and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        return [...filtered, {
          text: 'I apologize, but I\'m having trouble connecting. Please make sure the backend server is running and try again.',
          sender: 'bot',
          error: true,
          timestamp: Date.now()
        }];
      });
      setRetryCount(0);
    } finally {
      setIsTyping(false);
    }
  };

  // Debounced input handler for better UX
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={handleToggle} title="Chat with Machaha">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h3>Machaha Chatbot</h3>
              <div className="connection-status">
                <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                  ●
                </span>
                <small>{isConnected ? 'Connected' : 'Disconnected'}</small>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender} ${msg.error ? 'error' : ''} ${msg.typing ? 'typing' : ''}`}>
                {msg.typing ? (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
                {msg.timestamp && (
                  <small className="message-timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Type your message..." : "Reconnecting..."}
              disabled={!isConnected}
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || !isConnected || isTyping}
            >
              {isTyping ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
