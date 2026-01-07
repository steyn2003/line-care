import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import importMethod from './import'
/**
* @see \App\Http\Controllers\Api\MachineController::index
 * @see app/Http/Controllers/Api/MachineController.php:16
 * @route '/api/machines'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/machines',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MachineController::index
 * @see app/Http/Controllers/Api/MachineController.php:16
 * @route '/api/machines'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineController::index
 * @see app/Http/Controllers/Api/MachineController.php:16
 * @route '/api/machines'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MachineController::index
 * @see app/Http/Controllers/Api/MachineController.php:16
 * @route '/api/machines'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MachineController::index
 * @see app/Http/Controllers/Api/MachineController.php:16
 * @route '/api/machines'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MachineController::index
 * @see app/Http/Controllers/Api/MachineController.php:16
 * @route '/api/machines'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MachineController::index
 * @see app/Http/Controllers/Api/MachineController.php:16
 * @route '/api/machines'
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
* @see \App\Http\Controllers\Api\MachineController::store
 * @see app/Http/Controllers/Api/MachineController.php:47
 * @route '/api/machines'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/machines',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MachineController::store
 * @see app/Http/Controllers/Api/MachineController.php:47
 * @route '/api/machines'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineController::store
 * @see app/Http/Controllers/Api/MachineController.php:47
 * @route '/api/machines'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\MachineController::store
 * @see app/Http/Controllers/Api/MachineController.php:47
 * @route '/api/machines'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\MachineController::store
 * @see app/Http/Controllers/Api/MachineController.php:47
 * @route '/api/machines'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\MachineController::show
 * @see app/Http/Controllers/Api/MachineController.php:72
 * @route '/api/machines/{machine}'
 */
export const show = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/machines/{machine}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MachineController::show
 * @see app/Http/Controllers/Api/MachineController.php:72
 * @route '/api/machines/{machine}'
 */
show.url = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machine: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { machine: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    machine: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        machine: typeof args.machine === 'object'
                ? args.machine.id
                : args.machine,
                }

    return show.definition.url
            .replace('{machine}', parsedArgs.machine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineController::show
 * @see app/Http/Controllers/Api/MachineController.php:72
 * @route '/api/machines/{machine}'
 */
show.get = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MachineController::show
 * @see app/Http/Controllers/Api/MachineController.php:72
 * @route '/api/machines/{machine}'
 */
show.head = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MachineController::show
 * @see app/Http/Controllers/Api/MachineController.php:72
 * @route '/api/machines/{machine}'
 */
    const showForm = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MachineController::show
 * @see app/Http/Controllers/Api/MachineController.php:72
 * @route '/api/machines/{machine}'
 */
        showForm.get = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MachineController::show
 * @see app/Http/Controllers/Api/MachineController.php:72
 * @route '/api/machines/{machine}'
 */
        showForm.head = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\MachineController::update
 * @see app/Http/Controllers/Api/MachineController.php:91
 * @route '/api/machines/{machine}'
 */
export const update = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/machines/{machine}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\MachineController::update
 * @see app/Http/Controllers/Api/MachineController.php:91
 * @route '/api/machines/{machine}'
 */
update.url = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machine: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { machine: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    machine: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        machine: typeof args.machine === 'object'
                ? args.machine.id
                : args.machine,
                }

    return update.definition.url
            .replace('{machine}', parsedArgs.machine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineController::update
 * @see app/Http/Controllers/Api/MachineController.php:91
 * @route '/api/machines/{machine}'
 */
update.put = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\MachineController::update
 * @see app/Http/Controllers/Api/MachineController.php:91
 * @route '/api/machines/{machine}'
 */
update.patch = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\MachineController::update
 * @see app/Http/Controllers/Api/MachineController.php:91
 * @route '/api/machines/{machine}'
 */
    const updateForm = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\MachineController::update
 * @see app/Http/Controllers/Api/MachineController.php:91
 * @route '/api/machines/{machine}'
 */
        updateForm.put = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\MachineController::update
 * @see app/Http/Controllers/Api/MachineController.php:91
 * @route '/api/machines/{machine}'
 */
        updateForm.patch = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\MachineController::destroy
 * @see app/Http/Controllers/Api/MachineController.php:113
 * @route '/api/machines/{machine}'
 */
export const destroy = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/machines/{machine}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\MachineController::destroy
 * @see app/Http/Controllers/Api/MachineController.php:113
 * @route '/api/machines/{machine}'
 */
destroy.url = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machine: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { machine: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    machine: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        machine: typeof args.machine === 'object'
                ? args.machine.id
                : args.machine,
                }

    return destroy.definition.url
            .replace('{machine}', parsedArgs.machine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineController::destroy
 * @see app/Http/Controllers/Api/MachineController.php:113
 * @route '/api/machines/{machine}'
 */
destroy.delete = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\MachineController::destroy
 * @see app/Http/Controllers/Api/MachineController.php:113
 * @route '/api/machines/{machine}'
 */
    const destroyForm = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\MachineController::destroy
 * @see app/Http/Controllers/Api/MachineController.php:113
 * @route '/api/machines/{machine}'
 */
        destroyForm.delete = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\MachineController::analytics
 * @see app/Http/Controllers/Api/MachineController.php:128
 * @route '/api/machines/{machine}/analytics'
 */
export const analytics = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(args, options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/api/machines/{machine}/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MachineController::analytics
 * @see app/Http/Controllers/Api/MachineController.php:128
 * @route '/api/machines/{machine}/analytics'
 */
analytics.url = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machine: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { machine: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    machine: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        machine: typeof args.machine === 'object'
                ? args.machine.id
                : args.machine,
                }

    return analytics.definition.url
            .replace('{machine}', parsedArgs.machine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineController::analytics
 * @see app/Http/Controllers/Api/MachineController.php:128
 * @route '/api/machines/{machine}/analytics'
 */
analytics.get = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MachineController::analytics
 * @see app/Http/Controllers/Api/MachineController.php:128
 * @route '/api/machines/{machine}/analytics'
 */
analytics.head = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MachineController::analytics
 * @see app/Http/Controllers/Api/MachineController.php:128
 * @route '/api/machines/{machine}/analytics'
 */
    const analyticsForm = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MachineController::analytics
 * @see app/Http/Controllers/Api/MachineController.php:128
 * @route '/api/machines/{machine}/analytics'
 */
        analyticsForm.get = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MachineController::analytics
 * @see app/Http/Controllers/Api/MachineController.php:128
 * @route '/api/machines/{machine}/analytics'
 */
        analyticsForm.head = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analytics.form = analyticsForm
const machines = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
analytics: Object.assign(analytics, analytics),
import: Object.assign(importMethod, importMethod),
}

export default machines