
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const samplePrompts = [
  "Schedule a meeting with my team for next Tuesday...",
  "Send an email to John about the project update...",
  "Create a summary of today's important emails...",
  "Book a flight to New York for next month...",
  "Set a reminder to call the client tomorrow...",
  "Draft a proposal for the new marketing campaign..."
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
          setTimeout(() => setIsTyping(false), 2000);
        }
      }, 50);

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
      }, 30);

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
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 glow">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            Your AI-Powered Assistant
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          What can I help you
          <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            accomplish today?
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Simply describe what you need, and I'll handle the rest across all your connected apps and services.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto scale-in">
          <div className="relative glass rounded-2xl p-6 glow transition-all duration-500 hover:glow-purple">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={displayText}
              className="min-h-[120px] border-0 bg-transparent text-lg placeholder:text-muted-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </div>
              <Button
                type="submit"
                disabled={!message.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:scale-105 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3 fade-in">
          {["📧 Email", "📅 Calendar", "📝 Notes", "🔍 Research"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setMessage(`Help me with ${suggestion.split(' ')[1].toLowerCase()}...`)}
              className="px-4 py-2 glass hover:bg-secondary/50 rounded-full text-sm transition-all duration-300 hover:scale-105 hover:glow"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
