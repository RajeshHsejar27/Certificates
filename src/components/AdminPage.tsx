import { useState } from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import { useCategories } from '@/hooks/useCategories';
import { CertificateCard } from './CertificateCard';
import { CertificateViewer } from './CertificateViewer';
import { CertificateUploadForm } from './CertificateUploadForm';
import { CategoryTabs } from './CategoryTabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import type { Certificate } from '@/types';

export function AdminPage() {
  const { data: certificates, isLoading } = useCertificates();
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [editCert, setEditCert] = useState<Certificate | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const filteredCerts = (certificates || []).filter((cert) => {
    if (selectedCategory !== 'all' && cert.category_id !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        cert.title.toLowerCase().includes(q) ||
        cert.issuer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="sm" onClick={() => window.location.hash = ''} className="gap-1.5 h-8 sm:h-9">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
        </Button>
        <h2 className="font-display text-xl sm:text-2xl font-bold">Admin Portal</h2>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <CategoryTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-56 h-9 sm:h-10"
            />
          </div>
          <Button onClick={() => setShowUpload(true)} className="gap-1.5 h-9 sm:h-10 w-full sm:w-auto">
            <Plus className="h-4 w-4" /> <span className="sm:hidden">Upload Certificate</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg">No certificates</p>
            <p className="text-sm">Upload your first certificate to get started</p>
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
