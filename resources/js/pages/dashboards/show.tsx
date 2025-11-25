import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Clock,
    DollarSign,
    Edit,
    Gauge,
    LayoutList,
    LineChart,
    Package,
    PieChart,
    Settings,
    Wrench,
} from 'lucide-react';

interface WidgetData {
    // Work Orders
    total?: number;
    open?: number;
    in_progress?: number;
    completed?: number;
    by_status?: Record<string, number>;
    by_type?: Record<string, number>;
    // Machines
    active?: number;
    under_maintenance?: number;
    inactive?: number;
    // Spare Parts
    total_parts?: number;
    low_stock?: number;
    critical_parts?: number;
    total_value?: number;
    // OEE
    average_oee?: number;
    average_availability?: number;
    average_performance?: number;
    average_quality?: number;
    total_runs?: number;
    // Costs
    total_cost?: number;
    labor_cost?: number;
    parts_cost?: number;
    downtime_cost?: number;
    // Downtime
    total_incidents?: number;
    total_hours?: number;
    planned?: number;
    unplanned?: number;
    // MTBF/MTTR
    mtbf?: {
        average_mtbf_hours?: number;
        average_mtbf_days?: number;
    };
    mttr?: {
        average_mttr_hours?: number;
        average_mttr_minutes?: number;
    };
    // Predictions
    predictions?: Array<{
        machine_name: string;
        prediction: {
            days_until_failure: number;
            severity: string;
        };
    }>;
    machines_at_risk?: number;
    total_machines?: number;
}

interface Widget {
    id: number;
    widget_type: string;
    title: string;
    data_source: string;
    config: Record<string, unknown>;
    position_x: number;
    position_y: number;
    size_width: number;
    size_height: number;
    sort_order: number;
    data: WidgetData;
}

interface Dashboard {
    id: number;
    name: string;
    description: string | null;
    is_default: boolean;
    is_shared: boolean;
    shared_with_role: string | null;
    widgets: Widget[];
    creator: {
        id: number;
        name: string;
    };
}

interface Props {
    dashboard: Dashboard;
}

// Widget icon map
const widgetIcons: Record<string, React.ReactNode> = {
    metric_card: <Activity className="h-6 w-6" />,
    line_chart: <LineChart className="h-6 w-6" />,
    bar_chart: <BarChart3 className="h-6 w-6" />,
    pie_chart: <PieChart className="h-6 w-6" />,
    gauge: <Gauge className="h-6 w-6" />,
    table: <LayoutList className="h-6 w-6" />,
    list: <LayoutList className="h-6 w-6" />,
};

// Data source icon map
const dataSourceIcons: Record<string, React.ReactNode> = {
    work_orders: <Wrench className="h-4 w-4" />,
    machines: <Settings className="h-4 w-4" />,
    spare_parts: <Package className="h-4 w-4" />,
    oee: <Activity className="h-4 w-4" />,
    costs: <DollarSign className="h-4 w-4" />,
    downtime: <Clock className="h-4 w-4" />,
    mtbf_mttr: <BarChart3 className="h-4 w-4" />,
    predictions: <AlertTriangle className="h-4 w-4" />,
};

