
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const samplePrompts = [
  "Schedule a team meeting for next Tuesday at 2 PM...",
  "Send a follow-up email about the project proposal...", 
  "Create a summary of today's important emails...",
  "Book a flight to San Francisco for next month...",
  "Set a reminder to call the new client tomorrow...",
  "Draft a marketing campaign proposal for Q2..."
];

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentPrompt = samplePrompts[placeholderIndex];
    let currentIndex = 0;
    
    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (currentIndex <= currentPrompt.length) {
          setDisplayText(currentPrompt.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setIsTyping(false), 3000);
        }
      }, 60);

      return () => clearInterval(typingInterval);
    } else {
      const fadingInterval = setInterval(() => {
        if (currentIndex >= 0) {
          setDisplayText(currentPrompt.slice(0, currentIndex));
          currentIndex--;
        } else {
          clearInterval(fadingInterval);
          setPlaceholderIndex((prev) => (prev + 1) % samplePrompts.length);
          setIsTyping(true);
        }
      }, 40);

      return () => clearInterval(fadingInterval);
    }
  }, [placeholderIndex, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8 glow fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            AI Assistant • Beta
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight fade-in-up">
          What can I help you
          <span className="block text-gradient">
            accomplish today?
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed fade-in-up" style={{ animationDelay: '0.2s' }}>
          Your AI-powered assistant that connects to all your apps and handles tasks through natural conversation.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="relative glass-card rounded-2xl p-6 glow transition-all duration-500 hover:glow-purple group">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={displayText + (isTyping ? "|" : "")}
              className="min-h-[120px] border-0 bg-transparent text-lg placeholder:text-muted-foreground/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300"
            />
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Press Enter to send, Shift+Enter for new line
              </div>
              <Button
                type="submit"
                disabled={!message.trim()}
                className="button-gradient hover:scale-105 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow group-hover:scale-105"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3 fade-in" style={{ animationDelay: '0.6s' }}>
          {[
            { icon: "📧", label: "Email", action: "email management" },
            { icon: "📅", label: "Calendar", action: "scheduling" },
            { icon: "📝", label: "Notes", action: "note-taking" },
            { icon: "🔍", label: "Research", action: "research" }
          ].map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => setMessage(`Help me with ${suggestion.action}...`)}
              className="px-4 py-2 glass-card hover:bg-secondary/50 rounded-full text-sm transition-all duration-300 hover:scale-105 hover:glow flex items-center gap-2 group"
            >
              <span className="group-hover:scale-110 transition-transform duration-300">
                {suggestion.icon}
              </span>
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
