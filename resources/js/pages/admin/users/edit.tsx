import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'react-toastify';
import { Mail, AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
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
        title: 'Edit User',
        href: '#',
    },
];

export default function EditUser() {
    const { user } = usePage<{ user: UserData }>().props;
    const [sendingPassword, setSendingPassword] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'billing',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
            onSuccess: () => {
                toast.success('User updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update user. Please check the form.');
            },
        });
    };

    const handleSendNewPassword = () => {
        setSendingPassword(true);
        router.post(`/admin/users/${user.id}/reset-password`, {}, {
            onSuccess: () => {
                toast.success('New password has been sent to the user\'s email!');
                setSendingPassword(false);
                setShowPasswordModal(false);
            },
            onError: () => {
                toast.error('Failed to send new password. Please try again.');
                setSendingPassword(false);
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: () => {
                    toast.success('User deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete user.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                    <p className="text-muted-foreground">
                        Update user information for {user.name}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>
                                Update the user's details and role
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Full Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="John Doe"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email Address <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    placeholder="john@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    Role <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrator</SelectItem>
                                        <SelectItem value="billing">Billing Staff</SelectItem>
                                        <SelectItem value="admitting">Admitting Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    The role determines what the user can access in the system
                                </p>
                                <InputError message={errors.role} />
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-2">Password Reset</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Send a new randomized password to the user's email address
                                </p>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowPasswordModal(true)}
                                    className="gap-2"
                                >
                                    <Mail className="size-4" />
                                    Send New Password to Email
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">
                                    A new password will be generated and sent to: <strong>{user.email}</strong>
                                </p>
                            </div>

                            {/* Password Reset Confirmation Modal */}
                            <Dialog open={showPasswordModal} onOpenChange={(open) => !sendingPassword && setShowPasswordModal(open)}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                                            <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <DialogTitle className="text-center text-xl">Reset Password</DialogTitle>
                                        <DialogDescription className="text-center pt-2">
                                            Are you sure you want to send a new password to{' '}
                                            <span className="font-semibold text-foreground">{user.email}</span>?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="rounded-lg border bg-muted/50 p-4 my-2">
                                        <p className="text-sm text-muted-foreground text-center">
                                            This will <span className="font-medium text-destructive">replace their current password</span> and send a new randomly generated password to their email address.
                                        </p>
                                    </div>
                                    <DialogFooter className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowPasswordModal(false)}
                                            disabled={sendingPassword}
                                            className="flex-3 sm:flex-none"
                                        >
                                            Cancel
                                        </Button>
                                        
                                        <Button
                                            type="button"
                                            onClick={handleSendNewPassword}
                                            disabled={sendingPassword}
                                            className="flex-1 sm:flex-none gap-2"
                                        >
                                            {sendingPassword ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="size-4" />
                                                    Send New Password
                                                </>
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Update User
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="ml-auto"
                                >
                                    Delete User
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
