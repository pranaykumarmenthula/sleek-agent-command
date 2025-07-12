
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glow mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Start Your Journey Today</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Ready to Transform
          <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Workflow?
          </span>
        </h2>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of professionals who have automated their tasks and boosted productivity by 300%
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8 scale-in">
          <Input 
            placeholder="Enter your work email" 
            className="px-6 py-4 text-lg rounded-xl border-2 glass focus:glow transition-all duration-300"
          />
          <Button 
            size="lg"
            className="group bg-gradient-to-r from-primary to-accent hover:scale-105 text-white px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-nowrap glow"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground fade-in">
          Free 14-day trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};
