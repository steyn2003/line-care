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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, ClipboardList, Users, Wrench } from 'lucide-react';

interface Company {
    id: number;
    name: string;
    email: string | null;
    users_count: number;
    machines_count: number;
    created_at: string;
}

interface Stats {
    total_companies: number;
    total_users: number;
    total_machines: number;
    total_work_orders: number;
}

interface Props {
    stats: Stats;
    recentCompanies: Company[];
}

export default function AdminDashboard({ stats, recentCompanies }: Props) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        System-wide overview and management
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Companies
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_companies}
                            </div>
                            <Link
                                href="/admin/companies"
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                View all companies →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_users}
                            </div>
                            <Link
                                href="/admin/users"
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                Manage users →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Machines
                            </CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_machines}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Across all companies
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Work Orders
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_work_orders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Companies */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Companies</CardTitle>
                                <CardDescription>
                                    Latest registered companies
                                </CardDescription>
                            </div>
                            <Link href="/admin/companies">
                                <Button variant="outline" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">
                                        Users
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Machines
                                    </TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentCompanies.map((company) => (
                                    <TableRow key={company.id}>
                                        <TableCell className="font-medium">
                                            {company.name}
                                        </TableCell>
                                        <TableCell>
                                            {company.email || (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="secondary">
                                                {company.users_count}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="secondary">
                                                {company.machines_count}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                company.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
