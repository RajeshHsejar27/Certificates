import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, ExternalLink, Link } from 'lucide-react';
import type { Certificate } from '@/types';
import { PDFViewer } from './PDFViewer';
import { toast } from 'sonner';

interface CertificateViewerProps {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateViewer({ certificate, open, onOpenChange }: CertificateViewerProps) {
  const [zoom, setZoom] = useState(1);
  if (!certificate) return null;

  const isPdf = certificate.file_type === 'pdf';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogContent className="max-w-5xl p-0 overflow-hidden"> */}
<DialogContent
  className="
    flex
    flex-col
    w-[95vw]
    max-w-4xl
    h-[70vh]
    sm:h-[90vh]
    p-0
    overflow-hidden
  "
>
        <DialogHeader className="
   shrink-0
   px-4
   sm:px-6
   pt-4
   sm:pt-6
   pb-2
 ">
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate pr-4">{certificate.title}</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={certificate.file_url} target="_blank" rel="noopener noreferrer" download>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              {/* <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogTitle>
        </DialogHeader>

<div
  className="
    flex-1
    min-h-0
    overflow-auto
    bg-muted/30
  "
>
{/* 
        <div className="relative max-h-[70vh] overflow-auto bg-muted/30"> */}
          {isPdf ? (
            <PDFViewer url={certificate.file_url} zoom={zoom} />
          ) : (
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}>
              <img
                src={certificate.file_url}
                alt={certificate.title}
                className="mx-auto max-w-full h-auto object-contain"
                draggable={false}
              />
            </div>
          )}
        </div>

        <div className="
   shrink-0
   px-4
   sm:px-6
   py-3
   sm:py-4
   border-t
   flex
   flex-col
   sm:flex-row
   items-center
   gap-2
   sm:gap-4
   text-sm
   text-muted-foreground
 ">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 flex-1">
            <span className="font-medium text-foreground">{certificate.issuer}</span>
            {certificate.issue_date && (
              <span>Issued: {new Date(certificate.issue_date).toLocaleDateString()}</span>
            )}
          </div>

          <div className="flex-shrink-0">
            {certificate.external_url ? (
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5 bg-white/90 shadow-md hover:bg-white"
                asChild
              >
                <a href={certificate.external_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open Link
                </a>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5 bg-white/90 shadow-md hover:bg-white cursor-default"
                onClick={() => toast('No URL')}
              >
                <Link className="h-4 w-4" />
                No URL
              </Button>
            )}
          </div>

         {certificate.description && (
  <p
    className="
      hidden
      sm:block
      text-right
      flex-1
      max-w-md
      truncate
    "
  >
              {certificate.description}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
