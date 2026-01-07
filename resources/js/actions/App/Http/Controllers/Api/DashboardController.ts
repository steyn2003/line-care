import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DashboardController::metrics
 * @see app/Http/Controllers/Api/DashboardController.php:20
 * @route '/api/dashboard/metrics'
 */
export const metrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metrics.url(options),
    method: 'get',
})

metrics.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/metrics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::metrics
 * @see app/Http/Controllers/Api/DashboardController.php:20
 * @route '/api/dashboard/metrics'
 */
metrics.url = (options?: RouteQueryOptions) => {
    return metrics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::metrics
 * @see app/Http/Controllers/Api/DashboardController.php:20
 * @route '/api/dashboard/metrics'
 */
metrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metrics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DashboardController::metrics
 * @see app/Http/Controllers/Api/DashboardController.php:20
 * @route '/api/dashboard/metrics'
 */
metrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metrics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DashboardController::metrics
 * @see app/Http/Controllers/Api/DashboardController.php:20
 * @route '/api/dashboard/metrics'
 */
    const metricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metrics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DashboardController::metrics
 * @see app/Http/Controllers/Api/DashboardController.php:20
 * @route '/api/dashboard/metrics'
 */
        metricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metrics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DashboardController::metrics
 * @see app/Http/Controllers/Api/DashboardController.php:20
 * @route '/api/dashboard/metrics'
 */
        metricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metrics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metrics.form = metricsForm
/**
* @see \App\Http\Controllers\Api\DashboardController::downtimeByMachine
 * @see app/Http/Controllers/Api/DashboardController.php:107
 * @route '/api/reports/downtime-by-machine'
 */
export const downtimeByMachine = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downtimeByMachine.url(options),
    method: 'get',
})

downtimeByMachine.definition = {
    methods: ["get","head"],
    url: '/api/reports/downtime-by-machine',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::downtimeByMachine
 * @see app/Http/Controllers/Api/DashboardController.php:107
 * @route '/api/reports/downtime-by-machine'
 */
downtimeByMachine.url = (options?: RouteQueryOptions) => {
    return downtimeByMachine.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::downtimeByMachine
 * @see app/Http/Controllers/Api/DashboardController.php:107
 * @route '/api/reports/downtime-by-machine'
 */
downtimeByMachine.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downtimeByMachine.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DashboardController::downtimeByMachine
 * @see app/Http/Controllers/Api/DashboardController.php:107
 * @route '/api/reports/downtime-by-machine'
 */
downtimeByMachine.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downtimeByMachine.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DashboardController::downtimeByMachine
 * @see app/Http/Controllers/Api/DashboardController.php:107
 * @route '/api/reports/downtime-by-machine'
 */
    const downtimeByMachineForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downtimeByMachine.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DashboardController::downtimeByMachine
 * @see app/Http/Controllers/Api/DashboardController.php:107
 * @route '/api/reports/downtime-by-machine'
 */
        downtimeByMachineForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downtimeByMachine.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DashboardController::downtimeByMachine
 * @see app/Http/Controllers/Api/DashboardController.php:107
 * @route '/api/reports/downtime-by-machine'
 */
        downtimeByMachineForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downtimeByMachine.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downtimeByMachine.form = downtimeByMachineForm
/**
* @see \App\Http\Controllers\Api\DashboardController::completionTimeMetrics
 * @see app/Http/Controllers/Api/DashboardController.php:152
 * @route '/api/reports/completion-time-metrics'
 */
export const completionTimeMetrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: completionTimeMetrics.url(options),
    method: 'get',
})

completionTimeMetrics.definition = {
    methods: ["get","head"],
    url: '/api/reports/completion-time-metrics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::completionTimeMetrics
 * @see app/Http/Controllers/Api/DashboardController.php:152
 * @route '/api/reports/completion-time-metrics'
 */
completionTimeMetrics.url = (options?: RouteQueryOptions) => {
    return completionTimeMetrics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::completionTimeMetrics
 * @see app/Http/Controllers/Api/DashboardController.php:152
 * @route '/api/reports/completion-time-metrics'
 */
completionTimeMetrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: completionTimeMetrics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DashboardController::completionTimeMetrics
 * @see app/Http/Controllers/Api/DashboardController.php:152
 * @route '/api/reports/completion-time-metrics'
 */
completionTimeMetrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: completionTimeMetrics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DashboardController::completionTimeMetrics
 * @see app/Http/Controllers/Api/DashboardController.php:152
 * @route '/api/reports/completion-time-metrics'
 */
    const completionTimeMetricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: completionTimeMetrics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DashboardController::completionTimeMetrics
 * @see app/Http/Controllers/Api/DashboardController.php:152
 * @route '/api/reports/completion-time-metrics'
 */
        completionTimeMetricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: completionTimeMetrics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DashboardController::completionTimeMetrics
 * @see app/Http/Controllers/Api/DashboardController.php:152
 * @route '/api/reports/completion-time-metrics'
 */
        completionTimeMetricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: completionTimeMetrics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    completionTimeMetrics.form = completionTimeMetricsForm
const DashboardController = { metrics, downtimeByMachine, completionTimeMetrics }

export default DashboardController