<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Email Translation Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used in email notifications.
    |
    */

    'common' => [
        'greeting' => 'Hello :name,',
        'greeting_default' => 'Hello,',
        'regards' => 'Regards,',
        'team' => 'The :app Team',
        'view_button' => 'View Details',
        'footer' => 'This email was sent from :app. If you did not expect this email, please ignore it.',
        'auto_generated' => 'This is an automated message. Please do not reply directly to this email.',
    ],

    'work_order_assigned' => [
        'subject' => 'Work Order Assigned: :title',
        'title' => 'New Work Order Assigned',
        'intro' => 'A new work order has been assigned to you.',
        'details' => 'Work Order Details',
        'work_order_number' => 'Work Order #:number',
        'machine' => 'Machine',
        'location' => 'Location',
        'priority' => 'Priority',
        'type' => 'Type',
        'due_date' => 'Due Date',
        'description' => 'Description',
        'action' => 'View Work Order',
    ],

    'work_order_overdue' => [
        'subject' => 'Work Order Overdue: :title',
        'title' => 'Work Order is Overdue',
        'intro' => 'The following work order is now overdue and requires immediate attention.',
        'was_due' => 'Was due on',
        'days_overdue' => ':count day overdue|:count days overdue',
        'action' => 'View Work Order',
    ],

    'preventive_task_due' => [
        'subject' => 'Preventive Task Due Soon: :title',
        'title' => 'Preventive Maintenance Task Due',
        'intro' => 'A preventive maintenance task is due soon.',
        'task_name' => 'Task',
        'machine' => 'Machine',
        'due_date' => 'Due Date',
        'frequency' => 'Frequency',
        'instructions' => 'Instructions',
        'action' => 'View Task',
    ],

    'part_low_stock' => [
        'subject' => 'Low Stock Alert: :part_name',
        'title' => 'Spare Part Low Stock Alert',
        'intro' => 'The following spare part is running low on stock.',
        'part_name' => 'Part Name',
        'part_number' => 'Part Number',
        'current_stock' => 'Current Stock',
        'reorder_point' => 'Reorder Point',
        'reorder_quantity' => 'Recommended Order Quantity',
        'location' => 'Location',
        'action' => 'View Inventory',
        'create_po' => 'Create Purchase Order',
    ],

    'sensor_alert' => [
        'subject' => 'Sensor Alert: :sensor_name on :machine_name',
        'title' => 'Sensor Alert Triggered',
        'intro' => 'A sensor has exceeded its threshold and requires attention.',
        'sensor' => 'Sensor',
        'machine' => 'Machine',
        'reading' => 'Current Reading',
        'threshold' => 'Threshold',
        'alert_type' => 'Alert Type',
        'warning' => 'Warning',
        'critical' => 'Critical',
        'timestamp' => 'Detected at',
        'action' => 'View Sensor Details',
        'auto_work_order' => 'A work order has been automatically created for this alert.',
    ],

    'budget_exceeded' => [
        'subject' => 'Budget Alert: :period Budget Exceeded',
        'title' => 'Maintenance Budget Exceeded',
        'intro' => 'The maintenance budget for :period has been exceeded.',
        'period' => 'Period',
        'budgeted' => 'Budgeted Amount',
        'actual' => 'Actual Spent',
        'variance' => 'Over Budget',
        'percentage' => 'Utilization',
        'breakdown' => 'Cost Breakdown',
        'labor' => 'Labor Costs',
        'parts' => 'Parts Costs',
        'external' => 'External Services',
        'action' => 'View Cost Dashboard',
    ],

    'production_run_complete' => [
        'subject' => 'Production Run Complete: :product on :machine',
        'title' => 'Production Run Completed',
        'intro' => 'A production run has been completed.',
        'machine' => 'Machine',
        'product' => 'Product',
        'shift' => 'Shift',
        'duration' => 'Duration',
        'output' => 'Output',
        'target' => 'Target',
        'actual' => 'Actual',
        'good_units' => 'Good Units',
        'defects' => 'Defects',
        'oee_metrics' => 'OEE Metrics',
        'availability' => 'Availability',
        'performance' => 'Performance',
        'quality' => 'Quality',
        'oee' => 'OEE Score',
        'action' => 'View Production Details',
    ],

    'vendor' => [
        'new_purchase_order' => [
            'subject' => 'New Purchase Order #:number from :company',
            'title' => 'New Purchase Order',
            'intro' => 'You have received a new purchase order from :company.',
            'order_number' => 'Order Number',
            'company' => 'Company',
            'items' => 'Order Items',
            'part_number' => 'Part Number',
            'quantity' => 'Quantity',
            'unit_price' => 'Unit Price',
            'total' => 'Total',
            'expected_delivery' => 'Expected Delivery',
            'shipping_address' => 'Shipping Address',
            'notes' => 'Notes',
            'action' => 'View Order in Vendor Portal',
        ],
        'purchase_order_updated' => [
            'subject' => 'Purchase Order #:number Updated',
            'title' => 'Purchase Order Updated',
            'intro' => 'A purchase order has been updated.',
            'status' => 'New Status',
            'action' => 'View Order',
        ],
    ],

];
