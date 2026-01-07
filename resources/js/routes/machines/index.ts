import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import importMethod7367d2 from './import'
/**
* @see \App\Http\Controllers\MachineController::index
 * @see app/Http/Controllers/MachineController.php:14
 * @route '/machines'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/machines',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineController::index
 * @see app/Http/Controllers/MachineController.php:14
 * @route '/machines'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::index
 * @see app/Http/Controllers/MachineController.php:14
 * @route '/machines'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MachineController::index
 * @see app/Http/Controllers/MachineController.php:14
 * @route '/machines'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MachineController::index
 * @see app/Http/Controllers/MachineController.php:14
 * @route '/machines'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MachineController::index
 * @see app/Http/Controllers/MachineController.php:14
 * @route '/machines'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MachineController::index
 * @see app/Http/Controllers/MachineController.php:14
 * @route '/machines'
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
* @see \App\Http\Controllers\MachineController::create
 * @see app/Http/Controllers/MachineController.php:124
 * @route '/machines/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/machines/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineController::create
 * @see app/Http/Controllers/MachineController.php:124
 * @route '/machines/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::create
 * @see app/Http/Controllers/MachineController.php:124
 * @route '/machines/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MachineController::create
 * @see app/Http/Controllers/MachineController.php:124
 * @route '/machines/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MachineController::create
 * @see app/Http/Controllers/MachineController.php:124
 * @route '/machines/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MachineController::create
 * @see app/Http/Controllers/MachineController.php:124
 * @route '/machines/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MachineController::create
 * @see app/Http/Controllers/MachineController.php:124
 * @route '/machines/create'
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
* @see \App\Http\Controllers\MachineController::importMethod
 * @see app/Http/Controllers/MachineController.php:174
 * @route '/machines/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})

importMethod.definition = {
    methods: ["get","head"],
    url: '/machines/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineController::importMethod
 * @see app/Http/Controllers/MachineController.php:174
 * @route '/machines/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::importMethod
 * @see app/Http/Controllers/MachineController.php:174
 * @route '/machines/import'
 */
importMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MachineController::importMethod
 * @see app/Http/Controllers/MachineController.php:174
 * @route '/machines/import'
 */
importMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MachineController::importMethod
 * @see app/Http/Controllers/MachineController.php:174
 * @route '/machines/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: importMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MachineController::importMethod
 * @see app/Http/Controllers/MachineController.php:174
 * @route '/machines/import'
 */
        importMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MachineController::importMethod
 * @see app/Http/Controllers/MachineController.php:174
 * @route '/machines/import'
 */
        importMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\MachineController::store
 * @see app/Http/Controllers/MachineController.php:137
 * @route '/machines'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/machines',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MachineController::store
 * @see app/Http/Controllers/MachineController.php:137
 * @route '/machines'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::store
 * @see app/Http/Controllers/MachineController.php:137
 * @route '/machines'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MachineController::store
 * @see app/Http/Controllers/MachineController.php:137
 * @route '/machines'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MachineController::store
 * @see app/Http/Controllers/MachineController.php:137
 * @route '/machines'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\MachineController::show
 * @see app/Http/Controllers/MachineController.php:48
 * @route '/machines/{machine}'
 */
export const show = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/machines/{machine}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineController::show
 * @see app/Http/Controllers/MachineController.php:48
 * @route '/machines/{machine}'
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
* @see \App\Http\Controllers\MachineController::show
 * @see app/Http/Controllers/MachineController.php:48
 * @route '/machines/{machine}'
 */
show.get = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MachineController::show
 * @see app/Http/Controllers/MachineController.php:48
 * @route '/machines/{machine}'
 */
show.head = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MachineController::show
 * @see app/Http/Controllers/MachineController.php:48
 * @route '/machines/{machine}'
 */
    const showForm = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MachineController::show
 * @see app/Http/Controllers/MachineController.php:48
 * @route '/machines/{machine}'
 */
        showForm.get = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MachineController::show
 * @see app/Http/Controllers/MachineController.php:48
 * @route '/machines/{machine}'
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
* @see \App\Http\Controllers\MachineController::edit
 * @see app/Http/Controllers/MachineController.php:355
 * @route '/machines/{machine}/edit'
 */
export const edit = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/machines/{machine}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineController::edit
 * @see app/Http/Controllers/MachineController.php:355
 * @route '/machines/{machine}/edit'
 */
edit.url = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{machine}', parsedArgs.machine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::edit
 * @see app/Http/Controllers/MachineController.php:355
 * @route '/machines/{machine}/edit'
 */
edit.get = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MachineController::edit
 * @see app/Http/Controllers/MachineController.php:355
 * @route '/machines/{machine}/edit'
 */
edit.head = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MachineController::edit
 * @see app/Http/Controllers/MachineController.php:355
 * @route '/machines/{machine}/edit'
 */
    const editForm = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MachineController::edit
 * @see app/Http/Controllers/MachineController.php:355
 * @route '/machines/{machine}/edit'
 */
        editForm.get = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MachineController::edit
 * @see app/Http/Controllers/MachineController.php:355
 * @route '/machines/{machine}/edit'
 */
        editForm.head = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MachineController::update
 * @see app/Http/Controllers/MachineController.php:372
 * @route '/machines/{machine}'
 */
export const update = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/machines/{machine}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MachineController::update
 * @see app/Http/Controllers/MachineController.php:372
 * @route '/machines/{machine}'
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
* @see \App\Http\Controllers\MachineController::update
 * @see app/Http/Controllers/MachineController.php:372
 * @route '/machines/{machine}'
 */
update.put = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\MachineController::update
 * @see app/Http/Controllers/MachineController.php:372
 * @route '/machines/{machine}'
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
* @see \App\Http\Controllers\MachineController::update
 * @see app/Http/Controllers/MachineController.php:372
 * @route '/machines/{machine}'
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
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\MachineController::destroy
 * @see app/Http/Controllers/MachineController.php:403
 * @route '/machines/{machine}'
 */
export const destroy = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/machines/{machine}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MachineController::destroy
 * @see app/Http/Controllers/MachineController.php:403
 * @route '/machines/{machine}'
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
* @see \App\Http\Controllers\MachineController::destroy
 * @see app/Http/Controllers/MachineController.php:403
 * @route '/machines/{machine}'
 */
destroy.delete = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MachineController::destroy
 * @see app/Http/Controllers/MachineController.php:403
 * @route '/machines/{machine}'
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
* @see \App\Http\Controllers\MachineController::destroy
 * @see app/Http/Controllers/MachineController.php:403
 * @route '/machines/{machine}'
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
const machines = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
import: Object.assign(importMethod, importMethod7367d2),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default machines