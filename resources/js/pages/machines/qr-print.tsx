import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    machine: {
        id: number;
        name: string;
        code: string | null;
        qr_token: string;
        location: string | null;
    };
    qrUrl: string;
}

export default function QrPrint({ machine, qrUrl }: Props) {
    useEffect(() => {
        // Auto-print when page loads
        const timer = setTimeout(() => {
            window.print();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={`QR Label - ${machine.name}`} />

            <style>{`
                @media print {
                    @page {
                        size: 62mm 100mm;
                        margin: 5mm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8 print:min-h-0 print:bg-white print:p-0">
                {/* Print Instructions - hidden when printing */}
                <div className="no-print mb-6 rounded-lg bg-white p-4 shadow-md">
                    <p className="text-center text-sm text-gray-600">
                        This page will automatically open the print dialog.
                        <br />
                        For best results, use label paper (62mm x 100mm).
                    </p>
                </div>

                {/* Label Content */}
                <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 print:rounded-none print:border-solid print:border-gray-400 print:p-4">
                    {/* Logo placeholder - replace with actual logo */}
                    <div className="mb-3 text-xl font-bold text-gray-800">
                        LineCare
                    </div>

                    {/* Machine Name */}
                    <h1 className="mb-1 text-center text-lg font-bold text-gray-900">
                        {machine.name}
                    </h1>

                    {/* Machine Code */}
                    {machine.code && (
                        <p className="mb-2 text-center font-mono text-sm text-gray-600">
                            {machine.code}
                        </p>
                    )}

                    {/* Location */}
                    {machine.location && (
                        <p className="mb-3 text-center text-sm text-gray-500">
                            {machine.location}
                        </p>
                    )}

                    {/* QR Code */}
                    <div className="rounded-lg border bg-white p-2">
                        <img
                            src={qrUrl}
                            alt={`QR code for ${machine.name}`}
                            className="h-48 w-48"
                        />
                    </div>

                    {/* Instructions */}
                    <p className="mt-3 text-center text-xs text-gray-500">
                        Scan om storing te melden
                    </p>
                </div>

                {/* Print Again Button - hidden when printing */}
                <div className="no-print mt-6 flex gap-4">
                    <button
                        onClick={() => window.print()}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Print Again
                    </button>
                    <button
                        onClick={() => {
                            // Try to close if opened as popup, otherwise go back
                            if (window.opener) {
                                window.close();
                            } else {
                                router.visit(`/machines/${machine.id}`);
                            }
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
