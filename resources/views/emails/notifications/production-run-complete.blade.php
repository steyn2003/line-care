@extends('emails.layout')

@section('title', __('emails.production_run_complete.title'))

@section('content')
<h2>✅ {{ __('emails.production_run_complete.title') }}</h2>

<p>{{ $user_name ? __('emails.common.greeting', ['name' => $user_name]) : __('emails.common.greeting_default') }}</p>

<p>{{ __('emails.production_run_complete.intro') }}</p>

<div class="notification-card {{ isset($oee) && $oee >= 85 ? 'success' : (isset($oee) && $oee >= 60 ? '' : 'warning') }}">
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.machine') }}:</span>
        <span class="info-value"><strong>{{ $machine_name ?? 'N/A' }}</strong></span>
    </div>
    @if(isset($product_name))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.product') }}:</span>
        <span class="info-value">{{ $product_name }}</span>
    </div>
    @endif
    @if(isset($shift_name))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.shift') }}:</span>
        <span class="info-value">{{ $shift_name }}</span>
    </div>
    @endif
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.duration') }}:</span>
        <span class="info-value">{{ $duration ?? 'N/A' }}</span>
    </div>
</div>

<h3 style="color: #667eea; margin-top: 25px;">{{ __('emails.production_run_complete.output') }}</h3>

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
    @if(isset($target_quantity))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.target') }}:</span>
        <span class="info-value">{{ $target_quantity }} units</span>
    </div>
    @endif
    @if(isset($actual_output))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.actual') }}:</span>
        <span class="info-value">{{ $actual_output }} units</span>
    </div>
    @endif
    @if(isset($good_output))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.good_units') }}:</span>
        <span class="info-value">{{ $good_output }} units</span>
    </div>
    @endif
    @if(isset($defects))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.defects') }}:</span>
        <span class="info-value">{{ $defects }} units</span>
    </div>
    @endif
</div>

@if(isset($oee) || isset($availability) || isset($performance) || isset($quality))
<h3 style="color: #667eea; margin-top: 25px;">{{ __('emails.production_run_complete.oee_metrics') }}</h3>

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
    @if(isset($availability))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.availability') }}:</span>
        <span class="info-value">{{ number_format($availability, 1) }}%</span>
    </div>
    @endif
    @if(isset($performance))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.performance') }}:</span>
        <span class="info-value">{{ number_format($performance, 1) }}%</span>
    </div>
    @endif
    @if(isset($quality))
    <div class="info-row">
        <span class="info-label">{{ __('emails.production_run_complete.quality') }}:</span>
        <span class="info-value">{{ number_format($quality, 1) }}%</span>
    </div>
    @endif
    @if(isset($oee))
    <div class="info-row" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
        <span class="info-label">{{ __('emails.production_run_complete.oee') }}:</span>
        <span class="info-value" style="font-size: 18px; font-weight: 600; color: {{ $oee >= 85 ? '#10b981' : ($oee >= 60 ? '#f59e0b' : '#ef4444') }}">
            {{ number_format($oee, 1) }}%
        </span>
    </div>
    @endif
</div>
@endif

@if(isset($downtime_minutes) && $downtime_minutes > 0)
<p style="color: #f59e0b;">
    ⚠️ Total downtime: {{ $downtime_minutes }} minutes
</p>
@endif

<a href="{{ config('app.url') }}/oee/production-runs/{{ $production_run_id ?? '' }}" class="button">
    {{ __('emails.production_run_complete.action') }}
</a>
@endsection
