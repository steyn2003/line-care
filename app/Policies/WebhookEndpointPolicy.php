<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WebhookEndpoint;

class WebhookEndpointPolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->canActAsManager();
    }

    public function view(User $user, WebhookEndpoint $webhook): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->company_id !== $webhook->company_id) {
            return false;
        }

        return $user->canActAsManager();
    }

    public function create(User $user): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->canActAsManager();
    }

    public function update(User $user, WebhookEndpoint $webhook): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->company_id !== $webhook->company_id) {
            return false;
        }

        return $user->canActAsManager();
    }

    public function delete(User $user, WebhookEndpoint $webhook): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->company_id !== $webhook->company_id) {
            return false;
        }

        return $user->canActAsManager();
    }
}
