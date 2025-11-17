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
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'react-toastify';

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

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'billing',
        password: '',
        password_confirmation: '',
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
                                <h3 className="text-lg font-semibold mb-4">Change Password (Optional)</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Leave blank to keep the current password
                                </p>

                                {/* Password */}
                                <div className="space-y-2 mb-4">
                                    <Label htmlFor="password">
                                        New Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimum 8 characters"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Re-enter new password"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

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
