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
import { Head, router, useForm } from '@inertiajs/react';
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
    supplier_id: number | null;
    unit_cost: number;
    reorder_point: number;
    reorder_quantity: number;
    is_critical: boolean;
    status: 'active' | 'discontinued';
}

interface Props {
    spare_part: SparePart;
    categories: PartCategory[];
    suppliers: Supplier[];
}

export default function EditSparePart({
    spare_part,
    categories,
    suppliers,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        part_number: spare_part.part_number,
        name: spare_part.name,
        description: spare_part.description || '',
        category_id: spare_part.category_id?.toString() || '',
        supplier_id: spare_part.supplier_id?.toString() || '',
        unit_cost: spare_part.unit_cost.toString(),
        reorder_point: spare_part.reorder_point.toString(),
        reorder_quantity: spare_part.reorder_quantity.toString(),
        is_critical: spare_part.is_critical,
        status: spare_part.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/spare-parts/${spare_part.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Spare Part" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                router.visit(`/spare-parts/${spare_part.id}`)
                            }
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Edit Spare Part
                            </h1>
                            <p className="text-muted-foreground">
                                Update spare part information
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Essential part details and identification
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="part_number">
                                        Part Number{' '}
                                        <span className="text-red-500">*</span>
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
                                        className={
                                            errors.part_number
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.part_number && (
                                        <p className="text-sm text-red-500">
                                            {errors.part_number}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Ball Bearing 6201"
                                        className={
                                            errors.name ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
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
                                    placeholder="Additional details about this part"
                                    rows={3}
                                    className={
                                        errors.description
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">Category</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) =>
                                        setData('category_id', value)
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.category_id
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    >
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                {errors.category_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Supplier & Inventory */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier & Inventory</CardTitle>
                            <CardDescription>
                                Cost and reorder information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="supplier_id">Supplier</Label>
                                <Select
                                    value={data.supplier_id}
                                    onValueChange={(value) =>
                                        setData('supplier_id', value)
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.supplier_id
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    >
                                        <SelectValue placeholder="Select a supplier" />
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
                                {errors.supplier_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.supplier_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="unit_cost">
                                        Unit Cost{' '}
                                        <span className="text-red-500">*</span>
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
                                        placeholder="0.00"
                                        className={
                                            errors.unit_cost
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.unit_cost && (
                                        <p className="text-sm text-red-500">
                                            {errors.unit_cost}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reorder_point">
                                        Reorder Point{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="reorder_point"
                                        type="number"
                                        min="0"
                                        value={data.reorder_point}
                                        onChange={(e) =>
                                            setData(
                                                'reorder_point',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., 5"
                                        className={
                                            errors.reorder_point
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.reorder_point && (
                                        <p className="text-sm text-red-500">
                                            {errors.reorder_point}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reorder_quantity">
                                        Reorder Quantity{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="reorder_quantity"
                                        type="number"
                                        min="1"
                                        value={data.reorder_quantity}
                                        onChange={(e) =>
                                            setData(
                                                'reorder_quantity',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., 10"
                                        className={
                                            errors.reorder_quantity
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.reorder_quantity && (
                                        <p className="text-sm text-red-500">
                                            {errors.reorder_quantity}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>
                                Part status and properties
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    Status{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(
                                        value: 'active' | 'discontinued',
                                    ) => setData('status', value)}
                                >
                                    <SelectTrigger
                                        className={
                                            errors.status
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    >
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
                                {errors.status && (
                                    <p className="text-sm text-red-500">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

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
                                    Mark as critical part (requires priority
                                    attention)
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.visit(`/spare-parts/${spare_part.id}`)
                            }
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
