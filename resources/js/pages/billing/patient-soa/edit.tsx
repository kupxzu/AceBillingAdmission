import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { FileText, QrCode, Upload, Download } from 'lucide-react';
import { toast } from 'react-toastify';

interface PatientSOA {
    id: number;
    patient_id: number;
    patient_name: string;
    soa_attach: string | null;
    soa_link: string | null;
    amount: number | null;
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
        title: 'Edit SOA',
        href: '#',
    },
];

export default function EditPatientSOA() {
    const { soa } = usePage<{ soa: PatientSOA }>().props;

    const { data, setData, post, processing, errors } = useForm({
        soa_attach: null as File | null,
        soa_link: soa.soa_link || '',
        amount: soa.amount?.toString() || '',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/billing/patient-soa/${soa.id}`, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Patient SOA updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update Patient SOA. Please check the form.');
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('soa_attach', e.target.files[0]);
        }
    };

    const generateQRLink = () => {
        // Generate a unique QR code link for this patient
        const baseUrl = window.location.origin;
        const uniqueLink = `${baseUrl}/soa/view/${soa.id}`;
        setData('soa_link', uniqueLink);
        toast.success('QR Code link generated successfully!');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Patient SOA" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Edit Statement of Account
                    </h1>
                    <p className="text-muted-foreground">
                        Update SOA for {soa.patient_name}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>SOA Information</CardTitle>
                            <CardDescription>
                                Upload PDF statement and generate QR code link
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Patient Name (Read-only) */}
                            <div className="space-y-2">
                                <Label>Patient Name</Label>
                                <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
                                    <FileText className="size-4 text-muted-foreground" />
                                    <span className="font-medium">{soa.patient_name}</span>
                                </div>
                            </div>

                            {/* Document Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="soa_attach">Statement Document (PDF or Image)</Label>
                                {soa.soa_attach && (
                                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Download className="size-4" />
                                        <span>Current file: {soa.soa_attach}</span>
                                    </div>
                                )}
                                <Input
                                    id="soa_attach"
                                    type="file"
                                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleFileChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload a PDF or image file (JPG, PNG, GIF, WEBP) to replace the current document (Max 10MB)
                                </p>
                                <InputError message={errors.soa_attach} />
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">
                                    Amount
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter the total amount for this statement of account
                                </p>
                                <InputError message={errors.amount} />
                            </div>

                            {/* QR Code Link */}
                            <div className="space-y-2">
                                <Label htmlFor="soa_link">QR Code Link</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="soa_link"
                                        value={data.soa_link}
                                        onChange={(e) => setData('soa_link', e.target.value)}
                                        placeholder="https://example.com/soa/view/123"
                                        readOnly
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={generateQRLink}
                                    >
                                        <QrCode className="mr-2 size-4" />
                                        Generate
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Generate a unique link that patients can scan via QR code to view their SOA
                                </p>
                                <InputError message={errors.soa_link} />
                            </div>

                            {/* Display QR Link if exists */}
                            {data.soa_link && (
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <QrCode className="size-5 text-primary" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    QR Code Ready
                                                </p>
                                                <p className="text-xs text-muted-foreground break-all">
                                                    {data.soa_link}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Update SOA
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
