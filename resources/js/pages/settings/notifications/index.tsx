import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Head, useForm } from '@inertiajs/react';
import { Mail, MessageSquare, Smartphone } from 'lucide-react';
import { FormEventHandler } from 'react';

interface NotificationPreference {
    notification_type: string;
    email_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
}

interface NotificationType {
    type: string;
    label: string;
    description: string;
    category: string;
}

interface NotificationPreferencesProps {
    preferences: NotificationPreference[];
    notificationTypes: NotificationType[];
}

export default function NotificationPreferences({
    preferences,
    notificationTypes,
}: NotificationPreferencesProps) {
    const { data, setData, put, processing } = useForm({
        preferences: preferences,
    });

    const handleToggle = (
        index: number,
        channel: 'email_enabled' | 'sms_enabled' | 'push_enabled',
    ) => {
        const updated = [...data.preferences];
        updated[index] = {
            ...updated[index],
            [channel]: !updated[index][channel],
        };
        setData('preferences', updated);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put('/notification-preferences');
    };

    // Group notification types by category
    const groupedTypes = notificationTypes.reduce(
        (acc, type) => {
            if (!acc[type.category]) {
                acc[type.category] = [];
            }
            acc[type.category].push(type);
            return acc;
        },
        {} as Record<string, NotificationType[]>,
    );

    const getPreferenceForType = (type: string): NotificationPreference => {
        return (
            data.preferences.find((p) => p.notification_type === type) || {
                notification_type: type,
                email_enabled: false,
                sms_enabled: false,
                push_enabled: false,
            }
        );
    };

    return (
        <AppLayout>
            <Head title="Notification Preferences" />

            <div className="container mx-auto space-y-6 py-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Notification Preferences
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage how you receive notifications
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Info Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Manage Your Notifications
                                    </CardTitle>
                                    <CardDescription>
                                        Choose how you want to receive
                                        notifications for different events. You
                                        can enable or disable each channel
                                        (Email, SMS, Push) per notification
                                        type.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Channel Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Notification Channels
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-green-600" />
                                            <span className="text-sm">
                                                Email
                                            </span>
                                            <Badge
                                                variant="default"
                                                className="bg-green-600"
                                            >
                                                Active
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                SMS
                                            </span>
                                            <Badge variant="secondary">
                                                Not Configured
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                Push
                                            </span>
                                            <Badge variant="secondary">
                                                Not Configured
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-xs text-gray-600">
                                        SMS and Push notifications are currently
                                        not configured. Contact your
                                        administrator to enable these channels.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Preferences by Category */}
                            {Object.entries(groupedTypes).map(
                                ([category, types]) => (
                                    <Card key={category}>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                {category}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                {types.map((type) => {
                                                    const preferenceIndex =
                                                        data.preferences.findIndex(
                                                            (p) =>
                                                                p.notification_type ===
                                                                type.type,
                                                        );
                                                    const preference =
                                                        getPreferenceForType(
                                                            type.type,
                                                        );

                                                    return (
                                                        <div
                                                            key={type.type}
                                                            className="flex items-start justify-between border-b pb-6 last:border-0 last:pb-0"
                                                        >
                                                            <div className="flex-1">
                                                                <Label className="text-base font-medium">
                                                                    {type.label}
                                                                </Label>
                                                                <p className="mt-1 text-sm text-gray-600">
                                                                    {
                                                                        type.description
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="ml-6 flex items-center gap-6">
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-4 w-4 text-gray-600" />
                                                                    <Switch
                                                                        checked={
                                                                            preference.email_enabled
                                                                        }
                                                                        onCheckedChange={() =>
                                                                            handleToggle(
                                                                                preferenceIndex,
                                                                                'email_enabled',
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MessageSquare className="h-4 w-4 text-gray-400" />
                                                                    <Switch
                                                                        checked={
                                                                            preference.sms_enabled
                                                                        }
                                                                        onCheckedChange={() =>
                                                                            handleToggle(
                                                                                preferenceIndex,
                                                                                'sms_enabled',
                                                                            )
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Smartphone className="h-4 w-4 text-gray-400" />
                                                                    <Switch
                                                                        checked={
                                                                            preference.push_enabled
                                                                        }
                                                                        onCheckedChange={() =>
                                                                            handleToggle(
                                                                                preferenceIndex,
                                                                                'push_enabled',
                                                                            )
                                                                        }
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ),
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Saving...'
                                        : 'Save Preferences'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
