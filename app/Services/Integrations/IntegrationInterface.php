<?php

namespace App\Services\Integrations;

use App\Models\Integration;

interface IntegrationInterface
{
    /**
     * Test the connection to the integration.
     *
     * @return array{success: bool, message: string}
     */
    public function testConnection(): array;

    /**
     * Sync data with the integration.
     *
     * @param string $action The sync action to perform
     * @return array{success: bool, message: string, records_processed: int, records_succeeded: int, records_failed: int}
     */
    public function sync(string $action): array;

    /**
     * Get the integration model.
     */
    public function getIntegration(): Integration;

    /**
     * Validate the integration configuration.
     *
     * @return array{valid: bool, errors: array<string>}
     */
    public function validateConfig(): array;
}
