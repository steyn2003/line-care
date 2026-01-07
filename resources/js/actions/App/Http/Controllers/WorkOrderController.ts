import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkOrderController::index
 * @see app/Http/Controllers/WorkOrderController.php:14
 * @route '/work-orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/work-orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::index
 * @see app/Http/Controllers/WorkOrderController.php:14
 * @route '/work-orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::index
 * @see app/Http/Controllers/WorkOrderController.php:14
 * @route '/work-orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkOrderController::index
 * @see app/Http/Controllers/WorkOrderController.php:14
 * @route '/work-orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkOrderController::index
 * @see app/Http/Controllers/WorkOrderController.php:14
 * @route '/work-orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkOrderController::index
 * @see app/Http/Controllers/WorkOrderController.php:14
 * @route '/work-orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkOrderController::index
 * @see app/Http/Controllers/WorkOrderController.php:14
 * @route '/work-orders'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\WorkOrderController::reportBreakdown
 * @see app/Http/Controllers/WorkOrderController.php:101
 * @route '/work-orders/report-breakdown'
 */
export const reportBreakdown = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportBreakdown.url(options),
    method: 'get',
})

reportBreakdown.definition = {
    methods: ["get","head"],
    url: '/work-orders/report-breakdown',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::reportBreakdown
 * @see app/Http/Controllers/WorkOrderController.php:101
 * @route '/work-orders/report-breakdown'
 */
reportBreakdown.url = (options?: RouteQueryOptions) => {
    return reportBreakdown.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::reportBreakdown
 * @see app/Http/Controllers/WorkOrderController.php:101
 * @route '/work-orders/report-breakdown'
 */
reportBreakdown.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportBreakdown.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkOrderController::reportBreakdown
 * @see app/Http/Controllers/WorkOrderController.php:101
 * @route '/work-orders/report-breakdown'
 */
reportBreakdown.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportBreakdown.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkOrderController::reportBreakdown
 * @see app/Http/Controllers/WorkOrderController.php:101
 * @route '/work-orders/report-breakdown'
 */
    const reportBreakdownForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportBreakdown.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkOrderController::reportBreakdown
 * @see app/Http/Controllers/WorkOrderController.php:101
 * @route '/work-orders/report-breakdown'
 */
        reportBreakdownForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportBreakdown.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkOrderController::reportBreakdown
 * @see app/Http/Controllers/WorkOrderController.php:101
 * @route '/work-orders/report-breakdown'
 */
        reportBreakdownForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportBreakdown.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reportBreakdown.form = reportBreakdownForm
/**
* @see \App\Http\Controllers\WorkOrderController::store
 * @see app/Http/Controllers/WorkOrderController.php:119
 * @route '/work-orders'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/work-orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkOrderController::store
 * @see app/Http/Controllers/WorkOrderController.php:119
 * @route '/work-orders'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::store
 * @see app/Http/Controllers/WorkOrderController.php:119
 * @route '/work-orders'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkOrderController::store
 * @see app/Http/Controllers/WorkOrderController.php:119
 * @route '/work-orders'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkOrderController::store
 * @see app/Http/Controllers/WorkOrderController.php:119
 * @route '/work-orders'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WorkOrderController::show
 * @see app/Http/Controllers/WorkOrderController.php:71
 * @route '/work-orders/{workOrder}'
 */
export const show = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/work-orders/{workOrder}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkOrderController::show
 * @see app/Http/Controllers/WorkOrderController.php:71
 * @route '/work-orders/{workOrder}'
 */
show.url = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workOrder: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workOrder: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workOrder: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workOrder: typeof args.workOrder === 'object'
                ? args.workOrder.id
                : args.workOrder,
                }

    return show.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::show
 * @see app/Http/Controllers/WorkOrderController.php:71
 * @route '/work-orders/{workOrder}'
 */
show.get = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkOrderController::show
 * @see app/Http/Controllers/WorkOrderController.php:71
 * @route '/work-orders/{workOrder}'
 */
show.head = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkOrderController::show
 * @see app/Http/Controllers/WorkOrderController.php:71
 * @route '/work-orders/{workOrder}'
 */
    const showForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkOrderController::show
 * @see app/Http/Controllers/WorkOrderController.php:71
 * @route '/work-orders/{workOrder}'
 */
        showForm.get = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkOrderController::show
 * @see app/Http/Controllers/WorkOrderController.php:71
 * @route '/work-orders/{workOrder}'
 */
        showForm.head = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\WorkOrderController::updateStatus
 * @see app/Http/Controllers/WorkOrderController.php:149
 * @route '/work-orders/{workOrder}/status'
 */
export const updateStatus = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/work-orders/{workOrder}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkOrderController::updateStatus
 * @see app/Http/Controllers/WorkOrderController.php:149
 * @route '/work-orders/{workOrder}/status'
 */
updateStatus.url = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workOrder: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workOrder: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workOrder: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workOrder: typeof args.workOrder === 'object'
                ? args.workOrder.id
                : args.workOrder,
                }

    return updateStatus.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::updateStatus
 * @see app/Http/Controllers/WorkOrderController.php:149
 * @route '/work-orders/{workOrder}/status'
 */
