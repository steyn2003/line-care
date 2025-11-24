import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    BellOff,
    Check,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    ExternalLink,
    Inbox,
    Package,
    Trash2,
    Wrench,
} from 'lucide-react';

interface Notification {
    id: string;
    type: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
}

interface NotificationType {
    value: string;
    label: string;
}

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    notifications: PaginatedNotifications;
    unreadCount: number;
    filters: {
        status?: string;
        type?: string;
    };
    notificationTypes: NotificationType[];
}

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
    work_order_assigned: Wrench,
    work_order_overdue: AlertTriangle,
    preventive_task_due: CheckCircle,
    part_low_stock: Package,
    sensor_alert: Activity,
    budget_exceeded: DollarSign,
    production_run_complete: BarChart3,
};

const NOTIFICATION_COLORS: Record<string, string> = {
    work_order_assigned: 'text-blue-600 bg-blue-100',
    work_order_overdue: 'text-red-600 bg-red-100',
    preventive_task_due: 'text-green-600 bg-green-100',
    part_low_stock: 'text-orange-600 bg-orange-100',
    sensor_alert: 'text-purple-600 bg-purple-100',
    budget_exceeded: 'text-red-600 bg-red-100',
    production_run_complete: 'text-green-600 bg-green-100',
};

export default function NotificationsIndex({
    notifications,
    unreadCount,
    filters,
    notificationTypes,
}: Props) {
    const getNotificationIcon = (type: string) => {
        return NOTIFICATION_ICONS[type] || Bell;
    };

    const getNotificationColor = (type: string) => {
        return NOTIFICATION_COLORS[type] || 'text-gray-600 bg-gray-100';
    };

    const getNotificationTitle = (notification: Notification) => {
        const { type, data } = notification;

        switch (type) {
            case 'work_order_assigned':
                return `Work Order Assigned: ${data.work_order_title || 'New Task'}`;
            case 'work_order_overdue':
                return `Work Order Overdue: ${data.work_order_title || 'Task'}`;
            case 'preventive_task_due':
                return `Preventive Maintenance Due: ${data.task_title || 'Task'}`;
            case 'part_low_stock':
                return `Low Stock Alert: ${data.part_name || 'Part'}`;
            case 'sensor_alert':
                return `Sensor Alert: ${data.machine_name || 'Machine'}`;
            case 'budget_exceeded':
                return 'Budget Exceeded';
            case 'production_run_complete':
                return `Production Complete: ${data.machine_name || 'Machine'}`;
            default:
                return 'Notification';
        }
    };

    const getNotificationDescription = (notification: Notification) => {
        const { type, data } = notification;

        switch (type) {
            case 'work_order_assigned':
                return `${data.machine_name || ''} - Priority: ${data.priority || 'Normal'}`;
            case 'work_order_overdue':
                return `${data.days_overdue || 0} days overdue`;
            case 'preventive_task_due':
                return `Due ${data.due_date || 'soon'}`;
            case 'part_low_stock':
                return `Only ${data.quantity_available || 0} units remaining (reorder point: ${data.reorder_point || 'N/A'})`;
            case 'sensor_alert':
                return `${data.sensor_type || 'Sensor'} reading: ${data.reading_value || 'N/A'} (${data.alert_type || 'alert'})`;
            case 'budget_exceeded':
                return `Exceeded by $${data.variance || 0}`;
            case 'production_run_complete':
                return `OEE: ${data.oee || 'N/A'}%`;
            default:
                return '';
        }
    };

    const getNotificationLink = (notification: Notification): string | null => {
        const { type, data } = notification;

        switch (type) {
            case 'work_order_assigned':
            case 'work_order_overdue':
                return data.work_order_id
                    ? `/work-orders/${data.work_order_id}`
                    : null;
            case 'preventive_task_due':
                return data.task_id
                    ? `/preventive-tasks/${data.task_id}`
                    : null;
            case 'part_low_stock':
                return data.part_id ? `/spare-parts/${data.part_id}` : null;
            case 'sensor_alert':
                return data.machine_id
                    ? `/machines/${data.machine_id}`
                    : null;
            case 'budget_exceeded':
                return '/costs/budget';
            case 'production_run_complete':
                return data.production_run_id
                    ? `/production/${data.production_run_id}`
                    : null;
            default:
                return null;
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const params: Record<string, string | undefined> = {
            ...filters,
            [key]: value === 'all' ? undefined : value,
        };

        // Remove undefined values
        Object.keys(params).forEach((k) => {
            if (params[k] === undefined) delete params[k];
        });

        router.get('/notifications', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleMarkAsRead = (notificationId: string) => {
        router.post(`/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
        });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/mark-all-read', {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (notificationId: string) => {
        router.delete(`/notifications/${notificationId}`, {
            preserveScroll: true,
        });
    };

    const handleNotificationClick = (notification: Notification) => {
        const link = getNotificationLink(notification);

        if (!notification.read_at) {
            handleMarkAsRead(notification.id);
        }

        if (link) {
            router.visit(link);
        }
    };

    const handlePageChange = (page: number) => {
        router.get('/notifications', { ...filters, page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Notifications" />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Notifications
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {unreadCount > 0
                                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                                : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            <Check className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="w-48">
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={(value) =>
                                        handleFilterChange('status', value)
                                    }
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Notifications</SelectItem>
                                        <SelectItem value="unread">Unread Only</SelectItem>
                                        <SelectItem value="read">Read Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-56">
                                <Select
                                    value={filters.type || 'all'}
                                    onValueChange={(value) =>
                                        handleFilterChange('type', value)
                                    }
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {notificationTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {(filters.status || filters.type) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        router.get('/notifications', {}, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications List */}
                <div className="space-y-3">
                    {notifications.data.length === 0 ? (
                        <Card className="border-border">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="rounded-full bg-muted p-4 mb-4">
                                    {filters.status === 'unread' ? (
                                        <BellOff className="h-10 w-10 text-muted-foreground" />
                                    ) : (
                                        <Inbox className="h-10 w-10 text-muted-foreground" />
                                    )}
                                </div>
                                <p className="text-lg font-medium text-foreground mb-1">
                                    No notifications
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {filters.status === 'unread'
                                        ? "You're all caught up! No unread notifications."
                                        : 'No notifications match your current filters.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        notifications.data.map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            const colorClass = getNotificationColor(notification.type);
                            const isUnread = !notification.read_at;
                            const link = getNotificationLink(notification);

                            return (
                                <Card
                                    key={notification.id}
                                    className={`border-border transition-all hover:shadow-md ${
                                        isUnread ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                                    }`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div
                                                className={`shrink-0 rounded-lg p-3 ${colorClass}`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            {/* Content */}
                                            <div
                                                className={`min-w-0 flex-1 ${link ? 'cursor-pointer' : ''}`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3
                                                                className={`text-base truncate ${
                                                                    isUnread
                                                                        ? 'font-semibold text-foreground'
                                                                        : 'font-medium text-foreground'
                                                                }`}
                                                            >
                                                                {getNotificationTitle(notification)}
                                                            </h3>
                                                            {isUnread && (
                                                                <Badge variant="default" className="shrink-0 bg-blue-600">
                                                                    New
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {getNotificationDescription(notification)}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span>{formatTimestamp(notification.created_at)}</span>
                                                            {link && (
                                                                <span className="flex items-center gap-1 text-primary">
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    View details
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                {isUnread && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        title="Mark as read"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(notification.id);
                                                        }}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    title="Delete notification"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(notification.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {notifications.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {notifications.from} to {notifications.to} of{' '}
                            {notifications.total} notifications
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={notifications.current_page === 1}
                                onClick={() => handlePageChange(notifications.current_page - 1)}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground px-2">
                                Page {notifications.current_page} of {notifications.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={notifications.current_page === notifications.last_page}
                                onClick={() => handlePageChange(notifications.current_page + 1)}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
