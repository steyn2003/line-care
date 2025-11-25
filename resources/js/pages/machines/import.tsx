import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Download,
    Upload,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Location {
    id: number;
    name: string;
}

interface ValidationError {
    row: number;
    field: string;
    message: string;
}

interface PreviewData {
    valid_count: number;
    invalid_count: number;
    total_count: number;
    errors: ValidationError[];
    preview_rows: Array<{
        name: string;
        code: string | null;
        location_name: string | null;
        criticality: string;
        status: string;
    }>;
    upload_id: string;
}

interface Props {
    locations: Location[];
    preview?: PreviewData;
}

export default function ImportMachines({ preview }: Props) {
    const { t } = useTranslation('machines');
    const [step, setStep] = useState<'upload' | 'preview' | 'complete'>(
        preview ? 'preview' : 'upload',
    );
    const [file, setFile] = useState<File | null>(null);

    const { data, setData, post, processing } = useForm({
        file: null as File | null,
        location_handling: 'create' as 'create' | 'skip',
        upload_id: preview?.upload_id || '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setData('file', selectedFile);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) return;

        const formData = new FormData();
        formData.append('file', data.file);

        post('/machines/import/validate', {
            data: formData,
            forceFormData: true,
            preserveState: false,
            preserveScroll: false,
        });
    };

    const handleConfirm = () => {
        post('/machines/import/confirm', {
            upload_id: preview?.upload_id,
            location_handling: data.location_handling,
        });
    };

    const downloadTemplate = () => {
        window.location.href = '/machines/import/template';
    };

    return (
        <AppLayout>
            <Head title={t('import.title')} />

            <div className="container mx-auto max-w-4xl py-6">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit('/machines')}
                        className="mb-2 text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('import.back')}
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {t('import.page_title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('import.subtitle')}
                    </p>
                </div>

                {/* Step 1: Upload */}
                {step === 'upload' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('import.upload_title')}</CardTitle>
                            <CardDescription>
                                {t('import.upload_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Download Template */}
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={downloadTemplate}
                                    className="w-full sm:w-auto"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('import.download_template')}
                                </Button>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t('import.template_hint')}
                                </p>
                            </div>

                            {/* File Upload */}
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <Label htmlFor="file">
                                        {t('import.select_file')}
                                    </Label>
                                    <div className="mt-2">
                                        <input
                                            id="file"
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                                        />
                                    </div>
                                    {file && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {t('import.selected')}: {file.name}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!file || processing}
                                    className="w-full sm:w-auto"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {processing
                                        ? t('import.validating')
                                        : t('import.upload_button')}
                                </Button>
                            </form>

                            {/* Instructions */}
                            <div className="rounded-lg border border-border bg-muted/50 p-4">
                                <h3 className="mb-2 font-semibold text-foreground">
                                    {t('import.format_title')}
                                </h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• {t('import.format_name')}</li>
                                    <li>• {t('import.format_code')}</li>
                                    <li>• {t('import.format_location')}</li>
                                    <li>• {t('import.format_criticality')}</li>
                                    <li>• {t('import.format_status')}</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Preview & Validate */}
                {step === 'preview' && preview && (
                    <div className="space-y-6">
                        {/* Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('import.validation_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                        <div>
                                            <div className="text-2xl font-bold text-foreground">
                                                {preview.valid_count}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {t('import.valid_rows')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                                        <XCircle className="h-8 w-8 text-red-600" />
                                        <div>
                                            <div className="text-2xl font-bold text-foreground">
                                                {preview.invalid_count}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {t('import.invalid_rows')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                                        <AlertCircle className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <div className="text-2xl font-bold text-foreground">
                                                {preview.total_count}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {t('import.total_rows')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Errors */}
                        {preview.errors.length > 0 && (
                            <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="text-destructive">
                                        {t('import.errors_title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('import.errors_description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {preview.errors
                                            .slice(0, 10)
                                            .map((error, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3"
                                                >
                                                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                                                    <div className="text-sm">
                                                        <strong>
                                                            {t('import.row')}{' '}
                                                            {error.row}:
                                                        </strong>{' '}
                                                        {error.message}
                                                    </div>
                                                </div>
                                            ))}
                                        {preview.errors.length > 10 && (
                                            <p className="text-sm text-muted-foreground">
                                                {t('import.more_errors', {
                                                    count:
                                                        preview.errors.length -
                                                        10,
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Options */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('import.options_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="location_handling">
                                            {t('import.location_handling')}
                                        </Label>
                                        <Select
                                            value={data.location_handling}
                                            onValueChange={(
                                                value: 'create' | 'skip',
                                            ) =>
                                                setData(
                                                    'location_handling',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="location_handling"
                                                className="mt-2"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="create">
                                                    {t(
                                                        'import.location_create',
                                                    )}
                                                </SelectItem>
                                                <SelectItem value="skip">
                                                    {t('import.location_skip')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStep('upload');
                                    router.visit('/machines/import');
                                }}
                            >
                                {t('import.cancel')}
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={
                                    processing || preview.valid_count === 0
                                }
                            >
                                {processing
                                    ? t('import.importing')
                                    : preview.valid_count === 1
                                      ? t('import.import_button', {
                                            count: preview.valid_count,
                                        })
                                      : t('import.import_button_plural', {
                                            count: preview.valid_count,
                                        })}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Complete */}
                {step === 'complete' && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                {t('import.complete_title')}
                            </h3>
                            <p className="mb-6 text-center text-sm text-muted-foreground">
                                {t('import.complete_description')}
                            </p>
                            <Button onClick={() => router.visit('/machines')}>
                                {t('import.view_machines')}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
