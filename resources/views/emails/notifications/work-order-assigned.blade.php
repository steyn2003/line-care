@extends('emails.layout')

@section('title', 'Work Order Assigned')

@section('content')
<h2>New Work Order Assigned</h2>

<p>Hello {{ $user_name ?? 'there' }},</p>

<p>A new work order has been assigned to you:</p>

<div class="notification-card {{ $priority === 'high' ? 'critical' : ($priority === 'medium' ? 'warning' : '') }}">
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
        <span class="info-label">Priority:</span>
        <span class="info-value" style="text-transform: uppercase; font-weight: 600; color: {{ $priority === 'high' ? '#ef4444' : ($priority === 'medium' ? '#f59e0b' : '#10b981') }}">
            {{ $priority ?? 'Normal' }}
        </span>
    </div>
    @if(isset($due_date))
    <div class="info-row">
        <span class="info-label">Due Date:</span>
        <span class="info-value">{{ $due_date }}</span>
    </div>
    @endif
</div>

@if(isset($description))
<p><strong>Description:</strong></p>
<p>{{ $description }}</p>
@endif

<a href="{{ config('app.url') }}/work-orders/{{ $work_order_id ?? '' }}" class="button">
    View Work Order
</a>

<p>Please review and start working on this task as soon as possible.</p>
@endsection
