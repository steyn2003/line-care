import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import type { LocaleCode } from '@/locales';

interface LanguageSwitcherProps {
    variant?: 'icon' | 'full';
    className?: string;
}

export function LanguageSwitcher({ variant = 'icon', className }: LanguageSwitcherProps) {
    const { locale, availableLocales, localeMetadata, setLocale } = useLocale();
    const currentMetadata = localeMetadata[locale];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={variant === 'icon' ? 'icon' : 'sm'}
                    className={cn('gap-2', className)}
                >
                    {variant === 'icon' ? (
                        <Globe className="h-4 w-4" />
                    ) : (
                        <>
                            <span className="text-base">{currentMetadata?.flag}</span>
                            <span>{currentMetadata?.native || locale.toUpperCase()}</span>
                        </>
                    )}
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {availableLocales.map((localeCode) => {
                    const metadata = localeMetadata[localeCode];
                    const isActive = localeCode === locale;

                    return (
                        <DropdownMenuItem
                            key={localeCode}
                            onClick={() => setLocale(localeCode as LocaleCode)}
                            className={cn(
                                'gap-2 cursor-pointer',
                                isActive && 'bg-accent'
                            )}
                        >
                            <span className="text-base">{metadata?.flag}</span>
                            <span>{metadata?.native || localeCode.toUpperCase()}</span>
                            {isActive && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                    ✓
                                </span>
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
