import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    BarChart3,
    Eye,
    Gauge,
    LayoutList,
    LineChart,
    PieChart,
    Plus,
    Save,
    Settings,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

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
}

interface Dashboard {
    id: number;
    name: string;
    description: string | null;
    is_default: boolean;
    is_shared: boolean;
    shared_with_role: string | null;
    widgets: Widget[];
}

interface Props {
    dashboard: Dashboard;
    widgetTypes: Record<string, string>;
    dataSources: Record<string, string>;
}

const widgetIcons: Record<string, React.ReactNode> = {
    metric_card: <Activity className="h-5 w-5" />,
    line_chart: <LineChart className="h-5 w-5" />,
    bar_chart: <BarChart3 className="h-5 w-5" />,
    pie_chart: <PieChart className="h-5 w-5" />,
    gauge: <Gauge className="h-5 w-5" />,
    table: <LayoutList className="h-5 w-5" />,
    list: <LayoutList className="h-5 w-5" />,
};

export default function EditDashboard({
    dashboard,
    widgetTypes,
    dataSources,
}: Props) {
    const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

    // Form for dashboard settings
    const { data, setData, put, processing } = useForm({
        name: dashboard.name,
        description: dashboard.description || '',
        is_default: dashboard.is_default,
        is_shared: dashboard.is_shared,
        shared_with_role: dashboard.shared_with_role || '',
    });

    // Form for adding widgets
    const widgetForm = useForm({
        widget_type: 'metric_card',
        title: '',
        data_source: 'work_orders',
        size_width: 3,
        size_height: 2,
    });

    const handleSaveDashboard = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboards/${dashboard.id}`);
    };

    const handleAddWidget = (e: React.FormEvent) => {
        e.preventDefault();
        widgetForm.post(`/dashboards/${dashboard.id}/widgets`, {
            onSuccess: () => {
                setIsAddWidgetOpen(false);
                widgetForm.reset();
            },
        });
    };

    const handleDeleteWidget = (widgetId: number) => {
        if (!confirm('Are you sure you want to delete this widget?')) return;

        router.delete(`/dashboards/${dashboard.id}/widgets/${widgetId}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${dashboard.name}`} />

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
                                <h1 className="text-2xl font-bold">
                                    Edit Dashboard
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {dashboard.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.visit(`/dashboards/${dashboard.id}`)
                                }
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Dashboard Settings */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Dashboard Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSaveDashboard}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            rows={2}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label>Default Dashboard</Label>
                                        <Switch
                                            checked={data.is_default}
                                            onCheckedChange={(checked) =>
                                                setData('is_default', checked)
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label>Share with Team</Label>
                                        <Switch
                                            checked={data.is_shared}
                                            onCheckedChange={(checked) =>
                                                setData('is_shared', checked)
                                            }
                                        />
                                    </div>

                                    {data.is_shared && (
                                        <div className="space-y-2">
                                            <Label>Share with Role</Label>
                                            <Select
                                                value={
                                                    data.shared_with_role ||
                                                    'all'
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        'shared_with_role',
                                                        value === 'all'
                                                            ? ''
                                                            : value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All Roles
                                                    </SelectItem>
                                                    <SelectItem value="operator">
                                                        Operators
                                                    </SelectItem>
                                                    <SelectItem value="technician">
                                                        Technicians
                                                    </SelectItem>
                                                    <SelectItem value="manager">
                                                        Managers
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Settings
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Widgets */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Widgets</CardTitle>
                                        <CardDescription>
                                            {dashboard.widgets.length} widget(s)
                                            on this dashboard
                                        </CardDescription>
                                    </div>
                                    <Dialog
                                        open={isAddWidgetOpen}
                                        onOpenChange={setIsAddWidgetOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Widget
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <form onSubmit={handleAddWidget}>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Add Widget
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Configure your new
                                                        widget
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Title</Label>
                                                        <Input
                                                            value={
                                                                widgetForm.data
                                                                    .title
                                                            }
                                                            onChange={(e) =>
                                                                widgetForm.setData(
                                                                    'title',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Widget title"
                                                        />
                                                        {widgetForm.errors
                                                            .title && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    widgetForm
                                                                        .errors
                                                                        .title
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>
                                                            Widget Type
                                                        </Label>
                                                        <Select
                                                            value={
                                                                widgetForm.data
                                                                    .widget_type
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                widgetForm.setData(
                                                                    'widget_type',
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(
                                                                    widgetTypes,
                                                                ).map(
                                                                    ([
                                                                        key,
                                                                        label,
                                                                    ]) => (
                                                                        <SelectItem
                                                                            key={
                                                                                key
                                                                            }
                                                                            value={
                                                                                key
                                                                            }
                                                                        >
                                                                            {
                                                                                label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>
                                                            Data Source
                                                        </Label>
                                                        <Select
                                                            value={
                                                                widgetForm.data
                                                                    .data_source
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                widgetForm.setData(
                                                                    'data_source',
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(
                                                                    dataSources,
                                                                ).map(
                                                                    ([
                                                                        key,
                                                                        label,
                                                                    ]) => (
                                                                        <SelectItem
                                                                            key={
                                                                                key
                                                                            }
                                                                            value={
                                                                                key
                                                                            }
                                                                        >
                                                                            {
                                                                                label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>
                                                                Width (1-12
                                                                columns)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                max={12}
                                                                value={
                                                                    widgetForm
                                                                        .data
                                                                        .size_width
                                                                }
                                                                onChange={(e) =>
                                                                    widgetForm.setData(
                                                                        'size_width',
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ) || 3,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>
                                                                Height (1-6
                                                                rows)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                max={6}
                                                                value={
                                                                    widgetForm
                                                                        .data
                                                                        .size_height
                                                                }
                                                                onChange={(e) =>
                                                                    widgetForm.setData(
                                                                        'size_height',
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ) || 2,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setIsAddWidgetOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            !widgetForm.data
                                                                .title ||
                                                            widgetForm.processing
                                                        }
                                                    >
                                                        Add Widget
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {dashboard.widgets.length > 0 ? (
                                    <div className="space-y-3">
                                        {dashboard.widgets.map((widget) => (
                                            <div
                                                key={widget.id}
                                                className="flex items-center justify-between rounded-lg border p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {widgetIcons[
                                                        widget.widget_type
                                                    ] || (
                                                        <Activity className="h-5 w-5" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">
                                                            {widget.title}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                widgetTypes[
                                                                    widget
                                                                        .widget_type
                                                                ]
                                                            }{' '}
                                                            -{' '}
                                                            {
                                                                dataSources[
                                                                    widget
                                                                        .data_source
                                                                ]
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">
                                                        {widget.size_width}x
                                                        {widget.size_height}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDeleteWidget(
                                                                widget.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <LayoutList className="mx-auto h-12 w-12 opacity-50" />
                                        <p className="mt-2">No widgets yet</p>
                                        <p className="text-sm">
                                            Click "Add Widget" to get started
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
