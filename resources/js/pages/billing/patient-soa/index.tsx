import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, FileText, Upload, QrCode, Eye, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import QRCodeLib from 'qrcode';
import { PDFViewer } from '@/components/pdf-viewer';
import { toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Dashboard',
        href: '/billing/dashboard',
    },
    {
        title: 'Patient SOA',
        href: '/billing/patient-soa',
    },
];

interface PatientSOA {
    id: number;
    patient_id: number;
    patient_name: string;
    soa_attach: string | null;
    soa_link: string | null;
    amount: number | null;
    file_type?: 'image' | 'pdf';
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSOA {
    data: PatientSOA[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    from?: number;
    to?: number;
}

export default function PatientSOAIndex() {
    const { soas, filters } = usePage<{
        soas: PaginatedSOA;
        filters: { search?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [showQrModal, setShowQrModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedSoa, setSelectedSoa] = useState<PatientSOA | null>(null);
    const qrCanvasRef = useRef<HTMLCanvasElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/billing/patient-soa', { search }, { preserveState: true });
    };

    const handleShowQrCode = (soa: PatientSOA) => {
        if (soa.soa_link) {
            setSelectedSoa(soa);
            setShowQrModal(true);
        }
    };

    const handleShowPdf = (soa: PatientSOA) => {
        if (soa.soa_attach) {
            setSelectedSoa(soa);
            setShowPdfModal(true);
        }
    };

    useEffect(() => {
        if (showQrModal && selectedSoa?.soa_link && qrCanvasRef.current) {
            QRCodeLib.toCanvas(
                qrCanvasRef.current,
                selectedSoa.soa_link,
                {
                    width: 256,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                },
                (error) => {
                    if (error) console.error('Error generating QR code:', error);
                }
            );
        }
    }, [showQrModal, selectedSoa]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient SOA" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Patient Statement of Accounts
                        </h1>
                        <p className="text-muted-foreground">
                            Manage patient billing statements ({soas.total} total)
                        </p>
                    </div>
                    <Link href="/billing/patient-soa/create">
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Create SOA
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search SOA</CardTitle>
                        <CardDescription>
                            Find patient statements by patient name
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by patient name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                            {search && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('');
                                        router.get('/billing/patient-soa');
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* SOA Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Patient Statements</CardTitle>
                        <CardDescription>
                            A list of all patient statement of accounts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>PDF Attachment</TableHead>
                                    <TableHead>QR Code Link</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {soas.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No patient statements found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    soas.data.map((soa) => (
                                        <TableRow key={soa.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="size-4 text-blue-600" />
                                                    {soa.patient_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {soa.amount ? (
                                                    <span className="font-semibold">
                                                        ₱{parseFloat(soa.amount.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        Not set
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {soa.soa_attach ? (
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1"
                                                        >
                                                            <Upload className="size-3" />
                                                            Attached
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleShowPdf(soa)}
                                                            title="Preview PDF"
                                                        >
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        No file
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {soa.soa_link ? (
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1"
                                                        >
                                                            <QrCode className="size-3" />
                                                            Generated
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleShowQrCode(soa)}
                                                        >
                                                            <QrCode className="size-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        No link
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(soa.updated_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/billing/patient-soa/${soa.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="mr-1 size-3" />
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/billing/patient-soa/${soa.id}/edit`}
                                                >
                                                    <Button variant="ghost" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {soas.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {soas.from ?? 0}-{soas.to ?? soas.data.length} of {soas.total} statements
                                </div>
                                <div className="flex gap-2">
                                    {soas.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url);
                                                }
                                            }}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* QR Code Modal */}
            <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Patient SOA QR Code</DialogTitle>
                        <DialogDescription>
                            {selectedSoa?.patient_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="rounded-lg border p-4 bg-white">
                            <canvas ref={qrCanvasRef} />
                        </div>
                        {selectedSoa?.soa_link && (
                            <div className="w-full space-y-2">
                                <p className="text-xs text-muted-foreground text-center break-all">
                                    {selectedSoa.soa_link}
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <a
                                        href={selectedSoa.soa_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Link
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Document Preview Modal */}
            <Dialog open={showPdfModal} onOpenChange={setShowPdfModal}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSoa?.file_type === 'image' ? 'Image Preview' : 'PDF Preview'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedSoa?.patient_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-auto max-h-[70vh]">
                        {selectedSoa?.soa_attach && (
                            selectedSoa.file_type === 'image' ? (
                                <div className="flex justify-center p-4">
                                    <img 
                                        src={`/storage/${selectedSoa.soa_attach}`}
                                        alt={`SOA for ${selectedSoa.patient_name}`}
                                        className="max-w-full h-auto rounded-lg border"
                                    />
                                </div>
                            ) : (
                                <PDFViewer 
                                    fileUrl={`/storage/${selectedSoa.soa_attach}`}
                                    fileName={`SOA-${selectedSoa.patient_name}.pdf`}
                                />
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
