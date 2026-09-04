import React, { createContext, useContext, useState } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  source: 'sign' | 'speech' | 'type';
  timestamp: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (text: string, source: 'sign' | 'speech' | 'type') => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      text: 'Welcome to SIGNSETU AI Chat! Live sign recognition, voice typing, and typed text will appear here.',
      source: 'type',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const addMessage = (text: string, source: 'sign' | 'speech' | 'type') => {
    if (!text || !text.trim()) return;
    
    // Prevent duplicate consecutive sign messages within 2 seconds
    const cleanText = text.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => {
      if (source === 'sign' && prev.length > 0) {
        const lastMsg = prev[prev.length - 1];
        const lastTime = Number(lastMsg.id.split('_')[1] || 0);
        if (
          lastMsg.source === 'sign' &&
          lastMsg.text.toUpperCase() === cleanText.toUpperCase() &&
          Date.now() - lastTime < 2000
        ) {
          return prev;
        }
      }
      return [
        ...prev,
        {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          text: cleanText,
          source,
          timestamp: timeStr,
        },
      ];
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
