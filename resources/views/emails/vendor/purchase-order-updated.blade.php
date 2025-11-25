@extends('emails.layout')

@section('title', 'Purchase Order Updated - LineCare')

@section('content')
    <h2>Purchase Order Updated</h2>

    <p>Hello {{ $supplier_name }},</p>

    <p>Purchase order <strong>{{ $po_number }}</strong> from <strong>{{ $company_name }}</strong> has been updated.</p>

    <div class="notification-card">
        <div class="info-row">
            <span class="info-label">PO Number:</span>
            <span class="info-value"><strong>{{ $po_number }}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value">{{ ucfirst($status) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Total Amount:</span>
            <span class="info-value">${{ number_format($total_amount, 2) }}</span>
        </div>
        @if($expected_delivery_date)
        <div class="info-row">
            <span class="info-label">Expected Delivery:</span>
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

    <a href="{{ $portal_url }}" class="button">View in Vendor Portal</a>
@endsection
