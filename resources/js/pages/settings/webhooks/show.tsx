import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Copy,
    Eye,
    Play,
    RefreshCw,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WebhookDelivery {
    id: number;
    event: string;
    payload: Record<string, unknown>;
    response_code: number | null;
    response_body: string | null;
    duration_ms: number | null;
    status: 'pending' | 'success' | 'failed';
    delivered_at: string | null;
    created_at: string;
}

interface WebhookEndpoint {
    id: number;
    name: string;
    url: string;
    secret: string;
    events: string[];
    is_active: boolean;
    failure_count: number;
    last_triggered_at: string | null;
    created_at: string;
}

interface AvailableEvents {
    [key: string]: string;
}

interface PageProps {
    webhook: WebhookEndpoint;
    deliveries: WebhookDelivery[];
    availableEvents: AvailableEvents;
}

export default function WebhookShow() {
    const { t } = useTranslation();
    const {
        webhook,
        deliveries = [],
        availableEvents = {},
    } = usePage<PageProps>().props;

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPayloadOpen, setIsPayloadOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] =
        useState<WebhookDelivery | null>(null);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        is_active: webhook.is_active,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/settings/webhooks/${webhook.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => setIsEditOpen(false),
        });
    };

    const handleTest = () => {
        router.post(
            `/settings/webhooks/${webhook.id}/test`,
            {},
            { preserveScroll: true },
        );
    };

    const handleRegenerateSecret = () => {
        if (
            confirm(
                t(
                    'webhooks.confirmRegenerateSecret',
                    'Are you sure you want to regenerate the secret? You will need to update your endpoint configuration.',
                ),
            )
        ) {
            router.post(
                `/settings/webhooks/${webhook.id}/regenerate-secret`,
                {},
                { preserveScroll: true },
            );
        }
    };

    const toggleEvent = (event: string) => {
        setFormData((prev) => ({
            ...prev,
            events: prev.events.includes(event)
                ? prev.events.filter((e) => e !== event)
                : [...prev.events, event],
        }));
    };

    const copySecret = async () => {
        await navigator.clipboard.writeText(webhook.secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const viewPayload = (delivery: WebhookDelivery) => {
        setSelectedDelivery(delivery);
        setIsPayloadOpen(true);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return t('common.never', 'Never');
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getDeliveryStatusBadge = (delivery: WebhookDelivery) => {
        switch (delivery.status) {
            case 'success':
                return (
                    <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {t('webhooks.delivery.success', 'Success')}
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        {t('webhooks.delivery.failed', 'Failed')}
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        {t('webhooks.delivery.pending', 'Pending')}
                    </Badge>
                );
        }
    };

    // Group events by category
    const eventCategories = Object.entries(availableEvents).reduce(
        (acc, [key, label]) => {
            const [category] = key.split('.');
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push({ key, label });
            return acc;
        },
        {} as Record<string, { key: string; label: string }[]>,
    );

    const successCount = deliveries.filter(
        (d) => d.status === 'success',
    ).length;
    const failedCount = deliveries.filter((d) => d.status === 'failed').length;

    return (
        <AppLayout>
            <Head
                title={`${t('webhooks.title', 'Webhook')}: ${webhook.name}`}
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="mb-4"
                        >
                            <Link href="/settings/webhooks">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('webhooks.backToList', 'Back to Webhooks')}
                            </Link>
                        </Button>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {webhook.name}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {webhook.url}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleTest}>
                                    <Play className="mr-2 h-4 w-4" />
                                    {t('webhooks.sendTest', 'Send Test')}
                                </Button>
                                <Button onClick={() => setIsEditOpen(true)}>
                                    {t('common.edit', 'Edit')}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Configuration Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {t(
                                            'webhooks.configuration',
                                            'Configuration',
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm text-gray-600 dark:text-gray-400">
                                            {t(
                                                'webhooks.payloadUrl',
                                                'Payload URL',
                                            )}
                                        </Label>
                                        <p className="mt-1 font-mono text-sm">
                                            {webhook.url}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('webhooks.secret', 'Secret')}
                                        </Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                                {webhook.secret
                                                    ? '••••••••••••••••'
                                                    : t(
                                                          'webhooks.noSecret',
                                                          'No secret configured',
                                                      )}
                                            </code>
                                            {webhook.secret && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={copySecret}
                                                    >
                                                        {copied ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={
                                                            handleRegenerateSecret
                                                        }
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600 dark:text-gray-400">
                                            {t(
                                                'webhooks.subscribedEvents',
                                                'Subscribed Events',
                                            )}
                                        </Label>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {webhook.events.map((event) => (
                                                <Badge
                                                    key={event}
                                                    variant="outline"
                                                >
                                                    {availableEvents[event] ||
                                                        event}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Deliveries Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {t(
                                            'webhooks.recentDeliveries',
                                            'Recent Deliveries',
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            'webhooks.recentDeliveriesDescription',
                                            'Last 50 webhook deliveries',
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {deliveries.length === 0 ? (
                                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            {t(
                                                'webhooks.noDeliveries',
                                                'No deliveries yet. Send a test webhook to see delivery history.',
                                            )}
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        {t(
                                                            'webhooks.table.event',
                                                            'Event',
                                                        )}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t(
                                                            'webhooks.table.status',
                                                            'Status',
                                                        )}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t(
                                                            'webhooks.table.responseCode',
                                                            'Response',
                                                        )}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t(
                                                            'webhooks.table.duration',
                                                            'Duration',
                                                        )}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t(
                                                            'webhooks.table.deliveredAt',
                                                            'Delivered',
                                                        )}
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        {t(
                                                            'webhooks.table.actions',
                                                            'Actions',
                                                        )}
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {deliveries.map((delivery) => (
                                                    <TableRow key={delivery.id}>
                                                        <TableCell className="font-mono text-sm">
                                                            {delivery.event}
                                                        </TableCell>
                                                        <TableCell>
                                                            {getDeliveryStatusBadge(
                                                                delivery,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {delivery.response_code ||
                                                                '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {delivery.duration_ms
                                                                ? `${delivery.duration_ms}ms`
                                                                : '-'}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                            {formatDate(
                                                                delivery.delivered_at,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    viewPayload(
                                                                        delivery,
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Status Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {t('webhooks.status', 'Status')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('webhooks.active', 'Active')}
                                        </span>
                                        {webhook.is_active ? (
                                            <Badge className="bg-green-500">
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                {t('common.yes', 'Yes')}
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <XCircle className="mr-1 h-3 w-3" />
                                                {t('common.no', 'No')}
                                            </Badge>
                                        )}
                                    </div>
                                    {webhook.failure_count > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {t(
                                                    'webhooks.failureCount',
                                                    'Failure Count',
                                                )}
                                            </span>
                                            <Badge
                                                variant={
                                                    webhook.failure_count >= 5
                                                        ? 'destructive'
                                                        : 'secondary'
                                                }
                                            >
                                                <AlertTriangle className="mr-1 h-3 w-3" />
                                                {webhook.failure_count}
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t(
                                                'webhooks.lastTriggered',
                                                'Last Triggered',
                                            )}
                                        </span>
                                        <span className="text-sm">
                                            {formatDate(
                                                webhook.last_triggered_at,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('webhooks.created', 'Created')}
                                        </span>
                                        <span className="text-sm">
                                            {formatDate(webhook.created_at)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Delivery Stats Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {t(
                                            'webhooks.deliveryStats',
                                            'Delivery Stats',
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            'webhooks.last50',
                                            'Last 50 deliveries',
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t(
                                                'webhooks.successful',
                                                'Successful',
                                            )}
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            {successCount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('webhooks.failed', 'Failed')}
                                        </span>
                                        <span className="font-semibold text-red-600">
                                            {failedCount}
                                        </span>
                                    </div>
                                    {deliveries.length > 0 && (
                                        <div className="pt-2">
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                <div
                                                    className="h-full bg-green-500"
                                                    style={{
                                                        width: `${(successCount / deliveries.length) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                                                {Math.round(
                                                    (successCount /
                                                        deliveries.length) *
                                                        100,
                                                )}
                                                %{' '}
                                                {t(
                                                    'webhooks.successRate',
                                                    'success rate',
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {t('webhooks.edit', 'Edit Webhook')}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                'webhooks.editDescription',
                                'Update webhook configuration',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    {t('webhooks.form.name', 'Name')}
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">
                                    {t('webhooks.form.url', 'Payload URL')}
                                </Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            url: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {t(
                                        'webhooks.form.events',
                                        'Events to Subscribe',
                                    )}
                                </Label>
                                <div className="max-h-64 space-y-4 overflow-y-auto rounded-md border p-4">
                                    {Object.entries(eventCategories).map(
                                        ([category, events]) => (
                                            <div key={category}>
                                                <h4 className="mb-2 font-medium text-gray-900 capitalize dark:text-gray-100">
                                                    {category.replace('_', ' ')}
                                                </h4>
                                                <div className="space-y-2 pl-2">
                                                    {events.map(
                                                        ({ key, label }) => (
                                                            <div
                                                                key={key}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <Checkbox
                                                                    id={`edit-${key}`}
                                                                    checked={formData.events.includes(
                                                                        key,
                                                                    )}
                                                                    onCheckedChange={() =>
                                                                        toggleEvent(
                                                                            key,
                                                                        )
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`edit-${key}`}
                                                                    className="text-sm font-normal"
                                                                >
                                                                    {label}
                                                                </Label>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                {t('common.cancel', 'Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={formData.events.length === 0}
                            >
                                {t('common.save', 'Save Changes')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Payload Viewer Dialog */}
            <Dialog open={isPayloadOpen} onOpenChange={setIsPayloadOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {t('webhooks.deliveryDetails', 'Delivery Details')}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedDelivery?.event} -{' '}
                            {formatDate(selectedDelivery?.delivered_at ?? null)}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedDelivery && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('webhooks.payload', 'Request Payload')}
                                </Label>
                                <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                                    <code>
                                        {JSON.stringify(
                                            selectedDelivery.payload,
                                            null,
                                            2,
                                        )}
                                    </code>
                                </pre>
                            </div>
                            {selectedDelivery.response_body && (
                                <div>
                                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                                        {t(
                                            'webhooks.response',
                                            'Response Body',
                                        )}
                                    </Label>
                                    <pre className="mt-2 max-h-32 overflow-auto rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                                        <code>
                                            {selectedDelivery.response_body}
                                        </code>
                                    </pre>
                                </div>
                            )}
                            <div className="flex gap-4">
                                <div>
                                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                                        {t(
                                            'webhooks.responseCode',
                                            'Response Code',
                                        )}
                                    </Label>
                                    <p className="mt-1 font-mono">
                                        {selectedDelivery.response_code || '-'}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('webhooks.duration', 'Duration')}
                                    </Label>
                                    <p className="mt-1 font-mono">
                                        {selectedDelivery.duration_ms
                                            ? `${selectedDelivery.duration_ms}ms`
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsPayloadOpen(false)}>
                            {t('common.close', 'Close')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
