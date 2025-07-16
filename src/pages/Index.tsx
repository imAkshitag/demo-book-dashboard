import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Library, BarChart3, Search, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            LibraryManager Pro
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            The complete digital solution for managing your book collection. 
            Add, organize, and track your books with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                <Shield className="h-5 w-5 mr-2" />
                Demo Login
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Library className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-book bg-white/10 border-white/20 backdrop-blur-sm animate-slide-up">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Library className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Book Management</CardTitle>
              <CardDescription className="text-white/80">
                Add, edit, and organize your entire book collection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-book bg-white/10 border-white/20 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Smart Search</CardTitle>
              <CardDescription className="text-white/80">
                Find books instantly with powerful search and filters
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-book bg-white/10 border-white/20 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Analytics</CardTitle>
              <CardDescription className="text-white/80">
                Track your collection with detailed statistics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo Info */}
        <Card className="max-w-2xl mx-auto shadow-book bg-white/95 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Ready to Explore?</CardTitle>
            <CardDescription>
              This is a fully functional demo of the LibraryManager Pro system
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✅ Pre-filled demo login credentials</p>
              <p>✅ Full book management features</p>
              <p>✅ localStorage persistence</p>
              <p>✅ Responsive design</p>
            </div>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="hero" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Start Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
