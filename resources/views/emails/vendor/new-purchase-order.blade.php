@extends('emails.layout')

@section('title', 'New Purchase Order - LineCare')

@section('content')
    <h2>New Purchase Order</h2>

    <p>Hello {{ $supplier_name }},</p>

    <p>You have received a new purchase order from <strong>{{ $company_name }}</strong>.</p>

    <div class="notification-card">
        <div class="info-row">
            <span class="info-label">PO Number:</span>
            <span class="info-value"><strong>{{ $po_number }}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Total Amount:</span>
            <span class="info-value">${{ number_format($total_amount, 2) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Items:</span>
            <span class="info-value">{{ $items_count }} item(s)</span>
        </div>
        @if($expected_delivery_date)
        <div class="info-row">
            <span class="info-label">Expected Delivery:</span>
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
        <p><strong>Notes from buyer:</strong></p>
        <p>{{ $notes }}</p>
    </div>
    @endif

    <h3>Order Items</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
            <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Part Number</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Description</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Unit Price</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
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
                <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${{ number_format($total_amount, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <p>Please review and acknowledge this order at your earliest convenience.</p>

    <a href="{{ $portal_url }}" class="button">View in Vendor Portal</a>

    <p style="color: #666; font-size: 14px;">
        If you don't have access to the vendor portal, please contact {{ $company_name }} to request an API key.
    </p>
@endsection
