import { Head, useForm } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

export default function TrialSignup() {
    const { t } = useTranslation('trial');

    const { data, setData, post, processing, errors, reset } = useForm({
        company_name: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        industry: '',
        company_size: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/trial', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const benefits = [
        t('benefits.unlimited_machines', 'Onbeperkt machines en werkorders'),
        t('benefits.preventive', 'Preventief onderhoud planning'),
        t('benefits.qr_codes', 'QR-codes voor snelle storingsmeldingen'),
        t('benefits.reports', 'Rapporten en analytics'),
        t('benefits.spare_parts', 'Voorraadbeheer onderdelen'),
        t('benefits.oee', 'OEE tracking en productie inzicht'),
    ];

    const companySizes = [
        { value: '1-10', label: '1-10 medewerkers' },
        { value: '11-50', label: '11-50 medewerkers' },
        { value: '51-200', label: '51-200 medewerkers' },
        { value: '200+', label: '200+ medewerkers' },
    ];

    const industries = [
        { value: 'manufacturing', label: 'Productie / Manufacturing' },
        { value: 'food', label: 'Voedingsmiddelen' },
        { value: 'pharma', label: 'Farmaceutisch' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'logistics', label: 'Logistiek' },
        { value: 'chemicals', label: 'Chemie' },
        { value: 'metals', label: 'Metaalbewerking' },
        { value: 'packaging', label: 'Verpakking' },
        { value: 'other', label: 'Anders' },
    ];

    return (
        <>
            <Head title={t('signup.head_title', 'Start je gratis trial')} />

            <div className="flex min-h-svh">
                {/* Left: Form */}
                <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 flex flex-col items-center gap-4">
                            <TextLink href="/" className="flex items-center gap-2">
                                <AppLogoIcon className="size-10 fill-current text-foreground" />
                            </TextLink>
                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-semibold">
                                    {t('signup.title', 'Start je gratis trial')}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {t(
                                        'signup.description',
                                        '14 dagen gratis toegang tot alle functies. Geen creditcard nodig.',
                                    )}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="flex flex-col gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="company_name">
                                    {t('signup.company_name', 'Bedrijfsnaam')}
                                </Label>
                                <Input
                                    id="company_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    value={data.company_name}
                                    onChange={(e) =>
                                        setData('company_name', e.target.value)
                                    }
                                    placeholder={t(
                                        'signup.company_name_placeholder',
                                        'Jouw Bedrijf B.V.',
                                    )}
                                />
                                <InputError message={errors.company_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    {t('signup.name', 'Je naam')}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={t(
                                        'signup.name_placeholder',
                                        'Jan Jansen',
                                    )}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('signup.email', 'E-mailadres')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t(
                                        'signup.email_placeholder',
                                        'jan@bedrijf.nl',
                                    )}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t('signup.password', 'Wachtwoord')}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder={t(
                                        'signup.password_placeholder',
                                        'Minimaal 8 karakters',
                                    )}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    {t('signup.confirm_password', 'Bevestig wachtwoord')}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    placeholder={t(
                                        'signup.confirm_password_placeholder',
                                        'Herhaal je wachtwoord',
                                    )}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="industry">
                                        {t('signup.industry', 'Branche')}
                                    </Label>
                                    <Select
                                        value={data.industry}
                                        onValueChange={(value) =>
                                            setData('industry', value)
                                        }
                                    >
                                        <SelectTrigger tabIndex={6}>
                                            <SelectValue
                                                placeholder={t(
                                                    'signup.industry_placeholder',
                                                    'Selecteer...',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries.map((industry) => (
                                                <SelectItem
                                                    key={industry.value}
                                                    value={industry.value}
                                                >
                                                    {industry.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.industry} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="company_size">
                                        {t('signup.company_size', 'Bedrijfsgrootte')}
                                    </Label>
                                    <Select
                                        value={data.company_size}
                                        onValueChange={(value) =>
                                            setData('company_size', value)
                                        }
                                    >
                                        <SelectTrigger tabIndex={7}>
                                            <SelectValue
                                                placeholder={t(
                                                    'signup.company_size_placeholder',
                                                    'Selecteer...',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companySizes.map((size) => (
                                                <SelectItem
                                                    key={size.value}
                                                    value={size.value}
                                                >
                                                    {size.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.company_size} />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={8}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                {t('signup.submit', 'Start gratis trial')}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            {t('signup.have_account', 'Al een account?')}{' '}
                            <TextLink href="/login" tabIndex={9}>
                                {t('signup.login', 'Log in')}
                            </TextLink>
                        </p>
                    </div>
                </div>

                {/* Right: Benefits panel */}
                <div className="hidden flex-1 items-center justify-center bg-primary p-12 text-primary-foreground lg:flex">
                    <div className="max-w-md">
                        <h2 className="mb-8 text-3xl font-bold">
                            {t('signup.benefits_title', 'Wat je krijgt:')}
                        </h2>
                        <ul className="space-y-5">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span className="text-lg">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-12 rounded-lg bg-primary-foreground/10 p-6">
                            <p className="text-sm opacity-90">
                                {t(
                                    'signup.trial_note',
                                    'Je trial begint direct na aanmelding. Na 14 dagen kun je upgraden naar een betaald abonnement of neem je contact met ons op.',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
