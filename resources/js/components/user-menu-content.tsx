import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useLocale } from '@/hooks/use-locale';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import type { LocaleCode } from '@/locales';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Globe, LogOut, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const { t } = useTranslation(['nav', 'common']);
    const cleanup = useMobileNavigation();
    const { locale, availableLocales, localeMetadata, setLocale } = useLocale();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full"
                        href={edit()}
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        {t('nav:user_menu.settings')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Globe className="mr-2 h-4 w-4" />
                        {t('common:language')}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {availableLocales.map((localeCode) => {
                            const metadata = localeMetadata[localeCode];
                            const isActive = localeCode === locale;

                            return (
                                <DropdownMenuItem
                                    key={localeCode}
                                    onClick={() =>
                                        setLocale(localeCode as LocaleCode)
                                    }
                                    className={isActive ? 'bg-accent' : ''}
                                >
                                    <span className="mr-2">
                                        {metadata?.flag}
                                    </span>
                                    {metadata?.native ||
                                        localeCode.toUpperCase()}
                                    {isActive && (
                                        <span className="ml-auto text-xs">
                                            ✓
                                        </span>
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    {t('nav:user_menu.logout')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
