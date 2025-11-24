<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NotificationCenterController extends Controller
{
    /**
     * Display all notifications for the authenticated user
     */
    public function index(Request $request): Response
    {
        $query = DB::table('notifications')
            ->where('user_id', $request->user()->id);

        // Filter by read status
        if ($request->has('status')) {
            if ($request->status === 'unread') {
                $query->whereNull('read_at');
            } elseif ($request->status === 'read') {
                $query->whereNotNull('read_at');
            }
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $notifications = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Decode JSON data for each notification
        $notifications->getCollection()->transform(function ($notification) {
            $notification->data = json_decode($notification->data, true);
            return $notification;
        });

        $unreadCount = DB::table('notifications')
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
            'filters' => $request->only(['status', 'type']),
            'notificationTypes' => $this->getNotificationTypes(),
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(Request $request, string $notificationId)
    {
        DB::table('notifications')
            ->where('id', $notificationId)
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        DB::table('notifications')
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back()->with('success', 'All notifications marked as read');
    }

    /**
     * Delete a notification
     */
    public function destroy(Request $request, string $notificationId)
    {
        DB::table('notifications')
            ->where('id', $notificationId)
            ->where('user_id', $request->user()->id)
            ->delete();

        return back()->with('success', 'Notification deleted');
    }

    /**
     * Get available notification types
     */
    protected function getNotificationTypes(): array
    {
        return [
            ['value' => 'work_order_assigned', 'label' => 'Work Order Assigned'],
            ['value' => 'work_order_overdue', 'label' => 'Work Order Overdue'],
            ['value' => 'preventive_task_due', 'label' => 'Preventive Task Due'],
            ['value' => 'part_low_stock', 'label' => 'Low Stock Alert'],
            ['value' => 'sensor_alert', 'label' => 'Sensor Alert'],
            ['value' => 'budget_exceeded', 'label' => 'Budget Exceeded'],
            ['value' => 'production_run_complete', 'label' => 'Production Complete'],
        ];
    }
}
