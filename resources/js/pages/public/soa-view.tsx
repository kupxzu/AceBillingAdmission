import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, User, Building, Eye, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PDFViewer } from '@/components/pdf-viewer';
import { useState } from 'react';

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

interface Props {
    soa: PatientSOA;
}

export default function PublicSOAView({ soa }: Props) {
    const [showPreview, setShowPreview] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title={`SOA - ${soa.patient_name}`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                                <div className="flex justify-center">
                                <img
                                    src="/acelogo2.png"
                                    alt="ACE Logo"
                                    className="h-20 w-auto"
                                />
                                </div>
                        <div className="flex items-center justify-center gap-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                ACE Medical Center Tuguegarao
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            Statement of Account
                        </p>
                    </div>

                    {/* Patient Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="size-5" />
                                Patient Information
                            </CardTitle>
                            <CardDescription>
                                Details for this statement of account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Patient Name
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {soa.patient_name}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Statement Date
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {formatDate(soa.created_at)}
                                    </p>
                                </div>
                            </div>
                            {soa.amount && (
                                <div className="space-y-2 border-t pt-4">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Amount
                                    </p>
                                    <p className="text-2xl font-bold text-primary">
                                        ₱{parseFloat(soa.amount.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* SOA Document */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {soa.file_type === 'image' ? (
                                    <ImageIcon className="size-5" />
                                ) : (
                                    <FileText className="size-5" />
                                )}
                                Statement Document
                            </CardTitle>
                            <CardDescription>
                                Your billing statement is available for download
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {soa.soa_attach ? (
                                <div className="space-y-4">
                                    {!showPreview ? (
                                        <>
                                            <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-6 text-center">
                                                {soa.file_type === 'image' ? (
                                                    <ImageIcon className="mx-auto size-16 text-primary mb-4" />
                                                ) : (
                                                    <FileText className="mx-auto size-16 text-primary mb-4" />
                                                )}
                                                <h3 className="text-lg font-semibold mb-2">
                                                    {soa.file_type === 'image' ? 'Image' : 'PDF'} Document Available
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Click the button below to preview or download your statement of account
                                                </p>
                                                <Badge variant="secondary" className="mb-4">
                                                    {soa.file_type === 'image' ? 'Image Format' : 'PDF Format'}
                                                </Badge>
                                            </div>
                                            
                                            <div className="grid gap-2 md:grid-cols-2">
                                                <Button 
                                                    size="lg" 
                                                    variant="outline"
                                                    className="w-full text-lg h-12" 
                                                    onClick={() => setShowPreview(true)}
                                                >
                                                    <Eye className="mr-2 size-5" />
                                                    Preview {soa.file_type === 'image' ? 'Image' : 'PDF'}
                                                </Button>
                                                <Button 
                                                    size="lg" 
                                                    className="w-full text-lg h-12" 
                                                    asChild
                                                >
                                                    <a
                                                        href={`/storage/${soa.soa_attach}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                    >
                                                        <Download className="mr-2 size-5" />
                                                        Download {soa.file_type === 'image' ? 'Image' : 'PDF'}
                                                    </a>
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">
                                                    {soa.file_type === 'image' ? 'Image Preview' : 'PDF Preview'}
                                                </h3>
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => setShowPreview(false)}
                                                >
                                                    Close Preview
                                                </Button>
                                            </div>
                                            {soa.file_type === 'image' ? (
                                                <div className="flex justify-center p-4 bg-muted rounded-lg">
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
                                    )}
                                    
                                    <p className="text-xs text-center text-muted-foreground">
                                        Please save this document for your records
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center">
                                    <FileText className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                                    <p className="text-muted-foreground">
                                        No document is currently attached to this statement.
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Please contact the billing department for assistance.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Footer Information */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="size-4" />
                                <span>
                                    Last updated: {formatDate(soa.updated_at)}
                                </span>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                For questions about your statement, please contact our billing department.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Security Notice */}
                    <div className="text-center space-y-2 py-4">
                        <p className="text-xs text-muted-foreground">
                            This is a secure link. Do not share this link with others.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            © 2025 ACE Medical Center Tuguegarao Billing. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
