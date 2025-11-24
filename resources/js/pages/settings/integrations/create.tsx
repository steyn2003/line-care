import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Database, Mail, MessageSquare, Wifi } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface IntegrationType {
    value: string;
    label: string;
    description: string;
}

interface CreateIntegrationProps {
    integrationTypes: IntegrationType[];
    providers: Record<string, string[]>;
}

const INTEGRATION_ICONS = {
    erp: Database,
    iot: Wifi,
    email: Mail,
    sms: MessageSquare,
};

export default function Create({
    integrationTypes,
    providers,
}: CreateIntegrationProps) {
    const [selectedType, setSelectedType] = useState<string>('');
    const [configFields, setConfigFields] = useState<Record<string, string>>(
        {},
    );

    const { data, setData, post, processing, errors } = useForm({
        integration_type: '',
        provider: '',
        config: {},
        is_enabled: false,
        sync_frequency: 'manual',
    });

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        setData('integration_type', type);
        setData('provider', '');
        setConfigFields({});
        setData('config', {});
    };

    const handleProviderChange = (provider: string) => {
        setData('provider', provider);

        const defaultConfig = getDefaultConfigFields(
            data.integration_type,
            provider,
        );
        setConfigFields(defaultConfig);
        setData('config', defaultConfig);
    };

    const handleConfigChange = (key: string, value: string) => {
        setConfigFields((prev) => ({ ...prev, [key]: value }));
        setData('config', { ...data.config, [key]: value });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/integrations');
    };

    const getDefaultConfigFields = (
        type: string,
        provider: string,
    ): Record<string, string> => {
        if (type === 'erp') {
            return {
                api_endpoint: '',
                username: '',
                password: '',
                sync_inventory: 'true',
                sync_purchase_orders: 'true',
                sync_work_order_costs: 'false',
            };
        } else if (type === 'iot' && provider === 'MQTT') {
            return {
                broker_host: '',
                broker_port: '1883',
                username: '',
                password: '',
                client_id: '',
            };
        } else if (type === 'iot' && provider === 'REST Webhook') {
            return {
                webhook_url:
                    window.location.origin + '/webhooks/sensor-reading',
                authentication_type: 'none',
                auto_create_sensors: 'true',
                auto_create_work_orders: 'true',
            };
        } else if (type === 'email') {
            return {
                driver: 'smtp',
                host: '',
                port: '587',
                username: '',
                password: '',
                encryption: 'tls',
                from_address: '',
                from_name: 'LineCare',
            };
        } else if (type === 'sms') {
            return {
                account_sid: '',
                auth_token: '',
                from_number: '',
            };
        }
        return {};
    };

    return (
        <AppLayout
            title="Create Integration"
            renderHeader={() => (
                <div className="flex items-center gap-4">
                    <Link href="/integrations">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl leading-tight font-semibold text-gray-800">
                        Create Integration
                    </h2>
                </div>
            )}
        >
            <Head title="Create Integration" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Integration Type Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Integration Type</CardTitle>
                                    <CardDescription>
                                        Choose the type of integration you want
                                        to create
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {integrationTypes.map((type) => {
                                            const Icon =
                                                INTEGRATION_ICONS[
                                                    type.value as keyof typeof INTEGRATION_ICONS
                                                ];
                                            const isSelected =
                                                selectedType === type.value;

                                            return (
                                                <div
                                                    key={type.value}
                                                    onClick={() =>
                                                        handleTypeChange(
                                                            type.value,
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-blue-500 ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <Icon
                                                            className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold">
                                                                {type.label}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-600">
                                                                {
                                                                    type.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.integration_type && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.integration_type}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Provider Selection */}
                            {selectedType && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Provider</CardTitle>
                                        <CardDescription>
                                            Select the specific provider or
                                            system
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Label htmlFor="provider">
                                                Provider
                                            </Label>
                                            <Select
                                                value={data.provider}
                                                onValueChange={
                                                    handleProviderChange
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select provider" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {providers[
                                                        selectedType
                                                    ]?.map((provider) => (
                                                        <SelectItem
                                                            key={provider}
                                                            value={provider}
                                                        >
                                                            {provider}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.provider && (
                                                <p className="text-sm text-red-600">
                                                    {errors.provider}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Configuration Fields */}
                            {data.provider &&
                                Object.keys(configFields).length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Configuration</CardTitle>
                                            <CardDescription>
                                                Enter the connection details for{' '}
                                                {data.provider}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {Object.entries(
                                                    configFields,
                                                ).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="space-y-2"
                                                    >
                                                        <Label htmlFor={key}>
                                                            {key
                                                                .split('_')
                                                                .map(
                                                                    (word) =>
                                                                        word
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase() +
                                                                        word.slice(
                                                                            1,
                                                                        ),
                                                                )
                                                                .join(' ')}
                                                        </Label>
                                                        {key.includes(
                                                            'password',
                                                        ) ||
                                                        key.includes('token') ||
                                                        key.includes(
                                                            'secret',
                                                        ) ? (
                                                            <Input
                                                                id={key}
                                                                type="password"
                                                                value={value}
                                                                onChange={(e) =>
                                                                    handleConfigChange(
                                                                        key,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        ) : value === 'true' ||
                                                          value === 'false' ? (
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    checked={
                                                                        value ===
                                                                        'true'
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        handleConfigChange(
                                                                            key,
                                                                            checked.toString(),
                                                                        )
                                                                    }
                                                                />
                                                                <span className="text-sm text-gray-600">
                                                                    {value ===
                                                                    'true'
                                                                        ? 'Enabled'
                                                                        : 'Disabled'}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <Input
                                                                id={key}
                                                                type="text"
                                                                value={value}
                                                                onChange={(e) =>
                                                                    handleConfigChange(
                                                                        key,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Settings */}
                            {data.provider && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Settings</CardTitle>
                                        <CardDescription>
                                            Configure integration behavior
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="sync_frequency">
                                                    Sync Frequency
                                                </Label>
                                                <Select
                                                    value={data.sync_frequency}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            'sync_frequency',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="real_time">
                                                            Real-time
                                                        </SelectItem>
                                                        <SelectItem value="hourly">
                                                            Hourly
                                                        </SelectItem>
                                                        <SelectItem value="daily">
                                                            Daily
                                                        </SelectItem>
                                                        <SelectItem value="weekly">
                                                            Weekly
                                                        </SelectItem>
                                                        <SelectItem value="manual">
                                                            Manual
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="is_enabled">
                                                        Enable Integration
                                                    </Label>
                                                    <p className="text-sm text-gray-600">
                                                        Start using this
                                                        integration immediately
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="is_enabled"
                                                    checked={data.is_enabled}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        setData(
                                                            'is_enabled',
                                                            checked,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Actions */}
                            {data.provider && (
                                <div className="flex items-center justify-end gap-4">
                                    <Link href="/integrations">
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Creating...'
                                            : 'Create Integration'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
