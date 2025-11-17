import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admitting Dashboard',
        href: '/admitting/dashboard',
    },
    {
        title: 'Admitting Doctors',
        href: '/admitting/admitting-doctors',
    },
    {
        title: 'Add Doctor',
        href: '/admitting/admitting-doctors/create',
    },
];

export default function CreateAdmittingDoctor() {
    const { data, setData, post, processing, errors } = useForm({
        fullname: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admitting/admitting-doctors');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Admitting Doctor" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add Admitting Doctor</h1>
                    <p className="text-muted-foreground">
                        Register a new admitting physician
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Doctor Information</CardTitle>
                            <CardDescription>
                                Enter the admitting doctor's information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">
                                    Full Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="fullname"
                                    value={data.fullname}
                                    onChange={(e) => setData('fullname', e.target.value)}
                                    required
                                    placeholder="Dr. Juan Dela Cruz"
                                />
                                <InputError message={errors.fullname} />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Create Doctor
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
