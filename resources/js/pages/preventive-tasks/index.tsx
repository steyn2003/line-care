import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    Cpu,
    Inbox,
    Plus,
    Search,
} from 'lucide-react';
import { useState } from 'react';

interface Machine {
    id: number;
    name: string;
    code: string | null;
}

interface User {
    id: number;
    name: string;
}

interface PreventiveTask {
    id: number;
    title: string;
    description: string | null;
    machine_id: number;
    machine?: Machine;
    schedule_interval_value: number;
    schedule_interval_unit: 'days' | 'weeks' | 'months';
    assigned_to: number | null;
    assignee?: User;
    next_due_date: string;
    last_completed_at: string | null;
    is_active: boolean;
}

interface Props {
    tasks: PreventiveTask[];
    machines: Machine[];
}

export default function PreventiveTasksIndex({ tasks, machines }: Props) {
    const [search, setSearch] = useState('');
    const [machineFilter, setMachineFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            search === '' ||
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.machine?.name.toLowerCase().includes(search.toLowerCase());

        const matchesMachine =
            machineFilter === '' ||
            task.machine_id.toString() === machineFilter;

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && task.is_active) ||
            (statusFilter === 'inactive' && !task.is_active) ||
            (statusFilter === 'overdue' &&
                task.is_active &&
                new Date(task.next_due_date) < new Date());

        return matchesSearch && matchesMachine && matchesStatus;
    });

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    const formatDueDate = (dueDate: string) => {
        const date = new Date(dueDate);
        const today = new Date();
        const diffDays = Math.ceil(
            (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays < 0) {
            return `${Math.abs(diffDays)} days overdue`;
        } else if (diffDays === 0) {
            return 'Due today';
        } else if (diffDays === 1) {
            return 'Due tomorrow';
        } else {
            return `Due in ${diffDays} days`;
        }
    };

    const formatSchedule = (value: number, unit: string) => {
        const unitLabel = value === 1 ? unit.slice(0, -1) : unit;
        return `Every ${value} ${unitLabel}`;
    };

    return (
        <AppLayout>
            <Head title="Preventive Maintenance" />

            <div className="container mx-auto py-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Preventive Maintenance
                        </h1>
                        <p className="text-muted-foreground">
                            Schedule and track preventive maintenance tasks
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <a
                                href={`/exports/preventive-tasks?${new URLSearchParams(
                                    {
                                        ...(machineFilter && {
                                            machine_id: machineFilter,
                                        }),
                                        ...(statusFilter === 'active' && {
                                            is_active: 'true',
                                        }),
                                        ...(statusFilter === 'inactive' && {
                                            is_active: 'false',
                                        }),
                                        ...(statusFilter === 'overdue' && {
                                            overdue: 'true',
                                        }),
                                    },
                                ).toString()}`}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </a>
                        </Button>
                        <Button
                            onClick={() =>
                                router.visit('/preventive-tasks/create')
                            }
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search tasks..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Machine Filter */}
                            <Select
                                value={machineFilter || undefined}
                                onValueChange={setMachineFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All machines" />
                                </SelectTrigger>
                                <SelectContent>
                                    {machines.map((machine) => (
                                        <SelectItem
                                            key={machine.id}
                                            value={machine.id.toString()}
                                        >
                                            {machine.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All tasks
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                    <SelectItem value="overdue">
                                        Overdue
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks List */}
                {filteredTasks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Inbox className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                No preventive tasks found
                            </h3>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                                {search || machineFilter
                                    ? 'Try adjusting your filters'
                                    : 'Get started by creating your first preventive maintenance task'}
                            </p>
                            {!search && !machineFilter && (
                                <Button
                                    onClick={() =>
                                        router.visit('/preventive-tasks/create')
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Task
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredTasks.map((task) => (
                            <Card
                                key={task.id}
                                className="cursor-pointer transition-shadow hover:shadow-md"
                                onClick={() =>
                                    router.visit(`/preventive-tasks/${task.id}`)
                                }
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Header */}
                                            <div className="mb-3 flex flex-wrap items-start gap-2">
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {task.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {!task.is_active && (
                                                        <Badge variant="secondary">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                    {task.is_active &&
                                                        isOverdue(
                                                            task.next_due_date,
                                                        ) && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="h-3 w-3" />
                                                                Overdue
                                                            </Badge>
                                                        )}
                                                </div>
                                            </div>

                                            {/* Machine */}
                                            <div className="mb-2 flex items-center gap-2 text-sm">
                                                <Cpu className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium text-foreground">
                                                    {task.machine?.name}
                                                </span>
                                                {task.machine?.code && (
                                                    <span className="text-muted-foreground">
                                                        ({task.machine.code})
                                                    </span>
                                                )}
                                            </div>

                                            {/* Schedule & Due Date */}
                                            <div className="mb-3 flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        {formatSchedule(
                                                            task.schedule_interval_value,
                                                            task.schedule_interval_unit,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span
                                                        className={
                                                            isOverdue(
                                                                task.next_due_date,
                                                            )
                                                                ? 'font-medium text-destructive'
                                                                : 'text-muted-foreground'
                                                        }
                                                    >
                                                        {formatDueDate(
                                                            task.next_due_date,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Last Completed */}
                                            {task.last_completed_at && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>
                                                        Last completed{' '}
                                                        {new Date(
                                                            task.last_completed_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Assigned To */}
                                            {task.assignee && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    Assigned to{' '}
                                                    <span className="font-medium text-foreground">
                                                        {task.assignee.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
