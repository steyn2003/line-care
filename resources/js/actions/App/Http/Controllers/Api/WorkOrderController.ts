import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\WorkOrderController::index
 * @see app/Http/Controllers/Api/WorkOrderController.php:22
 * @route '/api/work-orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/work-orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WorkOrderController::index
 * @see app/Http/Controllers/Api/WorkOrderController.php:22
 * @route '/api/work-orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkOrderController::index
 * @see app/Http/Controllers/Api/WorkOrderController.php:22
 * @route '/api/work-orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\WorkOrderController::index
 * @see app/Http/Controllers/Api/WorkOrderController.php:22
 * @route '/api/work-orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\WorkOrderController::index
 * @see app/Http/Controllers/Api/WorkOrderController.php:22
 * @route '/api/work-orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\WorkOrderController::index
 * @see app/Http/Controllers/Api/WorkOrderController.php:22
 * @route '/api/work-orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\WorkOrderController::index
 * @see app/Http/Controllers/Api/WorkOrderController.php:22
 * @route '/api/work-orders'
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
* @see \App\Http\Controllers\Api\WorkOrderController::store
 * @see app/Http/Controllers/Api/WorkOrderController.php:74
 * @route '/api/work-orders'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/work-orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\WorkOrderController::store
 * @see app/Http/Controllers/Api/WorkOrderController.php:74
 * @route '/api/work-orders'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkOrderController::store
 * @see app/Http/Controllers/Api/WorkOrderController.php:74
 * @route '/api/work-orders'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\WorkOrderController::store
 * @see app/Http/Controllers/Api/WorkOrderController.php:74
 * @route '/api/work-orders'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WorkOrderController::store
 * @see app/Http/Controllers/Api/WorkOrderController.php:74
 * @route '/api/work-orders'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\WorkOrderController::show
 * @see app/Http/Controllers/Api/WorkOrderController.php:110
 * @route '/api/work-orders/{work_order}'
 */
export const show = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/work-orders/{work_order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WorkOrderController::show
 * @see app/Http/Controllers/Api/WorkOrderController.php:110
 * @route '/api/work-orders/{work_order}'
 */
show.url = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_order: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    work_order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        work_order: args.work_order,
                }

    return show.definition.url
            .replace('{work_order}', parsedArgs.work_order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkOrderController::show
 * @see app/Http/Controllers/Api/WorkOrderController.php:110
 * @route '/api/work-orders/{work_order}'
 */
show.get = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\WorkOrderController::show
 * @see app/Http/Controllers/Api/WorkOrderController.php:110
 * @route '/api/work-orders/{work_order}'
 */
show.head = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\WorkOrderController::show
 * @see app/Http/Controllers/Api/WorkOrderController.php:110
 * @route '/api/work-orders/{work_order}'
 */
    const showForm = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\WorkOrderController::show
 * @see app/Http/Controllers/Api/WorkOrderController.php:110
 * @route '/api/work-orders/{work_order}'
 */
        showForm.get = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\WorkOrderController::show
 * @see app/Http/Controllers/Api/WorkOrderController.php:110
 * @route '/api/work-orders/{work_order}'
 */
        showForm.head = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\WorkOrderController::update
 * @see app/Http/Controllers/Api/WorkOrderController.php:131
 * @route '/api/work-orders/{work_order}'
 */
export const update = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/work-orders/{work_order}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\WorkOrderController::update
 * @see app/Http/Controllers/Api/WorkOrderController.php:131
 * @route '/api/work-orders/{work_order}'
 */
update.url = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_order: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    work_order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        work_order: args.work_order,
                }

    return update.definition.url
            .replace('{work_order}', parsedArgs.work_order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkOrderController::update
 * @see app/Http/Controllers/Api/WorkOrderController.php:131
 * @route '/api/work-orders/{work_order}'
 */
update.put = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\WorkOrderController::update
 * @see app/Http/Controllers/Api/WorkOrderController.php:131
 * @route '/api/work-orders/{work_order}'
 */
update.patch = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\WorkOrderController::update
 * @see app/Http/Controllers/Api/WorkOrderController.php:131
 * @route '/api/work-orders/{work_order}'
 */
    const updateForm = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WorkOrderController::update
 * @see app/Http/Controllers/Api/WorkOrderController.php:131
 * @route '/api/work-orders/{work_order}'
 */
        updateForm.put = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\WorkOrderController::update
 * @see app/Http/Controllers/Api/WorkOrderController.php:131
 * @route '/api/work-orders/{work_order}'
 */
        updateForm.patch = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\WorkOrderController::destroy
 * @see app/Http/Controllers/Api/WorkOrderController.php:164
 * @route '/api/work-orders/{work_order}'
 */
export const destroy = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/work-orders/{work_order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\WorkOrderController::destroy
 * @see app/Http/Controllers/Api/WorkOrderController.php:164
 * @route '/api/work-orders/{work_order}'
 */
destroy.url = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_order: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    work_order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        work_order: args.work_order,
                }

    return destroy.definition.url
            .replace('{work_order}', parsedArgs.work_order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkOrderController::destroy
 * @see app/Http/Controllers/Api/WorkOrderController.php:164
 * @route '/api/work-orders/{work_order}'
 */
destroy.delete = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\WorkOrderController::destroy
 * @see app/Http/Controllers/Api/WorkOrderController.php:164
 * @route '/api/work-orders/{work_order}'
 */
    const destroyForm = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WorkOrderController::destroy
 * @see app/Http/Controllers/Api/WorkOrderController.php:164
 * @route '/api/work-orders/{work_order}'
 */
        destroyForm.delete = (args: { work_order: string | number } | [work_order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Api\WorkOrderController::complete
 * @see app/Http/Controllers/Api/WorkOrderController.php:178
 * @route '/api/work-orders/{workOrder}/complete'
 */
export const complete = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/api/work-orders/{workOrder}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\WorkOrderController::complete
 * @see app/Http/Controllers/Api/WorkOrderController.php:178
 * @route '/api/work-orders/{workOrder}/complete'
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
* @see \App\Http\Controllers\Api\WorkOrderController::complete
 * @see app/Http/Controllers/Api/WorkOrderController.php:178
 * @route '/api/work-orders/{workOrder}/complete'
 */
complete.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\WorkOrderController::complete
 * @see app/Http/Controllers/Api/WorkOrderController.php:178
 * @route '/api/work-orders/{workOrder}/complete'
 */
    const completeForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: complete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WorkOrderController::complete
 * @see app/Http/Controllers/Api/WorkOrderController.php:178
 * @route '/api/work-orders/{workOrder}/complete'
 */
        completeForm.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: complete.url(args, options),
            method: 'post',
        })
    
    complete.form = completeForm
/**
* @see \App\Http\Controllers\Api\WorkOrderController::assign
 * @see app/Http/Controllers/Api/WorkOrderController.php:233
 * @route '/api/work-orders/{workOrder}/assign'
 */
export const assign = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(args, options),
    method: 'post',
})

