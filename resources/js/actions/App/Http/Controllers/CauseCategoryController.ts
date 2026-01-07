import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CauseCategoryController::index
 * @see app/Http/Controllers/CauseCategoryController.php:12
 * @route '/cause-categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cause-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CauseCategoryController::index
 * @see app/Http/Controllers/CauseCategoryController.php:12
 * @route '/cause-categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CauseCategoryController::index
 * @see app/Http/Controllers/CauseCategoryController.php:12
 * @route '/cause-categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CauseCategoryController::index
 * @see app/Http/Controllers/CauseCategoryController.php:12
 * @route '/cause-categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CauseCategoryController::index
 * @see app/Http/Controllers/CauseCategoryController.php:12
 * @route '/cause-categories'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CauseCategoryController::index
 * @see app/Http/Controllers/CauseCategoryController.php:12
 * @route '/cause-categories'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CauseCategoryController::index
 * @see app/Http/Controllers/CauseCategoryController.php:12
 * @route '/cause-categories'
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
* @see \App\Http\Controllers\CauseCategoryController::store
 * @see app/Http/Controllers/CauseCategoryController.php:26
 * @route '/cause-categories'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cause-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CauseCategoryController::store
 * @see app/Http/Controllers/CauseCategoryController.php:26
 * @route '/cause-categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CauseCategoryController::store
 * @see app/Http/Controllers/CauseCategoryController.php:26
 * @route '/cause-categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CauseCategoryController::store
 * @see app/Http/Controllers/CauseCategoryController.php:26
 * @route '/cause-categories'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CauseCategoryController::store
 * @see app/Http/Controllers/CauseCategoryController.php:26
 * @route '/cause-categories'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CauseCategoryController::update
 * @see app/Http/Controllers/CauseCategoryController.php:51
 * @route '/cause-categories/{causeCategory}'
 */
export const update = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/cause-categories/{causeCategory}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CauseCategoryController::update
 * @see app/Http/Controllers/CauseCategoryController.php:51
 * @route '/cause-categories/{causeCategory}'
 */
update.url = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { causeCategory: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { causeCategory: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    causeCategory: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        causeCategory: typeof args.causeCategory === 'object'
                ? args.causeCategory.id
                : args.causeCategory,
                }

    return update.definition.url
            .replace('{causeCategory}', parsedArgs.causeCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CauseCategoryController::update
 * @see app/Http/Controllers/CauseCategoryController.php:51
 * @route '/cause-categories/{causeCategory}'
 */
update.put = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CauseCategoryController::update
 * @see app/Http/Controllers/CauseCategoryController.php:51
 * @route '/cause-categories/{causeCategory}'
 */
    const updateForm = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CauseCategoryController::update
 * @see app/Http/Controllers/CauseCategoryController.php:51
 * @route '/cause-categories/{causeCategory}'
 */
        updateForm.put = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CauseCategoryController::destroy
 * @see app/Http/Controllers/CauseCategoryController.php:66
 * @route '/cause-categories/{causeCategory}'
 */
export const destroy = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cause-categories/{causeCategory}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CauseCategoryController::destroy
 * @see app/Http/Controllers/CauseCategoryController.php:66
 * @route '/cause-categories/{causeCategory}'
 */
destroy.url = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { causeCategory: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { causeCategory: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    causeCategory: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        causeCategory: typeof args.causeCategory === 'object'
                ? args.causeCategory.id
                : args.causeCategory,
                }

    return destroy.definition.url
            .replace('{causeCategory}', parsedArgs.causeCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CauseCategoryController::destroy
 * @see app/Http/Controllers/CauseCategoryController.php:66
 * @route '/cause-categories/{causeCategory}'
 */
destroy.delete = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CauseCategoryController::destroy
 * @see app/Http/Controllers/CauseCategoryController.php:66
 * @route '/cause-categories/{causeCategory}'
 */
    const destroyForm = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CauseCategoryController::destroy
 * @see app/Http/Controllers/CauseCategoryController.php:66
 * @route '/cause-categories/{causeCategory}'
 */
        destroyForm.delete = (args: { causeCategory: number | { id: number } } | [causeCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CauseCategoryController = { index, store, update, destroy }

export default CauseCategoryController