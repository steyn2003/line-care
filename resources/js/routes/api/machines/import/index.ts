import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MachineImportController::upload
 * @see app/Http/Controllers/Api/MachineImportController.php:19
 * @route '/api/machines/import/upload'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/api/machines/import/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MachineImportController::upload
 * @see app/Http/Controllers/Api/MachineImportController.php:19
 * @route '/api/machines/import/upload'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineImportController::upload
 * @see app/Http/Controllers/Api/MachineImportController.php:19
 * @route '/api/machines/import/upload'
 */
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\MachineImportController::upload
 * @see app/Http/Controllers/Api/MachineImportController.php:19
 * @route '/api/machines/import/upload'
 */
    const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\MachineImportController::upload
 * @see app/Http/Controllers/Api/MachineImportController.php:19
 * @route '/api/machines/import/upload'
 */
        uploadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(options),
            method: 'post',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\Api\MachineImportController::validate
 * @see app/Http/Controllers/Api/MachineImportController.php:81
 * @route '/api/machines/import/validate'
 */
export const validate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

validate.definition = {
    methods: ["post"],
    url: '/api/machines/import/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MachineImportController::validate
 * @see app/Http/Controllers/Api/MachineImportController.php:81
 * @route '/api/machines/import/validate'
 */
validate.url = (options?: RouteQueryOptions) => {
    return validate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineImportController::validate
 * @see app/Http/Controllers/Api/MachineImportController.php:81
 * @route '/api/machines/import/validate'
 */
validate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\MachineImportController::validate
 * @see app/Http/Controllers/Api/MachineImportController.php:81
 * @route '/api/machines/import/validate'
 */
    const validateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: validate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\MachineImportController::validate
 * @see app/Http/Controllers/Api/MachineImportController.php:81
 * @route '/api/machines/import/validate'
 */
        validateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: validate.url(options),
            method: 'post',
        })
    
    validate.form = validateForm
/**
* @see \App\Http\Controllers\Api\MachineImportController::confirm
 * @see app/Http/Controllers/Api/MachineImportController.php:164
 * @route '/api/machines/import/confirm'
 */
export const confirm = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/api/machines/import/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MachineImportController::confirm
 * @see app/Http/Controllers/Api/MachineImportController.php:164
 * @route '/api/machines/import/confirm'
 */
confirm.url = (options?: RouteQueryOptions) => {
    return confirm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MachineImportController::confirm
 * @see app/Http/Controllers/Api/MachineImportController.php:164
 * @route '/api/machines/import/confirm'
 */
confirm.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\MachineImportController::confirm
 * @see app/Http/Controllers/Api/MachineImportController.php:164
 * @route '/api/machines/import/confirm'
 */
    const confirmForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirm.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\MachineImportController::confirm
 * @see app/Http/Controllers/Api/MachineImportController.php:164
 * @route '/api/machines/import/confirm'
 */
        confirmForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirm.url(options),
            method: 'post',
        })
    
    confirm.form = confirmForm
const importMethod = {
    upload: Object.assign(upload, upload),
validate: Object.assign(validate, validate),
confirm: Object.assign(confirm, confirm),
}

export default importMethod