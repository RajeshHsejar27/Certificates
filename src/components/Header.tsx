import { Award, Shield, LogOut } from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Header() {
  const { isAdmin, logout } = useAdminStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    window.location.hash = '';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Award className="h-7 w-7 text-primary" />
          <h1 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
            Certificate Repository of Rajesh N
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
                <Shield className="h-3 w-3" />
                Admin
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
