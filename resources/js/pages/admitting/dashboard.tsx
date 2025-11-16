import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, Clock, CheckCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admitting Dashboard',
        href: '/admitting/dashboard',
    },
];

interface DashboardStats {
    total_patients: number;
    pending_admissions: number;
    completed_today: number;
    active_admissions: number;
}

interface Admission {
    id: number;
    patient_name: string;
    admission_time: string;
    status: string;
}

export default function AdmittingDashboard() {
    const { stats, recentAdmissions } = usePage<{ 
        stats: DashboardStats;
        recentAdmissions: Admission[];
    }>().props;

    const statsCards = [
        {
            title: 'Total Patients',
            value: stats.total_patients,
            description: 'All registered patients',
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Pending Admissions',
            value: stats.pending_admissions,
            description: 'Awaiting processing',
            icon: Clock,
            color: 'text-orange-600 dark:text-orange-400',
        },
        {
            title: 'Completed Today',
            value: stats.completed_today,
            description: 'Processed today',
            icon: CheckCircle,
            color: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Active Admissions',
            value: stats.active_admissions,
            description: 'Currently admitted',
            icon: Activity,
            color: 'text-purple-600 dark:text-purple-400',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admitting Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Admitting Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage patient admissions and track admission status.
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

                {/* Recent Activity Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Admissions</CardTitle>
                            <CardDescription>
                                Latest patient admissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                No recent admissions
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Actions</CardTitle>
                            <CardDescription>
                                Tasks requiring attention
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                No pending actions
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common admitting tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                New Admission
                            </button>
                            <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                View All Patients
                            </button>
                            <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                Pending Approvals
                            </button>
                            <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                Reports
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
