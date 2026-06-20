import { useState, useMemo } from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import { useCategories } from '@/hooks/useCategories';
import { CertificateCard } from './CertificateCard';
import { CertificateViewer } from './CertificateViewer';
import { CategoryTabs } from './CategoryTabs';
import { CertificateUploadForm } from './CertificateUploadForm';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Certificate } from '@/types';

export function PublicDashboard() {
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const { data: certificates, isLoading } = useCertificates();
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [editCert, setEditCert] = useState<Certificate | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const filteredCerts = useMemo(() => {
    if (!certificates) return [];
    let filtered = certificates;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((c) => c.category_id === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.issuer.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [certificates, selectedCategory, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CategoryTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search certificates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            {isAdmin && (
              <Button onClick={() => setShowUpload(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Upload
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg">No certificates found</p>
            <p className="text-sm">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCerts.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                category={categories?.find((c) => c.id === cert.category_id)}
                onClick={() => setPreviewCert(cert)}
                onEdit={() => setEditCert(cert)}
              />
            ))}
          </div>
        )}
      </div>

      <CertificateViewer
        certificate={previewCert}
        open={!!previewCert}
        onOpenChange={(v) => !v && setPreviewCert(null)}
      />

      <CertificateUploadForm
        open={showUpload || !!editCert}
        onOpenChange={(v) => {
          if (!v) {
            setShowUpload(false);
            setEditCert(null);
          }
        }}
        certificate={editCert}
      />
    </div>
  );
}
