
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X, User, Bot, Maximize2, Minimize2, Plus, Mic, Paperclip } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isOpen, 
  onClose, 
  initialMessage 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  // Close on outside click (only when not fullscreen)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isFullscreen && overlayRef.current === event.target) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isFullscreen]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you want help with: "${content}". This is a simulated response. In a real implementation, this would connect to your AI backend.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const containerClasses = isFullscreen 
    ? "fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 z-50 flex flex-col"
    : "fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300";

  const chatClasses = isFullscreen
    ? "w-full h-full flex flex-col"
    : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col overflow-hidden w-full max-w-5xl h-[85vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500";

  return (
    <div ref={overlayRef} className={containerClasses}>
      <div className={chatClasses}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/30 ${
          isFullscreen 
            ? 'bg-gradient-to-r from-white/80 via-slate-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl' 
            : 'bg-gradient-to-r from-white/60 to-slate-50/60 dark:from-slate-900/60 dark:to-slate-800/60'
        } backdrop-blur-xl`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg animate-pulse">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isFullscreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(true)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-110 rounded-xl"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            )}
            {isFullscreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-110 rounded-xl"
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-110 hover:rotate-90 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto ${
          isFullscreen ? 'p-8 max-w-4xl mx-auto w-full' : 'p-6'
        } space-y-6 custom-scrollbar`}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  What's on your mind today?
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  I'm here to help you with any questions or tasks you might have. Just start typing!
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 animate-in slide-in-from-bottom-2 fade-in-0 duration-500 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 shadow-lg ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 dark:from-slate-700 dark:via-slate-600 dark:to-slate-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-3xl shadow-sm transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-200/50 dark:shadow-blue-900/50'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 animate-in slide-in-from-bottom-2 fade-in-0 duration-500">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 dark:from-slate-700 dark:via-slate-600 dark:to-slate-500 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-6 border-t border-slate-200/50 dark:border-slate-700/30 ${
          isFullscreen 
            ? 'bg-gradient-to-r from-white/80 via-slate-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl' 
            : 'bg-gradient-to-r from-white/60 to-slate-50/60 dark:from-slate-900/60 dark:to-slate-800/60'
        } backdrop-blur-xl`}>
          <div className={`${isFullscreen ? 'max-w-4xl mx-auto' : ''}`}>
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything..."
                  className="min-h-[52px] max-h-32 bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 focus:border-blue-500/50 dark:focus:border-blue-400/50 resize-none transition-all duration-300 focus:shadow-lg rounded-2xl backdrop-blur-sm pr-12"
                  disabled={isLoading}
                />
                <div className="absolute right-3 bottom-3 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 hover:scale-110 rounded-xl"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 hover:scale-110 rounded-xl"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white shadow-lg px-4 h-[52px] transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:hover:scale-100 rounded-2xl group"
              >
                <Send className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
