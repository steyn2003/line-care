import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
const dashboard = {
    metrics: Object.assign(metrics, metrics),
}

export default dashboard