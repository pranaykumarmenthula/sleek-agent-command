
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg mb-8">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Your Journey Today</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text">
            Ready to Transform
          </span>
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Workflow?
          </span>
        </h2>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who have automated their tasks and boosted productivity by 300%
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
          <Input 
            placeholder="Enter your work email" 
            className="px-6 py-4 text-lg rounded-xl border-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 border-slate-200 dark:border-slate-700"
          />
          <Button 
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Free 14-day trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};
