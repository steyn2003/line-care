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
    Clock,
    Factory,
    LayoutGrid,
    MapPin,
    Package,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
    Warehouse,
    Wrench,
} from 'lucide-react';
import AppLogo from './app-logo';

const overviewNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const maintenanceNavItems: NavItem[] = [
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
];

const inventoryNavItems: NavItem[] = [
    {
        title: 'Spare Parts',
        href: '/spare-parts',
        icon: Package,
    },
    {
        title: 'Low Stock Alerts',
        href: '/inventory/low-stock',
        icon: AlertTriangle,
    },
    {
        title: 'Purchase Orders',
        href: '/purchase-orders',
        icon: ShoppingCart,
    },
    {
        title: 'Suppliers',
        href: '/suppliers',
        icon: Warehouse,
    },
];

const productionNavItems: NavItem[] = [
    {
        title: 'OEE Dashboard',
        href: '/oee/dashboard',
        icon: TrendingUp,
    },
    {
        title: 'Production Runs',
        href: '/production/runs',
        icon: Factory,
    },
    {
        title: 'OEE Trends',
        href: '/oee/trends',
        icon: BarChart3,
    },
    {
        title: 'Products',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Shifts',
        href: '/shifts',
        icon: Clock,
    },
];

const reportsNavItems: NavItem[] = [
    {
        title: 'Downtime Report',
        href: '/reports/downtime',
        icon: TrendingDown,
    },
];

const settingsNavItems: NavItem[] = [
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
                <NavMain label="Overview" items={overviewNavItems} />
                <NavMain label="Maintenance" items={maintenanceNavItems} />
                <NavMain label="Production & OEE" items={productionNavItems} />
                <NavMain label="Inventory" items={inventoryNavItems} />
                <NavMain label="Reports" items={reportsNavItems} />
                <NavMain label="Settings" items={settingsNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
