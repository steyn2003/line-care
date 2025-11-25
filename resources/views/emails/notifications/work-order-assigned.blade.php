@extends('emails.layout')

@section('title', __('emails.work_order_assigned.title'))

@section('content')
<h2>{{ __('emails.work_order_assigned.title') }}</h2>

<p>{{ $user_name ? __('emails.common.greeting', ['name' => $user_name]) : __('emails.common.greeting_default') }}</p>

<p>{{ __('emails.work_order_assigned.intro') }}</p>

<div class="notification-card {{ $priority === 'high' ? 'critical' : ($priority === 'medium' ? 'warning' : '') }}">
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
        <span class="info-label">{{ __('emails.work_order_assigned.priority') }}:</span>
        <span class="info-value" style="text-transform: uppercase; font-weight: 600; color: {{ $priority === 'high' ? '#ef4444' : ($priority === 'medium' ? '#f59e0b' : '#10b981') }}">
            {{ $priority ?? 'Normal' }}
        </span>
    </div>
    @if(isset($due_date))
    <div class="info-row">
        <span class="info-label">{{ __('emails.work_order_assigned.due_date') }}:</span>
        <span class="info-value">{{ $due_date }}</span>
    </div>
    @endif
</div>

@if(isset($description))
<p><strong>{{ __('emails.work_order_assigned.description') }}:</strong></p>
<p>{{ $description }}</p>
@endif

<a href="{{ config('app.url') }}/work-orders/{{ $work_order_id ?? '' }}" class="button">
    {{ __('emails.work_order_assigned.action') }}
</a>
@endsection
