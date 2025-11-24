@extends('emails.layout')

@section('title', 'Budget Alert')

@section('content')
<h2>💰 Budget Alert</h2>

<p>Hello {{ $user_name ?? 'there' }},</p>

<p>The maintenance budget has exceeded the allocated amount for this period:</p>

<div class="notification-card critical">
    <div class="info-row">
        <span class="info-label">Period:</span>
        <span class="info-value"><strong>{{ $period ?? 'Current Month' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">Budgeted Amount:</span>
        <span class="info-value">${{ number_format($budgeted_amount ?? 0, 2) }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Actual Spending:</span>
        <span class="info-value" style="color: #ef4444; font-weight: 600;">
            ${{ number_format($actual_amount ?? 0, 2) }}
        </span>
    </div>
    <div class="info-row">
        <span class="info-label">Variance:</span>
        <span class="info-value" style="color: #ef4444; font-weight: 600;">
            ${{ number_format($variance ?? 0, 2) }} ({{ number_format($variance_percentage ?? 0, 1) }}%)
        </span>
    </div>
</div>

@if(isset($cost_breakdown))
<p><strong>Cost Breakdown:</strong></p>
<div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
    @if(isset($cost_breakdown['labor']))
    <div class="info-row">
        <span class="info-label">Labor Costs:</span>
        <span class="info-value">${{ number_format($cost_breakdown['labor'], 2) }}</span>
    </div>
    @endif
    @if(isset($cost_breakdown['parts']))
    <div class="info-row">
        <span class="info-label">Parts Costs:</span>
        <span class="info-value">${{ number_format($cost_breakdown['parts'], 2) }}</span>
    </div>
    @endif
    @if(isset($cost_breakdown['external']))
    <div class="info-row">
        <span class="info-label">External Services:</span>
        <span class="info-value">${{{ number_format($cost_breakdown['external'], 2) }}</span>
    </div>
    @endif
    @if(isset($cost_breakdown['downtime']))
    <div class="info-row">
        <span class="info-label">Downtime Costs:</span>
        <span class="info-value">${{ number_format($cost_breakdown['downtime'], 2) }}</span>
    </div>
    @endif
</div>
@endif

<a href="{{ config('app.url') }}/cost-management/budget" class="button">
    View Budget Details
</a>

<p><strong>Action Required:</strong> Please review spending and adjust maintenance activities if necessary to stay within budget.</p>
@endsection
