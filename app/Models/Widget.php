<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Widget extends Model
{
    use HasFactory;

    /**
     * Available widget types.
     */
    public const TYPE_METRIC_CARD = 'metric_card';
    public const TYPE_LINE_CHART = 'line_chart';
    public const TYPE_BAR_CHART = 'bar_chart';
    public const TYPE_PIE_CHART = 'pie_chart';
    public const TYPE_GAUGE = 'gauge';
    public const TYPE_TABLE = 'table';
    public const TYPE_LIST = 'list';

    /**
     * Available data sources.
     */
    public const SOURCE_WORK_ORDERS = 'work_orders';
    public const SOURCE_MACHINES = 'machines';
    public const SOURCE_SPARE_PARTS = 'spare_parts';
    public const SOURCE_OEE = 'oee';
    public const SOURCE_COSTS = 'costs';
    public const SOURCE_DOWNTIME = 'downtime';
    public const SOURCE_MTBF_MTTR = 'mtbf_mttr';
    public const SOURCE_PREDICTIONS = 'predictions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'dashboard_id',
        'widget_type',
        'title',
        'data_source',
        'config',
        'position_x',
        'position_y',
        'size_width',
        'size_height',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'config' => 'array',
        'position_x' => 'integer',
        'position_y' => 'integer',
        'size_width' => 'integer',
        'size_height' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * Get the dashboard that owns the widget.
     */
    public function dashboard(): BelongsTo
    {
        return $this->belongsTo(Dashboard::class);
    }

    /**
     * Get available widget types.
     */
    public static function getWidgetTypes(): array
    {
        return [
            self::TYPE_METRIC_CARD => 'Metric Card',
            self::TYPE_LINE_CHART => 'Line Chart',
            self::TYPE_BAR_CHART => 'Bar Chart',
            self::TYPE_PIE_CHART => 'Pie Chart',
            self::TYPE_GAUGE => 'Gauge',
            self::TYPE_TABLE => 'Table',
            self::TYPE_LIST => 'List',
        ];
    }

    /**
     * Get available data sources.
     */
    public static function getDataSources(): array
    {
        return [
            self::SOURCE_WORK_ORDERS => 'Work Orders',
            self::SOURCE_MACHINES => 'Machines',
            self::SOURCE_SPARE_PARTS => 'Spare Parts',
            self::SOURCE_OEE => 'OEE Metrics',
            self::SOURCE_COSTS => 'Costs',
            self::SOURCE_DOWNTIME => 'Downtime',
            self::SOURCE_MTBF_MTTR => 'MTBF/MTTR',
            self::SOURCE_PREDICTIONS => 'Predictions',
        ];
    }

    /**
     * Get config value with default.
     */
    public function getConfig(string $key, $default = null)
    {
        return $this->config[$key] ?? $default;
    }

    /**
     * Set config value.
     */
    public function setConfig(string $key, $value): void
    {
        $config = $this->config ?? [];
        $config[$key] = $value;
        $this->config = $config;
    }

    /**
     * Check if widget is a chart type.
     */
    public function isChart(): bool
    {
        return in_array($this->widget_type, [
            self::TYPE_LINE_CHART,
            self::TYPE_BAR_CHART,
            self::TYPE_PIE_CHART,
        ]);
    }

    /**
     * Get the grid position as CSS style.
     */
    public function getGridStyle(): string
    {
        return sprintf(
            'grid-column: span %d; grid-row: span %d;',
            $this->size_width,
            $this->size_height
        );
    }
}
