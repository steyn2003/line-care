import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PreventiveTaskController::index
 * @see app/Http/Controllers/PreventiveTaskController.php:15
 * @route '/preventive-tasks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/preventive-tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PreventiveTaskController::index
 * @see app/Http/Controllers/PreventiveTaskController.php:15
 * @route '/preventive-tasks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreventiveTaskController::index
 * @see app/Http/Controllers/PreventiveTaskController.php:15
 * @route '/preventive-tasks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PreventiveTaskController::index
 * @see app/Http/Controllers/PreventiveTaskController.php:15
 * @route '/preventive-tasks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PreventiveTaskController::index
 * @see app/Http/Controllers/PreventiveTaskController.php:15
 * @route '/preventive-tasks'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PreventiveTaskController::index
 * @see app/Http/Controllers/PreventiveTaskController.php:15
 * @route '/preventive-tasks'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PreventiveTaskController::index
 * @see app/Http/Controllers/PreventiveTaskController.php:15
 * @route '/preventive-tasks'
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
* @see \App\Http\Controllers\PreventiveTaskController::create
 * @see app/Http/Controllers/PreventiveTaskController.php:33
 * @route '/preventive-tasks/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/preventive-tasks/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PreventiveTaskController::create
 * @see app/Http/Controllers/PreventiveTaskController.php:33
 * @route '/preventive-tasks/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreventiveTaskController::create
 * @see app/Http/Controllers/PreventiveTaskController.php:33
 * @route '/preventive-tasks/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PreventiveTaskController::create
 * @see app/Http/Controllers/PreventiveTaskController.php:33
 * @route '/preventive-tasks/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PreventiveTaskController::create
 * @see app/Http/Controllers/PreventiveTaskController.php:33
 * @route '/preventive-tasks/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PreventiveTaskController::create
 * @see app/Http/Controllers/PreventiveTaskController.php:33
 * @route '/preventive-tasks/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PreventiveTaskController::create
 * @see app/Http/Controllers/PreventiveTaskController.php:33
 * @route '/preventive-tasks/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\PreventiveTaskController::store
 * @see app/Http/Controllers/PreventiveTaskController.php:53
 * @route '/preventive-tasks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/preventive-tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PreventiveTaskController::store
 * @see app/Http/Controllers/PreventiveTaskController.php:53
 * @route '/preventive-tasks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreventiveTaskController::store
 * @see app/Http/Controllers/PreventiveTaskController.php:53
 * @route '/preventive-tasks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PreventiveTaskController::store
 * @see app/Http/Controllers/PreventiveTaskController.php:53
 * @route '/preventive-tasks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PreventiveTaskController::store
 * @see app/Http/Controllers/PreventiveTaskController.php:53
 * @route '/preventive-tasks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PreventiveTaskController::show
 * @see app/Http/Controllers/PreventiveTaskController.php:98
 * @route '/preventive-tasks/{preventiveTask}'
 */
export const show = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/preventive-tasks/{preventiveTask}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PreventiveTaskController::show
 * @see app/Http/Controllers/PreventiveTaskController.php:98
 * @route '/preventive-tasks/{preventiveTask}'
 */
