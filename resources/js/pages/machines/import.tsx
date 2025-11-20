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

export default function ImportMachines({ locations, preview }: Props) {
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
            <Head title="Import Machines" />

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
                        Back to Machines
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Import Machines from CSV
                    </h1>
                    <p className="text-muted-foreground">
                        Upload a CSV file to bulk import machines
                    </p>
                </div>

                {/* Step 1: Upload */}
                {step === 'upload' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload CSV File</CardTitle>
                            <CardDescription>
                                Download our template to get started, then
                                upload your completed CSV file
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
                                    Download CSV Template
                                </Button>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    The template includes example data and
                                    required columns
                                </p>
                            </div>

                            {/* File Upload */}
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <Label htmlFor="file">
                                        Select CSV File
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
                                            Selected: {file.name}
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
                                        ? 'Validating...'
                                        : 'Upload and Validate'}
                                </Button>
                            </form>

                            {/* Instructions */}
                            <div className="rounded-lg border border-border bg-muted/50 p-4">
                                <h3 className="mb-2 font-semibold text-foreground">
                                    CSV Format Requirements:
                                </h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        • <strong>name</strong> (required) -
                                        Machine name
                                    </li>
                                    <li>
                                        • <strong>code</strong> (optional) -
                                        Machine code/ID
                                    </li>
                                    <li>
                                        • <strong>location</strong> (optional) -
                                        Location name
                                    </li>
                                    <li>
                                        • <strong>criticality</strong>{' '}
                                        (optional) - low, medium, or high
                                        (default: medium)
                                    </li>
                                    <li>
                                        • <strong>status</strong> (optional) -
                                        active or archived (default: active)
                                    </li>
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
                                <CardTitle>Validation Results</CardTitle>
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
                                                Valid Rows
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
                                                Invalid Rows
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
                                                Total Rows
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
                                        Validation Errors
                                    </CardTitle>
                                    <CardDescription>
                                        These rows will be skipped during import
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
                                                            Row {error.row}:
                                                        </strong>{' '}
                                                        {error.message}
                                                    </div>
                                                </div>
                                            ))}
                                        {preview.errors.length > 10 && (
                                            <p className="text-sm text-muted-foreground">
                                                ... and{' '}
                                                {preview.errors.length - 10}{' '}
                                                more errors
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Options */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Import Options</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="location_handling">
                                            How to handle unknown locations?
                                        </Label>
                                        <Select
                                            value={data.location_handling}
                                            onValueChange={(value: any) =>
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
                                                    Create new locations
                                                    automatically
                                                </SelectItem>
                                                <SelectItem value="skip">
                                                    Skip machines with unknown
                                                    locations
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
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={
                                    processing || preview.valid_count === 0
                                }
                            >
                                {processing
                                    ? 'Importing...'
                                    : `Import ${preview.valid_count} Machine${preview.valid_count !== 1 ? 's' : ''}`}
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
                                Import Complete!
                            </h3>
                            <p className="mb-6 text-center text-sm text-muted-foreground">
                                Your machines have been successfully imported
                            </p>
                            <Button onClick={() => router.visit('/machines')}>
                                View Machines
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
