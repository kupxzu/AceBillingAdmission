import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/build/pdfjs/pdf.worker.js';

interface PDFViewerProps {
    fileUrl: string;
    fileName?: string;
}

export function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [loading, setLoading] = useState<boolean>(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setPageNumber(1);
        setLoading(false);
    }

    function onDocumentLoadError(error: Error): void {
        console.error('Error loading PDF:', error);
        setLoading(false);
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
                        disabled={pageNumber <= 1 || loading}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm">
                        Page {pageNumber} of {numPages || '?'}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={pageNumber >= numPages || loading}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={zoomOut} disabled={loading}>
                        <ZoomOut className="size-4" />
                    </Button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={zoomIn} disabled={loading}>
                        <ZoomIn className="size-4" />
                    </Button>
                </div>

                {fileUrl && (
                    <Button variant="outline" size="sm" asChild>
                        <a href={fileUrl} download={fileName || 'document.pdf'}>
                            <Download className="mr-1 size-4" />
                            Download
                        </a>
                    </Button>
                )}
            </div>

            {/* PDF Display */}
            <div className="overflow-auto rounded-lg border bg-muted/30">
                <div className="flex justify-center p-4">
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="flex h-96 items-center justify-center">
                                <div className="text-center">
                                    <div className="mb-2 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                                    <p className="text-sm text-muted-foreground">Loading PDF...</p>
                                </div>
                            </div>
                        }
                        error={
                            <div className="flex h-96 items-center justify-center">
                                <div className="text-center">
                                    <p className="text-sm text-destructive font-medium">Failed to load PDF</p>
                                    <p className="text-xs text-muted-foreground mt-1">Please try again or use a different file</p>
                                </div>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
}
