<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExternalService extends Model
{
    protected $fillable = [
        'company_id',
        'work_order_id',
        'vendor_name',
        'description',
        'cost',
        'invoice_number',
        'invoice_date',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'invoice_date' => 'date',
    ];

    // Relationships
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }
}
