import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Login Successful",
      description: "Welcome to LibraryManager Pro!",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-book border-0">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">LibraryManager Pro</CardTitle>
              <CardDescription className="text-muted-foreground">
                Demo Login - Access your book management system
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value="admin@library.com"
                    readOnly
                    className="pl-10 bg-muted cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value="password123"
                    readOnly
                    className="pl-10 bg-muted cursor-not-allowed"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In to Dashboard"}
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>Demo credentials are pre-filled</p>
                <p className="text-xs mt-1">Click "Sign In" to access the dashboard</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;