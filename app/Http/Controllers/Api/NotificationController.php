<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\NotificationPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notification::where('user_id', $request->user()->id);

        // Filter by read status
        if ($request->has('unread_only') && $request->boolean('unread_only')) {
            $query->unread();
        }

        $notifications = $query
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($notifications);
    }

    /**
     * Get unread notification count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->unread()
            ->count();

        return response()->json([
            'unread_count' => $count,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification,
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted',
        ]);
    }

    /**
     * Get notification preferences for the authenticated user.
     */
    public function getPreferences(Request $request): JsonResponse
    {
        $preferences = NotificationPreference::where('user_id', $request->user()->id)->get();

        // If no preferences exist, return defaults
        if ($preferences->isEmpty()) {
            $defaults = [];
            foreach (NotificationPreference::getAvailableTypes() as $type) {
                $defaults[] = [
                    'notification_type' => $type,
                    'email_enabled' => true,
                    'sms_enabled' => false,
                    'push_enabled' => true,
                ];
            }
            return response()->json($defaults);
        }

        return response()->json($preferences);
    }

    /**
     * Update notification preferences for the authenticated user.
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'preferences' => 'required|array',
            'preferences.*.notification_type' => 'required|string',
            'preferences.*.email_enabled' => 'required|boolean',
            'preferences.*.sms_enabled' => 'required|boolean',
            'preferences.*.push_enabled' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        foreach ($request->preferences as $pref) {
            NotificationPreference::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'notification_type' => $pref['notification_type'],
                ],
                [
                    'email_enabled' => $pref['email_enabled'],
                    'sms_enabled' => $pref['sms_enabled'],
                    'push_enabled' => $pref['push_enabled'],
                ]
            );
        }

        return response()->json([
            'message' => 'Preferences updated successfully',
        ]);
    }
}
