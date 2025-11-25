<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user,
        public string $type,
        public array $data
    ) {}

    /**
     * Execute the job.
     */
    public function handle(NotificationService $notificationService): void
    {
        Log::info("Processing notification job", [
            'user_id' => $this->user->id,
            'type' => $this->type,
        ]);

        $results = $notificationService->notify($this->user, $this->type, $this->data);

        Log::info("Notification job completed", [
            'user_id' => $this->user->id,
            'type' => $this->type,
            'results' => $results,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Notification job failed", [
            'user_id' => $this->user->id,
            'type' => $this->type,
            'error' => $exception->getMessage(),
        ]);
    }
}
