@extends('emails.layout')

@section('title', __('emails.part_low_stock.title'))

@section('content')
<h2>📦 {{ __('emails.part_low_stock.title') }}</h2>

<p>{{ $user_name ? __('emails.common.greeting', ['name' => $user_name]) : __('emails.common.greeting_default') }}</p>

<p>{{ __('emails.part_low_stock.intro') }}</p>

<div class="notification-card {{ $is_critical ? 'critical' : 'warning' }}">
    <div class="info-row">
        <span class="info-label">{{ __('emails.part_low_stock.part_name') }}:</span>
        <span class="info-value"><strong>{{ $part_name ?? 'N/A' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.part_low_stock.part_number') }}:</span>
        <span class="info-value">{{ $part_number ?? 'N/A' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.part_low_stock.current_stock') }}:</span>
        <span class="info-value" style="color: {{ $is_critical ? '#ef4444' : '#f59e0b' }}; font-weight: 600;">
            {{ $quantity_available ?? '0' }} {{ $unit_of_measure ?? 'units' }}
        </span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.part_low_stock.reorder_point') }}:</span>
        <span class="info-value">{{ $reorder_point ?? 'N/A' }}</span>
    </div>
    @if(isset($reorder_quantity))
    <div class="info-row">
        <span class="info-label">{{ __('emails.part_low_stock.reorder_quantity') }}:</span>
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
    {{ __('emails.part_low_stock.action') }}
</a>
@endsection
