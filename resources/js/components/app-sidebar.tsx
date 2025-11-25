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
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    Brain,
    Building2,
    Calendar,
    ClipboardList,
    Clock,
    DollarSign,
    Factory,
    FileText,
    Gauge,
    Key,
    LayoutDashboard,
    LayoutGrid,
    MapPin,
    Package,
    PieChart,
    PiggyBank,
    Settings,
    Shield,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
    Warehouse,
    Wifi,
    Wrench,
} from 'lucide-react';
import AppLogo from './app-logo';

// Overview - always visible
const overviewNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
];

// Maintenance section with sub-items
const maintenanceNavItem: NavItem = {
    title: 'Maintenance',
    href: '#',
    icon: Wrench,
    items: [
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
    ],
};

// Production & OEE section with sub-items
const productionNavItem: NavItem = {
    title: 'Production & OEE',
    href: '#',
    icon: Factory,
    items: [
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
    ],
};

// Inventory section with sub-items
const inventoryNavItem: NavItem = {
    title: 'Inventory',
    href: '#',
    icon: Package,
    items: [
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
    ],
};

// Cost Management section with sub-items
const costNavItem: NavItem = {
    title: 'Cost Management',
    href: '#',
    icon: DollarSign,
    items: [
        {
            title: 'Cost Dashboard',
            href: '/costs/dashboard',
            icon: DollarSign,
        },
        {
            title: 'Cost Report',
            href: '/costs/report',
            icon: FileText,
        },
        {
            title: 'Budget Management',
            href: '/costs/budget',
            icon: PiggyBank,
        },
        {
            title: 'Labor Rates',
            href: '/costs/labor-rates',
            icon: Clock,
        },
    ],
};

// Dashboards & Reports section with sub-groups
const reportsNavItem: NavItem = {
    title: 'Dashboards & Reports',
    href: '#',
    icon: LayoutDashboard,
    groups: [
        {
            label: 'Dashboards',
            items: [
                {
                    title: 'Custom Dashboards',
                    href: '/dashboards',
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            label: 'Analytics',
            items: [
                {
                    title: 'Analytics Dashboard',
                    href: '/analytics',
                    icon: Activity,
                },
                {
                    title: 'Reliability (MTBF/MTTR)',
                    href: '/analytics/reliability',
                    icon: Gauge,
                },
                {
                    title: 'Pareto Analysis',
                    href: '/analytics/pareto',
                    icon: PieChart,
                },
                {
                    title: 'Failure Predictions',
                    href: '/analytics/predictions',
                    icon: Brain,
                },
                {
                    title: 'Failure Modes',
                    href: '/analytics/failure-modes',
                    icon: AlertTriangle,
                },
            ],
        },
        {
            label: 'Reports',
            items: [
                {
                    title: 'Downtime Report',
                    href: '/reports/downtime',
                    icon: TrendingDown,
                },
            ],
        },
    ],
};

// IoT & Sensors section with sub-items
const iotNavItem: NavItem = {
    title: 'IoT & Sensors',
    href: '#',
    icon: Wifi,
    items: [
        {
            title: 'IoT Dashboard',
            href: '/iot/dashboard',
            icon: Wifi,
        },
        {
            title: 'Sensors',
            href: '/iot/sensors',
            icon: Wifi,
        },
        {
            title: 'Sensor Alerts',
            href: '/iot/alerts',
            icon: AlertTriangle,
        },
    ],
};

// Settings section with sub-items (consolidated)
const settingsNavItem: NavItem = {
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
        {
            title: 'Integrations',
            href: '/settings/integrations',
            icon: Settings,
        },
        {
            title: 'Vendor API Keys',
            href: '/settings/vendor-api-keys',
            icon: Key,
        },
    ],
};

// Grouped sections
const operationsNavItems: NavItem[] = [
    maintenanceNavItem,
    productionNavItem,
    inventoryNavItem,
];

const financeNavItems: NavItem[] = [costNavItem];

const insightsNavItems: NavItem[] = [reportsNavItem];

const systemNavItems: NavItem[] = [iotNavItem, settingsNavItem];

const footerNavItems: NavItem[] = [];

// Admin section with sub-items
const adminNavItem: NavItem = {
    title: 'System Admin',
    href: '#',
    icon: Shield,
    items: [
        {
            title: 'Admin Dashboard',
            href: '/admin',
            icon: Shield,
        },
        {
            title: 'Companies',
            href: '/admin/companies',
            icon: Building2,
        },
        {
            title: 'All Users',
            href: '/admin/users',
            icon: Users,
        },
    ],
};

export function AppSidebar() {
    const { auth } = usePage().props;
    const isSuperAdmin = auth.user.role === 'super_admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch preserveScroll>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Overview items - always visible */}
                <NavMain items={overviewNavItems} />

                {/* Admin section - only for super admins */}
                {isSuperAdmin && (
                    <NavMain label="Admin" items={[adminNavItem]} />
                )}

                {/* Operations section */}
                <NavMain label="Operations" items={operationsNavItems} />

                {/* Finance section */}
                <NavMain label="Finance" items={financeNavItems} />

                {/* Insights section */}
                <NavMain label="Insights" items={insightsNavItems} />

                {/* System section */}
                <NavMain label="System" items={systemNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
