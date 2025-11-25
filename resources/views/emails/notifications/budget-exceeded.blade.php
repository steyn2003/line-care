@extends('emails.layout')

@section('title', __('emails.budget_exceeded.title'))

@section('content')
<h2>💰 {{ __('emails.budget_exceeded.title') }}</h2>

<p>{{ $user_name ? __('emails.common.greeting', ['name' => $user_name]) : __('emails.common.greeting_default') }}</p>

<p>{{ __('emails.budget_exceeded.intro', ['period' => $period ?? 'Current Month']) }}</p>

<div class="notification-card critical">
    <div class="info-row">
        <span class="info-label">{{ __('emails.budget_exceeded.period') }}:</span>
        <span class="info-value"><strong>{{ $period ?? 'Current Month' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.budget_exceeded.budgeted') }}:</span>
        <span class="info-value">${{ number_format($budgeted_amount ?? 0, 2) }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.budget_exceeded.actual') }}:</span>
        <span class="info-value" style="color: #ef4444; font-weight: 600;">
            ${{ number_format($actual_amount ?? 0, 2) }}
        </span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.budget_exceeded.variance') }}:</span>
        <span class="info-value" style="color: #ef4444; font-weight: 600;">
            ${{ number_format($variance ?? 0, 2) }} ({{ number_format($variance_percentage ?? 0, 1) }}%)
        </span>
    </div>
</div>

@if(isset($cost_breakdown))
<p><strong>{{ __('emails.budget_exceeded.breakdown') }}:</strong></p>
<div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
    @if(isset($cost_breakdown['labor']))
    <div class="info-row">
        <span class="info-label">{{ __('emails.budget_exceeded.labor') }}:</span>
        <span class="info-value">${{ number_format($cost_breakdown['labor'], 2) }}</span>
    </div>
    @endif
    @if(isset($cost_breakdown['parts']))
    <div class="info-row">
        <span class="info-label">{{ __('emails.budget_exceeded.parts') }}:</span>
        <span class="info-value">${{ number_format($cost_breakdown['parts'], 2) }}</span>
    </div>
    @endif
    @if(isset($cost_breakdown['external']))
    <div class="info-row">
        <span class="info-label">{{ __('emails.budget_exceeded.external') }}:</span>
        <span class="info-value">${{ number_format($cost_breakdown['external'], 2) }}</span>
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
    {{ __('emails.budget_exceeded.action') }}
</a>
@endsection
