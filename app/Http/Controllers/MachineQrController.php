<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class MachineQrController extends Controller
{
    /**
     * Ensure machine has a QR token, generating one if needed.
     */
    protected function ensureQrToken(Machine $machine): string
    {
        if (! $machine->qr_token) {
            $machine->update(['qr_token' => Str::uuid()->toString()]);
        }

        return $machine->qr_token;
    }

    /**
     * Generate QR code image for a machine (SVG format).
     */
    public function image(Machine $machine): Response
    {
        $this->authorize('view', $machine);

        $qrToken = $this->ensureQrToken($machine);
        $url = route('qr.scan', $qrToken);

        $options = new QROptions([
            'outputType' => QRCode::OUTPUT_MARKUP_SVG,
            'eccLevel' => QRCode::ECC_H,
            'svgViewBoxSize' => 300,
            'addQuietzone' => true,
            'quietzoneSize' => 2,
            'outputBase64' => false,
        ]);

        $qrcode = new QRCode($options);
        $svg = $qrcode->render($url);

        // If it's a data URI, extract the SVG content
        if (str_starts_with($svg, 'data:')) {
            $svg = base64_decode(explode(',', $svg)[1]);
        }

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * Show printable QR label page.
     */
    public function print(Machine $machine): InertiaResponse
    {
        $this->authorize('view', $machine);

        $qrToken = $this->ensureQrToken($machine);

        return Inertia::render('machines/qr-print', [
            'machine' => [
                'id' => $machine->id,
                'name' => $machine->name,
                'code' => $machine->code,
                'qr_token' => $qrToken,
                'location' => $machine->location?->name,
            ],
            'qrUrl' => route('machines.qr-image', $machine),
        ]);
    }

    /**
     * Download QR code as PNG.
     */
    public function download(Machine $machine): Response
    {
        $this->authorize('view', $machine);

        $qrToken = $this->ensureQrToken($machine);
        $url = route('qr.scan', $qrToken);

        $options = new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'eccLevel' => QRCode::ECC_H,
            'scale' => 10,
            'imageBase64' => false,
            'addQuietzone' => true,
            'quietzoneSize' => 2,
        ]);

        $qrcode = new QRCode($options);
        $png = $qrcode->render($url);

        $filename = 'qr-' . ($machine->code ?: $machine->id) . '.png';

        return response($png, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
