import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Lock, User, ArrowRight, Shield } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.username);
      
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]" />
      </div>

      <Card className="w-full max-w-md p-8 glass border-2 border-border/50 shadow-elegant">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          <p className="text-muted-foreground">
            Access your portfolio dashboard
          </p>
        </div>

        <Separator className="mb-8" />

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="username" className="text-foreground font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-foreground font-semibold flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass border-2 border-border/50 focus:border-primary transition-all h-11"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 h-11 text-base shadow-lg hover:glow-primary transition-smooth"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <Separator className="my-6" />

        <div className="space-y-3">
          <div className="text-center p-4 glass rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground mb-2">Default Credentials</p>
            <div className="space-y-1 text-sm">
              <p className="text-foreground">
                <span className="text-muted-foreground">Username:</span>{" "}
                <span className="font-mono font-semibold">admin</span>
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Password:</span>{" "}
                <span className="font-mono font-semibold">admin123</span>
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Change default credentials in production
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
