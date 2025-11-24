@extends('emails.layout')

@section('title', 'Production Run Complete')

@section('content')
<h2>✅ Production Run Complete</h2>

<p>Hello {{ $user_name ?? 'there' }},</p>

<p>A production run has been completed. Here is the summary:</p>

<div class="notification-card {{ isset($oee) && $oee >= 85 ? 'success' : (isset($oee) && $oee >= 60 ? '' : 'warning') }}">
    <div class="info-row">
        <span class="info-label">Machine:</span>
        <span class="info-value"><strong>{{ $machine_name ?? 'N/A' }}</strong></span>
    </div>
    @if(isset($product_name))
    <div class="info-row">
        <span class="info-label">Product:</span>
        <span class="info-value">{{ $product_name }}</span>
    </div>
    @endif
    @if(isset($shift_name))
    <div class="info-row">
        <span class="info-label">Shift:</span>
        <span class="info-value">{{ $shift_name }}</span>
    </div>
    @endif
    <div class="info-row">
        <span class="info-label">Duration:</span>
        <span class="info-value">{{ $duration ?? 'N/A' }}</span>
    </div>
</div>

<h3 style="color: #667eea; margin-top: 25px;">Production Results</h3>

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
    @if(isset($target_quantity))
    <div class="info-row">
        <span class="info-label">Target Quantity:</span>
        <span class="info-value">{{ $target_quantity }} units</span>
    </div>
    @endif
    @if(isset($actual_output))
    <div class="info-row">
        <span class="info-label">Actual Output:</span>
        <span class="info-value">{{ $actual_output }} units</span>
    </div>
    @endif
    @if(isset($good_output))
    <div class="info-row">
        <span class="info-label">Good Output:</span>
        <span class="info-value">{{ $good_output }} units</span>
    </div>
    @endif
    @if(isset($defects))
    <div class="info-row">
        <span class="info-label">Defects:</span>
        <span class="info-value">{{ $defects }} units</span>
    </div>
    @endif
</div>

@if(isset($oee) || isset($availability) || isset($performance) || isset($quality))
<h3 style="color: #667eea; margin-top: 25px;">OEE Metrics</h3>

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
    @if(isset($availability))
    <div class="info-row">
        <span class="info-label">Availability:</span>
        <span class="info-value">{{ number_format($availability, 1) }}%</span>
    </div>
    @endif
    @if(isset($performance))
    <div class="info-row">
        <span class="info-label">Performance:</span>
        <span class="info-value">{{ number_format($performance, 1) }}%</span>
    </div>
    @endif
    @if(isset($quality))
    <div class="info-row">
        <span class="info-label">Quality:</span>
        <span class="info-value">{{ number_format($quality, 1) }}%</span>
    </div>
    @endif
    @if(isset($oee))
    <div class="info-row" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
        <span class="info-label">Overall OEE:</span>
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
    View Full Report
</a>

@if(isset($oee))
    @if($oee >= 85)
        <p style="color: #10b981; font-weight: 600;">🎉 Excellent performance! This run achieved world-class OEE.</p>
    @elseif($oee >= 60)
        <p>Good performance with room for improvement.</p>
    @else
        <p style="color: #ef4444;">Performance below target. Please review for improvement opportunities.</p>
    @endif
@endif
@endsection
