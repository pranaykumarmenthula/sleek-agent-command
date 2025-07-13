import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Chrome } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const SignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const { setIsSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    console.log("Google sign in initiated");
    // Simulate successful Google sign-in
    setIsSignedIn(true);
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignUp ? "Sign up" : "Sign in", formData);
    // Simulate successful sign-in
    setIsSignedIn(true);
    navigate("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      <div className="pt-20 pb-16">
        <div className="max-w-md mx-auto px-4">
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                {isSignUp 
                  ? "Sign up to get started with AI Agent" 
                  : "Sign in to your AI Agent account"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                variant="outline" 
                onClick={handleGoogleSignIn}
                className="w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              
              <div className="relative">
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-2 text-sm text-slate-500 dark:text-slate-400">
                  or
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="password" 
                    name="password"
                    placeholder="Enter your password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isSignUp 
                    ? "Already have an account? Sign in" 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>

              {!isSignUp && (
                <div className="text-center">
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
