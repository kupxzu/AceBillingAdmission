import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, UserPlus, Users } from 'lucide-react';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Clients',
        href: '/admin/clients',
    },
];

interface Client {
    id: number;
    name: string;
    email: string;
    created_at: string;
    email_verified_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedClients {
    data: Client[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export default function ClientsIndex() {
    const { clients, filters } = usePage<{
        clients: PaginatedClients;
        filters: { search?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/clients', { search }, { preserveState: true });
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
            <Head title="All Clients" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                        <p className="text-muted-foreground">
                            Manage all client accounts ({clients.total} total)
                        </p>
                    </div>
                    <Button>
                        <UserPlus className="mr-2 size-4" />
                        Add Client
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search Clients</CardTitle>
                        <CardDescription>
                            Find clients by name or email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                            {filters.search && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('');
                                        router.get('/admin/clients');
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Clients Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Clients</CardTitle>
                        <CardDescription>
                            {clients.data.length > 0
                                ? `Showing ${clients.data.length} of ${clients.total} clients`
                                : 'No clients found'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {clients.data.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {clients.data.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell className="font-mono text-sm">
                                                    #{client.id}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {client.name}
                                                </TableCell>
                                                <TableCell>{client.email}</TableCell>
                                                <TableCell>
                                                    {client.email_verified_at ? (
                                                        <Badge variant="default" className="bg-green-500">
                                                            Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            Unverified
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(client.created_at)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={`/admin/clients/${client.id}`}>
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {clients.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            Page {clients.current_page} of {clients.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {clients.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="mb-4 size-12 text-muted-foreground" />
                                <p className="text-lg font-medium">No clients found</p>
                                <p className="text-sm text-muted-foreground">
                                    {filters.search
                                        ? 'Try adjusting your search criteria'
                                        : 'Get started by adding your first client'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
