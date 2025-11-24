import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Database,
    Mail,
    MessageSquare,
    Plus,
    RefreshCw,
    Settings,
    Wifi,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Integration {
    id: number;
    integration_type: string;
    provider: string;
    is_enabled: boolean;
    sync_frequency: string;
    last_sync_at: string | null;
    last_sync_status: string | null;
    created_at: string;
}

interface IntegrationsIndexProps {
    integrations: Integration[];
}

const INTEGRATION_ICONS = {
    erp: Database,
    iot: Wifi,
    email: Mail,
    sms: MessageSquare,
};

const INTEGRATION_COLORS = {
    erp: 'bg-blue-500',
    iot: 'bg-purple-500',
    email: 'bg-green-500',
    sms: 'bg-orange-500',
};

export default function IntegrationsIndex({
    integrations,
}: IntegrationsIndexProps) {
    const [localIntegrations, setLocalIntegrations] = useState(integrations);

    const handleToggleEnabled = (
        integrationId: number,
        currentState: boolean,
    ) => {
        router.patch(
            `/api/integrations/${integrationId}`,
            { is_enabled: !currentState },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalIntegrations((prev) =>
                        prev.map((int) =>
                            int.id === integrationId
                                ? { ...int, is_enabled: !currentState }
                                : int,
                        ),
                    );
                },
            },
        );
    };

    const handleSync = (integrationId: number) => {
        router.post(
            `/api/integrations/${integrationId}/sync`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Refresh the page to show updated sync status
                    router.reload({ only: ['integrations'] });
                },
            },
        );
    };

    const handleTestConnection = (integrationId: number) => {
        router.post(
            `/api/integrations/${integrationId}/test`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const groupedIntegrations = localIntegrations.reduce(
        (acc, integration) => {
            const type = integration.integration_type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(integration);
            return acc;
        },
        {} as Record<string, Integration[]>,
    );

    const getStatusBadge = (integration: Integration) => {
        if (!integration.is_enabled) {
            return <Badge variant="secondary">Disabled</Badge>;
        }

        if (!integration.last_sync_status) {
            return <Badge variant="outline">Not Synced</Badge>;
        }

        switch (integration.last_sync_status) {
            case 'success':
            case 'connected':
            case 'active':
                return (
                    <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Active
                    </Badge>
                );
            case 'error':
            case 'failed':
                return (
                    <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Error
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
        }
    };

    const formatLastSync = (lastSyncAt: string | null) => {
        if (!lastSyncAt) return 'Never';

        const date = new Date(lastSyncAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    return (
        <AppLayout
        // header={
        //     <div className="flex items-center justify-between">
        //         <h2 className="text-xl leading-tight font-semibold text-gray-800">
        //             Integrations
        //         </h2>
        //         <Link href="/settings/integrations/create">
        //             <Button>
        //                 <Plus className="mr-2 h-4 w-4" />
        //                 Add Integration
        //             </Button>
        //         </Link>
        //     </div>
        // }
        >
            <Head title="Integrations" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {Object.entries(groupedIntegrations).map(
                            ([type, integrations]) => {
                                const Icon =
                                    INTEGRATION_ICONS[
                                        type as keyof typeof INTEGRATION_ICONS
                                    ] || Database;
                                const color =
                                    INTEGRATION_COLORS[
                                        type as keyof typeof INTEGRATION_COLORS
                                    ] || 'bg-gray-500';

                                return (
                                    <div key={type}>
                                        <div className="mb-4 flex items-center gap-3">
                                            <div
                                                className={`${color} rounded-lg p-2`}
                                            >
                                                <Icon className="h-5 w-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                                {type} Integrations
                                            </h3>
                                            <Badge variant="secondary">
                                                {integrations.length}
                                            </Badge>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {integrations.map((integration) => (
                                                <Card key={integration.id}>
                                                    <CardHeader>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <CardTitle className="text-base">
                                                                    {
                                                                        integration.provider
                                                                    }
                                                                </CardTitle>
                                                                <CardDescription className="mt-1">
                                                                    Sync:{' '}
                                                                    {
                                                                        integration.sync_frequency
                                                                    }
                                                                </CardDescription>
                                                            </div>
                                                            {getStatusBadge(
                                                                integration,
                                                            )}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-600">
                                                                    Enabled
                                                                </span>
                                                                <Switch
                                                                    checked={
                                                                        integration.is_enabled
                                                                    }
                                                                    onCheckedChange={() =>
                                                                        handleToggleEnabled(
                                                                            integration.id,
                                                                            integration.is_enabled,
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            {integration.last_sync_at && (
                                                                <div className="text-sm text-gray-600">
                                                                    Last sync:{' '}
                                                                    {formatLastSync(
                                                                        integration.last_sync_at,
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={`/settings/integrations/${integration.id}/edit`}
                                                                    className="flex-1"
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="w-full"
                                                                    >
                                                                        <Settings className="mr-1 h-3 w-3" />
                                                                        Configure
                                                                    </Button>
                                                                </Link>

                                                                {integration.is_enabled &&
                                                                    integration.integration_type ===
                                                                        'erp' && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleSync(
                                                                                    integration.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <RefreshCw className="h-3 w-3" />
                                                                        </Button>
                                                                    )}
                                                            </div>

                                                            {integration.is_enabled && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="w-full"
                                                                    onClick={() =>
                                                                        handleTestConnection(
                                                                            integration.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Test
                                                                    Connection
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                );
                            },
                        )}

                        {localIntegrations.length === 0 && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Database className="mb-4 h-12 w-12 text-gray-400" />
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        No Integrations Configured
                                    </h3>
                                    <p className="mb-4 max-w-md text-center text-gray-600">
                                        Connect LineCare to your ERP system, IoT
                                        sensors, or notification services to
                                        automate your workflows.
                                    </p>
                                    <Link href="/settings/integrations/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Your First Integration
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
