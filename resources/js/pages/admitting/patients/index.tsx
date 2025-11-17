import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, UserPlus, Users, Phone, MapPin, Stethoscope } from 'lucide-react';
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
];

interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    extension_name: string | null;
    address: string | null;
    phone_number: string | null;
    attending_doctor?: string | null;
    admitting_doctor?: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPatients {
    data: Patient[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export default function PatientsIndex() {
    const { patients, filters } = usePage<{
        patients: PaginatedPatients;
        filters: { search?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admitting/patients', { search }, { preserveState: true });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getFullName = (patient: Patient) => {
        const parts = [
            patient.first_name,
            patient.middle_name,
            patient.last_name,
            patient.extension_name,
        ].filter(Boolean);
        return parts.join(' ');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
                        <p className="text-muted-foreground">
                            Manage all patient records ({patients.total} total)
                        </p>
                    </div>
                    <Link href="/admitting/patients/create">
                        <Button>
                            <UserPlus className="mr-2 size-4" />
                            Add Patient
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search Patients</CardTitle>
                        <CardDescription>
                            Find patients by name or contact information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, phone, or address..."
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
                                        router.get('/admitting/patients');
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Patients Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Patients</CardTitle>
                        <CardDescription>
                            A list of all registered patients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Doctors</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Registered</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {patients.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No patients found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    patients.data.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell className="font-medium">
                                                {getFullName(patient)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {patient.attending_doctor && (
                                                        <Badge variant="outline" className="w-fit gap-1 text-xs">
                                                            <Stethoscope className="size-3 text-blue-600" />
                                                            {patient.attending_doctor}
                                                        </Badge>
                                                    )}
                                                    {patient.admitting_doctor && (
                                                        <Badge variant="outline" className="w-fit gap-1 text-xs">
                                                            <Stethoscope className="size-3 text-purple-600" />
                                                            {patient.admitting_doctor}
                                                        </Badge>
                                                    )}
                                                    {!patient.attending_doctor && !patient.admitting_doctor && (
                                                        <span className="text-xs text-muted-foreground">
                                                            No doctors assigned
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {patient.phone_number && (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Phone className="size-3" />
                                                        {patient.phone_number}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(patient.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    href={`/admitting/patients/${patient.id}/assign-doctors`}
                                                >
                                                    <Button variant="ghost" size="sm">
                                                        Assign Doctors
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/admitting/patients/${patient.id}/edit`}
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
                        {patients.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {patients.data.length} of {patients.total} patients
                                </div>
                                <div className="flex gap-2">
                                    {patients.links.map((link, index) => (
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
        </AppLayout>
    );
}
