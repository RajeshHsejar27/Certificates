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
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;

      setContainerWidth(
        Math.max(
          Math.min(width - 16, 1400),
          250
        )
      );
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const pageWidth = Math.round(
    Math.min(containerWidth * zoom, 1400)
  );

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-auto"
    >
      {loading && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading PDF...
          </p>
        </div>
      )}

      {error ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-sm font-medium">
            Failed to load PDF
          </p>
          <p className="text-xs">
            Try opening the file directly
          </p>
        </div>
      ) : (
        <Document
          file={url}
          onLoadSuccess={(doc) => {
            setNumPages(doc.numPages);
            setLoading(false);
          }}
          onLoadError={(err) => {
            console.error(err);
            setLoading(false);
            setError(true);
          }}
          className="flex flex-col items-center gap-6 py-4"
        >
          {Array.from(
            { length: numPages },
            (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={pageWidth}
                renderAnnotationLayer
                renderTextLayer
                className="shadow-lg"
              />
            )
          )}
        </Document>
      )}
    </div>
  );
}