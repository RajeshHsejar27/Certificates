import { useState } from 'react';
import { FileText, Image, Eye, Trash2, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Certificate, Category } from '@/types';
import { useAdminStore } from '@/stores/adminStore';
import { useDeleteCertificate } from '@/hooks/useCertificates';
import { PDFThumbnail } from './PDFThumbnail';

interface CertificateCardProps {
  certificate: Certificate;
  category?: Category;
  onClick: (cert: Certificate) => void;
  onEdit?: (cert: Certificate) => void;
}

export function CertificateCard({ certificate, category, onClick, onEdit }: CertificateCardProps) {
  const [imageError, setImageError] = useState(false);
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const deleteMutation = useDeleteCertificate();
  const thumbnail = certificate.thumbnail_url || certificate.file_url;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this certificate?')) {
      deleteMutation.mutate(certificate);
    }
  };



  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
      onClick={() => onClick(certificate)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
        {certificate.file_type === 'pdf' ? (
          <PDFThumbnail url={certificate.file_url} width={320} />
        ) : imageError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Image className="h-10 w-10" />
            <span className="text-xs font-medium">Image unavailable</span>
          </div>
        ) : (
          <img
            src={thumbnail}
            alt={certificate.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

        <div className="absolute bottom-2 left-2 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Badge variant="secondary" className="bg-white/90 text-xs shadow-sm">
            {certificate.file_type === 'pdf' ? (
              <FileText className="mr-1 h-3 w-3" />
            ) : (
              <Image className="mr-1 h-3 w-3" />
            )}
            {certificate.file_type.toUpperCase()}
          </Badge>
          {category && (
            <Badge variant="secondary" className="bg-white/90 text-xs shadow-sm">
              {category.name}
            </Badge>
          )}
        </div>

        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {isAdmin && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 bg-white/90 shadow-sm hover:bg-white"
                onClick={() => onEdit?.(certificate)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 bg-white/90 shadow-sm hover:bg-white text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 bg-white/90 shadow-sm hover:bg-white"
            onClick={(e) => { e.stopPropagation(); onClick(certificate); }}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">{certificate.title}</h3>
        <p className="text-xs text-muted-foreground">{certificate.issuer}</p>
        {certificate.issue_date && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(certificate.issue_date).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
