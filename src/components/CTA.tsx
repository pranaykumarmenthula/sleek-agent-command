
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass subtle-glow mb-12">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Start Your Journey Today</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
          Ready to Transform
          <span className="block font-medium text-gradient mt-2">
            Your Workflow?
          </span>
        </h2>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Join thousands of professionals who have automated their tasks and boosted productivity by 300%
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-12">
          <Input 
            placeholder="Enter your work email" 
            className="px-6 py-4 text-lg rounded-xl border-2 glass-card focus:ring-2 focus:ring-ring"
          />
          <Button 
            size="lg"
            className="button-gradient text-primary-foreground px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl whitespace-nowrap subtle-glow group"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground font-light">
          Free 14-day trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};
