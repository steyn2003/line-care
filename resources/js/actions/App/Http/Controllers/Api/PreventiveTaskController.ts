import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::index
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:19
 * @route '/api/preventive-tasks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/preventive-tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::index
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:19
 * @route '/api/preventive-tasks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::index
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:19
 * @route '/api/preventive-tasks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::index
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:19
 * @route '/api/preventive-tasks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::index
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:19
 * @route '/api/preventive-tasks'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::index
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:19
 * @route '/api/preventive-tasks'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::index
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:19
 * @route '/api/preventive-tasks'
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
* @see \App\Http\Controllers\Api\PreventiveTaskController::store
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:55
 * @route '/api/preventive-tasks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/preventive-tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::store
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:55
 * @route '/api/preventive-tasks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::store
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:55
 * @route '/api/preventive-tasks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::store
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:55
 * @route '/api/preventive-tasks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::store
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:55
 * @route '/api/preventive-tasks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::show
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:104
 * @route '/api/preventive-tasks/{preventive_task}'
 */
export const show = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/preventive-tasks/{preventive_task}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::show
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:104
 * @route '/api/preventive-tasks/{preventive_task}'
 */
show.url = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { preventive_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    preventive_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        preventive_task: args.preventive_task,
                }

    return show.definition.url
            .replace('{preventive_task}', parsedArgs.preventive_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::show
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:104
 * @route '/api/preventive-tasks/{preventive_task}'
 */
show.get = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::show
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:104
 * @route '/api/preventive-tasks/{preventive_task}'
 */
show.head = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::show
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:104
 * @route '/api/preventive-tasks/{preventive_task}'
 */
    const showForm = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::show
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:104
 * @route '/api/preventive-tasks/{preventive_task}'
 */
        showForm.get = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::show
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:104
 * @route '/api/preventive-tasks/{preventive_task}'
 */
        showForm.head = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\PreventiveTaskController::update
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:123
 * @route '/api/preventive-tasks/{preventive_task}'
 */
export const update = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/preventive-tasks/{preventive_task}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::update
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:123
 * @route '/api/preventive-tasks/{preventive_task}'
 */
update.url = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { preventive_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    preventive_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        preventive_task: args.preventive_task,
                }

    return update.definition.url
            .replace('{preventive_task}', parsedArgs.preventive_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::update
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:123
 * @route '/api/preventive-tasks/{preventive_task}'
 */
update.put = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::update
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:123
 * @route '/api/preventive-tasks/{preventive_task}'
 */
update.patch = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::update
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:123
 * @route '/api/preventive-tasks/{preventive_task}'
 */
    const updateForm = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::update
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:123
 * @route '/api/preventive-tasks/{preventive_task}'
 */
        updateForm.put = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::update
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:123
 * @route '/api/preventive-tasks/{preventive_task}'
 */
        updateForm.patch = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\PreventiveTaskController::destroy
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:162
 * @route '/api/preventive-tasks/{preventive_task}'
 */
export const destroy = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/preventive-tasks/{preventive_task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::destroy
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:162
 * @route '/api/preventive-tasks/{preventive_task}'
 */
destroy.url = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { preventive_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    preventive_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        preventive_task: args.preventive_task,
                }

    return destroy.definition.url
            .replace('{preventive_task}', parsedArgs.preventive_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::destroy
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:162
 * @route '/api/preventive-tasks/{preventive_task}'
 */
destroy.delete = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::destroy
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:162
 * @route '/api/preventive-tasks/{preventive_task}'
 */
    const destroyForm = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::destroy
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:162
 * @route '/api/preventive-tasks/{preventive_task}'
 */
        destroyForm.delete = (args: { preventive_task: string | number } | [preventive_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\PreventiveTaskController::upcoming
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:177
 * @route '/api/preventive-tasks-upcoming'
 */
export const upcoming = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upcoming.url(options),
    method: 'get',
})

upcoming.definition = {
    methods: ["get","head"],
    url: '/api/preventive-tasks-upcoming',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::upcoming
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:177
 * @route '/api/preventive-tasks-upcoming'
 */
upcoming.url = (options?: RouteQueryOptions) => {
    return upcoming.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::upcoming
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:177
 * @route '/api/preventive-tasks-upcoming'
 */
upcoming.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upcoming.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::upcoming
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:177
 * @route '/api/preventive-tasks-upcoming'
 */
upcoming.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: upcoming.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::upcoming
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:177
 * @route '/api/preventive-tasks-upcoming'
 */
    const upcomingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: upcoming.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::upcoming
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:177
 * @route '/api/preventive-tasks-upcoming'
 */
        upcomingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: upcoming.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::upcoming
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:177
 * @route '/api/preventive-tasks-upcoming'
 */
        upcomingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: upcoming.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    upcoming.form = upcomingForm
/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::overdue
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:200
 * @route '/api/preventive-tasks-overdue'
 */
export const overdue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})

overdue.definition = {
    methods: ["get","head"],
    url: '/api/preventive-tasks-overdue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::overdue
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:200
 * @route '/api/preventive-tasks-overdue'
 */
overdue.url = (options?: RouteQueryOptions) => {
    return overdue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::overdue
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:200
 * @route '/api/preventive-tasks-overdue'
 */
overdue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PreventiveTaskController::overdue
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:200
 * @route '/api/preventive-tasks-overdue'
 */
overdue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overdue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::overdue
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:200
 * @route '/api/preventive-tasks-overdue'
 */
    const overdueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overdue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::overdue
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:200
 * @route '/api/preventive-tasks-overdue'
 */
        overdueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overdue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PreventiveTaskController::overdue
 * @see app/Http/Controllers/Api/PreventiveTaskController.php:200
 * @route '/api/preventive-tasks-overdue'
 */
        overdueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overdue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overdue.form = overdueForm
const PreventiveTaskController = { index, store, show, update, destroy, upcoming, overdue }

export default PreventiveTaskController