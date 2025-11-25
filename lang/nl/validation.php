<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validatie Taalregels
    |--------------------------------------------------------------------------
    |
    | De volgende taalregels bevatten de standaard foutmeldingen die worden
    | gebruikt door de validator klasse. Sommige regels hebben meerdere versies
    | zoals de grootte regels. Voel je vrij om deze berichten aan te passen.
    |
    */

    'accepted' => ':Attribute moet worden geaccepteerd.',
    'accepted_if' => ':Attribute moet worden geaccepteerd wanneer :other :value is.',
    'active_url' => ':Attribute moet een geldige URL zijn.',
    'after' => ':Attribute moet een datum zijn na :date.',
    'after_or_equal' => ':Attribute moet een datum zijn na of gelijk aan :date.',
    'alpha' => ':Attribute mag alleen letters bevatten.',
    'alpha_dash' => ':Attribute mag alleen letters, cijfers, streepjes en underscores bevatten.',
    'alpha_num' => ':Attribute mag alleen letters en cijfers bevatten.',
    'any_of' => ':Attribute is ongeldig.',
    'array' => ':Attribute moet een array zijn.',
    'ascii' => ':Attribute mag alleen single-byte alfanumerieke tekens en symbolen bevatten.',
    'before' => ':Attribute moet een datum zijn voor :date.',
    'before_or_equal' => ':Attribute moet een datum zijn voor of gelijk aan :date.',
    'between' => [
        'array' => ':Attribute moet tussen :min en :max items bevatten.',
        'file' => ':Attribute moet tussen :min en :max kilobytes zijn.',
        'numeric' => ':Attribute moet tussen :min en :max zijn.',
        'string' => ':Attribute moet tussen :min en :max tekens zijn.',
    ],
    'boolean' => ':Attribute moet waar of onwaar zijn.',
    'can' => ':Attribute bevat een niet-geautoriseerde waarde.',
    'confirmed' => ':Attribute bevestiging komt niet overeen.',
    'contains' => ':Attribute mist een vereiste waarde.',
    'current_password' => 'Het wachtwoord is onjuist.',
    'date' => ':Attribute moet een geldige datum zijn.',
    'date_equals' => ':Attribute moet een datum gelijk aan :date zijn.',
    'date_format' => ':Attribute moet overeenkomen met het formaat :format.',
    'decimal' => ':Attribute moet :decimal decimalen hebben.',
    'declined' => ':Attribute moet worden afgewezen.',
    'declined_if' => ':Attribute moet worden afgewezen wanneer :other :value is.',
    'different' => ':Attribute en :other moeten verschillend zijn.',
    'digits' => ':Attribute moet :digits cijfers zijn.',
    'digits_between' => ':Attribute moet tussen :min en :max cijfers zijn.',
    'dimensions' => ':Attribute heeft ongeldige afbeeldingsafmetingen.',
    'distinct' => ':Attribute heeft een dubbele waarde.',
    'doesnt_contain' => ':Attribute mag het volgende niet bevatten: :values.',
    'doesnt_end_with' => ':Attribute mag niet eindigen met: :values.',
    'doesnt_start_with' => ':Attribute mag niet beginnen met: :values.',
    'email' => ':Attribute moet een geldig e-mailadres zijn.',
    'ends_with' => ':Attribute moet eindigen met: :values.',
    'enum' => 'De geselecteerde :attribute is ongeldig.',
    'exists' => 'De geselecteerde :attribute is ongeldig.',
    'extensions' => ':Attribute moet een van de volgende extensies hebben: :values.',
    'file' => ':Attribute moet een bestand zijn.',
    'filled' => ':Attribute moet een waarde hebben.',
    'gt' => [
        'array' => ':Attribute moet meer dan :value items bevatten.',
        'file' => ':Attribute moet groter zijn dan :value kilobytes.',
        'numeric' => ':Attribute moet groter zijn dan :value.',
        'string' => ':Attribute moet meer dan :value tekens bevatten.',
    ],
    'gte' => [
        'array' => ':Attribute moet :value items of meer bevatten.',
        'file' => ':Attribute moet groter dan of gelijk zijn aan :value kilobytes.',
        'numeric' => ':Attribute moet groter dan of gelijk zijn aan :value.',
        'string' => ':Attribute moet :value tekens of meer bevatten.',
    ],
    'hex_color' => ':Attribute moet een geldige hexadecimale kleur zijn.',
    'image' => ':Attribute moet een afbeelding zijn.',
    'in' => 'De geselecteerde :attribute is ongeldig.',
    'in_array' => ':Attribute moet bestaan in :other.',
    'in_array_keys' => ':Attribute moet ten minste een van de volgende sleutels bevatten: :values.',
    'integer' => ':Attribute moet een geheel getal zijn.',
    'ip' => ':Attribute moet een geldig IP-adres zijn.',
    'ipv4' => ':Attribute moet een geldig IPv4-adres zijn.',
    'ipv6' => ':Attribute moet een geldig IPv6-adres zijn.',
    'json' => ':Attribute moet een geldige JSON-string zijn.',
    'list' => ':Attribute moet een lijst zijn.',
    'lowercase' => ':Attribute moet kleine letters zijn.',
    'lt' => [
        'array' => ':Attribute moet minder dan :value items bevatten.',
        'file' => ':Attribute moet kleiner zijn dan :value kilobytes.',
        'numeric' => ':Attribute moet kleiner zijn dan :value.',
        'string' => ':Attribute moet minder dan :value tekens bevatten.',
    ],
    'lte' => [
        'array' => ':Attribute mag niet meer dan :value items bevatten.',
        'file' => ':Attribute moet kleiner dan of gelijk zijn aan :value kilobytes.',
        'numeric' => ':Attribute moet kleiner dan of gelijk zijn aan :value.',
        'string' => ':Attribute mag niet meer dan :value tekens bevatten.',
    ],
    'mac_address' => ':Attribute moet een geldig MAC-adres zijn.',
    'max' => [
        'array' => ':Attribute mag niet meer dan :max items bevatten.',
        'file' => ':Attribute mag niet groter zijn dan :max kilobytes.',
        'numeric' => ':Attribute mag niet groter zijn dan :max.',
        'string' => ':Attribute mag niet meer dan :max tekens bevatten.',
    ],
    'max_digits' => ':Attribute mag niet meer dan :max cijfers bevatten.',
    'mimes' => ':Attribute moet een bestand zijn van het type: :values.',
    'mimetypes' => ':Attribute moet een bestand zijn van het type: :values.',
    'min' => [
        'array' => ':Attribute moet ten minste :min items bevatten.',
        'file' => ':Attribute moet ten minste :min kilobytes zijn.',
        'numeric' => ':Attribute moet ten minste :min zijn.',
        'string' => ':Attribute moet ten minste :min tekens bevatten.',
    ],
    'min_digits' => ':Attribute moet ten minste :min cijfers bevatten.',
    'missing' => ':Attribute moet ontbreken.',
    'missing_if' => ':Attribute moet ontbreken wanneer :other :value is.',
    'missing_unless' => ':Attribute moet ontbreken tenzij :other :value is.',
    'missing_with' => ':Attribute moet ontbreken wanneer :values aanwezig is.',
    'missing_with_all' => ':Attribute moet ontbreken wanneer :values aanwezig zijn.',
    'multiple_of' => ':Attribute moet een veelvoud van :value zijn.',
    'not_in' => 'De geselecteerde :attribute is ongeldig.',
    'not_regex' => ':Attribute formaat is ongeldig.',
    'numeric' => ':Attribute moet een nummer zijn.',
    'password' => [
        'letters' => ':Attribute moet ten minste één letter bevatten.',
        'mixed' => ':Attribute moet ten minste één hoofdletter en één kleine letter bevatten.',
        'numbers' => ':Attribute moet ten minste één cijfer bevatten.',
        'symbols' => ':Attribute moet ten minste één symbool bevatten.',
        'uncompromised' => ':Attribute is gevonden in een datalek. Kies een andere :attribute.',
    ],
    'present' => ':Attribute moet aanwezig zijn.',
    'present_if' => ':Attribute moet aanwezig zijn wanneer :other :value is.',
    'present_unless' => ':Attribute moet aanwezig zijn tenzij :other :value is.',
    'present_with' => ':Attribute moet aanwezig zijn wanneer :values aanwezig is.',
    'present_with_all' => ':Attribute moet aanwezig zijn wanneer :values aanwezig zijn.',
    'prohibited' => ':Attribute is niet toegestaan.',
    'prohibited_if' => ':Attribute is niet toegestaan wanneer :other :value is.',
    'prohibited_if_accepted' => ':Attribute is niet toegestaan wanneer :other is geaccepteerd.',
    'prohibited_if_declined' => ':Attribute is niet toegestaan wanneer :other is afgewezen.',
    'prohibited_unless' => ':Attribute is niet toegestaan tenzij :other in :values is.',
    'prohibits' => ':Attribute staat niet toe dat :other aanwezig is.',
    'regex' => ':Attribute formaat is ongeldig.',
    'required' => ':Attribute is verplicht.',
    'required_array_keys' => ':Attribute moet items bevatten voor: :values.',
    'required_if' => ':Attribute is verplicht wanneer :other :value is.',
    'required_if_accepted' => ':Attribute is verplicht wanneer :other is geaccepteerd.',
    'required_if_declined' => ':Attribute is verplicht wanneer :other is afgewezen.',
    'required_unless' => ':Attribute is verplicht tenzij :other in :values is.',
    'required_with' => ':Attribute is verplicht wanneer :values aanwezig is.',
    'required_with_all' => ':Attribute is verplicht wanneer :values aanwezig zijn.',
    'required_without' => ':Attribute is verplicht wanneer :values niet aanwezig is.',
    'required_without_all' => ':Attribute is verplicht wanneer geen van :values aanwezig zijn.',
    'same' => ':Attribute moet overeenkomen met :other.',
    'size' => [
        'array' => ':Attribute moet :size items bevatten.',
        'file' => ':Attribute moet :size kilobytes zijn.',
        'numeric' => ':Attribute moet :size zijn.',
        'string' => ':Attribute moet :size tekens zijn.',
    ],
    'starts_with' => ':Attribute moet beginnen met: :values.',
    'string' => ':Attribute moet een tekenreeks zijn.',
    'timezone' => ':Attribute moet een geldige tijdzone zijn.',
    'unique' => ':Attribute is al in gebruik.',
    'uploaded' => ':Attribute kon niet worden geüpload.',
    'uppercase' => ':Attribute moet hoofdletters zijn.',
    'url' => ':Attribute moet een geldige URL zijn.',
    'ulid' => ':Attribute moet een geldige ULID zijn.',
    'uuid' => ':Attribute moet een geldige UUID zijn.',

    /*
    |--------------------------------------------------------------------------
    | Aangepaste Validatie Taalregels
    |--------------------------------------------------------------------------
    |
    | Hier kunt u aangepaste validatieberichten opgeven voor attributen met
    | de conventie "attribuut.regel" om de regels te benoemen. Dit maakt het
    | snel om een specifieke taalregel voor een gegeven attribuutregel op te geven.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'aangepast-bericht',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Aangepaste Validatie Attributen
    |--------------------------------------------------------------------------
    |
    | De volgende taalregels worden gebruikt om onze attribuut placeholder te
    | vervangen door iets leesbaardervriendelijks zoals "E-mailadres" in
    | plaats van "email". Dit helpt om onze berichten expressiever te maken.
    |
    */

    'attributes' => [
        'name' => 'naam',
        'email' => 'e-mailadres',
        'password' => 'wachtwoord',
        'password_confirmation' => 'wachtwoord bevestiging',
        'phone' => 'telefoonnummer',
        'address' => 'adres',
        'city' => 'stad',
        'country' => 'land',
        'description' => 'beschrijving',
        'title' => 'titel',
        'machine_id' => 'machine',
        'location_id' => 'locatie',
        'assigned_to' => 'toegewezen aan',
        'priority' => 'prioriteit',
        'status' => 'status',
        'due_date' => 'vervaldatum',
        'start_date' => 'startdatum',
        'end_date' => 'einddatum',
        'quantity' => 'hoeveelheid',
        'unit_cost' => 'eenheidsprijs',
        'supplier_id' => 'leverancier',
        'reorder_point' => 'bestelpunt',
        'reorder_quantity' => 'bestelhoeveelheid',
    ],

];
