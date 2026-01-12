import { MarketingFooter } from '@/components/marketing-footer';
import { MarketingNav } from '@/components/marketing-nav';
import { Head } from '@inertiajs/react';

interface SeoProps {
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    canonical?: string;
}

interface MarketingLayoutProps {
    children: React.ReactNode;
    title: string;
    canRegister?: boolean;
    currentPath?: string;
    seo?: SeoProps;
}

const defaultSeo: SeoProps = {
    description:
        'LineCare is eenvoudige onderhoudssoftware (CMMS) voor kleine fabrieken. Beheer storingen, periodiek onderhoud, reserveonderdelen, OEE en kosten op een plek.',
    keywords:
        'CMMS, onderhoudssoftware, preventief onderhoud, werkorders, OEE, reserveonderdelen, storingen, kleine fabriek, onderhoudsbeheer',
    ogImage: '/images/marketing/og-image.png',
    ogType: 'website',
};

export function MarketingLayout({
    children,
    title,
    canRegister = true,
    currentPath = '/',
    seo = {},
}: MarketingLayoutProps) {
    const meta = { ...defaultSeo, ...seo };
    const siteUrl =
        typeof window !== 'undefined'
            ? window.location.origin
            : 'https://linecare.nl';
    const canonicalUrl = meta.canonical || `${siteUrl}${currentPath}`;

    return (
        <>
            <Head title={title}>
                {/* Primary Meta Tags */}
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content={meta.ogType} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={meta.description} />
                <meta
                    property="og:image"
                    content={`${siteUrl}${meta.ogImage}`}
                />
                <meta property="og:locale" content="nl_NL" />
                <meta property="og:site_name" content="LineCare" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={canonicalUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={meta.description} />
                <meta
                    name="twitter:image"
                    content={`${siteUrl}${meta.ogImage}`}
                />
            </Head>
            <MarketingNav canRegister={canRegister} currentPath={currentPath} />
            <div className="bg-background">{children}</div>
            <MarketingFooter />
        </>
    );
}
