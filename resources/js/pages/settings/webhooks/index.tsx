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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
    CheckCircle2,
    ExternalLink,
    Plus,
    Settings2,
    Trash2,
    Webhook,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WebhookEndpoint {
    id: number;
    name: string;
    url: string;
    events: string[];
    is_active: boolean;
    failure_count: number;
    last_triggered_at: string | null;
    deliveries_count: number;
    created_at: string;
}

interface AvailableEvents {
    [key: string]: string;
}

interface PageProps {
    webhooks: WebhookEndpoint[];
    availableEvents: AvailableEvents;
    flash?: {
        success?: string;
    };
}

export default function WebhooksIndex() {
    const { t } = useTranslation();
    const { webhooks = [], availableEvents = {} } = usePage<PageProps>().props;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        events: [] as string[],
        secret: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/settings/webhooks', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setFormData({ name: '', url: '', events: [], secret: '' });
                setIsCreateOpen(false);
            },
        });
    };

    const handleToggle = (webhookId: number) => {
        router.post(
            `/settings/webhooks/${webhookId}/toggle`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (webhookId: number) => {
        if (
            confirm(
                t(
                    'webhooks.confirmDelete',
                    'Are you sure you want to delete this webhook? This action cannot be undone.',
                ),
            )
        ) {
            router.delete(`/settings/webhooks/${webhookId}`, {
                preserveScroll: true,
            });
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

    const formatDate = (dateString: string | null) => {
        if (!dateString) return t('common.never', 'Never');
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (webhook: WebhookEndpoint) => {
        if (!webhook.is_active) {
            return (
                <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    {t('webhooks.status.inactive', 'Inactive')}
                </Badge>
            );
        }

        if (webhook.failure_count >= 5) {
            return (
                <Badge variant="destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {t('webhooks.status.failing', 'Failing')}
                </Badge>
            );
        }

        return (
            <Badge variant="default" className="bg-green-500">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {t('webhooks.status.active', 'Active')}
            </Badge>
        );
    };

    const totalWebhooks = webhooks.length;
    const activeWebhooks = webhooks.filter((w) => w.is_active).length;
    const failingWebhooks = webhooks.filter(
        (w) => w.is_active && w.failure_count >= 5,
    ).length;

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

    return (
        <AppLayout>
            <Head title={t('webhooks.title', 'Webhooks')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {t('webhooks.title', 'Webhooks')}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {t(
                                    'webhooks.description',
                                    'Configure webhooks to receive real-time notifications when events occur in LineCare',
                                )}
                            </p>
                        </div>
                        <Dialog
                            open={isCreateOpen}
                            onOpenChange={setIsCreateOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('webhooks.create', 'Create Webhook')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {t(
                                            'webhooks.createNew',
                                            'Create New Webhook',
                                        )}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {t(
                                            'webhooks.createDescription',
                                            'Configure a webhook endpoint to receive event notifications.',
                                        )}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreate}>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                {t('webhooks.form.name', 'Name')}
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder={t(
                                                    'webhooks.form.namePlaceholder',
                                                    'e.g., Production Server',
                                                )}
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
                                                {t(
                                                    'webhooks.form.url',
                                                    'Payload URL',
                                                )}
                                            </Label>
                                            <Input
                                                id="url"
                                                type="url"
                                                placeholder="https://example.com/webhook"
                                                value={formData.url}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        url: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t(
                                                    'webhooks.form.urlHelp',
                                                    'We will send a POST request to this URL when events occur.',
                                                )}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="secret">
                                                {t(
                                                    'webhooks.form.secret',
                                                    'Secret (Optional)',
                                                )}
                                            </Label>
                                            <Input
                                                id="secret"
                                                type="password"
                                                placeholder={t(
                                                    'webhooks.form.secretPlaceholder',
                                                    'Leave empty to auto-generate',
                                                )}
                                                value={formData.secret}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        secret: e.target.value,
                                                    })
                                                }
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t(
                                                    'webhooks.form.secretHelp',
                                                    'Used to sign webhook payloads for verification.',
                                                )}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>
                                                {t(
                                                    'webhooks.form.events',
                                                    'Events to Subscribe',
                                                )}
                                            </Label>
                                            <div className="max-h-64 space-y-4 overflow-y-auto rounded-md border p-4">
                                                {Object.entries(
                                                    eventCategories,
                                                ).map(([category, events]) => (
                                                    <div key={category}>
                                                        <h4 className="mb-2 font-medium capitalize text-gray-900 dark:text-gray-100">
                                                            {category.replace(
                                                                '_',
                                                                ' ',
                                                            )}
                                                        </h4>
                                                        <div className="space-y-2 pl-2">
                                                            {events.map(
                                                                ({
                                                                    key,
                                                                    label,
                                                                }) => (
                                                                    <div
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="flex items-center space-x-2"
                                                                    >
                                                                        <Checkbox
                                                                            id={
                                                                                key
                                                                            }
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
                                                                            htmlFor={
                                                                                key
                                                                            }
                                                                            className="text-sm font-normal"
                                                                        >
                                                                            {
                                                                                label
                                                                            }
                                                                        </Label>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {formData.events.length === 0 && (
                                                <p className="text-xs text-red-500">
                                                    {t(
                                                        'webhooks.form.eventsRequired',
                                                        'Please select at least one event.',
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsCreateOpen(false)
                                            }
                                        >
                                            {t('common.cancel', 'Cancel')}
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                formData.events.length === 0
                                            }
                                        >
                                            {t(
                                                'webhooks.createButton',
                                                'Create Webhook',
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {t('webhooks.stats.total', 'Total Webhooks')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalWebhooks}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {t('webhooks.stats.active', 'Active')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {activeWebhooks}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {t('webhooks.stats.failing', 'Failing')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {failingWebhooks}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Webhooks Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Webhook className="h-5 w-5" />
                                {t('webhooks.endpoints', 'Webhook Endpoints')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'webhooks.endpointsDescription',
                                    'Manage your webhook endpoints and view delivery history.',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {webhooks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Webhook className="mb-4 h-12 w-12 text-gray-400" />
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {t(
                                            'webhooks.empty.title',
                                            'No Webhooks Configured',
                                        )}
                                    </h3>
                                    <p className="mb-4 max-w-md text-center text-gray-600 dark:text-gray-400">
                                        {t(
                                            'webhooks.empty.description',
                                            'Create your first webhook to start receiving real-time event notifications.',
                                        )}
                                    </p>
                                    <Button onClick={() => setIsCreateOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('webhooks.create', 'Create Webhook')}
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                {t('webhooks.table.name', 'Name')}
                                            </TableHead>
                                            <TableHead>
                                                {t('webhooks.table.url', 'URL')}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'webhooks.table.events',
                                                    'Events',
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
                                                    'webhooks.table.lastTriggered',
                                                    'Last Triggered',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'webhooks.table.active',
                                                    'Active',
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
                                        {webhooks.map((webhook) => (
                                            <TableRow key={webhook.id}>
                                                <TableCell className="font-medium">
                                                    {webhook.name}
                                                </TableCell>
                                                <TableCell>
                                                    <code className="max-w-xs truncate text-xs text-gray-600 dark:text-gray-400">
                                                        {webhook.url}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {webhook.events.length}{' '}
                                                        {t(
                                                            'webhooks.events',
                                                            'events',
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(webhook)}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(
                                                        webhook.last_triggered_at,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={webhook.is_active}
                                                        onCheckedChange={() =>
                                                            handleToggle(webhook.id)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/settings/webhooks/${webhook.id}`}
                                                            >
                                                                <Settings2 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    webhook.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documentation Card */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>
                                {t('webhooks.docs.title', 'Webhook Documentation')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'webhooks.docs.description',
                                    'Learn how to handle webhook payloads in your application',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="mb-2 font-medium">
                                    {t(
                                        'webhooks.docs.payloadFormat',
                                        'Payload Format',
                                    )}
                                </h4>
                                <pre className="overflow-x-auto rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                                    <code>{`{
  "event": "work_order.created",
  "timestamp": "2025-01-20T14:30:00Z",
  "data": {
    "_type": "WorkOrder",
    "_id": 123,
    "title": "Fix conveyor belt",
    "status": "open",
    ...
  }
}`}</code>
                                </pre>
                            </div>
                            <div>
                                <h4 className="mb-2 font-medium">
                                    {t(
                                        'webhooks.docs.verification',
                                        'Signature Verification',
                                    )}
                                </h4>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    {t(
                                        'webhooks.docs.verificationDescription',
                                        'Each webhook includes a signature header for verification:',
                                    )}
                                </p>
                                <pre className="overflow-x-auto rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                                    <code>X-Webhook-Signature: t=1674225000,v1=abc123...</code>
                                </pre>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {t(
                                        'webhooks.docs.verificationSteps',
                                        'To verify: extract timestamp and signature, compute HMAC-SHA256 of "{timestamp}.{payload}" using your secret, compare with signature.',
                                    )}
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-2 font-medium">
                                    {t('webhooks.docs.headers', 'Request Headers')}
                                </h4>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    <li>
                                        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                                            Content-Type: application/json
                                        </code>
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                                            X-Webhook-Event
                                        </code>{' '}
                                        - {t('webhooks.docs.eventName', 'The event name')}
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                                            X-Webhook-Delivery
                                        </code>{' '}
                                        - {t('webhooks.docs.deliveryId', 'Unique delivery ID')}
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                                            X-Webhook-Timestamp
                                        </code>{' '}
                                        - {t('webhooks.docs.timestamp', 'Unix timestamp')}
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                                            X-Webhook-Signature
                                        </code>{' '}
                                        - {t('webhooks.docs.signature', 'HMAC signature (if secret configured)')}
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-2">
                                <Button variant="outline" asChild>
                                    <a
                                        href="/api/docs"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        {t(
                                            'webhooks.docs.viewApiDocs',
                                            'View Full API Documentation',
                                        )}
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
