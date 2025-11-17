import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Activity, Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Activity Logs',
        href: '/admin/activity-logs',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface ActivityLog {
    id: number;
    user: User;
    action: string;
    model: string;
    model_id: number | null;
    description: string;
    properties: any;
    ip_address: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedLogs {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export default function ActivityLogsIndex() {
    const { logs, filters } = usePage<{
        logs: PaginatedLogs;
        filters: { search?: string; action?: string; model?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [actionFilter, setActionFilter] = useState(filters.action || 'all');
    const [modelFilter, setModelFilter] = useState(filters.model || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/activity-logs', {
            search,
            action: actionFilter === 'all' ? '' : actionFilter,
            model: modelFilter === 'all' ? '' : modelFilter,
        }, { preserveState: true });
    };

    const handleActionFilter = (value: string) => {
        setActionFilter(value);
        router.get('/admin/activity-logs', {
            search,
            action: value === 'all' ? '' : value,
            model: modelFilter === 'all' ? '' : modelFilter,
        }, { preserveState: true });
    };

    const handleModelFilter = (value: string) => {
        setModelFilter(value);
        router.get('/admin/activity-logs', {
            search,
            action: actionFilter === 'all' ? '' : actionFilter,
            model: value === 'all' ? '' : value,
        }, { preserveState: true });
    };

    const getActionBadgeVariant = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
                return 'default';
            case 'updated':
                return 'secondary';
            case 'deleted':
                return 'destructive';
            case 'viewed':
                return 'outline';
            default:
                return 'outline';
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
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Activity Logs
                        </h1>
                        <p className="text-muted-foreground">
                            Monitor all user activities in the system ({logs.total} total)
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Logs</CardTitle>
                        <CardDescription>
                            Search and filter activity logs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <Input
                                    placeholder="Search by description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Select value={actionFilter} onValueChange={handleActionFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    <SelectItem value="created">Created</SelectItem>
                                    <SelectItem value="updated">Updated</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                    <SelectItem value="viewed">Viewed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={modelFilter} onValueChange={handleModelFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Models" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Models</SelectItem>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Patient">Patient</SelectItem>
                                    <SelectItem value="PatientSOA">Patient SOA</SelectItem>
                                    <SelectItem value="Doctor">Doctor</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">
                                <Search className="mr-2 size-4" />
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Activity Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Activities</CardTitle>
                        <CardDescription>
                            Complete history of user actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No activity logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{log.user.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {log.user.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(log.user.role)}>
                                                    {log.user.role.charAt(0).toUpperCase() + log.user.role.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getActionBadgeVariant(log.action)}>
                                                    {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono text-sm">{log.model}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-md">
                                                    {log.description}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {log.ip_address || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {formatDate(log.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {logs.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {logs.data.length} of {logs.total} logs
                                </div>
                                <div className="flex gap-2">
                                    {logs.links.map((link, index) => (
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