updateStatus.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkOrderController::updateStatus
 * @see app/Http/Controllers/WorkOrderController.php:149
 * @route '/work-orders/{workOrder}/status'
 */
    const updateStatusForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkOrderController::updateStatus
 * @see app/Http/Controllers/WorkOrderController.php:149
 * @route '/work-orders/{workOrder}/status'
 */
        updateStatusForm.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, options),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\WorkOrderController::assign
 * @see app/Http/Controllers/WorkOrderController.php:170
 * @route '/work-orders/{workOrder}/assign'
 */
export const assign = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(args, options),
    method: 'post',
})

assign.definition = {
    methods: ["post"],
    url: '/work-orders/{workOrder}/assign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkOrderController::assign
 * @see app/Http/Controllers/WorkOrderController.php:170
 * @route '/work-orders/{workOrder}/assign'
 */
assign.url = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workOrder: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workOrder: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workOrder: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workOrder: typeof args.workOrder === 'object'
                ? args.workOrder.id
                : args.workOrder,
                }

    return assign.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::assign
 * @see app/Http/Controllers/WorkOrderController.php:170
 * @route '/work-orders/{workOrder}/assign'
 */
assign.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkOrderController::assign
 * @see app/Http/Controllers/WorkOrderController.php:170
 * @route '/work-orders/{workOrder}/assign'
 */
    const assignForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assign.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkOrderController::assign
 * @see app/Http/Controllers/WorkOrderController.php:170
 * @route '/work-orders/{workOrder}/assign'
 */
        assignForm.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assign.url(args, options),
            method: 'post',
        })
    
    assign.form = assignForm
/**
* @see \App\Http\Controllers\WorkOrderController::complete
 * @see app/Http/Controllers/WorkOrderController.php:186
 * @route '/work-orders/{workOrder}/complete'
 */
export const complete = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/work-orders/{workOrder}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkOrderController::complete
 * @see app/Http/Controllers/WorkOrderController.php:186
 * @route '/work-orders/{workOrder}/complete'
 */
complete.url = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workOrder: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workOrder: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workOrder: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workOrder: typeof args.workOrder === 'object'
                ? args.workOrder.id
                : args.workOrder,
                }

    return complete.definition.url
            .replace('{workOrder}', parsedArgs.workOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkOrderController::complete
 * @see app/Http/Controllers/WorkOrderController.php:186
 * @route '/work-orders/{workOrder}/complete'
 */
complete.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkOrderController::complete
 * @see app/Http/Controllers/WorkOrderController.php:186
 * @route '/work-orders/{workOrder}/complete'
 */
    const completeForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: complete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkOrderController::complete
 * @see app/Http/Controllers/WorkOrderController.php:186
 * @route '/work-orders/{workOrder}/complete'
 */
        completeForm.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: complete.url(args, options),
            method: 'post',
        })
    
    complete.form = completeForm
const WorkOrderController = { index, reportBreakdown, store, show, updateStatus, assign, complete }

export default WorkOrderController