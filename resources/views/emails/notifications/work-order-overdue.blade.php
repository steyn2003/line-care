@extends('emails.layout')

@section('title', 'Work Order Overdue')

@section('content')
<h2>⚠️ Work Order Overdue</h2>

<p>Hello {{ $user_name ?? 'there' }},</p>

<p>The following work order is now overdue and requires immediate attention:</p>

<div class="notification-card critical">
    <div class="info-row">
        <span class="info-label">Work Order:</span>
        <span class="info-value"><strong>{{ $work_order_number ?? 'N/A' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">Title:</span>
        <span class="info-value">{{ $work_order_title ?? 'Untitled' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Machine:</span>
        <span class="info-value">{{ $machine_name ?? 'N/A' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Due Date:</span>
        <span class="info-value">{{ $due_date ?? 'N/A' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Days Overdue:</span>
        <span class="info-value" style="color: #ef4444; font-weight: 600;">{{ $days_overdue ?? '0' }} days</span>
    </div>
    <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value">{{ ucfirst($status ?? 'pending') }}</span>
    </div>
</div>

<a href="{{ config('app.url') }}/work-orders/{{ $work_order_id ?? '' }}" class="button">
    View Work Order
</a>

<p><strong>Action Required:</strong> Please complete this work order as soon as possible to minimize downtime and maintain equipment reliability.</p>
@endsection
