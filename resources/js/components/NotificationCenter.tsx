import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    Check,
    CheckCircle,
    DollarSign,
    ExternalLink,
    Package,
    Wrench,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Notification {
    id: string;
    type: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
}

interface NotificationCenterProps {
    initialNotifications?: Notification[];
    unreadCount?: number;
}

const NOTIFICATION_ICONS = {
    work_order_assigned: Wrench,
    work_order_overdue: AlertTriangle,
    preventive_task_due: CheckCircle,
    part_low_stock: Package,
    sensor_alert: Activity,
    budget_exceeded: DollarSign,
    production_run_complete: BarChart3,
};

const NOTIFICATION_COLORS = {
    work_order_assigned: 'text-blue-600 bg-blue-100',
    work_order_overdue: 'text-red-600 bg-red-100',
    preventive_task_due: 'text-green-600 bg-green-100',
    part_low_stock: 'text-orange-600 bg-orange-100',
    sensor_alert: 'text-purple-600 bg-purple-100',
    budget_exceeded: 'text-red-600 bg-red-100',
    production_run_complete: 'text-green-600 bg-green-100',
};

export default function NotificationCenter({
    initialNotifications = [],
    unreadCount: initialUnreadCount = 0,
}: NotificationCenterProps) {
    const { t } = useTranslation('common');
    const [notifications, setNotifications] =
        useState<Notification[]>(initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [isOpen, setIsOpen] = useState(false);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notifications?limit=10');
                const data = await response.json();

                setNotifications(data.data || []);
                setUnreadCount(data.unread_count || 0);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notificationId
                        ? { ...notif, read_at: new Date().toISOString() }
                        : notif,
                ),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            setNotifications((prev) =>
                prev.map((notif) => ({
                    ...notif,
                    read_at: new Date().toISOString(),
                })),
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            const notif = notifications.find((n) => n.id === notificationId);
            if (notif && !notif.read_at) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }

            setNotifications((prev) =>
                prev.filter((notif) => notif.id !== notificationId),
            );
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        const Icon =
            NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS] || Bell;
        return Icon;
    };

    const getNotificationColor = (type: string) => {
        return (
            NOTIFICATION_COLORS[type as keyof typeof NOTIFICATION_COLORS] ||
            'text-gray-600 bg-gray-100'
        );
    };

    const getNotificationTitle = (notification: Notification) => {
        const { type, data } = notification;

        switch (type) {
            case 'work_order_assigned':
                return t('notifications.types.work_order_assigned_title', {
                    title: data.work_order_title || t('notifications.new_task'),
                });
            case 'work_order_overdue':
                return t('notifications.types.work_order_overdue_title', {
                    title: data.work_order_title || t('notifications.task'),
                });
            case 'preventive_task_due':
                return t('notifications.types.pm_due_title', {
                    title: data.task_title || t('notifications.task'),
                });
            case 'part_low_stock':
                return t('notifications.types.low_stock_title', {
                    part: data.part_name || t('notifications.part'),
                });
            case 'sensor_alert':
                return t('notifications.types.sensor_alert_title', {
                    machine: data.machine_name || t('notifications.machine'),
                });
            case 'budget_exceeded':
                return t('notifications.types.budget_exceeded_title');
            case 'production_run_complete':
                return t('notifications.types.production_complete_title', {
                    machine: data.machine_name || t('notifications.machine'),
                });
            default:
                return t('notifications.notification');
        }
    };

    const getNotificationDescription = (notification: Notification) => {
        const { type, data } = notification;

        switch (type) {
            case 'work_order_assigned':
                return `${data.machine_name || ''} • ${t('notifications.priority')}: ${data.priority || t('notifications.normal')}`;
            case 'work_order_overdue':
                return t('notifications.days_overdue', {
                    count: data.days_overdue || 0,
                });
            case 'preventive_task_due':
                return t('notifications.due_on', { date: data.due_date || '' });
            case 'part_low_stock':
                return t('notifications.remaining', {
                    count: data.quantity_available || 0,
                });
            case 'sensor_alert':
                return `${data.sensor_type || t('notifications.sensor')} ${data.alert_type || t('notifications.alert')}`;
            case 'budget_exceeded':
                return t('notifications.exceeded_by', {
                    amount: data.variance || 0,
                });
            case 'production_run_complete':
                return `OEE: ${data.oee || 'N/A'}%`;
            default:
                return '';
        }
    };

    const getNotificationLink = (notification: Notification) => {
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
                    ? `/machines/${data.machine_id}/sensors`
                    : null;
            case 'budget_exceeded':
                return '/cost-management/budget';
            case 'production_run_complete':
                return data.production_run_id
                    ? `/oee/production-runs/${data.production_run_id}`
                    : null;
            default:
                return null;
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        const link = getNotificationLink(notification);

        if (!notification.read_at) {
            markAsRead(notification.id);
        }

        if (link) {
            router.visit(link);
            setIsOpen(false);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return t('time.just_now');
        if (diffMins < 60) return t('time.minutes_ago', { count: diffMins });

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return t('time.hours_ago', { count: diffHours });

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return t('time.yesterday');
        if (diffDays < 7) return t('time.days_ago', { count: diffDays });

        return date.toLocaleDateString();
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="text-lg font-semibold">
                        {t('notifications.title')}
                    </h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs"
                        >
                            <Check className="mr-1 h-3 w-3" />
                            {t('notifications.mark_all_read')}
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                            <Bell className="mb-3 h-12 w-12 text-gray-400" />
                            <p className="font-medium text-gray-600">
                                {t('notifications.no_notifications')}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {t('notifications.all_caught_up')}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => {
                                const Icon = getNotificationIcon(
                                    notification.type,
                                );
                                const colorClass = getNotificationColor(
                                    notification.type,
                                );
                                const isUnread = !notification.read_at;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 transition-colors hover:bg-gray-50 ${
                                            isUnread ? 'bg-blue-50/50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`${colorClass} shrink-0 rounded-lg p-2`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        handleNotificationClick(
                                                            notification,
                                                        )
                                                    }
                                                >
                                                    <div className="mb-1 flex items-start justify-between gap-2">
                                                        <p
                                                            className={`text-sm ${isUnread ? 'font-semibold' : 'font-medium'}`}
                                                        >
                                                            {getNotificationTitle(
                                                                notification,
                                                            )}
                                                        </p>
                                                        {getNotificationLink(
                                                            notification,
                                                        ) && (
                                                            <ExternalLink className="h-3 w-3 shrink-0 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600">
                                                        {getNotificationDescription(
                                                            notification,
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {formatTimestamp(
                                                            notification.created_at,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(
                                                        notification.id,
                                                    );
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="border-t px-4 py-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                                router.visit('/notifications');
                                setIsOpen(false);
                            }}
                        >
                            {t('notifications.view_all')}
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
