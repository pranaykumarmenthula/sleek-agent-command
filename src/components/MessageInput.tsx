
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-12 subtle-glow">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            AI Assistant • Beta
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight tracking-tight">
          What can I help you
          <span className="block font-medium text-gradient mt-2">
            accomplish today?
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed font-light">
          Your AI-powered assistant that connects to all your apps and handles tasks through natural conversation.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative glass-card rounded-2xl p-8 elevated-card">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schedule a team meeting for next Tuesday at 2 PM..."
              className="min-h-[120px] border-0 bg-transparent text-lg placeholder:text-muted-foreground/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Press Enter to send, Shift+Enter for new line
              </div>
              <Button
                type="submit"
                disabled={!message.trim()}
                className="button-gradient text-primary-foreground shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            { icon: "📧", label: "Email", action: "email management" },
            { icon: "📅", label: "Calendar", action: "scheduling" },
            { icon: "📝", label: "Notes", action: "note-taking" },
            { icon: "🔍", label: "Research", action: "research" }
          ].map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => setMessage(`Help me with ${suggestion.action}...`)}
              className="px-6 py-3 glass-card hover:bg-secondary/30 rounded-full text-sm font-medium flex items-center gap-2 soft-shadow"
            >
              <span className="text-lg">{suggestion.icon}</span>
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
