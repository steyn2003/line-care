import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\MachineController::downloadTemplate
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/machines/import/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineController::downloadTemplate
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::downloadTemplate
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MachineController::downloadTemplate
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MachineController::downloadTemplate
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
    const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MachineController::downloadTemplate
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
        downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MachineController::downloadTemplate
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
        downloadTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadTemplate.form = downloadTemplateForm
/**
* @see \App\Http\Controllers\MachineController::validateImport
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
export const validateImport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateImport.url(options),
    method: 'post',
})

validateImport.definition = {
    methods: ["post"],
    url: '/machines/import/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MachineController::validateImport
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
validateImport.url = (options?: RouteQueryOptions) => {
    return validateImport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::validateImport
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
validateImport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateImport.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MachineController::validateImport
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
    const validateImportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: validateImport.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MachineController::validateImport
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
        validateImportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: validateImport.url(options),
            method: 'post',
        })
    
    validateImport.form = validateImportForm
/**
* @see \App\Http\Controllers\MachineController::confirmImport
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
export const confirmImport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmImport.url(options),
    method: 'post',
})

confirmImport.definition = {
    methods: ["post"],
    url: '/machines/import/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MachineController::confirmImport
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
confirmImport.url = (options?: RouteQueryOptions) => {
    return confirmImport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::confirmImport
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
confirmImport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmImport.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MachineController::confirmImport
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
    const confirmImportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmImport.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MachineController::confirmImport
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
        confirmImportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmImport.url(options),
            method: 'post',
        })
    
    confirmImport.form = confirmImportForm
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
const MachineController = { index, create, importMethod, downloadTemplate, validateImport, confirmImport, store, show, edit, update, destroy, import: importMethod }

export default MachineController