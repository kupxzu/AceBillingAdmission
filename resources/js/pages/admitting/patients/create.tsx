import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'react-toastify';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admitting Dashboard',
        href: '/admitting/dashboard',
    },
    {
        title: 'Patients',
        href: '/admitting/patients',
    },
    {
        title: 'Add Patient',
        href: '/admitting/patients/create',
    },
];

export default function CreatePatient() {
    const [showCustomExtension, setShowCustomExtension] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        extension_name: '',
        address: '',
        phone_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admitting/patients', {
            onSuccess: () => {
                toast.success('Patient created successfully!');
            },
            onError: () => {
                toast.error('Failed to create patient. Please check the form.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Patient" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Patient</h1>
                    <p className="text-muted-foreground">
                        Register a new patient in the system
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Information</CardTitle>
                            <CardDescription>
                                Enter the patient's personal and contact information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name Fields */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">
                                        First Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                        placeholder="Juan"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">
                                        Last Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        required
                                        placeholder="Dela Cruz"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="middle_name">Middle Name</Label>
                                    <Input
                                        id="middle_name"
                                        value={data.middle_name}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                        placeholder="Santos"
                                    />
                                    <InputError message={errors.middle_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="extension_name">Extension Name</Label>
                                    {!showCustomExtension ? (
                                        <Select
                                            value={data.extension_name}
                                            onValueChange={(value) => {
                                                if (value === 'custom') {
                                                    setShowCustomExtension(true);
                                                    setData('extension_name', '');
                                                } else {
                                                    setData('extension_name', value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select extension" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="Jr.">Jr.</SelectItem>
                                                <SelectItem value="Sr.">Sr.</SelectItem>
                                                <SelectItem value="II">II</SelectItem>
                                                <SelectItem value="III">III</SelectItem>
                                                <SelectItem value="IV">IV</SelectItem>
                                                <SelectItem value="custom">Custom (add extension name)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                id="extension_name"
                                                value={data.extension_name}
                                                onChange={(e) => setData('extension_name', e.target.value)}
                                                placeholder="Enter custom extension"
                                                autoFocus
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowCustomExtension(false);
                                                    setData('extension_name', '');
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                    <InputError message={errors.extension_name} />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    placeholder="+63 912 345 6789"
                                />
                                <InputError message={errors.phone_number} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="123 Main St, Barangay Sample, City, Province"
                                    rows={3}
                                />
                                <InputError message={errors.address} />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Create Patient
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
