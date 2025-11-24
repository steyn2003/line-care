@extends('emails.layout')

@section('title', 'LineCare Notification')

@section('content')
<h2>{{ $title ?? 'Notification' }}</h2>

<p>Hello {{ $user_name ?? 'there' }},</p>

@if(isset($message))
<p>{{ $message }}</p>
@endif

<div class="notification-card">
    @if(isset($data) && is_array($data))
        @foreach($data as $key => $value)
            @if(!in_array($key, ['title', 'message', 'user_name']))
                <div class="info-row">
                    <span class="info-label">{{ ucwords(str_replace('_', ' ', $key)) }}:</span>
                    <span class="info-value">{{ is_array($value) ? json_encode($value) : $value }}</span>
                </div>
            @endif
        @endforeach
    @endif
</div>

@if(isset($action_url))
<a href="{{ $action_url }}" class="button">
    {{ $action_text ?? 'View Details' }}
</a>
@endif

<p>Thank you for using LineCare.</p>
@endsection
