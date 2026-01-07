import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MachineController::template
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/machines/import/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineController::template
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::template
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MachineController::template
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MachineController::template
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
    const templateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: template.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MachineController::template
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
        templateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MachineController::template
 * @see app/Http/Controllers/MachineController.php:185
 * @route '/machines/import/template'
 */
        templateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    template.form = templateForm
/**
* @see \App\Http\Controllers\MachineController::validate
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
export const validate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

validate.definition = {
    methods: ["post"],
    url: '/machines/import/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MachineController::validate
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
validate.url = (options?: RouteQueryOptions) => {
    return validate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::validate
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
validate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MachineController::validate
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
    const validateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: validate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MachineController::validate
 * @see app/Http/Controllers/MachineController.php:197
 * @route '/machines/import/validate'
 */
        validateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: validate.url(options),
            method: 'post',
        })
    
    validate.form = validateForm
/**
* @see \App\Http\Controllers\MachineController::confirm
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
export const confirm = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/machines/import/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MachineController::confirm
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
confirm.url = (options?: RouteQueryOptions) => {
    return confirm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineController::confirm
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
confirm.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MachineController::confirm
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
    const confirmForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirm.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MachineController::confirm
 * @see app/Http/Controllers/MachineController.php:286
 * @route '/machines/import/confirm'
 */
        confirmForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirm.url(options),
            method: 'post',
        })
    
    confirm.form = confirmForm
const importMethod = {
    template: Object.assign(template, template),
validate: Object.assign(validate, validate),
confirm: Object.assign(confirm, confirm),
}

export default importMethod