show.url = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { preventiveTask: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { preventiveTask: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    preventiveTask: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        preventiveTask: typeof args.preventiveTask === 'object'
                ? args.preventiveTask.id
                : args.preventiveTask,
                }

    return show.definition.url
            .replace('{preventiveTask}', parsedArgs.preventiveTask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreventiveTaskController::show
 * @see app/Http/Controllers/PreventiveTaskController.php:98
 * @route '/preventive-tasks/{preventiveTask}'
 */
show.get = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PreventiveTaskController::show
 * @see app/Http/Controllers/PreventiveTaskController.php:98
 * @route '/preventive-tasks/{preventiveTask}'
 */
show.head = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PreventiveTaskController::show
 * @see app/Http/Controllers/PreventiveTaskController.php:98
 * @route '/preventive-tasks/{preventiveTask}'
 */
    const showForm = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PreventiveTaskController::show
 * @see app/Http/Controllers/PreventiveTaskController.php:98
 * @route '/preventive-tasks/{preventiveTask}'
 */
        showForm.get = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PreventiveTaskController::show
 * @see app/Http/Controllers/PreventiveTaskController.php:98
 * @route '/preventive-tasks/{preventiveTask}'
 */
        showForm.head = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PreventiveTaskController::edit
 * @see app/Http/Controllers/PreventiveTaskController.php:115
 * @route '/preventive-tasks/{preventiveTask}/edit'
 */
export const edit = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/preventive-tasks/{preventiveTask}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PreventiveTaskController::edit
 * @see app/Http/Controllers/PreventiveTaskController.php:115
 * @route '/preventive-tasks/{preventiveTask}/edit'
 */
edit.url = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { preventiveTask: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { preventiveTask: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    preventiveTask: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        preventiveTask: typeof args.preventiveTask === 'object'
                ? args.preventiveTask.id
                : args.preventiveTask,
                }

    return edit.definition.url
            .replace('{preventiveTask}', parsedArgs.preventiveTask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreventiveTaskController::edit
 * @see app/Http/Controllers/PreventiveTaskController.php:115
 * @route '/preventive-tasks/{preventiveTask}/edit'
 */
edit.get = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PreventiveTaskController::edit
 * @see app/Http/Controllers/PreventiveTaskController.php:115
 * @route '/preventive-tasks/{preventiveTask}/edit'
 */
edit.head = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PreventiveTaskController::edit
 * @see app/Http/Controllers/PreventiveTaskController.php:115
 * @route '/preventive-tasks/{preventiveTask}/edit'
 */
    const editForm = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PreventiveTaskController::edit
 * @see app/Http/Controllers/PreventiveTaskController.php:115
 * @route '/preventive-tasks/{preventiveTask}/edit'
 */
        editForm.get = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PreventiveTaskController::edit
 * @see app/Http/Controllers/PreventiveTaskController.php:115
 * @route '/preventive-tasks/{preventiveTask}/edit'
 */
        editForm.head = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\PreventiveTaskController::update
 * @see app/Http/Controllers/PreventiveTaskController.php:134
 * @route '/preventive-tasks/{preventiveTask}'
 */
export const update = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/preventive-tasks/{preventiveTask}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PreventiveTaskController::update
 * @see app/Http/Controllers/PreventiveTaskController.php:134
 * @route '/preventive-tasks/{preventiveTask}'
 */
update.url = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { preventiveTask: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { preventiveTask: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    preventiveTask: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        preventiveTask: typeof args.preventiveTask === 'object'
                ? args.preventiveTask.id
                : args.preventiveTask,
                }

    return update.definition.url
            .replace('{preventiveTask}', parsedArgs.preventiveTask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreventiveTaskController::update
 * @see app/Http/Controllers/PreventiveTaskController.php:134
 * @route '/preventive-tasks/{preventiveTask}'
 */
update.put = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PreventiveTaskController::update
 * @see app/Http/Controllers/PreventiveTaskController.php:134
 * @route '/preventive-tasks/{preventiveTask}'
 */
    const updateForm = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PreventiveTaskController::update
 * @see app/Http/Controllers/PreventiveTaskController.php:134
 * @route '/preventive-tasks/{preventiveTask}'
 */
        updateForm.put = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PreventiveTaskController::destroy
 * @see app/Http/Controllers/PreventiveTaskController.php:177
 * @route '/preventive-tasks/{preventiveTask}'
 */
export const destroy = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/preventive-tasks/{preventiveTask}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PreventiveTaskController::destroy
 * @see app/Http/Controllers/PreventiveTaskController.php:177
 * @route '/preventive-tasks/{preventiveTask}'
 */
destroy.url = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { preventiveTask: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { preventiveTask: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    preventiveTask: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        preventiveTask: typeof args.preventiveTask === 'object'
                ? args.preventiveTask.id
                : args.preventiveTask,
                }

    return destroy.definition.url
            .replace('{preventiveTask}', parsedArgs.preventiveTask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreventiveTaskController::destroy
 * @see app/Http/Controllers/PreventiveTaskController.php:177
 * @route '/preventive-tasks/{preventiveTask}'
 */
destroy.delete = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PreventiveTaskController::destroy
 * @see app/Http/Controllers/PreventiveTaskController.php:177
 * @route '/preventive-tasks/{preventiveTask}'
 */
    const destroyForm = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PreventiveTaskController::destroy
 * @see app/Http/Controllers/PreventiveTaskController.php:177
 * @route '/preventive-tasks/{preventiveTask}'
 */
        destroyForm.delete = (args: { preventiveTask: number | { id: number } } | [preventiveTask: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PreventiveTaskController = { index, create, store, show, edit, update, destroy }

export default PreventiveTaskController