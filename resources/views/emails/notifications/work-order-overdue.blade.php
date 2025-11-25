@extends('emails.layout')

@section('title', __('emails.work_order_overdue.title'))

@section('content')
<h2>⚠️ {{ __('emails.work_order_overdue.title') }}</h2>

<p>{{ $user_name ? __('emails.common.greeting', ['name' => $user_name]) : __('emails.common.greeting_default') }}</p>

<p>{{ __('emails.work_order_overdue.intro') }}</p>

<div class="notification-card critical">
    <div class="info-row">
        <span class="info-label">{{ __('emails.work_order_assigned.details') }}:</span>
        <span class="info-value"><strong>{{ __('emails.work_order_assigned.work_order_number', ['number' => $work_order_number ?? 'N/A']) }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.work_order_assigned.type') }}:</span>
        <span class="info-value">{{ $work_order_title ?? 'Untitled' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.work_order_assigned.machine') }}:</span>
        <span class="info-value">{{ $machine_name ?? 'N/A' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.work_order_overdue.was_due') }}:</span>
        <span class="info-value">{{ $due_date ?? 'N/A' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ trans_choice('emails.work_order_overdue.days_overdue', $days_overdue ?? 0, ['count' => $days_overdue ?? 0]) }}:</span>
        <span class="info-value" style="color: #ef4444; font-weight: 600;">{{ $days_overdue ?? '0' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value">{{ ucfirst($status ?? 'pending') }}</span>
    </div>
</div>

<a href="{{ config('app.url') }}/work-orders/{{ $work_order_id ?? '' }}" class="button">
    {{ __('emails.work_order_overdue.action') }}
</a>
@endsection
