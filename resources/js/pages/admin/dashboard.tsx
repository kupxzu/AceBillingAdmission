import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, UserCheck, UserPlus, Shield, Receipt, Phone, MapPin, Stethoscope, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

interface DashboardStats {
    total_billing: number;
    total_admitting: number;
    total_admins: number;
    verified_users: number;
    recent_signups: number;
}

interface BillingStats {
    total_soas: number;
    total_amount: number;
    soas_today: number;
    soas_this_month: number;
}

interface AdmittingStats {
    total_patients: number;
    patients_today: number;
    patients_this_month: number;
}

interface PatientData {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    extension_name: string | null;
    address: string | null;
    phone_number: string | null;
    created_at: string;
    total_bills: number;
    soa_count: number;
    attending_doctors: string[];
    admitting_doctors: string[];
}

interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'billing' | 'admitting';
    created_at: string;
    email_verified_at: string | null;
}

interface MonthlyRegistration {
    month: string;
    billing: number;
    admitting: number;
}

interface ChartData {
    name: string;
    value: number;
    fill: string;
    [key: string]: string | number;
}

const COLORS = {
    billing: '#3b82f6',
    admitting: '#06b6d4',
    verified: '#22c55e',
    unverified: '#f59e0b',
};

export default function AdminDashboard() {
    const { stats, billingStats, admittingStats, patients, recentUsers, monthlyRegistrations, roleDistribution, verificationStatus } = usePage<{
        stats: DashboardStats;
        billingStats: BillingStats;
        admittingStats: AdmittingStats;
        patients: PatientData[];
        recentUsers: UserData[];
        monthlyRegistrations: MonthlyRegistration[];
        roleDistribution: ChartData[];
        verificationStatus: ChartData[];
    }>().props;

    // Modal states
    const [billsModalOpen, setBillsModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [billsSearch, setBillsSearch] = useState('');
    const [infoSearch, setInfoSearch] = useState('');

    // Filter patients with bills (for bills modal)
    const patientsWithBills = useMemo(() => {
        const filtered = patients
            .filter(p => p.soa_count > 0)
            .filter(p => 
                billsSearch === '' ||
                p.full_name.toLowerCase().includes(billsSearch.toLowerCase()) ||
                p.phone_number?.toLowerCase().includes(billsSearch.toLowerCase())
            );
        return filtered.slice(0, 10);
    }, [patients, billsSearch]);

    // Filter all patients (for info modal)
    const filteredPatientsInfo = useMemo(() => {
        const filtered = patients.filter(p => 
            infoSearch === '' ||
            p.full_name.toLowerCase().includes(infoSearch.toLowerCase()) ||
            p.phone_number?.toLowerCase().includes(infoSearch.toLowerCase()) ||
            p.address?.toLowerCase().includes(infoSearch.toLowerCase())
        );
        return filtered.slice(0, 10);
    }, [patients, infoSearch]);

    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP',
                minimumFractionDigits: 2,
            }),
        []
    );

    const formatCurrency = (value: number) => currencyFormatter.format(value ?? 0);

    const statsCards = [
        {
            title: 'Billing Users',
            value: stats.total_billing,
            description: 'All billing staff',
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Admitting Users',
            value: stats.total_admitting,
            description: 'All admitting staff',
            icon: Users,
            color: 'text-cyan-600 dark:text-cyan-400',
        },
        {
            title: 'Verified Users',
            value: stats.verified_users,
            description: 'Email verified',
            icon: UserCheck,
            color: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Recent Signups',
            value: stats.recent_signups,
            description: 'Last 30 days',
            icon: UserPlus,
            color: 'text-orange-600 dark:text-orange-400',
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage users and monitor system activity.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className={`size-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Billing & Admitting Overview */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Billing Overview - Clickable */}
                    <Card 
                        className="border-blue-200 dark:border-blue-800 cursor-pointer transition-all hover:shadow-md hover:border-blue-400"
                        onClick={() => setBillsModalOpen(true)}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="size-5 text-blue-600" />
                                Patient Bills
                            </CardTitle>
                            <CardDescription>Click to view patients with bills</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total SOAs</p>
                                    <p className="text-2xl font-bold">{billingStats.total_soas}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(billingStats.total_amount)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Today</p>
                                    <p className="text-lg font-semibold">{billingStats.soas_today} SOAs</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">This Month</p>
                                    <p className="text-lg font-semibold">{billingStats.soas_this_month} SOAs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admitting Overview - Clickable */}
                    <Card 
                        className="border-cyan-200 dark:border-cyan-800 cursor-pointer transition-all hover:shadow-md hover:border-cyan-400"
                        onClick={() => setInfoModalOpen(true)}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="size-5 text-cyan-600" />
                                Patient Information
                            </CardTitle>
                            <CardDescription>Click to view patient details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Patients</p>
                                    <p className="text-2xl font-bold">{admittingStats.total_patients}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Registered Today</p>
                                    <p className="text-2xl font-bold text-cyan-600">{admittingStats.patients_today}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <p className="text-sm text-muted-foreground">This Month</p>
                                    <p className="text-lg font-semibold">{admittingStats.patients_this_month} patients registered</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Patient Bills Modal */}
                <Dialog open={billsModalOpen} onOpenChange={(open) => { setBillsModalOpen(open); if (!open) setBillsSearch(''); }}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Receipt className="size-5 text-blue-600" />
                                Patients with Bills
                            </DialogTitle>
                            <DialogDescription>Showing up to 10 patients with SOA records</DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or phone..."
                                value={billsSearch}
                                onChange={(e) => setBillsSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex-1 overflow-auto space-y-2 pr-2">
                            {patientsWithBills.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    No patients with bills found.
                                </div>
                            ) : (
                                patientsWithBills.map((patient) => (
                                    <div key={patient.id} className="rounded-lg border p-4 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold">{patient.full_name}</h4>
                                                {patient.phone_number && (
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Phone className="size-3" /> {patient.phone_number}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge className="bg-blue-600">{patient.soa_count} SOA</Badge>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <span className="text-sm text-muted-foreground">Total Bills</span>
                                            <span className="text-lg font-bold text-blue-600">{formatCurrency(patient.total_bills)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground pt-2 border-t">
                            Showing {patientsWithBills.length} of {patients.filter(p => p.soa_count > 0).length} patients with bills
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Patient Information Modal */}
                <Dialog open={infoModalOpen} onOpenChange={(open) => { setInfoModalOpen(open); if (!open) setInfoSearch(''); }}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Users className="size-5 text-cyan-600" />
                                Patient Information
                            </DialogTitle>
                            <DialogDescription>Showing up to 10 patients with their details</DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, phone, or address..."
                                value={infoSearch}
                                onChange={(e) => setInfoSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex-1 overflow-auto space-y-2 pr-2">
                            {filteredPatientsInfo.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    No patients found.
                                </div>
                            ) : (
                                filteredPatientsInfo.map((patient) => (
                                    <div key={patient.id} className="rounded-lg border p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-semibold">{patient.full_name}</h4>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(patient.created_at)}
                                            </span>
                                        </div>
                                        <div className="grid gap-2 text-sm">
                                            {patient.phone_number && (
                                                <p className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="size-3" /> {patient.phone_number}
                                                </p>
                                            )}
                                            {patient.address && (
                                                <p className="flex items-start gap-2 text-muted-foreground">
                                                    <MapPin className="size-3 mt-0.5 shrink-0" /> {patient.address}
                                                </p>
                                            )}
                                        </div>
                                        {(patient.attending_doctors.length > 0 || patient.admitting_doctors.length > 0) && (
                                            <div className="pt-2 border-t space-y-2">
                                                {patient.attending_doctors.length > 0 && (
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        <span className="text-xs text-muted-foreground">Attending:</span>
                                                        {patient.attending_doctors.map((doc, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs gap-1">
                                                                <Stethoscope className="size-2.5" /> {doc}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                                {patient.admitting_doctors.length > 0 && (
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        <span className="text-xs text-muted-foreground">Admitting:</span>
                                                        {patient.admitting_doctors.map((doc, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs gap-1">
                                                                <Stethoscope className="size-2.5" /> {doc}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground pt-2 border-t">
                            Showing {filteredPatientsInfo.length} of {patients.length} patients
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Monthly Registrations Area Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>User Registrations</CardTitle>
                            <CardDescription>
                                Monthly registration trends over the last 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyRegistrations}>
                                        <defs>
                                            <linearGradient id="billingGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={COLORS.billing} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={COLORS.billing} stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="admittingGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={COLORS.admitting} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={COLORS.admitting} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="month" className="text-xs" />
                                        <YAxis className="text-xs" allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="billing"
                                            name="Billing Staff"
                                            stroke={COLORS.billing}
                                            fill="url(#billingGradient)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="admitting"
                                            name="Admitting Staff"
                                            stroke={COLORS.admitting}
                                            fill="url(#admittingGradient)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role Distribution Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Distribution by Role</CardTitle>
                            <CardDescription>
                                Breakdown of users by their role
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={roleDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                                            }
                                        >
                                            <Cell fill={COLORS.billing} />
                                            <Cell fill={COLORS.admitting} />
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.billing }} />
                                    <span className="text-sm text-muted-foreground">Billing ({stats.total_billing})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.admitting }} />
                                    <span className="text-sm text-muted-foreground">Admitting ({stats.total_admitting})</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verification Status Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Verification Status</CardTitle>
                            <CardDescription>
                                Users with verified vs unverified emails
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={verificationStatus}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                                            }
                                        >
                                            <Cell fill={COLORS.verified} />
                                            <Cell fill={COLORS.unverified} />
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.verified }} />
                                    <span className="text-sm text-muted-foreground">Verified ({stats.verified_users})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.unverified }} />
                                    <span className="text-sm text-muted-foreground">Unverified ({verificationStatus[1]?.value || 0})</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Users Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>
                                Latest user registrations
                            </CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/admin/users">View All Users</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentUsers.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.email_verified_at ? (
                                                    <Badge variant="default" className="bg-green-500">
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Unverified
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(user.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                No users yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href="/admin/users">Manage Users</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/settings/profile">System Settings</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
