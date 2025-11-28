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
    CalendarDays,
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
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { t } = useTranslation('nav');
    const { auth } = usePage().props;
    const isSuperAdmin = auth.user.role === 'super_admin';

    // Overview - always visible
    const overviewNavItems: NavItem[] = [
        {
            title: t('dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('notifications'),
            href: '/notifications',
            icon: Bell,
        },
    ];

    // Maintenance section with sub-items
    const maintenanceNavItem: NavItem = {
        title: t('maintenance.title'),
        href: '#',
        icon: Wrench,
        items: [
            {
                title: t('maintenance.machines'),
                href: '/machines',
                icon: Wrench,
            },
            {
                title: t('maintenance.work_orders'),
                href: '/work-orders',
                icon: ClipboardList,
            },
            {
                title: t('maintenance.report_breakdown'),
                href: '/work-orders/report-breakdown',
                icon: AlertTriangle,
            },
            {
                title: t('maintenance.preventive_tasks'),
                href: '/preventive-tasks',
                icon: Calendar,
            },
        ],
    };

    // Planning section with sub-items
    const planningNavItem: NavItem = {
        title: t('planning.title', 'Planning'),
        href: '#',
        icon: CalendarDays,
        items: [
            {
                title: t('planning.board', 'Planning Board'),
                href: '/planning',
                icon: CalendarDays,
            },
            {
                title: t('planning.shutdowns', 'Shutdowns'),
                href: '/planning/shutdowns',
                icon: Clock,
            },
            {
                title: t('planning.capacity', 'Capacity'),
                href: '/planning/capacity',
                icon: BarChart3,
            },
            {
                title: t('planning.analytics', 'Analytics'),
                href: '/planning/analytics',
                icon: Activity,
            },
        ],
    };

    // Production & OEE section with sub-items
    const productionNavItem: NavItem = {
        title: t('production.title'),
        href: '#',
        icon: Factory,
        items: [
            {
                title: t('production.oee_dashboard'),
                href: '/oee/dashboard',
                icon: TrendingUp,
            },
            {
                title: t('production.runs'),
                href: '/production/runs',
                icon: Factory,
            },
            {
                title: t('production.oee_trends'),
                href: '/oee/trends',
                icon: BarChart3,
            },
            {
                title: t('production.products'),
                href: '/products',
                icon: Package,
            },
            {
                title: t('production.shifts'),
                href: '/shifts',
                icon: Clock,
            },
        ],
    };

    // Inventory section with sub-items
    const inventoryNavItem: NavItem = {
        title: t('inventory.title'),
        href: '#',
        icon: Package,
        items: [
            {
                title: t('inventory.spare_parts'),
                href: '/spare-parts',
                icon: Package,
            },
            {
                title: t('inventory.low_stock'),
                href: '/inventory/low-stock',
                icon: AlertTriangle,
            },
            {
                title: t('inventory.purchase_orders'),
                href: '/purchase-orders',
                icon: ShoppingCart,
            },
            {
                title: t('inventory.suppliers'),
                href: '/suppliers',
                icon: Warehouse,
            },
        ],
    };

    // Cost Management section with sub-items
    const costNavItem: NavItem = {
        title: t('costs.title'),
        href: '#',
        icon: DollarSign,
        items: [
            {
                title: t('costs.dashboard'),
                href: '/costs/dashboard',
                icon: DollarSign,
            },
            {
                title: t('costs.report'),
                href: '/costs/report',
                icon: FileText,
            },
            {
                title: t('costs.budget'),
                href: '/costs/budget',
                icon: PiggyBank,
            },
            {
                title: t('costs.labor_rates'),
                href: '/costs/labor-rates',
                icon: Clock,
            },
        ],
    };

    // Dashboards & Reports section with sub-groups
    const reportsNavItem: NavItem = {
        title: t('reports.title'),
        href: '#',
        icon: LayoutDashboard,
        groups: [
            {
                label: t('reports.dashboards'),
                items: [
                    {
                        title: t('reports.custom_dashboards'),
                        href: '/dashboards',
                        icon: LayoutDashboard,
                    },
                ],
            },
            {
                label: t('reports.analytics'),
                items: [
                    {
                        title: t('reports.analytics_dashboard'),
                        href: '/analytics',
                        icon: Activity,
                    },
                    {
                        title: t('reports.reliability'),
                        href: '/analytics/reliability',
                        icon: Gauge,
                    },
                    {
                        title: t('reports.pareto'),
                        href: '/analytics/pareto',
                        icon: PieChart,
                    },
                    {
                        title: t('reports.predictions'),
                        href: '/analytics/predictions',
                        icon: Brain,
                    },
                    {
                        title: t('reports.failure_modes'),
                        href: '/analytics/failure-modes',
                        icon: AlertTriangle,
                    },
                ],
            },
            {
                label: t('reports.reports'),
                items: [
                    {
                        title: t('reports.downtime'),
                        href: '/reports/downtime',
                        icon: TrendingDown,
                    },
                ],
            },
        ],
    };

    // IoT & Sensors section with sub-items
    const iotNavItem: NavItem = {
        title: t('iot.title'),
        href: '#',
        icon: Wifi,
        items: [
            {
                title: t('iot.dashboard'),
                href: '/iot/dashboard',
                icon: Wifi,
            },
            {
                title: t('iot.sensors'),
                href: '/iot/sensors',
                icon: Wifi,
            },
            {
                title: t('iot.alerts'),
                href: '/iot/alerts',
                icon: AlertTriangle,
            },
        ],
    };

    // Settings section with sub-items (consolidated)
    const settingsNavItem: NavItem = {
        title: t('settings.title'),
        href: '#',
        icon: Settings,
        items: [
            {
                title: t('settings.locations'),
                href: '/locations',
                icon: MapPin,
            },
            {
                title: t('settings.cause_categories'),
                href: '/cause-categories',
                icon: AlertTriangle,
            },
            {
                title: t('settings.users'),
                href: '/users',
                icon: Users,
            },
            {
                title: t('settings.integrations'),
                href: '/settings/integrations',
                icon: Settings,
            },
            {
                title: t('settings.vendor_api_keys'),
                href: '/settings/vendor-api-keys',
                icon: Key,
            },
        ],
    };

    // Admin section with sub-items
    const adminNavItem: NavItem = {
        title: t('admin.title'),
        href: '#',
        icon: Shield,
        items: [
            {
                title: t('admin.dashboard'),
                href: '/admin',
                icon: Shield,
            },
            {
                title: t('admin.companies'),
                href: '/admin/companies',
                icon: Building2,
            },
            {
                title: t('admin.users'),
                href: '/admin/users',
                icon: Users,
            },
        ],
    };

    // Grouped sections
    const operationsNavItems: NavItem[] = [
        maintenanceNavItem,
        planningNavItem,
        productionNavItem,
        inventoryNavItem,
    ];

    const financeNavItems: NavItem[] = [costNavItem];

    const insightsNavItems: NavItem[] = [reportsNavItem];

    const systemNavItems: NavItem[] = [iotNavItem, settingsNavItem];

    const footerNavItems: NavItem[] = [];

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
                    <NavMain
                        label={t('sections.admin')}
                        items={[adminNavItem]}
                    />
                )}

                {/* Operations section */}
                <NavMain
                    label={t('sections.operations')}
                    items={operationsNavItems}
                />

                {/* Finance section */}
                <NavMain
                    label={t('sections.finance')}
                    items={financeNavItems}
                />

                {/* Insights section */}
                <NavMain
                    label={t('sections.insights')}
                    items={insightsNavItems}
                />

                {/* System section */}
                <NavMain label={t('sections.system')} items={systemNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
