import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Clients',
        href: '/admin/clients',
    },
    {
        title: 'Client Details',
        href: '#',
    },
];

export default function ClientShow({ client }: { client: User }) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Client: ${client.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/clients">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Clients
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                    <div className="flex items-center gap-2">
                        <Badge variant={client.email_verified_at ? 'default' : 'secondary'}>
                            {client.email_verified_at ? (
                                <>
                                    <CheckCircle className="mr-1 size-3" />
                                    Verified
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-1 size-3" />
                                    Unverified
                                </>
                            )}
                        </Badge>
                        <Badge variant="outline">Client</Badge>
                    </div>
                </div>

                {/* Client Information */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Basic client details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="mt-0.5 size-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Email Address</p>
                                    <p className="text-sm text-muted-foreground">{client.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Shield className="mt-0.5 size-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Role</p>
                                    <p className="text-sm text-muted-foreground capitalize">
                                        {client.role || 'Client'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 size-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Member Since</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(client.created_at)}
                                    </p>
                                </div>
                            </div>
                            {client.email_verified_at && (
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="mt-0.5 size-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Email Verified</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(client.email_verified_at)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Summary</CardTitle>
                            <CardDescription>Client account statistics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Total Invoices</span>
                                <span className="text-2xl font-bold">0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Pending Payments</span>
                                <span className="text-2xl font-bold">$0.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Total Paid</span>
                                <span className="text-2xl font-bold">$0.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Last Activity</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(client.updated_at)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoices Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Client's billing history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                No invoices found for this client
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Manage this client account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline">Send Email</Button>
                            <Button variant="outline">Create Invoice</Button>
                            <Button variant="outline">View Payment History</Button>
                            <Button variant="destructive">Deactivate Account</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
