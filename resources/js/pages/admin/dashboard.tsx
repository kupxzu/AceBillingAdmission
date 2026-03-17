import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, UserCheck, UserPlus, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
    const { stats, recentUsers, monthlyRegistrations, roleDistribution, verificationStatus } = usePage<{
        stats: DashboardStats;
        recentUsers: UserData[];
        monthlyRegistrations: MonthlyRegistration[];
        roleDistribution: ChartData[];
        verificationStatus: ChartData[];
    }>().props;

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
