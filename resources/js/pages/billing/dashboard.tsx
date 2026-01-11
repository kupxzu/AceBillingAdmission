import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CreditCard, DollarSign, FileText, Clock, Receipt, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    ComposedChart,
    Line,
} from 'recharts';

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

interface MonthlyBilling {
    month: string;
    invoices: number;
    amount: number;
}

interface AmountDistribution {
    name: string;
    value: number;
    [key: string]: string | number;
}

const COLORS = ['#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444'];

export default function BillingDashboard() {
    const { stats, patientBills: patientBillsProp, monthlyBilling, recentSoas, amountDistribution } = usePage<{
        stats: DashboardStats;
        patientBills: PatientBill[];
        monthlyBilling: MonthlyBilling[];
        recentSoas: PatientBill[];
        amountDistribution: AmountDistribution[];
    }>().props;
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

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Monthly Billing Trend - Area Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-primary" />
                                Billing Trend
                            </CardTitle>
                            <CardDescription>
                                Monthly invoices and revenue over the last 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={monthlyBilling}>
                                        <defs>
                                            <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="month" className="text-xs" />
                                        <YAxis 
                                            yAxisId="left" 
                                            className="text-xs" 
                                            allowDecimals={false}
                                            tickFormatter={(value) => value.toLocaleString()}
                                        />
                                        <YAxis 
                                            yAxisId="right" 
                                            orientation="right" 
                                            className="text-xs"
                                            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value, name) => [
                                                name === 'amount' ? formatCurrency(value as number) : value,
                                                name === 'amount' ? 'Revenue' : 'Invoices'
                                            ]}
                                        />
                                        <Legend />
                                        <Area
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="amount"
                                            name="Revenue"
                                            stroke="#3b82f6"
                                            fill="url(#amountGradient)"
                                            strokeWidth={2}
                                        />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="invoices"
                                            name="Invoices"
                                            fill="#06b6d4"
                                            radius={[4, 4, 0, 0]}
                                            barSize={30}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Amount Distribution Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Distribution</CardTitle>
                            <CardDescription>
                                Breakdown by amount range
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                {amountDistribution && amountDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={amountDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }) =>
                                                    `${((percent ?? 0) * 100).toFixed(0)}%`
                                                }
                                            >
                                                {amountDistribution.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--card))',
                                                    border: '1px solid hsl(var(--border))',
                                                    borderRadius: '8px',
                                                }}
                                                formatter={(value) => [`${value} invoices`, 'Count']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        No data available
                                    </div>
                                )}
                            </div>
                            {amountDistribution && amountDistribution.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-3 mt-2">
                                    {amountDistribution.map((item, index) => (
                                        <div key={item.name} className="flex items-center gap-1.5">
                                            <div 
                                                className="w-2.5 h-2.5 rounded-full" 
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                                            />
                                            <span className="text-xs text-muted-foreground">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent SOAs Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Statements</CardTitle>
                            <CardDescription>
                                Latest patient statement of accounts
                            </CardDescription>
                        </div>
                        <Link href="/billing/patient-soa">
                            <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                View All
                            </button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentSoas && recentSoas.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto text-sm">
                                    <thead>
                                        <tr className="text-left text-muted-foreground border-b">
                                            <th className="px-3 py-3 font-medium">Patient</th>
                                            <th className="px-3 py-3 font-medium text-right">Amount</th>
                                            <th className="px-3 py-3 font-medium">Date</th>
                                            <th className="px-3 py-3 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentSoas.map((soa) => (
                                            <tr key={soa.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-3 py-3 font-medium">{soa.patient_name}</td>
                                                <td className="px-3 py-3 text-right">
                                                    <Badge variant="secondary" className="font-mono">
                                                        {formatCurrency(soa.amount)}
                                                    </Badge>
                                                </td>
                                                <td className="px-3 py-3 text-muted-foreground">
                                                    {soa.created_at ? new Date(soa.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : '—'}
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <Link href={`/billing/patient-soa/${soa.id}`}>
                                                        <button className="text-primary hover:underline text-sm">
                                                            View
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                No statements yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks for billing management
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/billing/patient-soa">
                                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                    View All SOAs
                                </button>
                            </Link>
                            <Link href="/billing/patient-soa/create">
                                <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                    Create New SOA
                                </button>
                            </Link>
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
