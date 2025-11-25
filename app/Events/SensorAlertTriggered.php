<?php

namespace App\Events;

use App\Models\SensorAlert;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SensorAlertTriggered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public SensorAlert $alert,
        public int $companyId
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('company.' . $this->companyId . '.alerts'),
            new PrivateChannel('machine.' . $this->alert->machine_id . '.alerts'),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->alert->id,
            'sensor_id' => $this->alert->sensor_id,
            'machine_id' => $this->alert->machine_id,
            'alert_type' => $this->alert->alert_type,
            'current_value' => $this->alert->current_value,
            'threshold_value' => $this->alert->threshold_value,
            'triggered_at' => $this->alert->triggered_at->toIso8601String(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'sensor.alert';
    }
}
