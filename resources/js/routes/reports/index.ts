import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReportsController::downtime
 * @see app/Http/Controllers/ReportsController.php:16
 * @route '/reports/downtime'
 */
export const downtime = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downtime.url(options),
    method: 'get',
})

downtime.definition = {
    methods: ["get","head"],
    url: '/reports/downtime',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportsController::downtime
 * @see app/Http/Controllers/ReportsController.php:16
 * @route '/reports/downtime'
 */
downtime.url = (options?: RouteQueryOptions) => {
    return downtime.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportsController::downtime
 * @see app/Http/Controllers/ReportsController.php:16
 * @route '/reports/downtime'
 */
downtime.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downtime.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportsController::downtime
 * @see app/Http/Controllers/ReportsController.php:16
 * @route '/reports/downtime'
 */
downtime.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downtime.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportsController::downtime
 * @see app/Http/Controllers/ReportsController.php:16
 * @route '/reports/downtime'
 */
    const downtimeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downtime.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportsController::downtime
 * @see app/Http/Controllers/ReportsController.php:16
 * @route '/reports/downtime'
 */
        downtimeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downtime.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportsController::downtime
 * @see app/Http/Controllers/ReportsController.php:16
 * @route '/reports/downtime'
 */
        downtimeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downtime.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downtime.form = downtimeForm
const reports = {
    downtime: Object.assign(downtime, downtime),
}

export default reports