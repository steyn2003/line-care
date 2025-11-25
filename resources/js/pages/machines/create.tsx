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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Location {
    id: number;
    name: string;
}

interface Machine {
    id: number;
    name: string;
    code: string | null;
    location_id: number | null;
    criticality: 'low' | 'medium' | 'high';
    status: 'active' | 'archived';
    description: string | null;
}

interface Props {
    locations: Location[];
    machine?: Machine;
}

export default function CreateMachine({ locations, machine }: Props) {
    const { t } = useTranslation('machines');
    const isEditing = !!machine;

    const { data, setData, post, put, processing, errors } = useForm({
        name: machine?.name || '',
        code: machine?.code || '',
        location_id: machine?.location_id?.toString() || '',
        criticality: (machine?.criticality || 'medium') as
            | 'low'
            | 'medium'
            | 'high',
        status: (machine?.status || 'active') as 'active' | 'archived',
        description: machine?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/machines/${machine.id}`, {
                onSuccess: () => {
                    router.visit(`/machines/${machine.id}`);
                },
            });
        } else {
            post('/machines', {
                onSuccess: () => {
                    router.visit('/machines');
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title={isEditing ? t('edit.title') : t('create.title')} />

            <div className="container mx-auto max-w-2xl space-y-6 py-6">
                {/* Header */}
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit('/machines')}
                        className="text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('create.back')}
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {isEditing
                            ? t('edit.page_title')
                            : t('create.page_title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing ? t('edit.subtitle') : t('create.subtitle')}
                    </p>
                </div>

                {/* Form */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>{t('create.card_title')}</CardTitle>
                        <CardDescription>
                            {t('create.card_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Machine Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    {t('form.name_label')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder={t('form.name_placeholder')}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="bg-background"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Machine Code */}
                            <div className="space-y-2">
                                <Label htmlFor="code">
                                    {t('form.code_label')}
                                </Label>
                                <Input
                                    id="code"
                                    placeholder={t('form.code_placeholder')}
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                    className="bg-background"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('form.code_hint')}
                                </p>
                                {errors.code && (
                                    <p className="text-sm text-destructive">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location_id">
                                    {t('form.location_label')}
                                </Label>
                                <Select
                                    value={data.location_id || undefined}
                                    onValueChange={(value) =>
                                        setData('location_id', value)
                                    }
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue
                                            placeholder={t(
                                                'form.location_placeholder',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem
                                                key={location.id}
                                                value={location.id.toString()}
                                            >
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {t('form.location_hint')}
                                </p>
                                {errors.location_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.location_id}
                                    </p>
                                )}
                            </div>

                            {/* Criticality */}
                            <div className="space-y-2">
                                <Label htmlFor="criticality">
                                    {t('form.criticality_label')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.criticality}
                                    onValueChange={(value: string) =>
                                        setData('criticality', value)
                                    }
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">
                                            {t('form.criticality_low')}
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            {t('form.criticality_medium')}
                                        </SelectItem>
                                        <SelectItem value="high">
                                            {t('form.criticality_high')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {t('form.criticality_hint')}
                                </p>
                                {errors.criticality && (
                                    <p className="text-sm text-destructive">
                                        {errors.criticality}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    {t('form.status_label')}
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value: string) =>
                                        setData('status', value)
                                    }
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            {t('form.status_active')}
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            {t('form.status_archived')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-destructive">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    {t('form.description_label')}
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder={t(
                                        'form.description_placeholder',
                                    )}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    className="resize-none bg-background"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/machines')}
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    {t('create.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.name}
                                    className="flex-1"
                                >
                                    {processing ? (
                                        isEditing ? (
                                            t('edit.submitting')
                                        ) : (
                                            t('create.submitting')
                                        )
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {isEditing
                                                ? t('edit.submit')
                                                : t('create.submit')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
