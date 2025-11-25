import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Camera,
    ChevronDown,
    ChevronUp,
    Info,
    Lightbulb,
    Loader,
    Send,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Machine {
    id: number;
    name: string;
    code: string | null;
}

interface CauseCategory {
    id: number;
    name: string;
}

interface Props {
    machines: Machine[];
    cause_categories: CauseCategory[];
    preselected_machine_id?: number;
}

export default function ReportBreakdown({
    machines,
    cause_categories,
    preselected_machine_id,
}: Props) {
    const { t } = useTranslation('workorders');
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        machine_id: preselected_machine_id?.toString() || '',
        title: '',
        description: '',
        started_at: new Date().toISOString().slice(0, 16),
        cause_category_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/work-orders', {
            onSuccess: () => {
                // Show success and redirect
                router.visit('/work-orders');
            },
        });
    };

    return (
        <AppLayout>
            <Head title={t('report_breakdown.title')} />

            <div className="container mx-auto max-w-2xl py-6">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit('/work-orders')}
                        className="mb-2 text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('report_breakdown.back')}
                    </Button>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {t('report_breakdown.title')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('report_breakdown.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="border-border shadow-lg">
                    <CardHeader>
                        <CardTitle>
                            {t('report_breakdown.card_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('report_breakdown.card_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Machine Selection - Large Touch Target */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="machine_id"
                                    className="text-base"
                                >
                                    {t('report_breakdown.machine_label')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.machine_id}
                                    onValueChange={(value) =>
                                        setData('machine_id', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="machine_id"
                                        className="h-12 bg-background text-base"
                                    >
                                        <SelectValue
                                            placeholder={t(
                                                'report_breakdown.machine_placeholder',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {machines.map((machine) => (
                                            <SelectItem
                                                key={machine.id}
                                                value={machine.id.toString()}
                                                className="py-3"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {machine.name}
                                                    </span>
                                                    {machine.code && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {machine.code}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.machine_id && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.machine_id}
                                    </p>
                                )}
                            </div>

                            {/* Short Description - Required */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-base">
                                    {t('report_breakdown.whats_wrong')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder={t(
                                        'report_breakdown.whats_wrong_placeholder',
                                    )}
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="h-12 bg-background text-base"
                                    autoComplete="off"
                                />
                                {errors.title && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Breakdown Start Time */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="started_at"
                                    className="text-base"
                                >
                                    {t('report_breakdown.when_happened')}
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="started_at"
                                        type="datetime-local"
                                        value={data.started_at}
                                        onChange={(e) =>
                                            setData(
                                                'started_at',
                                                e.target.value,
                                            )
                                        }
                                        className="h-12 bg-background text-base"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setData(
                                                'started_at',
                                                new Date()
                                                    .toISOString()
                                                    .slice(0, 16),
                                            )
                                        }
                                    >
                                        {t('report_breakdown.now')}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t('report_breakdown.time_hint')}
                                </p>
                            </div>

                            {/* Collapsible More Details */}
                            <Collapsible
                                open={showMoreDetails}
                                onOpenChange={setShowMoreDetails}
                            >
                                <CollapsibleTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-between"
                                    >
                                        <span>
                                            {t('report_breakdown.more_details')}
                                        </span>
                                        {showMoreDetails ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="space-y-6 pt-6">
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-base"
                                        >
                                            {t(
                                                'report_breakdown.detailed_description',
                                            )}
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder={t(
                                                'report_breakdown.description_placeholder',
                                            )}
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            rows={4}
                                            className="resize-none bg-background"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {t(
                                                'report_breakdown.description_hint',
                                            )}
                                        </p>
                                    </div>

                                    {/* Cause Category Hint */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="cause_category_id"
                                            className="text-base"
                                        >
                                            {t('report_breakdown.issue_type')}
                                        </Label>
                                        <Select
                                            value={
                                                data.cause_category_id ||
                                                undefined
                                            }
                                            onValueChange={(value) =>
                                                setData(
                                                    'cause_category_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="cause_category_id"
                                                className="h-12 bg-background"
                                            >
                                                <SelectValue
                                                    placeholder={t(
                                                        'report_breakdown.issue_type_placeholder',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cause_categories.map((cat) => (
                                                    <SelectItem
                                                        key={cat.id}
                                                        value={cat.id.toString()}
                                                    >
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            {t(
                                                'report_breakdown.issue_type_hint',
                                            )}
                                        </p>
                                    </div>

                                    {/* Photo Upload - Placeholder for future */}
                                    <div className="space-y-2">
                                        <Label className="text-base">
                                            {t('report_breakdown.photos')}
                                        </Label>
                                        <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                                            <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                {t(
                                                    'report_breakdown.photos_coming_soon',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>

                            {/* Submit Button - Large and Prominent */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="h-14 w-full text-lg"
                                    disabled={
                                        processing ||
                                        !data.machine_id ||
                                        !data.title
                                    }
                                >
                                    {processing ? (
                                        <>
                                            <Loader className="mr-2 h-5 w-5 animate-spin" />
                                            {t('report_breakdown.submitting')}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-5 w-5" />
                                            {t('report_breakdown.submit')}
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Help Text */}
                            <div className="border-t border-border pt-2">
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <p>{t('report_breakdown.help_text')}</p>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Quick Help */}
                <Card className="mt-6 border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <Lightbulb className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">
                                    {t('report_breakdown.quick_tips')}
                                </p>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        • {t('report_breakdown.tip_specific')}
                                    </li>
                                    <li>
                                        • {t('report_breakdown.tip_errors')}
                                    </li>
                                    <li>
                                        • {t('report_breakdown.tip_history')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
