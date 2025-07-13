
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add password reset logic here
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      <div className="pt-20 pb-16">
        <div className="max-w-md mx-auto px-4">
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                {isSubmitted ? "Check Your Email" : "Reset Password"}
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                {isSubmitted 
                  ? "We've sent password reset instructions to your email"
                  : "Enter your email to receive reset instructions"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Send Reset Instructions
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    If an account with <strong>{email}</strong> exists, you'll receive reset instructions shortly.
                  </p>
                </div>
              )}

              <div className="text-center">
                <Link 
                  to="/signin"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
