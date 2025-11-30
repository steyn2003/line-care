import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Check,
    Clock,
    Edit,
    FileText,
    Plus,
    RefreshCw,
    Trash2,
    User,
    UserCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AuditLogEntry {
    id: number;
    action: string;
    action_label: string;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    changes_summary: string | null;
    user: {
        id: number;
        name: string;
    } | null;
    ip_address: string | null;
    created_at: string;
}

interface AuditTimelineProps {
    modelType: string;
    modelId: number;
}

function getActionIcon(action: string) {
    if (action.includes('created')) return Plus;
    if (action.includes('updated')) return Edit;
    if (action.includes('deleted')) return Trash2;
    if (action.includes('status_changed')) return RefreshCw;
    if (action.includes('assigned')) return UserCheck;
    if (action.includes('completed')) return Check;
    return FileText;
}

function getActionColor(action: string): string {
    if (action.includes('created')) return 'bg-green-500';
    if (action.includes('deleted')) return 'bg-red-500';
    if (action.includes('status_changed')) return 'bg-blue-500';
    if (action.includes('assigned')) return 'bg-purple-500';
    if (action.includes('completed')) return 'bg-emerald-500';
    return 'bg-gray-500';
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

export function AuditTimeline({ modelType, modelId }: AuditTimelineProps) {
    const { t } = useTranslation();
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/audit-logs/${modelType}/${modelId}`,
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch audit logs');
                }

                const data = await response.json();
                setLogs(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load audit logs',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [modelType, modelId]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="py-4 text-center text-destructive">
                    {error}
                </CardContent>
            </Card>
        );
    }

    if (logs.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    <Clock className="mx-auto mb-2 h-8 w-8" />
                    <p>{t('audit.no_logs')}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-5 w-px bg-border" />

            {logs.map((log) => {
                const Icon = getActionIcon(log.action);
                const colorClass = getActionColor(log.action);

                return (
                    <div key={log.id} className="relative flex gap-4 pb-6">
                        {/* Timeline dot */}
                        <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${colorClass}`}
                        >
                            <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-medium">
                                        {log.action_label}
                                    </p>
                                    {log.changes_summary && (
                                        <p className="text-sm text-muted-foreground">
                                            {log.changes_summary}
                                        </p>
                                    )}
                                </div>
                                <Badge variant="outline" className="shrink-0">
                                    {formatTimeAgo(log.created_at)}
                                </Badge>
                            </div>

                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                {log.user && (
                                    <>
                                        <User className="h-3 w-3" />
                                        <span>{log.user.name}</span>
                                    </>
                                )}
                                {log.ip_address && (
                                    <>
                                        <span className="text-border">|</span>
                                        <span>{log.ip_address}</span>
                                    </>
                                )}
                            </div>

                            {/* Show value changes for updates */}
                            {(log.old_values || log.new_values) &&
                                !log.changes_summary && (
                                    <div className="mt-2 rounded-md bg-muted/50 p-2 text-xs">
                                        <ValueChanges
                                            oldValues={log.old_values}
                                            newValues={log.new_values}
                                        />
                                    </div>
                                )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface ValueChangesProps {
    oldValues: Record<string, unknown> | null;
    newValues: Record<string, unknown> | null;
}

function ValueChanges({ oldValues, newValues }: ValueChangesProps) {
    const allKeys = new Set([
        ...Object.keys(oldValues || {}),
        ...Object.keys(newValues || {}),
    ]);

    if (allKeys.size === 0) return null;

    return (
        <div className="space-y-1">
            {Array.from(allKeys).map((key) => {
                const oldVal = oldValues?.[key];
                const newVal = newValues?.[key];

                // Skip if values are the same
                if (JSON.stringify(oldVal) === JSON.stringify(newVal))
                    return null;

                return (
                    <div key={key} className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">
                            {formatFieldName(key)}:
                        </span>
                        {oldVal !== undefined && (
                            <span className="text-red-600 line-through">
                                {formatValue(oldVal)}
                            </span>
                        )}
                        {oldVal !== undefined && newVal !== undefined && (
                            <span className="text-muted-foreground">→</span>
                        )}
                        {newVal !== undefined && (
                            <span className="text-green-600">
                                {formatValue(newVal)}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function formatFieldName(field: string): string {
    return field
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase());
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

export function AuditTimelineCard({
    modelType,
    modelId,
    title,
}: AuditTimelineProps & { title?: string }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {title || t('audit.history')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AuditTimeline modelType={modelType} modelId={modelId} />
            </CardContent>
        </Card>
    );
}
