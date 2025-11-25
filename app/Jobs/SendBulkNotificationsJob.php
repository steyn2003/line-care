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

class SendBulkNotificationsJob implements ShouldQueue
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
     * @param array<int> $userIds Array of user IDs to notify
     * @param string $type Notification type
     * @param array $data Notification data
     */
    public function __construct(
        public array $userIds,
        public string $type,
        public array $data
    ) {}

    /**
     * Execute the job.
     */
    public function handle(NotificationService $notificationService): void
    {
        Log::info("Processing bulk notification job", [
            'user_count' => count($this->userIds),
            'type' => $this->type,
        ]);

        $users = User::whereIn('id', $this->userIds)->get();

        $results = $notificationService->notifyMany($users->all(), $this->type, $this->data);

        $successCount = 0;
        $failureCount = 0;

        foreach ($results as $userId => $channelResults) {
            $hasSuccess = collect($channelResults)->contains('sent', true);
            if ($hasSuccess) {
                $successCount++;
            } else {
                $failureCount++;
            }
        }

        Log::info("Bulk notification job completed", [
            'type' => $this->type,
            'total_users' => count($this->userIds),
            'success_count' => $successCount,
            'failure_count' => $failureCount,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Bulk notification job failed", [
            'user_count' => count($this->userIds),
            'type' => $this->type,
            'error' => $exception->getMessage(),
        ]);
    }
}
