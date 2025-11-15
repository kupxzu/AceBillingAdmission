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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

interface DashboardStats {
    total_clients: number;
    total_admins: number;
    verified_clients: number;
    recent_signups: number;
}

interface Client {
    id: number;
    name: string;
    email: string;
    created_at: string;
    email_verified_at: string | null;
}

export default function AdminDashboard() {
    const { stats, recentClients } = usePage<{
        stats: DashboardStats;
        recentClients: Client[];
    }>().props;

    const statsCards = [
        {
            title: 'Total Clients',
            value: stats.total_clients,
            description: 'All registered clients',
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Verified Clients',
            value: stats.verified_clients,
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
        {
            title: 'Total Admins',
            value: stats.total_admins,
            description: 'Administrator accounts',
            icon: Shield,
            color: 'text-purple-600 dark:text-purple-400',
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
                        Manage clients and monitor system activity.
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

                {/* Recent Clients Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Clients</CardTitle>
                            <CardDescription>
                                Latest client registrations
                            </CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/admin/clients">View All Clients</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentClients.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentClients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">
                                                {client.name}
                                            </TableCell>
                                            <TableCell>{client.email}</TableCell>
                                            <TableCell>
                                                {client.email_verified_at ? (
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
                                                {formatDate(client.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/admin/clients/${client.id}`}>
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
                                No clients yet
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
                                <Link href="/admin/clients">Manage Clients</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/admin/invoices">View All Invoices</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/admin/settings">System Settings</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
