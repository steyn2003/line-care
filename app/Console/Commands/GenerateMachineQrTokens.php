<?php

namespace App\Console\Commands;

use App\Models\Machine;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateMachineQrTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'machines:generate-qr-tokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate QR tokens for machines that do not have one';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $count = Machine::whereNull('qr_token')->count();

        if ($count === 0) {
            $this->info('All machines already have QR tokens.');

            return Command::SUCCESS;
        }

        $this->info("Generating QR tokens for {$count} machines...");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        Machine::whereNull('qr_token')->each(function (Machine $machine) use ($bar) {
            $machine->update(['qr_token' => Str::uuid()->toString()]);
            $bar->advance();
        });

        $bar->finish();
        $this->newLine();
        $this->info('QR tokens generated successfully!');

        return Command::SUCCESS;
    }
}