assign.definition = {
    methods: ["post"],
    url: '/api/work-orders/{workOrder}/assign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\WorkOrderController::assign
 * @see app/Http/Controllers/Api/WorkOrderController.php:233
 * @route '/api/work-orders/{workOrder}/assign'
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
* @see \App\Http\Controllers\Api\WorkOrderController::assign
 * @see app/Http/Controllers/Api/WorkOrderController.php:233
 * @route '/api/work-orders/{workOrder}/assign'
 */
assign.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\WorkOrderController::assign
 * @see app/Http/Controllers/Api/WorkOrderController.php:233
 * @route '/api/work-orders/{workOrder}/assign'
 */
    const assignForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assign.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WorkOrderController::assign
 * @see app/Http/Controllers/Api/WorkOrderController.php:233
 * @route '/api/work-orders/{workOrder}/assign'
 */
        assignForm.post = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assign.url(args, options),
            method: 'post',
        })
    
    assign.form = assignForm
/**
* @see \App\Http\Controllers\Api\WorkOrderController::updateStatus
 * @see app/Http/Controllers/Api/WorkOrderController.php:262
 * @route '/api/work-orders/{workOrder}/status'
 */
export const updateStatus = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/api/work-orders/{workOrder}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\WorkOrderController::updateStatus
 * @see app/Http/Controllers/Api/WorkOrderController.php:262
 * @route '/api/work-orders/{workOrder}/status'
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
* @see \App\Http\Controllers\Api\WorkOrderController::updateStatus
 * @see app/Http/Controllers/Api/WorkOrderController.php:262
 * @route '/api/work-orders/{workOrder}/status'
 */
updateStatus.patch = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\WorkOrderController::updateStatus
 * @see app/Http/Controllers/Api/WorkOrderController.php:262
 * @route '/api/work-orders/{workOrder}/status'
 */
    const updateStatusForm = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\WorkOrderController::updateStatus
 * @see app/Http/Controllers/Api/WorkOrderController.php:262
 * @route '/api/work-orders/{workOrder}/status'
 */
        updateStatusForm.patch = (args: { workOrder: number | { id: number } } | [workOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
const WorkOrderController = { index, store, show, update, destroy, complete, assign, updateStatus }

export default WorkOrderController