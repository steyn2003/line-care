import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface PartCategory {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface SparePart {
    id: number;
    part_number: string;
    name: string;
    description: string | null;
    category_id: number | null;
    manufacturer: string | null;
    supplier_id: number | null;
    unit_of_measure: string;
    unit_cost: string;
    reorder_point: number;
    reorder_quantity: number;
    lead_time_days: number;
    location: string | null;
    is_critical: boolean;
    status: 'active' | 'discontinued';
}

interface Props {
    categories: PartCategory[];
    suppliers: Supplier[];
    spare_part?: SparePart;
}

export default function CreateSparePart({
    categories,
    suppliers,
    spare_part,
}: Props) {
    const isEditing = !!spare_part;

    const { data, setData, post, put, processing, errors } = useForm({
        part_number: spare_part?.part_number || '',
        name: spare_part?.name || '',
        description: spare_part?.description || '',
        category_id: spare_part?.category_id?.toString() || '',
        manufacturer: spare_part?.manufacturer || '',
        supplier_id: spare_part?.supplier_id?.toString() || '',
        unit_of_measure: spare_part?.unit_of_measure || 'pieces',
        unit_cost: spare_part?.unit_cost || '0.00',
        reorder_point: spare_part?.reorder_point || 10,
        reorder_quantity: spare_part?.reorder_quantity || 20,
        lead_time_days: spare_part?.lead_time_days || 7,
        location: spare_part?.location || '',
        is_critical: spare_part?.is_critical || false,
        status: (spare_part?.status || 'active') as 'active' | 'discontinued',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/spare-parts/${spare_part.id}`, {
                onSuccess: () => {
                    router.visit(`/spare-parts/${spare_part.id}`);
                },
            });
        } else {
            post('/spare-parts', {
                onSuccess: () => {
                    router.visit('/spare-parts');
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title={isEditing ? 'Edit Spare Part' : 'Add Spare Part'} />

            <div className="container mx-auto max-w-3xl space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/spare-parts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {isEditing ? 'Edit Spare Part' : 'Add Spare Part'}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {isEditing
                                ? 'Update spare part information'
                                : 'Add a new spare part to inventory'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Essential details about the spare part
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="part_number">
                                        Part Number{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="part_number"
                                        value={data.part_number}
                                        onChange={(e) =>
                                            setData(
                                                'part_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., BRG-001"
                                        required
                                    />
                                    {errors.part_number && (
                                        <p className="text-sm text-destructive">
                                            {errors.part_number}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Bearing 6205"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Detailed description of the part..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">
                                        Category
                                    </Label>
                                    <Select
                                        value={
                                            data.category_id === ''
                                                ? 'none'
                                                : data.category_id
                                        }
                                        onValueChange={(value) =>
                                            setData(
                                                'category_id',
                                                value === 'none' ? '' : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                No category
                                            </SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="manufacturer">
                                        Manufacturer
                                    </Label>
                                    <Input
                                        id="manufacturer"
                                        value={data.manufacturer}
                                        onChange={(e) =>
                                            setData(
                                                'manufacturer',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., SKF"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Supplier & Inventory */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier & Inventory</CardTitle>
                            <CardDescription>
                                Pricing and stock management settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="supplier_id">
                                        Supplier
                                    </Label>
                                    <Select
                                        value={data.supplier_id}
                                        onValueChange={(value) =>
                                            setData('supplier_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {suppliers.map((supplier) => (
                                                <SelectItem
                                                    key={supplier.id}
                                                    value={supplier.id.toString()}
                                                >
                                                    {supplier.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit_of_measure">
                                        Unit of Measure{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="unit_of_measure"
                                        value={data.unit_of_measure}
                                        onChange={(e) =>
                                            setData(
                                                'unit_of_measure',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., pieces, kg, liters"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="unit_cost">
                                        Unit Cost ($){' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="unit_cost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.unit_cost}
                                        onChange={(e) =>
                                            setData('unit_cost', e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reorder_point">
                                        Reorder Point{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="reorder_point"
                                        type="number"
                                        min="0"
                                        value={data.reorder_point}
                                        onChange={(e) =>
                                            setData(
                                                'reorder_point',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reorder_quantity">
                                        Reorder Quantity{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="reorder_quantity"
                                        type="number"
                                        min="0"
                                        value={data.reorder_quantity}
                                        onChange={(e) =>
                                            setData(
                                                'reorder_quantity',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="lead_time_days">
                                        Lead Time (days){' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="lead_time_days"
                                        type="number"
                                        min="0"
                                        value={data.lead_time_days}
                                        onChange={(e) =>
                                            setData(
                                                'lead_time_days',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">
                                        Storage Location
                                    </Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        placeholder="e.g., Warehouse A, Shelf 3"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_critical"
                                    checked={data.is_critical}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'is_critical',
                                            checked as boolean,
                                        )
                                    }
                                />
                                <Label
                                    htmlFor="is_critical"
                                    className="cursor-pointer"
                                >
                                    Mark as critical part (gets priority in
                                    automated ordering)
                                </Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(
                                        value: 'active' | 'discontinued',
                                    ) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="discontinued">
                                            Discontinued
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/spare-parts">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {isEditing ? 'Update' : 'Create'} Spare Part
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
