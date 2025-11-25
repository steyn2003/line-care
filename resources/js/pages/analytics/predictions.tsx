import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Clock,
    TrendingUp,
    Wrench,
} from 'lucide-react';

interface Prediction {
    machine_id: number;
    machine_name: string;
    prediction: {
        predicted_failure_date: string;
        days_until_failure: number;
        probability: number;
        severity: string;
        confidence: string;
    };
    historical_data: {
        total_breakdowns: number;
        average_days_between_failures: number;
        standard_deviation: number;
        last_breakdown: string;
        days_since_last_breakdown: number;
    };
    recommended_action: string;
}

interface Props {
    predictions: Prediction[];
    totalMachines: number;
    machinesWithPredictions: number;
}

export default function PredictionsPage({
    predictions,
    totalMachines,
    machinesWithPredictions,
}: Props) {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-green-100 text-green-800 border-green-300';
        }
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <Badge variant="destructive">Critical</Badge>;
            case 'high':
                return <Badge className="bg-orange-500">High</Badge>;
            case 'medium':
                return <Badge className="bg-yellow-500">Medium</Badge>;
            default:
                return <Badge variant="secondary">Low</Badge>;
        }
    };

    const getConfidenceBadge = (confidence: string) => {
        switch (confidence) {
            case 'high':
                return (
                    <Badge variant="outline" className="border-green-500 text-green-600">
                        High Confidence
                    </Badge>
                );
            case 'medium':
                return (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        Medium Confidence
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="border-gray-500 text-gray-600">
                        Low Confidence
                    </Badge>
                );
        }
    };

    const criticalCount = predictions.filter(
        (p) => p.prediction.severity === 'critical',
    ).length;
    const highCount = predictions.filter(
        (p) => p.prediction.severity === 'high',
    ).length;

    return (
        <AppLayout>
            <Head title="Failure Predictions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.visit('/analytics')}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Failure Predictions
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Predictive maintenance based on historical
                                    breakdown patterns
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-6 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">
                                    Total Machines
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {totalMachines}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    active machines
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">
                                    With Predictions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600">
                                    {machinesWithPredictions}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    machines have enough data
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    Critical
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-600">
                                    {criticalCount}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    need immediate attention
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                    High Priority
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-orange-600">
                                    {highCount}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    schedule this week
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Predictions List */}
                    {predictions.length > 0 ? (
                        <div className="space-y-4">
                            {predictions.map((item) => (
                                <Card
                                    key={item.machine_id}
                                    className={`border-l-4 ${getSeverityColor(item.prediction.severity)}`}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {item.machine_name}
                                                    {getSeverityBadge(
                                                        item.prediction.severity,
                                                    )}
                                                    {getConfidenceBadge(
                                                        item.prediction.confidence,
                                                    )}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {item.recommended_action}
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    router.visit(
                                                        `/machines/${item.machine_id}`,
                                                    )
                                                }
                                            >
                                                View Machine
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {/* Prediction Details */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4" />
                                                    Prediction
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Predicted Failure
                                                        </p>
                                                        <p className="flex items-center gap-1 font-medium">
                                                            <Calendar className="h-4 w-4" />
                                                            {item.prediction.predicted_failure_date}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Days Until Failure
                                                        </p>
                                                        <p
                                                            className={`text-2xl font-bold ${
                                                                item.prediction.days_until_failure <= 7
                                                                    ? 'text-red-600'
                                                                    : item.prediction.days_until_failure <= 14
                                                                      ? 'text-orange-600'
                                                                      : 'text-green-600'
                                                            }`}
                                                        >
                                                            {item.prediction.days_until_failure}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Probability
                                                        </p>
                                                        <p className="font-medium">
                                                            {item.prediction.probability.toFixed(0)}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Historical Data */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Historical Data
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Total Breakdowns
                                                        </p>
                                                        <p className="font-medium">
                                                            {item.historical_data.total_breakdowns}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Avg Days Between
                                                        </p>
                                                        <p className="font-medium">
                                                            {item.historical_data.average_days_between_failures.toFixed(
                                                                0,
                                                            )}{' '}
                                                            days
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Last Breakdown
                                                        </p>
                                                        <p className="font-medium">
                                                            {item.historical_data.last_breakdown}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Days Since Last
                                                        </p>
                                                        <p className="font-medium">
                                                            {item.historical_data.days_since_last_breakdown}{' '}
                                                            days
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                onClick={() =>
                                                    router.visit(
                                                        `/work-orders/report-breakdown?machine_id=${item.machine_id}&type=preventive&title=Preventive Maintenance - ${item.machine_name}`,
                                                    )
                                                }
                                            >
                                                <Wrench className="mr-2 h-4 w-4" />
                                                Create Preventive Work Order
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No Predictions Available
                                </h3>
                                <p className="mt-2 text-muted-foreground">
                                    Machines need at least 3 historical breakdowns to
                                    generate predictions. Continue logging work orders
                                    to enable predictive maintenance.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
