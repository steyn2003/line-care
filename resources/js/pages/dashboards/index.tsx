import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Copy,
    Edit,
    LayoutDashboard,
    MoreVertical,
    Plus,
    Share2,
    Star,
    Trash2,
} from 'lucide-react';

interface Dashboard {
    id: number;
    name: string;
    description: string | null;
    is_default: boolean;
    is_shared: boolean;
    shared_with_role: string | null;
    widgets_count: number;
    created_at: string;
    creator: {
        id: number;
        name: string;
    };
}

interface Props {
    dashboards: Dashboard[];
}

export default function DashboardsIndex({ dashboards }: Props) {
    const handleDelete = (dashboard: Dashboard) => {
        if (
            confirm(
                `Are you sure you want to delete "${dashboard.name}"? This cannot be undone.`,
            )
        ) {
            router.delete(`/dashboards/${dashboard.id}`);
        }
    };

    const handleDuplicate = (dashboard: Dashboard) => {
        router.post(`/dashboards/${dashboard.id}/duplicate`);
    };

    return (
        <AppLayout>
            <Head title="Custom Dashboards" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Custom Dashboards
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Create and manage personalized dashboards with
                                custom widgets
                            </p>
                        </div>
                        <Button onClick={() => router.visit('/dashboards/create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Dashboard
                        </Button>
                    </div>

                    {/* Dashboards Grid */}
                    {dashboards.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {dashboards.map((dashboard) => (
                                <Card
                                    key={dashboard.id}
                                    className="cursor-pointer transition-shadow hover:shadow-md"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div
                                                className="flex-1"
                                                onClick={() =>
                                                    router.visit(
                                                        `/dashboards/${dashboard.id}`,
                                                    )
                                                }
                                            >
                                                <CardTitle className="flex items-center gap-2">
                                                    <LayoutDashboard className="h-5 w-5" />
                                                    {dashboard.name}
                                                    {dashboard.is_default && (
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    )}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {dashboard.description ||
                                                        'No description'}
                                                </CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.visit(
                                                                `/dashboards/${dashboard.id}/edit`,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDuplicate(dashboard)
                                                        }
                                                    >
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(dashboard)
                                                        }
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent
                                        onClick={() =>
                                            router.visit(`/dashboards/${dashboard.id}`)
                                        }
                                    >
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">
                                                    {dashboard.widgets_count} widgets
                                                </Badge>
                                                {dashboard.is_shared && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Share2 className="h-3 w-3" />
                                                        Shared
                                                        {dashboard.shared_with_role &&
                                                            ` (${dashboard.shared_with_role})`}
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-muted-foreground">
                                                by {dashboard.creator.name}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No Dashboards Yet
                                </h3>
                                <p className="mt-2 text-muted-foreground">
                                    Create your first custom dashboard to visualize
                                    the metrics that matter most to you.
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => router.visit('/dashboards/create')}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Dashboard
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
