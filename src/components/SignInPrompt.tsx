
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

interface SignInPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInPrompt: React.FC<SignInPromptProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Sign In Required</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          Please sign in to start chatting with your AI assistant and access all features.
        </p>
        
        <div className="space-y-4">
          <Link to="/signin" className="block">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
};
