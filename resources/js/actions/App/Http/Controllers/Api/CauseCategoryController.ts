import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CauseCategoryController::index
 * @see app/Http/Controllers/Api/CauseCategoryController.php:15
 * @route '/api/cause-categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/cause-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::index
 * @see app/Http/Controllers/Api/CauseCategoryController.php:15
 * @route '/api/cause-categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::index
 * @see app/Http/Controllers/Api/CauseCategoryController.php:15
 * @route '/api/cause-categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CauseCategoryController::index
 * @see app/Http/Controllers/Api/CauseCategoryController.php:15
 * @route '/api/cause-categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CauseCategoryController::index
 * @see app/Http/Controllers/Api/CauseCategoryController.php:15
 * @route '/api/cause-categories'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CauseCategoryController::index
 * @see app/Http/Controllers/Api/CauseCategoryController.php:15
 * @route '/api/cause-categories'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CauseCategoryController::index
 * @see app/Http/Controllers/Api/CauseCategoryController.php:15
 * @route '/api/cause-categories'
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
* @see \App\Http\Controllers\Api\CauseCategoryController::store
 * @see app/Http/Controllers/Api/CauseCategoryController.php:30
 * @route '/api/cause-categories'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/cause-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::store
 * @see app/Http/Controllers/Api/CauseCategoryController.php:30
 * @route '/api/cause-categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::store
 * @see app/Http/Controllers/Api/CauseCategoryController.php:30
 * @route '/api/cause-categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\CauseCategoryController::store
 * @see app/Http/Controllers/Api/CauseCategoryController.php:30
 * @route '/api/cause-categories'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\CauseCategoryController::store
 * @see app/Http/Controllers/Api/CauseCategoryController.php:30
 * @route '/api/cause-categories'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\CauseCategoryController::show
 * @see app/Http/Controllers/Api/CauseCategoryController.php:57
 * @route '/api/cause-categories/{cause_category}'
 */
export const show = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/cause-categories/{cause_category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::show
 * @see app/Http/Controllers/Api/CauseCategoryController.php:57
 * @route '/api/cause-categories/{cause_category}'
 */
show.url = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cause_category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    cause_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cause_category: args.cause_category,
                }

    return show.definition.url
            .replace('{cause_category}', parsedArgs.cause_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::show
 * @see app/Http/Controllers/Api/CauseCategoryController.php:57
 * @route '/api/cause-categories/{cause_category}'
 */
show.get = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CauseCategoryController::show
 * @see app/Http/Controllers/Api/CauseCategoryController.php:57
 * @route '/api/cause-categories/{cause_category}'
 */
show.head = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CauseCategoryController::show
 * @see app/Http/Controllers/Api/CauseCategoryController.php:57
 * @route '/api/cause-categories/{cause_category}'
 */
    const showForm = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CauseCategoryController::show
 * @see app/Http/Controllers/Api/CauseCategoryController.php:57
 * @route '/api/cause-categories/{cause_category}'
 */
        showForm.get = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CauseCategoryController::show
 * @see app/Http/Controllers/Api/CauseCategoryController.php:57
 * @route '/api/cause-categories/{cause_category}'
 */
        showForm.head = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\CauseCategoryController::update
 * @see app/Http/Controllers/Api/CauseCategoryController.php:74
 * @route '/api/cause-categories/{cause_category}'
 */
export const update = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/cause-categories/{cause_category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::update
 * @see app/Http/Controllers/Api/CauseCategoryController.php:74
 * @route '/api/cause-categories/{cause_category}'
 */
update.url = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cause_category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    cause_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cause_category: args.cause_category,
                }

    return update.definition.url
            .replace('{cause_category}', parsedArgs.cause_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::update
 * @see app/Http/Controllers/Api/CauseCategoryController.php:74
 * @route '/api/cause-categories/{cause_category}'
 */
update.put = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\CauseCategoryController::update
 * @see app/Http/Controllers/Api/CauseCategoryController.php:74
 * @route '/api/cause-categories/{cause_category}'
 */
update.patch = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\CauseCategoryController::update
 * @see app/Http/Controllers/Api/CauseCategoryController.php:74
 * @route '/api/cause-categories/{cause_category}'
 */
    const updateForm = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\CauseCategoryController::update
 * @see app/Http/Controllers/Api/CauseCategoryController.php:74
 * @route '/api/cause-categories/{cause_category}'
 */
        updateForm.put = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\CauseCategoryController::update
 * @see app/Http/Controllers/Api/CauseCategoryController.php:74
 * @route '/api/cause-categories/{cause_category}'
 */
        updateForm.patch = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\CauseCategoryController::destroy
 * @see app/Http/Controllers/Api/CauseCategoryController.php:105
 * @route '/api/cause-categories/{cause_category}'
 */
export const destroy = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/cause-categories/{cause_category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::destroy
 * @see app/Http/Controllers/Api/CauseCategoryController.php:105
 * @route '/api/cause-categories/{cause_category}'
 */
destroy.url = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cause_category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    cause_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cause_category: args.cause_category,
                }

    return destroy.definition.url
            .replace('{cause_category}', parsedArgs.cause_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CauseCategoryController::destroy
 * @see app/Http/Controllers/Api/CauseCategoryController.php:105
 * @route '/api/cause-categories/{cause_category}'
 */
destroy.delete = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\CauseCategoryController::destroy
 * @see app/Http/Controllers/Api/CauseCategoryController.php:105
 * @route '/api/cause-categories/{cause_category}'
 */
    const destroyForm = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\CauseCategoryController::destroy
 * @see app/Http/Controllers/Api/CauseCategoryController.php:105
 * @route '/api/cause-categories/{cause_category}'
 */
        destroyForm.delete = (args: { cause_category: string | number } | [cause_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CauseCategoryController = { index, store, show, update, destroy }

export default CauseCategoryController