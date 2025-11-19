import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Stethoscope, UserCog } from 'lucide-react';
import { toast } from 'react-toastify';

interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    extension_name: string | null;
}

interface Doctor {
    id: number;
    fullname: string;
}

interface CurrentAssignments {
    attending_ids?: number[];
    admitting_id?: number | null;
}

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
        title: 'Assign Doctors',
        href: '#',
    },
];

export default function AssignDoctors() {
    const { patient, attendingDoctors, admittingDoctors, currentAssignments } = usePage<{
        patient: Patient;
        attendingDoctors: Doctor[];
        admittingDoctors: Doctor[];
        currentAssignments: CurrentAssignments;
    }>().props;

    const { data, setData, post, processing, errors } = useForm({
        attending_doctor_ids:
            currentAssignments.attending_ids?.map((value) => value.toString()) || [],
        admitting_doctor_id: currentAssignments.admitting_id?.toString() || '',
    });

    const selectedAttendingDoctors = data.attending_doctor_ids;

    const toggleAttendingDoctor = (doctorId: string, checked: boolean | 'indeterminate') => {
        const isChecked = checked === true;
        setData(
            'attending_doctor_ids',
            isChecked
                ? Array.from(new Set([...selectedAttendingDoctors, doctorId]))
                : selectedAttendingDoctors.filter((id) => id !== doctorId)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admitting/patients/${patient.id}/assign-doctors`, {
            onSuccess: () => {
                toast.success('Doctors assigned successfully!');
            },
            onError: () => {
                toast.error('Failed to assign doctors. Please try again.');
            },
        });
    };

    const patientName = [
        patient.first_name,
        patient.middle_name,
        patient.last_name,
        patient.extension_name,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assign Doctors" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assign Doctors</h1>
                    <p className="text-muted-foreground">
                        Assign attending and admitting physicians to {patientName}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Attending Doctor Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="size-5 text-blue-600" />
                                    Attending Doctor
                                </CardTitle>
                                <CardDescription>
                                    Select the attending physician for this patient
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Attending Doctors</Label>
                                    <div className="rounded-md border p-3">
                                        <div className="max-h-60 space-y-2 overflow-auto pr-2">
                                            {attendingDoctors.map((doctor) => (
                                                <label
                                                    key={doctor.id}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <Checkbox
                                                        id={`attending-${doctor.id}`}
                                                        checked={selectedAttendingDoctors.includes(
                                                            doctor.id.toString()
                                                        )}
                                                        onCheckedChange={(checked) =>
                                                            toggleAttendingDoctor(
                                                                doctor.id.toString(),
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <span>{doctor.fullname}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {selectedAttendingDoctors.length === 0 && (
                                            <p className="pt-3 text-xs text-muted-foreground">
                                                Select one or more attending doctors to assign.
                                            </p>
                                        )}
                                    </div>
                                    <InputError message={errors.attending_doctor_ids} />
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href="/admitting/attending-doctors/create"
                                        className="flex-1"
                                    >
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Add New Attending Doctor
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admitting Doctor Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCog className="size-5 text-purple-600" />
                                    Admitting Doctor
                                </CardTitle>
                                <CardDescription>
                                    Select the admitting physician for this patient
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="admitting_doctor_id">
                                        Admitting Doctor
                                    </Label>
                                    <Select
                                        value={data.admitting_doctor_id || 'none'}
                                        onValueChange={(value) =>
                                            setData('admitting_doctor_id', value === 'none' ? '' : value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select admitting doctor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                No admitting doctor
                                            </SelectItem>
                                            {admittingDoctors.map((doctor) => (
                                                <SelectItem
                                                    key={doctor.id}
                                                    value={doctor.id.toString()}
                                                >
                                                    {doctor.fullname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.admitting_doctor_id} />
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href="/admitting/admitting-doctors/create"
                                        className="flex-1"
                                    >
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Add New Admitting Doctor
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Assign Doctors
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
