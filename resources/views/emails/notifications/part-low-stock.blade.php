@extends('emails.layout')

@section('title', 'Low Stock Alert')

@section('content')
<h2>📦 Low Stock Alert</h2>

<p>Hello {{ $user_name ?? 'there' }},</p>

<p>The following spare part is running low on stock and requires attention:</p>

<div class="notification-card {{ $is_critical ? 'critical' : 'warning' }}">
    <div class="info-row">
        <span class="info-label">Part Name:</span>
        <span class="info-value"><strong>{{ $part_name ?? 'N/A' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">Part Number:</span>
        <span class="info-value">{{ $part_number ?? 'N/A' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Current Stock:</span>
        <span class="info-value" style="color: {{ $is_critical ? '#ef4444' : '#f59e0b' }}; font-weight: 600;">
            {{ $quantity_available ?? '0' }} {{ $unit_of_measure ?? 'units' }}
        </span>
    </div>
    <div class="info-row">
        <span class="info-label">Reorder Point:</span>
        <span class="info-value">{{ $reorder_point ?? 'N/A' }}</span>
    </div>
    @if(isset($reorder_quantity))
    <div class="info-row">
        <span class="info-label">Suggested Order:</span>
        <span class="info-value">{{ $reorder_quantity }} {{ $unit_of_measure ?? 'units' }}</span>
    </div>
    @endif
    @if(isset($category_name))
    <div class="info-row">
        <span class="info-label">Category:</span>
        <span class="info-value">{{ $category_name }}</span>
    </div>
    @endif
    @if(isset($supplier_name))
    <div class="info-row">
        <span class="info-label">Supplier:</span>
        <span class="info-value">{{ $supplier_name }}</span>
    </div>
    @endif
    @if(isset($unit_cost))
    <div class="info-row">
        <span class="info-label">Unit Cost:</span>
        <span class="info-value">${{ number_format($unit_cost, 2) }}</span>
    </div>
    @endif
</div>

@if($is_critical ?? false)
<p style="color: #ef4444; font-weight: 600;">⚠️ This is a CRITICAL part. Please reorder immediately to avoid production delays.</p>
@endif

<a href="{{ config('app.url') }}/spare-parts/{{ $part_id ?? '' }}" class="button">
    View Part Details
</a>

<p>Please review stock levels and create a purchase order if necessary.</p>
@endsection
