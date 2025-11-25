@extends('emails.layout')

@section('title', __('emails.vendor.new_purchase_order.title'))

@section('content')
    <h2>{{ __('emails.vendor.new_purchase_order.title') }}</h2>

    <p>{{ __('emails.common.greeting', ['name' => $supplier_name]) }}</p>

    <p>{{ __('emails.vendor.new_purchase_order.intro', ['company' => $company_name]) }}</p>

    <div class="notification-card">
        <div class="info-row">
            <span class="info-label">{{ __('emails.vendor.new_purchase_order.order_number') }}:</span>
            <span class="info-value"><strong>{{ $po_number }}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">{{ __('emails.vendor.new_purchase_order.total') }}:</span>
            <span class="info-value">${{ number_format($total_amount, 2) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">{{ __('emails.vendor.new_purchase_order.items') }}:</span>
            <span class="info-value">{{ $items_count }} item(s)</span>
        </div>
        @if($expected_delivery_date)
        <div class="info-row">
            <span class="info-label">{{ __('emails.vendor.new_purchase_order.expected_delivery') }}:</span>
            <span class="info-value">{{ $expected_delivery_date }}</span>
        </div>
        @endif
        <div class="info-row">
            <span class="info-label">Created:</span>
            <span class="info-value">{{ $created_at }}</span>
        </div>
    </div>

    @if($notes)
    <div class="notification-card">
        <p><strong>{{ __('emails.vendor.new_purchase_order.notes') }}:</strong></p>
        <p>{{ $notes }}</p>
    </div>
    @endif

    <h3>{{ __('emails.vendor.new_purchase_order.items') }}</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
            <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">{{ __('emails.vendor.new_purchase_order.part_number') }}</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Description</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">{{ __('emails.vendor.new_purchase_order.quantity') }}</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">{{ __('emails.vendor.new_purchase_order.unit_price') }}</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">{{ __('emails.vendor.new_purchase_order.total') }}</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">{{ $item['part_number'] }}</td>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">{{ $item['name'] }}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #dee2e6;">{{ $item['quantity'] }}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #dee2e6;">${{ number_format($item['unit_price'], 2) }}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #dee2e6;">${{ number_format($item['total_price'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">{{ __('emails.vendor.new_purchase_order.total') }}:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${{ number_format($total_amount, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <a href="{{ $portal_url }}" class="button">{{ __('emails.vendor.new_purchase_order.action') }}</a>

    <p style="color: #666; font-size: 14px;">
        If you don't have access to the vendor portal, please contact {{ $company_name }} to request an API key.
    </p>
@endsection
