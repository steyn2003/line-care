@extends('emails.layout')

@section('title', __('emails.vendor.purchase_order_updated.title'))

@section('content')
    <h2>{{ __('emails.vendor.purchase_order_updated.title') }}</h2>

    <p>{{ __('emails.common.greeting', ['name' => $supplier_name]) }}</p>

    <p>{{ __('emails.vendor.purchase_order_updated.intro') }}</p>

    <div class="notification-card">
        <div class="info-row">
            <span class="info-label">{{ __('emails.vendor.new_purchase_order.order_number') }}:</span>
            <span class="info-value"><strong>{{ $po_number }}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">{{ __('emails.vendor.purchase_order_updated.status') }}:</span>
            <span class="info-value">{{ ucfirst($status) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">{{ __('emails.vendor.new_purchase_order.total') }}:</span>
            <span class="info-value">${{ number_format($total_amount, 2) }}</span>
        </div>
        @if($expected_delivery_date)
        <div class="info-row">
            <span class="info-label">{{ __('emails.vendor.new_purchase_order.expected_delivery') }}:</span>
            <span class="info-value">{{ $expected_delivery_date }}</span>
        </div>
        @endif
    </div>

    @if($update_message)
    <div class="notification-card">
        <p><strong>Update Details:</strong></p>
        <p>{{ $update_message }}</p>
    </div>
    @endif

    <a href="{{ $portal_url }}" class="button">{{ __('emails.vendor.purchase_order_updated.action') }}</a>
@endsection
