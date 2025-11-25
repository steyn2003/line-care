@extends('emails.layout')

@section('title', __('emails.sensor_alert.title'))

@section('content')
<h2>🚨 {{ __('emails.sensor_alert.title') }}</h2>

<p>{{ $user_name ? __('emails.common.greeting', ['name' => $user_name]) : __('emails.common.greeting_default') }}</p>

<p>{{ __('emails.sensor_alert.intro') }}</p>

<div class="notification-card {{ $alert_type === 'critical' ? 'critical' : 'warning' }}">
    <div class="info-row">
        <span class="info-label">{{ __('emails.sensor_alert.machine') }}:</span>
        <span class="info-value"><strong>{{ $machine_name ?? 'N/A' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.sensor_alert.sensor') }}:</span>
        <span class="info-value">{{ ucfirst($sensor_type ?? 'N/A') }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.sensor_alert.alert_type') }}:</span>
        <span class="info-value" style="text-transform: uppercase; font-weight: 600; color: {{ $alert_type === 'critical' ? '#ef4444' : '#f59e0b' }}">
            {{ $alert_type === 'critical' ? __('emails.sensor_alert.critical') : __('emails.sensor_alert.warning') }}
        </span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.sensor_alert.reading') }}:</span>
        <span class="info-value" style="font-weight: 600;">{{ $reading_value ?? 'N/A' }} {{ $unit ?? '' }}</span>
    </div>
    @if(isset($threshold))
    <div class="info-row">
        <span class="info-label">{{ __('emails.sensor_alert.threshold') }}:</span>
        <span class="info-value">{{ $threshold }} {{ $unit ?? '' }}</span>
    </div>
    @endif
    @if(isset($triggered_at))
    <div class="info-row">
        <span class="info-label">{{ __('emails.sensor_alert.timestamp') }}:</span>
        <span class="info-value">{{ $triggered_at }}</span>
    </div>
    @endif
</div>

@if(isset($work_order_id))
<p>✅ {{ __('emails.sensor_alert.auto_work_order') }}</p>
<a href="{{ config('app.url') }}/work-orders/{{ $work_order_id }}" class="button">
    {{ __('emails.work_order_assigned.action') }}
</a>
@else
<a href="{{ config('app.url') }}/machines/{{ $machine_id ?? '' }}/sensors" class="button">
    {{ __('emails.sensor_alert.action') }}
</a>
@endif
@endsection
