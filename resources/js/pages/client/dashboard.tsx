import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CreditCard, DollarSign, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Client Dashboard',
        href: '/client/dashboard',
    },
];

interface DashboardStats {
    total_invoices: number;
    pending_invoices: number;
    paid_invoices: number;
    total_amount_due: number;
}

export default function ClientDashboard() {
    const { stats } = usePage<{ stats: DashboardStats }>().props;

    const statsCards = [
        {
            title: 'Total Invoices',
            value: stats.total_invoices,
            description: 'All time invoices',
            icon: FileText,
            color: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Pending Invoices',
            value: stats.pending_invoices,
            description: 'Awaiting payment',
            icon: Clock,
            color: 'text-orange-600 dark:text-orange-400',
        },
        {
            title: 'Paid Invoices',
            value: stats.paid_invoices,
            description: 'Successfully paid',
            icon: CreditCard,
            color: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Amount Due',
            value: `$${stats.total_amount_due.toFixed(2)}`,
            description: 'Total outstanding',
            icon: DollarSign,
            color: 'text-red-600 dark:text-red-400',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your billing and invoices.
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
                            <CardTitle>Recent Invoices</CardTitle>
                            <CardDescription>
                                Your latest billing documents
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                No invoices yet
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                            <CardDescription>
                                Your recent transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                No payments yet
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks for managing your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                View All Invoices
                            </button>
                            <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                Payment Methods
                            </button>
                            <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                Download Receipts
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
