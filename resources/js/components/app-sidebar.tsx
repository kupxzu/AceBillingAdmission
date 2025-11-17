import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, FileText, CreditCard, Users, Settings, Activity, ClipboardList, Receipt } from 'lucide-react';
import AppLogo from './app-logo';

const getNavItemsForRole = (role?: string): NavItem[] => {
    if (role === 'billing') {
        return [
            {
                title: 'Billing Dashboard',
                href: '/billing/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Patient SOA',
                href: '/billing/patient-soa',
                icon: Receipt,
            },
            {
                title: 'My Invoices',
                href: '/billing/invoices',
                icon: FileText,
            },
            {
                title: 'Payments',
                href: '/billing/payments',
                icon: CreditCard,
            },
        ];
    }

    if (role === 'admin') {
        return [
            {
                title: 'Admin Dashboard',
                href: '/admin/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Users',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Activity Logs',
                href: '/admin/activity-logs',
                icon: Activity,
            },
            {
                title: 'All Invoices',
                href: '/admin/invoices',
                icon: FileText,
            },
            {
                title: 'Settings',
                href: '/admin/settings',
                icon: Settings,
            },
        ];
    }

    if (role === 'admitting') {
        return [
            {
                title: 'Admitting Dashboard',
                href: '/admitting/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Patients',
                href: '/admitting/patients',
                icon: Users,
            },
            // {
            //     title: 'Admissions',
            //     href: '/admitting/admissions',
            //     icon: ClipboardList,
            // },
            {
                title: 'Activity Log',
                href: '/admitting/activity',
                icon: Activity,
            },
        ];
    }

    return [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role?: string } } }>().props;
    const mainNavItems = getNavItemsForRole(auth.user?.role);
    
    const homeUrl = auth.user?.role === 'billing' 
        ? '/billing/dashboard' 
        : auth.user?.role === 'admin'
        ? '/admin/dashboard'
        : auth.user?.role === 'admitting'
        ? '/admitting/dashboard'
        : dashboard();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
