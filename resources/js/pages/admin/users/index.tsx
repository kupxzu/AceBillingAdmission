import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, Eye, Pencil, Trash2, Users as UsersIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export default function UsersIndex() {
    const { users, filters } = usePage<{
        users: PaginatedUsers;
        filters: { search?: string; role?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search, role: roleFilter === 'all' ? '' : roleFilter }, { preserveState: true });
    };

    const handleRoleFilter = (value: string) => {
        setRoleFilter(value);
        router.get('/admin/users', { search, role: value === 'all' ? '' : value }, { preserveState: true });
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
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
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Users Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage system users and their roles ({users.total} total)
                        </p>
                    </div>
                    <Link href="/admin/users/create">
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Add New User
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search Users</CardTitle>
                        <CardDescription>
                            Filter users by name, email, or role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={handleRoleFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="billing">Billing</SelectItem>
                                    <SelectItem value="admitting">Admitting</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">
                                <Search className="mr-2 size-4" />
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>
                            View and manage all system users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <UsersIcon className="size-4 text-blue-600" />
                                                    {user.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.email_verified_at ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                        Unverified
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(user.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/users/${user.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(user)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {users.data.length} of {users.total} users
                                </div>
                                <div className="flex gap-2">
                                    {users.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => link.url && router.visit(link.url)}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
