import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PublicDashboard } from '@/components/PublicDashboard';
import { AdminPage } from '@/components/AdminPage';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { useAdminStore } from '@/stores/adminStore';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'admin'>('dashboard');
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin') {
      setShowLogin(true);
      setCurrentPage('dashboard');
    } else if (hash === 'admin-panel') {
      if (isAdmin) {
        setCurrentPage('admin');
      } else {
        window.location.hash = 'admin';
        setShowLogin(true);
        setCurrentPage('dashboard');
      }
    } else {
      setCurrentPage('dashboard');
    }
  }, [isAdmin]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setShowLogin(true);
        setCurrentPage('dashboard');
      } else if (hash === 'admin-panel') {
        if (isAdmin) {
          setCurrentPage('admin');
        } else {
          window.location.hash = 'admin';
          setShowLogin(true);
          setCurrentPage('dashboard');
        }
      } else {
        setCurrentPage('dashboard');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdmin]);

  const handleLoginSuccess = () => {
    window.location.hash = 'admin-panel';
    setCurrentPage('admin');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {currentPage === 'admin' && isAdmin ? <AdminPage /> : <PublicDashboard />}
      </main>
      <AdminLoginModal
        open={showLogin}
        onOpenChange={(open) => {
          setShowLogin(open);
          if (!open && currentPage !== 'admin') {
            window.location.hash = '';
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
