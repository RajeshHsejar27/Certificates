import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, FileText } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PDFThumbnailProps {
  url: string;
  width?: number;
}

export function PDFThumbnail({ url, width = 320 }: PDFThumbnailProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {error ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <FileText className="h-8 w-8" />
          <span className="text-xs font-medium">PDF Document</span>
        </div>
      ) : (
        <Document
          file={url}
          onLoadSuccess={() => setLoading(false)}
          onLoadError={() => {
            setLoading(false);
            setError(true);
          }}
        >
          <Page
            pageNumber={1}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="!bg-transparent"
          />
        </Document>
      )}
    </div>
  );
}
