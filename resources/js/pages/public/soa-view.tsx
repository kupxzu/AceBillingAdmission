import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Image as ImageIcon, Phone, Mail, X } from 'lucide-react';
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

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const formatCurrency = (value: number) =>
        '₱' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <>
            <Head title={`SOA - ${soa.patient_name}`} />

            {/* Full-screen preview overlay */}
            {showPreview && soa.soa_attach && (
                <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
                    <div className="flex items-center justify-between border-b px-3 py-2.5 sm:px-5 sm:py-3">
                        <p className="text-xs font-medium truncate sm:text-sm">
                            SOA &mdash; {soa.patient_name}
                        </p>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Button size="sm" variant="outline" asChild className="h-8 text-xs sm:h-9 sm:text-sm">
                                <a href={`/storage/${soa.soa_attach}`} download>
                                    <Download className="mr-1 size-3.5 sm:mr-1.5 sm:size-4" />
                                    Save
                                </a>
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setShowPreview(false)} className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                                <X className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6">
                        {soa.file_type === 'image' ? (
                            <div className="flex justify-center">
                                <img
                                    src={`/storage/${soa.soa_attach}`}
                                    alt={`SOA for ${soa.patient_name}`}
                                    className="max-w-full h-auto rounded-md sm:rounded-lg"
                                />
                            </div>
                        ) : (
                            <PDFViewer
                                fileUrl={`/storage/${soa.soa_attach}`}
                                fileName={`SOA-${soa.patient_name}.pdf`}
                            />
                        )}
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-background">
                {/* Hospital header — adapts across breakpoints */}
                <header className="border-b bg-white dark:bg-gray-950">
                    <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 md:max-w-2xl lg:max-w-3xl lg:px-8">
                        <img src="/acelogo2.png" alt="ACE Logo" className="h-8 w-auto shrink-0 sm:h-10 lg:h-12" />
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold leading-tight sm:text-base lg:text-lg">
                                ACE Medical Center Tuguegarao
                            </h1>
                            <p className="text-[11px] text-muted-foreground sm:text-xs">Statement of Account</p>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-xl space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-6 md:max-w-2xl lg:max-w-3xl lg:space-y-6 lg:px-8 lg:py-8">
                    {/* Patient + Amount card */}
                    <div className="rounded-xl border bg-card p-4 space-y-3 sm:p-5 sm:space-y-4 lg:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                                    Patient
                                </p>
                                <p className="mt-0.5 text-base font-semibold leading-tight sm:text-lg lg:text-xl">
                                    {soa.patient_name}
                                </p>
                            </div>
                            <div className="sm:text-right shrink-0">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                                    Date
                                </p>
                                <p className="mt-0.5 text-sm font-medium">
                                    {formatDate(soa.created_at)}
                                </p>
                            </div>
                        </div>

                        {soa.amount != null && (
                            <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3 text-center sm:py-4 lg:py-5">
                                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                                    Total Amount Due
                                </p>
                                <p className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl">
                                    {formatCurrency(soa.amount)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Document section */}
                    <div className="rounded-xl border bg-card p-4 sm:p-5 lg:p-6">
                        <h2 className="flex items-center gap-2 text-sm font-semibold lg:text-base">
                            {soa.file_type === 'image' ? (
                                <ImageIcon className="size-4 text-muted-foreground" />
                            ) : (
                                <FileText className="size-4 text-muted-foreground" />
                            )}
                            Billing Document
                        </h2>

                        {soa.soa_attach ? (
                            <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:grid sm:grid-cols-2">
                                <Button
                                    variant="outline"
                                    className="h-11 w-full sm:h-12"
                                    onClick={() => setShowPreview(true)}
                                >
                                    <Eye className="mr-2 size-4" />
                                    View {soa.file_type === 'image' ? 'Image' : 'Document'}
                                </Button>
                                <Button className="h-11 w-full sm:h-12" asChild>
                                    <a href={`/storage/${soa.soa_attach}`} download>
                                        <Download className="mr-2 size-4" />
                                        Download
                                    </a>
                                </Button>
                            </div>
                        ) : (
                            <div className="mt-3 rounded-lg border border-dashed px-4 py-6 text-center sm:mt-4 sm:py-8">
                                <FileText className="mx-auto size-8 text-muted-foreground/40" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    No document attached yet.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Please contact the billing department.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Help / Contact */}
                    <div className="rounded-xl border bg-card p-4 space-y-2.5 sm:p-5 sm:space-y-3 lg:p-6">
                        <h2 className="text-sm font-semibold lg:text-base">Need Help?</h2>
                        <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm">
                            If you have questions about your statement, please contact our billing department during office hours.
                        </p>
                        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:gap-4 sm:text-sm">
                            <a href="tel:0788441888" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                                <Phone className="size-3.5 sm:size-4" />
                                (078) 844-1888
                            </a>
                            <a href="mailto:billing@acemct.com" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                                <Mail className="size-3.5 sm:size-4" />
                                billing@acemct.com
                            </a>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t">
                    <div className="mx-auto max-w-xl px-4 py-3 text-center space-y-1 sm:px-6 sm:py-4 md:max-w-2xl lg:max-w-3xl lg:px-8">
                        <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                            This is a secure, private link. Please do not share it with others.
                        </p>
                        <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                            &copy; {new Date().getFullYear()} ACE Medical Center Tuguegarao. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
