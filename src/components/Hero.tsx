
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
          Why choose our AI Agent?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              One Interface
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Control all your apps and services from a single, intuitive interface
            </p>
          </div>
          
          <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
            <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Smart Automation
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              AI-powered automation that learns your preferences and workflows
            </p>
          </div>
          
          <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
            <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Enterprise-grade security with end-to-end encryption for your data
            </p>
          </div>
        </div>

        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Start Free Trial
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </section>
  );
};
