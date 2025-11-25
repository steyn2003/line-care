@extends('emails.layout')

@section('title', __('emails.preventive_task_due.title'))

@section('content')
<h2>🔧 {{ __('emails.preventive_task_due.title') }}</h2>

<p>{{ $user_name ? __('emails.common.greeting', ['name' => $user_name]) : __('emails.common.greeting_default') }}</p>

<p>{{ __('emails.preventive_task_due.intro') }}</p>

<div class="notification-card warning">
    <div class="info-row">
        <span class="info-label">{{ __('emails.preventive_task_due.task_name') }}:</span>
        <span class="info-value"><strong>{{ $task_title ?? 'Untitled Task' }}</strong></span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.preventive_task_due.machine') }}:</span>
        <span class="info-value">{{ $machine_name ?? 'N/A' }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">{{ __('emails.preventive_task_due.due_date') }}:</span>
        <span class="info-value">{{ $due_date ?? 'N/A' }}</span>
    </div>
    @if(isset($frequency))
    <div class="info-row">
        <span class="info-label">{{ __('emails.preventive_task_due.frequency') }}:</span>
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
<p><strong>{{ __('emails.preventive_task_due.instructions') }}:</strong></p>
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
    {{ __('emails.preventive_task_due.action') }}
</a>
@endsection
