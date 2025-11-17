import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
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
        title: 'Create User',
        href: '/admin/users/create',
    },
];

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'billing',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => {
                toast.success('User created successfully!');
            },
            onError: () => {
                toast.error('Failed to create user. Please check the form.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
                    <p className="text-muted-foreground">
                        Add a new user to the system
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>
                                Enter the user's details and assign a role
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

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    placeholder="Minimum 8 characters"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm Password <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    placeholder="Re-enter password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Create User
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
