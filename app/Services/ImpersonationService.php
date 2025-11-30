<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class ImpersonationService
{
    /**
     * Session keys for impersonation.
     */
    protected const IMPERSONATOR_ID_KEY = 'impersonator_id';
    protected const IMPERSONATED_USER_ID_KEY = 'impersonated_user_id';

    /**
     * Start impersonating a user.
     *
     * @param User $impersonator The superadmin user starting impersonation
     * @param User $targetUser The user to impersonate
     * @return void
     * @throws \InvalidArgumentException If impersonator is not a superadmin
     * @throws \InvalidArgumentException If trying to impersonate a superadmin
     */
    public function start(User $impersonator, User $targetUser): void
    {
        // Verify the impersonator is a superadmin
        if (!$impersonator->isSuperAdmin()) {
            throw new \InvalidArgumentException('Only superadmins can impersonate users.');
        }

        // Prevent impersonating other superadmins
        if ($targetUser->isSuperAdmin()) {
            throw new \InvalidArgumentException('Cannot impersonate another superadmin.');
        }

        // Prevent nested impersonation
        if ($this->isImpersonating()) {
            throw new \InvalidArgumentException('Already impersonating a user. Stop current impersonation first.');
        }

        // Store impersonation data in session
        Session::put(self::IMPERSONATOR_ID_KEY, $impersonator->id);
        Session::put(self::IMPERSONATED_USER_ID_KEY, $targetUser->id);

        // Log in as the target user
        Auth::login($targetUser);
    }

    /**
     * Stop impersonating and return to the original superadmin account.
     *
     * @return void
     * @throws \RuntimeException If not currently impersonating
     */
    public function stop(): void
    {
        if (!$this->isImpersonating()) {
            throw new \RuntimeException('Not currently impersonating anyone.');
        }

        $impersonatorId = Session::get(self::IMPERSONATOR_ID_KEY);

        // Clear impersonation session data
        Session::forget([self::IMPERSONATOR_ID_KEY, self::IMPERSONATED_USER_ID_KEY]);

        // Log back in as the superadmin
        Auth::loginUsingId($impersonatorId);
    }

    /**
     * Check if currently impersonating a user.
     *
     * @return bool
     */
    public function isImpersonating(): bool
    {
        return Session::has(self::IMPERSONATOR_ID_KEY);
    }

    /**
     * Get the impersonator (superadmin) user.
     *
     * @return User|null
     */
    public function getImpersonator(): ?User
    {
        if (!$this->isImpersonating()) {
            return null;
        }

        $impersonatorId = Session::get(self::IMPERSONATOR_ID_KEY);
        return User::find($impersonatorId);
    }

    /**
     * Get the impersonated user.
     *
     * @return User|null
     */
    public function getImpersonatedUser(): ?User
    {
        if (!$this->isImpersonating()) {
            return null;
        }

        $impersonatedUserId = Session::get(self::IMPERSONATED_USER_ID_KEY);
        return User::find($impersonatedUserId);
    }

    /**
     * Get impersonation data for sharing with the frontend.
     *
     * @return array|null
     */
    public function getImpersonationData(): ?array
    {
        if (!$this->isImpersonating()) {
            return null;
        }

        $impersonator = $this->getImpersonator();
        $impersonatedUser = $this->getImpersonatedUser();

        if (!$impersonator || !$impersonatedUser) {
            return null;
        }

        return [
            'is_impersonating' => true,
            'impersonator' => [
                'id' => $impersonator->id,
                'name' => $impersonator->name,
                'email' => $impersonator->email,
            ],
            'impersonated_user' => [
                'id' => $impersonatedUser->id,
                'name' => $impersonatedUser->name,
                'email' => $impersonatedUser->email,
                'company' => $impersonatedUser->company ? [
                    'id' => $impersonatedUser->company->id,
                    'name' => $impersonatedUser->company->name,
                ] : null,
            ],
        ];
    }
}
