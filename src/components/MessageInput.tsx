
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
    <section className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 mb-8">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Your AI-Powered Assistant
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          What can I help you
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            accomplish today?
          </span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
          Simply describe what you need, and I'll handle the rest across all your connected apps and services.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={displayText}
              className="min-h-[120px] border-0 bg-transparent text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Press Enter to send, Shift+Enter for new line
              </div>
              <Button
                type="submit"
                disabled={!message.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["📧 Email", "📅 Calendar", "📝 Notes", "🔍 Research"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setMessage(`Help me with ${suggestion.split(' ')[1].toLowerCase()}...`)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
