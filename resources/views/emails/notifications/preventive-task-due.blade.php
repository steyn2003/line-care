@extends('emails.layout')

@section('title', 'Preventive Maintenance Due')

@section('content')
<h2>🔧 Preventive Maintenance Due</h2>

<p>Hello {{ $user_name ?? 'there' }},</p>

<p>A scheduled preventive maintenance task is due soon:</p>

<div class="notification-card warning">
    <div class="info-row">
        <span class="info-label">Task:</span>
        <span class="info-value"><strong>{{ $task_title ?? 'Untitled Task' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">Machine:</span>
        <span class="info-value">{{ $machine_name ?? 'N/A' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Due Date:</span>
        <span class="info-value">{{ $due_date ?? 'N/A' }}</span>
    </div>
    @if(isset($frequency))
    <div class="info-row">
        <span class="info-label">Frequency:</span>
        <span class="info-value">{{ ucfirst($frequency) }}</span>
    </div>
    @endif
    @if(isset($estimated_duration))
    <div class="info-row">
        <span class="info-label">Est. Duration:</span>
        <span class="info-value">{{ $estimated_duration }} hours</span>
    </div>
    @endif
</div>

@if(isset($instructions))
<p><strong>Instructions:</strong></p>
<p>{{ $instructions }}</p>
@endif

@if(isset($required_parts) && count($required_parts) > 0)
<p><strong>Required Parts:</strong></p>
<ul>
    @foreach($required_parts as $part)
        <li>{{ $part }}</li>
    @endforeach
</ul>
@endif

<a href="{{ config('app.url') }}/preventive-tasks/{{ $task_id ?? '' }}" class="button">
    View Task Details
</a>

<p>Please schedule and complete this preventive maintenance task to ensure optimal machine performance.</p>
@endsection
