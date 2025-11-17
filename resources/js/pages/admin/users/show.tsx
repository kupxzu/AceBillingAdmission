import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar, CheckCircle, XCircle, Pencil } from 'lucide-react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
    {
        title: 'View User',
        href: '#',
    },
];

export default function ShowUser() {
    const { user } = usePage<{ user: UserData }>().props;

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'billing':
                return 'default';
            case 'admitting':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            User Details
                        </h1>
                        <p className="text-muted-foreground">
                            View user information and status
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Button>
                                <Pencil className="mr-2 size-4" />
                                Edit User
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Back
                        </Button>
                    </div>
                </div>

                {/* User Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>
                            Basic details about this user
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Name */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <User className="size-4" />
                                    Full Name
                                </div>
                                <p className="text-lg font-semibold">{user.name}</p>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Mail className="size-4" />
                                    Email Address
                                </div>
                                <p className="text-lg font-semibold">{user.email}</p>
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Shield className="size-4" />
                                    Role
                                </div>
                                <div>
                                    <Badge variant={getRoleBadgeVariant(user.role)} className="text-sm">
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    {user.email_verified_at ? (
                                        <CheckCircle className="size-4 text-green-600" />
                                    ) : (
                                        <XCircle className="size-4 text-yellow-600" />
                                    )}
                                    Email Status
                                </div>
                                <div>
                                    {user.email_verified_at ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                            Unverified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Information</CardTitle>
                        <CardDescription>
                            Account activity and timestamps
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Created At */}
                            <div className="flex items-start gap-3">
                                <Calendar className="size-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Account Created
                                    </p>
                                    <p className="font-semibold">
                                        {formatDate(user.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Updated At */}
                            <div className="flex items-start gap-3">
                                <Calendar className="size-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </p>
                                    <p className="font-semibold">
                                        {formatDate(user.updated_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Email Verified */}
                            {user.email_verified_at && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="size-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Email Verified
                                        </p>
                                        <p className="font-semibold">
                                            {formatDate(user.email_verified_at)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Role Permissions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Role Permissions</CardTitle>
                        <CardDescription>
                            What this user can do based on their role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user.role === 'admin' && (
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Full system access</li>
                                <li>Manage all users</li>
                                <li>View all invoices and statements</li>
                                <li>Access system settings</li>
                                <li>View all activities across departments</li>
                            </ul>
                        )}
                        {user.role === 'billing' && (
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Access Billing Dashboard</li>
                                <li>Manage Patient Statement of Accounts (SOA)</li>
                                <li>Create, view, edit, and delete SOA records</li>
                                <li>Upload SOA documents (PDF/Images)</li>
                                <li>Generate QR codes for patient access</li>
                                <li>Manage invoices and payments</li>
                            </ul>
                        )}
                        {user.role === 'admitting' && (
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Access Admitting Dashboard</li>
                                <li>Manage patient records</li>
                                <li>Create, view, edit, and delete patients</li>
                                <li>Assign attending and admitting doctors</li>
                                <li>Manage doctor records</li>
                                <li>Manage room assignments</li>
                                <li>View admissions and activity logs</li>
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
