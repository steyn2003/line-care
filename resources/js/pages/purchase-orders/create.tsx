import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Stock {
    location_id: number;
    quantity_on_hand: number;
    quantity_reserved: number;
    location?: {
        id: number;
        name: string;
    };
}

interface Category {
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
    unit_cost: number;
    category?: Category;
    supplier?: Supplier;
    stocks: Stock[];
    total_quantity_available: number;
}

interface PrefilledPart {
    spare_part_id: number;
    quantity: number;
    unit_cost: number;
}

interface Props {
    suppliers: Supplier[];
    spare_parts: SparePart[];
    prefilled_data?: {
        supplier_id: number;
        parts: PrefilledPart[];
    } | null;
}

interface LineItem {
    spare_part_id: number;
    quantity: number;
    unit_cost: number;
}

export default function CreatePurchaseOrder({
    suppliers,
    spare_parts,
    prefilled_data,
}: Props) {
    // Safely initialize line items from prefilled data
    const initialLineItems = prefilled_data?.parts
        ? prefilled_data.parts.map((part) => ({
              spare_part_id: part.spare_part_id || 0,
              quantity: part.quantity || 1,
              unit_cost: part.unit_cost || 0,
          }))
        : [];

    const [lineItems, setLineItems] = useState<LineItem[]>(initialLineItems);

    const { data, setData, processing, errors } = useForm({
        supplier_id: prefilled_data?.supplier_id?.toString() || '',
        expected_delivery_date: '',
        notes: '',
        line_items: initialLineItems,
    });

    const handleAddLineItem = () => {
        const newItem: LineItem = {
            spare_part_id: 0,
            quantity: 1,
            unit_cost: 0,
        };
        setLineItems([...lineItems, newItem]);
    };

    const handleRemoveLineItem = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index));
    };

    const handleLineItemChange = (
        index: number,
        field: keyof LineItem,
        value: string | number,
    ) => {
        const updated = [...lineItems];

        // Convert string to number for numeric fields
        if (field === 'spare_part_id') {
            const partId = parseInt(value) || 0;
            updated[index] = { ...updated[index], [field]: partId };

            // Auto-fill unit cost when part is selected
            const part = spare_parts.find((p) => p.id === partId);
            if (part) {
                updated[index].unit_cost = part.unit_cost;
            }
        } else if (field === 'quantity') {
            updated[index] = {
                ...updated[index],
                [field]: parseInt(value) || 1,
            };
        } else if (field === 'unit_cost') {
            updated[index] = {
                ...updated[index],
                [field]: parseFloat(value) || 0,
            };
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }

        setLineItems(updated);
    };

    const getTotalAmount = () => {
        return lineItems.reduce((sum, item) => {
            return sum + item.quantity * item.unit_cost;
        }, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out invalid line items
        const validItems = lineItems.filter(
            (item) =>
                item.spare_part_id > 0 &&
                item.quantity > 0 &&
                item.unit_cost >= 0,
        );

        if (validItems.length === 0) {
            alert('Please add at least one line item with valid data.');
            return;
        }

        // Submit directly with router.post to include line items
        router.post('/purchase-orders', {
            supplier_id: data.supplier_id,
            expected_delivery_date: data.expected_delivery_date,
            notes: data.notes,
            line_items: validItems,
        });
    };

    return (
        <AppLayout>
            <Head title="Create Purchase Order" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit('/purchase-orders')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Create Purchase Order
                            </h1>
                            <p className="text-muted-foreground">
                                Order spare parts from suppliers
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PO Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                            <CardDescription>
                                Basic purchase order information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="supplier_id">
                                        Supplier{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
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

                                <div className="space-y-2">
                                    <Label htmlFor="expected_delivery_date">
                                        Expected Delivery Date
                                    </Label>
                                    <Input
                                        id="expected_delivery_date"
                                        type="date"
                                        value={data.expected_delivery_date}
                                        onChange={(e) =>
                                            setData(
                                                'expected_delivery_date',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            errors.expected_delivery_date
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.expected_delivery_date && (
                                        <p className="text-sm text-red-500">
                                            {errors.expected_delivery_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    placeholder="Additional notes or instructions"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line Items */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Line Items</CardTitle>
                                    <CardDescription>
                                        Parts to order from this supplier
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddLineItem}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Item
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {lineItems.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p>
                                        No items added yet. Click "Add Item" to
                                        get started.
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Spare Part</TableHead>
                                            <TableHead className="text-right">
                                                Quantity
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Unit Cost
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Total
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lineItems.map((item, index) => {
                                            const selectedPart =
                                                spare_parts.find(
                                                    (p) =>
                                                        p.id ===
                                                        item.spare_part_id,
                                                );
                                            const lineTotal =
                                                item.quantity * item.unit_cost;

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Select
                                                            value={
                                                                item.spare_part_id >
                                                                0
                                                                    ? item.spare_part_id.toString()
                                                                    : ''
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                handleLineItemChange(
                                                                    index,
                                                                    'spare_part_id',
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select part" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {spare_parts.map(
                                                                    (part) => (
                                                                        <SelectItem
                                                                            key={
                                                                                part.id
                                                                            }
                                                                            value={part.id.toString()}
                                                                        >
                                                                            {
                                                                                part.part_number
                                                                            }{' '}
                                                                            -{' '}
                                                                            {
                                                                                part.name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {selectedPart && (
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                Available:{' '}
                                                                {
                                                                    selectedPart.total_quantity_available
                                                                }
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleLineItemChange(
                                                                    index,
                                                                    'quantity',
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ) || 1,
                                                                )
                                                            }
                                                            className="w-24 text-right"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={
                                                                item.unit_cost
                                                            }
                                                            onChange={(e) =>
                                                                handleLineItemChange(
                                                                    index,
                                                                    'unit_cost',
                                                                    parseFloat(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                                )
                                                            }
                                                            className="w-32 text-right"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        ${lineTotal.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRemoveLineItem(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-right font-semibold"
                                            >
                                                Total Amount:
                                            </TableCell>
                                            <TableCell className="text-right text-lg font-bold">
                                                ${getTotalAmount().toFixed(2)}
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/purchase-orders')}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || lineItems.length === 0}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing
                                ? 'Creating...'
                                : 'Create Purchase Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
