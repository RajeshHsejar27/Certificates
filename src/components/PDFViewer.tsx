import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, AlertTriangle } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PDFViewerProps {
  url: string;
  zoom: number;
}

export function PDFViewer({ url, zoom }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 48);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      {loading && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      )}
      {error ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-sm font-medium">Failed to load PDF</p>
          <p className="text-xs text-muted-foreground">Try opening the file directly</p>
        </div>
      ) : (
        <Document
          file={url}
          onLoadSuccess={(doc) => {
            setNumPages(doc.numPages);
            setLoading(false);
          }}
          onLoadError={() => {
            setLoading(false);
            setError(true);
          }}
          className="flex flex-col items-center gap-4"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={containerWidth * zoom}
              renderAnnotationLayer={true}
              renderTextLayer={true}
              className="shadow-lg"
            />
          ))}
        </Document>
      )}
    </div>
  );
}
