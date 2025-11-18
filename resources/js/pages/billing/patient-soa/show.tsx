import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, QrCode, Download, Calendar, User, Eye, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { PDFViewer } from '@/components/pdf-viewer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Dashboard',
        href: '/billing/dashboard',
    },
    {
        title: 'Patient SOA',
        href: '/billing/patient-soa',
    },
    {
        title: 'View SOA',
        href: '#',
    },
];

export default function ShowPatientSOA() {
    const { soa } = usePage<{ soa: PatientSOA }>().props;
    const qrCanvasRef = useRef<HTMLCanvasElement>(null);
    const [showPreview, setShowPreview] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    useEffect(() => {
        if (soa.soa_link && qrCanvasRef.current) {
            QRCode.toCanvas(
                qrCanvasRef.current,
                soa.soa_link,
                {
                    width: 200,
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
    }, [soa.soa_link]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`SOA - ${soa.patient_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Statement of Account
                        </h1>
                        <p className="text-muted-foreground">
                            View patient billing statement details
                        </p>
                    </div>
                    <Button onClick={() => window.history.back()} variant="outline">
                        Back
                    </Button>
                </div>

                {/* Patient Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                        <CardDescription>
                            Basic patient details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Patient Name</p>
                                <p className="font-semibold">{soa.patient_name}</p>
                            </div>
                        </div>
                        {soa.amount && (
                            <div className="flex items-center gap-3">
                                <FileText className="size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="font-semibold text-lg">₱{parseFloat(soa.amount.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* SOA Documents */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Document Attachment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {soa.file_type === 'image' ? (
                                    <ImageIcon className="size-5" />
                                ) : (
                                    <FileText className="size-5" />
                                )}
                                {soa.file_type === 'image' ? 'Image Statement' : 'PDF Statement'}
                            </CardTitle>
                            <CardDescription>
                                Attached {soa.file_type === 'image' ? 'image' : 'PDF'} document
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {soa.soa_attach ? (
                                <div className="space-y-3">
                                    <Badge variant="outline" className="gap-1">
                                        <Download className="size-3" />
                                        {soa.file_type === 'image' ? 'Image' : 'PDF'} Available
                                    </Badge>
                                    <p className="text-sm text-muted-foreground break-all">
                                        {soa.soa_attach}
                                    </p>
                                    <div className="grid gap-2">
                                        <Button 
                                            variant="outline" 
                                            className="w-full"
                                            onClick={() => setShowPreview(true)}
                                        >
                                            <Eye className="mr-2 size-4" />
                                            {`Preview ${soa.file_type === 'image' ? 'Image' : 'PDF'}`}
                                        </Button>
                                        <Button className="w-full" asChild>
                                            <a
                                                href={`/storage/${soa.soa_attach}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                <Download className="mr-2 size-4" />
                                                Download {soa.file_type === 'image' ? 'Image' : 'PDF'}
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No file attached
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* QR Code Link */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="size-5" />
                                QR Code Link
                            </CardTitle>
                            <CardDescription>
                                Patient access link
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {soa.soa_link ? (
                                <div className="space-y-3">
                                    <Badge variant="outline" className="gap-1">
                                        <QrCode className="size-3" />
                                        Link Generated
                                    </Badge>
                                    
                                    {/* QR Code Display */}
                                    <div className="flex justify-center p-4 bg-muted rounded-lg">
                                        <canvas ref={qrCanvasRef} className="rounded" />
                                    </div>
                                    
                                    <p className="text-xs text-muted-foreground break-all text-center">
                                        {soa.soa_link}
                                    </p>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a
                                            href={soa.soa_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Open Link
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No QR code link generated
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Document Preview Modal */}
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogContent className="w-[95vw] max-w-5xl lg:max-w-6xl max-h-[92vh]">
                        <DialogHeader>
                            <DialogTitle>
                                {soa.file_type === 'image' ? 'Image Preview' : 'PDF Preview'}
                            </DialogTitle>
                            <DialogDescription>
                                Interactive document preview for {soa.patient_name}
                            </DialogDescription>
                        </DialogHeader>
                        {soa.soa_attach ? (
                            <div className="overflow-auto h-[calc(92vh-7rem)]">
                                {soa.file_type === 'image' ? (
                                    <div className="flex justify-center">
                                        <img
                                            src={`/storage/${soa.soa_attach}`}
                                            alt={`SOA for ${soa.patient_name}`}
                                            className="max-w-full h-auto rounded-lg border"
                                        />
                                    </div>
                                ) : (
                                    <PDFViewer
                                        fileUrl={`/storage/${soa.soa_attach}`}
                                        fileName={`SOA-${soa.patient_name}.pdf`}
                                    />
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No attachment available for preview.
                            </p>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Timestamps */}
                <Card>
                    <CardHeader>
                        <CardTitle>Record Information</CardTitle>
                        <CardDescription>
                            Creation and update timestamps
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar className="size-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="text-sm font-medium">
                                    {formatDate(soa.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="size-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p className="text-sm font-medium">
                                    {formatDate(soa.updated_at)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
