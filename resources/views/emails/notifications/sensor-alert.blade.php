@extends('emails.layout')

@section('title', 'Sensor Alert')

@section('content')
<h2>🚨 Sensor Alert</h2>

<p>Hello {{ $user_name ?? 'there' }},</p>

<p>A sensor has detected an abnormal reading that requires your attention:</p>

<div class="notification-card {{ $alert_type === 'critical' ? 'critical' : 'warning' }}">
    <div class="info-row">
        <span class="info-label">Machine:</span>
        <span class="info-value"><strong>{{ $machine_name ?? 'N/A' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">Sensor Type:</span>
        <span class="info-value">{{ ucfirst($sensor_type ?? 'N/A') }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Alert Level:</span>
        <span class="info-value" style="text-transform: uppercase; font-weight: 600; color: {{ $alert_type === 'critical' ? '#ef4444' : '#f59e0b' }}">
            {{ $alert_type ?? 'WARNING' }}
        </span>
    </div>
    <div class="info-row">
        <span class="info-label">Current Reading:</span>
        <span class="info-value" style="font-weight: 600;">{{ $reading_value ?? 'N/A' }} {{ $unit ?? '' }}</span>
    </div>
    @if(isset($threshold))
    <div class="info-row">
        <span class="info-label">Threshold:</span>
        <span class="info-value">{{ $threshold }} {{ $unit ?? '' }}</span>
    </div>
    @endif
    @if(isset($triggered_at))
    <div class="info-row">
        <span class="info-label">Triggered At:</span>
        <span class="info-value">{{ $triggered_at }}</span>
    </div>
    @endif
</div>

@if(isset($work_order_id))
<p>✅ A work order has been automatically created to address this issue.</p>
<a href="{{ config('app.url') }}/work-orders/{{ $work_order_id }}" class="button">
    View Work Order
</a>
@else
<a href="{{ config('app.url') }}/machines/{{ $machine_id ?? '' }}/sensors" class="button">
    View Sensor Details
</a>
@endif

@if($alert_type === 'critical')
<p style="color: #ef4444; font-weight: 600;">⚠️ CRITICAL ALERT: Immediate action required to prevent equipment damage or production loss.</p>
@else
<p><strong>Recommended Action:</strong> Inspect the machine and address the abnormal sensor reading to prevent potential issues.</p>
@endif
@endsection
