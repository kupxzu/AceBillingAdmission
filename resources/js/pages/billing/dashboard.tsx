import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CreditCard, DollarSign, FileText, Clock, Receipt } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Dashboard',
        href: '/billing/dashboard',
    },
];

interface DashboardStats {
    total_invoices: number;
    pending_invoices: number;
    paid_invoices: number;
    total_amount_due: number;
}

interface PatientBill {
    id: number;
    patient_name: string;
    amount: number;
    created_at: string;
}

export default function BillingDashboard() {
    const { stats, patientBills: patientBillsProp } = usePage<{ stats: DashboardStats; patientBills: PatientBill[] }>().props;
    const patientBills = patientBillsProp ?? [];
    const [showInsights, setShowInsights] = useState(false);

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
            title: 'Total Invoices',
            value: stats.total_invoices.toLocaleString(),
            description: 'All time invoices',
            icon: FileText,
            color: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Pending Invoices',
            value: stats.pending_invoices.toLocaleString(),
            description: 'Awaiting payment',
            icon: Clock,
            color: 'text-orange-600 dark:text-orange-400',
        },
        {
            title: 'Paid Invoices',
            value: stats.paid_invoices.toLocaleString(),
            description: 'Successfully paid',
            icon: CreditCard,
            color: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'All Patients Amount Due',
            value: formatCurrency(stats.total_amount_due),
            description: 'Total outstanding across every patient',
            icon: DollarSign,
            color: 'text-red-600 dark:text-red-400',
            actionable: true,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your billing and invoices.
                    </p>
                </div>

                {/* Quick Access - Patient SOA */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="size-5" />
                                    Patient Statement of Accounts
                                </CardTitle>
                                <CardDescription>
                                    Manage patient billing statements and attachments
                                </CardDescription>
                            </div>
                            <Link href="/billing/patient-soa">
                                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                    View All SOAs
                                </button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card
                                key={stat.title}
                                onClick={stat.actionable ? () => setShowInsights(true) : undefined}
                                className={stat.actionable ? 'cursor-pointer transition hover:shadow-md' : ''}
                                role={stat.actionable ? 'button' : undefined}
                                tabIndex={stat.actionable ? 0 : undefined}
                                onKeyDown={(event) => {
                                    if (!stat.actionable) return;
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setShowInsights(true);
                                    }
                                }}
                            >
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

            <Dialog open={showInsights} onOpenChange={setShowInsights}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Patient Bills Insights</DialogTitle>
                        <DialogDescription>
                            Detailed list of every patient bill contributing to the total amount
                        </DialogDescription>
                    </DialogHeader>

                    {patientBills.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-sm">
                                <thead>
                                    <tr className="text-left text-muted-foreground">
                                        <th className="px-3 py-2">#</th>
                                        <th className="px-3 py-2">Patient</th>
                                        <th className="px-3 py-2 text-right">Amount</th>
                                        <th className="px-3 py-2">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientBills.map((bill, index) => (
                                        <tr key={bill.id} className="border-t">
                                            <td className="px-3 py-2 text-muted-foreground">{index + 1}</td>
                                            <td className="px-3 py-2 font-medium">{bill.patient_name}</td>
                                            <td className="px-3 py-2 text-right font-semibold">{formatCurrency(bill.amount)}</td>
                                            <td className="px-3 py-2 text-muted-foreground">
                                                {bill.created_at ? new Date(bill.created_at).toLocaleString() : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 text-right text-sm text-muted-foreground">
                                Total: <span className="font-semibold text-foreground">{formatCurrency(stats.total_amount_due)}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            There are no patient bills recorded yet.
                        </p>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
