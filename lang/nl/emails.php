<?php

return [

    /*
    |--------------------------------------------------------------------------
    | E-mail Vertalingen
    |--------------------------------------------------------------------------
    |
    | De volgende taalregels worden gebruikt in e-mailmeldingen.
    |
    */

    'common' => [
        'greeting' => 'Hallo :name,',
        'greeting_default' => 'Hallo,',
        'regards' => 'Met vriendelijke groet,',
        'team' => 'Het :app Team',
        'view_button' => 'Details bekijken',
        'footer' => 'Deze e-mail is verzonden vanuit :app. Als u deze e-mail niet verwachtte, kunt u deze negeren.',
        'auto_generated' => 'Dit is een automatisch bericht. Gelieve niet rechtstreeks op deze e-mail te antwoorden.',
    ],

    'work_order_assigned' => [
        'subject' => 'Werkorder toegewezen: :title',
        'title' => 'Nieuwe werkorder toegewezen',
        'intro' => 'Er is een nieuwe werkorder aan u toegewezen.',
        'details' => 'Werkorder details',
        'work_order_number' => 'Werkorder #:number',
        'machine' => 'Machine',
        'location' => 'Locatie',
        'priority' => 'Prioriteit',
        'type' => 'Type',
        'due_date' => 'Vervaldatum',
        'description' => 'Beschrijving',
        'action' => 'Werkorder bekijken',
    ],

    'work_order_overdue' => [
        'subject' => 'Werkorder achterstallig: :title',
        'title' => 'Werkorder is achterstallig',
        'intro' => 'De volgende werkorder is achterstallig en vereist onmiddellijke aandacht.',
        'was_due' => 'Was gepland op',
        'days_overdue' => ':count dag achterstallig|:count dagen achterstallig',
        'action' => 'Werkorder bekijken',
    ],

    'preventive_task_due' => [
        'subject' => 'Preventieve taak binnenkort: :title',
        'title' => 'Preventieve onderhoudstaak gepland',
        'intro' => 'Er is een preventieve onderhoudstaak die binnenkort moet worden uitgevoerd.',
        'task_name' => 'Taak',
        'machine' => 'Machine',
        'due_date' => 'Vervaldatum',
        'frequency' => 'Frequentie',
        'instructions' => 'Instructies',
        'action' => 'Taak bekijken',
    ],

    'part_low_stock' => [
        'subject' => 'Lage voorraad: :part_name',
        'title' => 'Reserveonderdeel lage voorraad waarschuwing',
        'intro' => 'Het volgende reserveonderdeel heeft een lage voorraad.',
        'part_name' => 'Onderdeelnaam',
        'part_number' => 'Onderdeelnummer',
        'current_stock' => 'Huidige voorraad',
        'reorder_point' => 'Bestelpunt',
        'reorder_quantity' => 'Aanbevolen bestelhoeveelheid',
        'location' => 'Locatie',
        'action' => 'Voorraad bekijken',
        'create_po' => 'Inkooporder aanmaken',
    ],

    'sensor_alert' => [
        'subject' => 'Sensorwaarschuwing: :sensor_name op :machine_name',
        'title' => 'Sensorwaarschuwing geactiveerd',
        'intro' => 'Een sensor heeft de drempelwaarde overschreden en vereist aandacht.',
        'sensor' => 'Sensor',
        'machine' => 'Machine',
        'reading' => 'Huidige waarde',
        'threshold' => 'Drempelwaarde',
        'alert_type' => 'Waarschuwingstype',
        'warning' => 'Waarschuwing',
        'critical' => 'Kritiek',
        'timestamp' => 'Gedetecteerd om',
        'action' => 'Sensordetails bekijken',
        'auto_work_order' => 'Er is automatisch een werkorder aangemaakt voor deze waarschuwing.',
    ],

    'budget_exceeded' => [
        'subject' => 'Budgetwaarschuwing: :period budget overschreden',
        'title' => 'Onderhoudsbudget overschreden',
        'intro' => 'Het onderhoudsbudget voor :period is overschreden.',
        'period' => 'Periode',
        'budgeted' => 'Begroot bedrag',
        'actual' => 'Werkelijk besteed',
        'variance' => 'Over budget',
        'percentage' => 'Benutting',
        'breakdown' => 'Kostenoverzicht',
        'labor' => 'Arbeidskosten',
        'parts' => 'Onderdelenkosten',
        'external' => 'Externe services',
        'action' => 'Kosten dashboard bekijken',
    ],

    'production_run_complete' => [
        'subject' => 'Productierun voltooid: :product op :machine',
        'title' => 'Productierun voltooid',
        'intro' => 'Een productierun is voltooid.',
        'machine' => 'Machine',
        'product' => 'Product',
        'shift' => 'Ploeg',
        'duration' => 'Duur',
        'output' => 'Output',
        'target' => 'Doel',
        'actual' => 'Werkelijk',
        'good_units' => 'Goede eenheden',
        'defects' => 'Defecten',
        'oee_metrics' => 'OEE Metrics',
        'availability' => 'Beschikbaarheid',
        'performance' => 'Prestatie',
        'quality' => 'Kwaliteit',
        'oee' => 'OEE Score',
        'action' => 'Productiedetails bekijken',
    ],

    'vendor' => [
        'new_purchase_order' => [
            'subject' => 'Nieuwe inkooporder #:number van :company',
            'title' => 'Nieuwe inkooporder',
            'intro' => 'U heeft een nieuwe inkooporder ontvangen van :company.',
            'order_number' => 'Ordernummer',
            'company' => 'Bedrijf',
            'items' => 'Orderitems',
            'part_number' => 'Onderdeelnummer',
            'quantity' => 'Hoeveelheid',
            'unit_price' => 'Eenheidsprijs',
            'total' => 'Totaal',
            'expected_delivery' => 'Verwachte levering',
            'shipping_address' => 'Verzendadres',
            'notes' => 'Notities',
            'action' => 'Order bekijken in leveranciersportaal',
        ],
        'purchase_order_updated' => [
            'subject' => 'Inkooporder #:number bijgewerkt',
            'title' => 'Inkooporder bijgewerkt',
            'intro' => 'Een inkooporder is bijgewerkt.',
            'status' => 'Nieuwe status',
            'action' => 'Order bekijken',
        ],
    ],

];