function WidgetCard({ widget }: { widget: Widget }) {
    const { data } = widget;

    const renderContent = () => {
        if (!data || Object.keys(data).length === 0) {
            return (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    No data available
                </div>
            );
        }

        // Render based on widget type and data source
        switch (widget.widget_type) {
            case 'metric_card':
                return renderMetricCard();
            case 'gauge':
                return renderGauge();
            default:
                return renderGenericData();
        }
    };

    const renderMetricCard = () => {
        if (!data) return null;

        // Extract main metric based on data source
        let mainValue = '';
        let label = '';
        let subValue = '';

        switch (widget.data_source) {
            case 'work_orders':
                mainValue = String(data.total || 0);
                label = 'Total Work Orders';
                subValue = `${data.open || 0} open, ${data.in_progress || 0} in progress`;
                break;
            case 'machines':
                mainValue = String(data.total || 0);
                label = 'Total Machines';
                subValue = `${data.active || 0} active`;
                break;
            case 'spare_parts':
                mainValue = String(data.total_parts || 0);
                label = 'Total Parts';
                subValue = `${data.low_stock || 0} low stock`;
                break;
            case 'oee':
                mainValue = `${(data.average_oee || 0).toFixed(1)}%`;
                label = 'Average OEE';
                subValue = `${data.total_runs || 0} production runs`;
                break;
            case 'costs':
                mainValue = `$${(data.total_cost || 0).toLocaleString()}`;
                label = 'Total Cost';
                subValue = `Labor: $${(data.labor_cost || 0).toLocaleString()}`;
                break;
            case 'downtime':
                mainValue = String(data.total_incidents || 0);
                label = 'Downtime Incidents';
                subValue = `${data.total_hours || 0} total hours`;
                break;
            case 'mtbf_mttr':
                mainValue = `${(data.mtbf?.average_mtbf_hours || 0).toFixed(1)}h`;
                label = 'Avg MTBF';
                subValue = `MTTR: ${(data.mttr?.average_mttr_hours || 0).toFixed(1)}h`;
                break;
            case 'predictions':
                mainValue = String(data.machines_at_risk || 0);
                label = 'Machines at Risk';
                subValue = `of ${data.total_machines || 0} total`;
                break;
            default:
                mainValue = '-';
                label = widget.title;
        }

        return (
            <div className="flex h-full flex-col items-center justify-center">
                <p className="text-4xl font-bold">{mainValue}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
                {subValue && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {subValue}
                    </p>
                )}
            </div>
        );
    };

    const renderGauge = () => {
        if (!data) return null;

        let value = 0;
        const maxValue = 100;

        switch (widget.data_source) {
            case 'oee':
                value = data.average_oee || 0;
                break;
            default:
                value = 0;
        }

        const percentage = (value / maxValue) * 100;
        const color =
            percentage >= 85
                ? 'text-green-600'
                : percentage >= 60
                  ? 'text-yellow-600'
                  : 'text-red-600';

        return (
            <div className="flex h-full flex-col items-center justify-center">
                <div className="relative h-32 w-32">
                    <svg
                        className="h-full w-full -rotate-90"
                        viewBox="0 0 36 36"
                    >
                        <path
                            className="stroke-gray-200"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className={`${color.replace('text-', 'stroke-')}`}
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={`${percentage}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${color}`}>
                            {value.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderGenericData = () => {
        return (
            <div className="h-full overflow-auto p-2">
                <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    };

    return (
        <Card
            className="h-full"
            style={{
                gridColumn: `span ${widget.size_width}`,
                gridRow: `span ${widget.size_height}`,
            }}
        >
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                    {widgetIcons[widget.widget_type] || (
                        <Activity className="h-4 w-4" />
                    )}
                    {widget.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                    {dataSourceIcons[widget.data_source]}
                    {widget.data_source.replace(/_/g, ' ')}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
                {renderContent()}
            </CardContent>
        </Card>
    );
}

export default function ShowDashboard({ dashboard }: Props) {
    return (
        <AppLayout>
            <Head title={dashboard.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.visit('/dashboards')}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="flex items-center gap-2 text-2xl font-bold">
                                    {dashboard.name}
                                    {dashboard.is_default && (
                                        <Badge variant="secondary">
                                            Default
                                        </Badge>
                                    )}
                                    {dashboard.is_shared && (
                                        <Badge variant="outline">Shared</Badge>
                                    )}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {dashboard.description ||
                                        `Created by ${dashboard.creator.name}`}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() =>
                                router.visit(`/dashboards/${dashboard.id}/edit`)
                            }
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Dashboard
                        </Button>
                    </div>

                    {/* Widgets Grid */}
                    {dashboard.widgets.length > 0 ? (
                        <div
                            className="grid gap-4"
                            style={{
                                gridTemplateColumns: 'repeat(12, 1fr)',
                                gridAutoRows: '120px',
                            }}
                        >
                            {dashboard.widgets.map((widget) => (
                                <WidgetCard key={widget.id} widget={widget} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <LayoutList className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No Widgets Yet
                                </h3>
                                <p className="mt-2 text-muted-foreground">
                                    Add widgets to start building your
                                    dashboard.
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() =>
                                        router.visit(
                                            `/dashboards/${dashboard.id}/edit`,
                                        )
                                    }
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Add Widgets
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
