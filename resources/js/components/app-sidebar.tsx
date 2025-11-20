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
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    ClipboardList,
    LayoutGrid,
    MapPin,
    Settings,
    TrendingDown,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Machines',
        href: '/machines',
        icon: Wrench,
    },
    {
        title: 'Work Orders',
        href: '/work-orders',
        icon: ClipboardList,
    },
    {
        title: 'Report Breakdown',
        href: '/work-orders/report-breakdown',
        icon: AlertTriangle,
    },
    {
        title: 'Preventive Tasks',
        href: '/preventive-tasks',
        icon: Calendar,
    },
    {
        title: 'Reports',
        href: '#',
        icon: BarChart3,
        items: [
            {
                title: 'Downtime Report',
                href: '/reports/downtime',
                icon: TrendingDown,
            },
        ],
    },
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
        items: [
            {
                title: 'Locations',
                href: '/locations',
                icon: MapPin,
            },
            {
                title: 'Cause Categories',
                href: '/cause-categories',
                icon: AlertTriangle,
            },
            {
                title: 'Users',
                href: '/users',
                icon: Users,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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
