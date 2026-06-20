import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/stores/adminStore';
import { toast } from 'sonner';
import { Lock, Shield } from 'lucide-react';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: () => void;
}

export function AdminLoginModal({ open, onOpenChange, onLoginSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAdminStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(password);
    setLoading(false);
    if (ok) {
      toast.success('Welcome, Admin');
      setPassword('');
      onOpenChange(false);
      onLoginSuccess?.();
    } else {
      toast.error('Invalid secret code');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Admin Access
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-secret">Secret Passcode</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-secret"
                type="password"
                placeholder="Enter admin secret"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !password.trim()}>
            {loading ? 'Verifying...' : 'Enter Admin Mode'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
