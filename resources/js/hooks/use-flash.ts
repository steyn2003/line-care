import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Flash {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

/**
 * Hook to display Laravel flash messages as toast notifications
 *
 * Usage in Laravel:
 * - return redirect()->with('success', 'Message')
 * - return redirect()->with('error', 'Error message')
 * - return redirect()->with('warning', 'Warning message')
 * - return redirect()->with('info', 'Info message')
 */
export function useFlash() {
    const { props } = usePage<{ flash?: Flash }>();
    const flash = props.flash;

    useEffect(() => {
        if (!flash) return;

        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }

        if (flash.warning) {
            toast.warning(flash.warning);
        }

        if (flash.info) {
            toast.info(flash.info);
        }
    }, [flash]);
}
