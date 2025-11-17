import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { FileText, QrCode, Upload, Search, Eye, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PDFViewer } from '@/components/pdf-viewer';
import { toast } from 'react-toastify';

interface Patient {
    id: number;
    name: string;
    created_at: string;
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
        title: 'Create SOA',
        href: '/billing/patient-soa/create',
    },
];

export default function CreatePatientSOA() {
    const { patients } = usePage<{ patients: Patient[] }>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'pdf' | 'image' | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        soa_attach: null as File | null,
        soa_link: '',
        amount: '',
    });

    // Filter patients based on search term
    const filteredPatients = useMemo(() => {
        if (!searchTerm) return patients;
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [patients, searchTerm]);

    // Get patients created today
    const today = new Date().toISOString().split('T')[0];
    const todayPatients = filteredPatients.filter(p => p.created_at === today);
    const olderPatients = filteredPatients.filter(p => p.created_at !== today);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/billing/patient-soa', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Patient SOA created successfully!');
            },
            onError: () => {
                toast.error('Failed to create Patient SOA. Please check the form.');
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('soa_attach', file);
            
            // Determine file type
            const isPDF = file.type === 'application/pdf';
            setFileType(isPDF ? 'pdf' : 'image');
            
            // For PDFs, use FileReader to create a data URL for react-pdf compatibility
            if (isPDF) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        setPreviewUrl(event.target.result as string);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                // For images, use createObjectURL
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            }
        }
    };

    const handlePreviewClose = () => {
        setShowPreview(false);
    };

    const generateQRLink = () => {
        if (!data.patient_id) {
            toast.warning('Please select a patient first');
            return;
        }
        const baseUrl = window.location.origin;
        const uniqueLink = `${baseUrl}/soa/view/${data.patient_id}-${Date.now()}`;
        setData('soa_link', uniqueLink);
        toast.success('QR Code link generated successfully!');
    };

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            if (previewUrl && fileType === 'image' && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl, fileType]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Patient SOA" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create Statement of Account
                    </h1>
                    <p className="text-muted-foreground">
                        Upload PDF statement and generate QR code link for a patient
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>SOA Information</CardTitle>
                            <CardDescription>
                                Select patient and upload their billing statement
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Patient Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="patient_id">
                                    Patient <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.patient_id}
                                    onValueChange={(value) => setData('patient_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Search Input */}
                                        <div className="flex items-center border-b px-3 pb-2">
                                            <Search className="mr-2 size-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Search patients..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>

                                        {/* Today's Patients */}
                                        {todayPatients.length > 0 && (
                                            <>
                                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                    Created Today ({todayPatients.length})
                                                </div>
                                                {todayPatients.map((patient) => (
                                                    <SelectItem
                                                        key={patient.id}
                                                        value={patient.id.toString()}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span>{patient.name}</span>
                                                            <span className="text-xs text-green-600">New</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </>
                                        )}

                                        {/* Older Patients */}
                                        {olderPatients.length > 0 && (
                                            <>
                                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                    {todayPatients.length > 0 ? 'Previous Patients' : 'All Patients'} ({olderPatients.length})
                                                </div>
                                                {olderPatients.map((patient) => (
                                                    <SelectItem
                                                        key={patient.id}
                                                        value={patient.id.toString()}
                                                    >
                                                        {patient.name}
                                                    </SelectItem>
                                                ))}
                                            </>
                                        )}

                                        {/* No Results */}
                                        {filteredPatients.length === 0 && (
                                            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                                No patients found
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.patient_id} />
                            </div>

                            {/* Document Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="soa_attach">
                                    Statement Document (PDF or Image) <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="soa_attach"
                                        type="file"
                                        accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleFileChange}
                                        required
                                    />
                                    {data.soa_attach && (
                                        <>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Upload className="size-4" />
                                                {data.soa_attach.name}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowPreview(true)}
                                            >
                                                <Eye className="size-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Upload a PDF or image file (JPG, PNG, GIF, WEBP) containing the patient's statement (Max 10MB)
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
                                    Create SOA
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

                {/* Preview Dialog */}
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Statement Preview</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-auto max-h-[calc(90vh-8rem)]">
                            {fileType === 'pdf' && previewUrl && (
                                <PDFViewer fileUrl={previewUrl} />
                            )}
                            {fileType === 'image' && previewUrl && (
                                <div className="flex justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Statement Preview"
                                        className="max-w-full h-auto"
                                    />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
