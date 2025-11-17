import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
    fileUrl: string;
    fileName?: string;
}

export function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function zoomIn() {
        setScale((prevScale) => Math.min(prevScale + 0.2, 3.0));
    }

    function zoomOut() {
        setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={previousPage}
                        disabled={pageNumber <= 1}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm">
                        Page {pageNumber} of {numPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={pageNumber >= numPages}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={zoomOut}>
                        <ZoomOut className="size-4" />
                    </Button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={zoomIn}>
                        <ZoomIn className="size-4" />
                    </Button>
                </div>

                <Button variant="outline" size="sm" asChild>
                    <a href={fileUrl} download={fileName || 'document.pdf'}>
                        <Download className="mr-1 size-4" />
                        Download
                    </a>
                </Button>
            </div>

            {/* PDF Display */}
            <div className="overflow-auto rounded-lg border bg-muted/30">
                <div className="flex justify-center p-4">
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex h-96 items-center justify-center">
                                <div className="text-center">
                                    <div className="mb-2 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                    <p className="text-sm text-muted-foreground">Loading PDF...</p>
                                </div>
                            </div>
                        }
                        error={
                            <div className="flex h-96 items-center justify-center">
                                <p className="text-sm text-destructive">Failed to load PDF</p>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
}
