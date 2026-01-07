import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:14
 * @route '/oplossing'
 */
export const oplossing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oplossing.url(options),
    method: 'get',
})

oplossing.definition = {
    methods: ["get","head"],
    url: '/oplossing',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:14
 * @route '/oplossing'
 */
oplossing.url = (options?: RouteQueryOptions) => {
    return oplossing.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:14
 * @route '/oplossing'
 */
oplossing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oplossing.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:14
 * @route '/oplossing'
 */
oplossing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: oplossing.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:14
 * @route '/oplossing'
 */
    const oplossingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: oplossing.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:14
 * @route '/oplossing'
 */
        oplossingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: oplossing.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:14
 * @route '/oplossing'
 */
        oplossingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: oplossing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    oplossing.form = oplossingForm
/**
 * @see routes/web.php:20
 * @route '/functionaliteiten'
 */
export const functionaliteiten = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: functionaliteiten.url(options),
    method: 'get',
})

functionaliteiten.definition = {
    methods: ["get","head"],
    url: '/functionaliteiten',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:20
 * @route '/functionaliteiten'
 */
functionaliteiten.url = (options?: RouteQueryOptions) => {
    return functionaliteiten.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:20
 * @route '/functionaliteiten'
 */
functionaliteiten.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: functionaliteiten.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:20
 * @route '/functionaliteiten'
 */
functionaliteiten.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: functionaliteiten.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:20
 * @route '/functionaliteiten'
 */
    const functionaliteitenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: functionaliteiten.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:20
 * @route '/functionaliteiten'
 */
        functionaliteitenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: functionaliteiten.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:20
 * @route '/functionaliteiten'
 */
        functionaliteitenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: functionaliteiten.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    functionaliteiten.form = functionaliteitenForm
/**
 * @see routes/web.php:26
 * @route '/prijzen'
 */
export const prijzen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prijzen.url(options),
    method: 'get',
})

prijzen.definition = {
    methods: ["get","head"],
    url: '/prijzen',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:26
 * @route '/prijzen'
 */
prijzen.url = (options?: RouteQueryOptions) => {
    return prijzen.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:26
 * @route '/prijzen'
 */
prijzen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prijzen.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:26
 * @route '/prijzen'
 */
prijzen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: prijzen.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:26
 * @route '/prijzen'
 */
    const prijzenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: prijzen.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:26
 * @route '/prijzen'
 */
        prijzenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prijzen.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:26
 * @route '/prijzen'
 */
        prijzenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prijzen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    prijzen.form = prijzenForm
/**
 * @see routes/web.php:32
 * @route '/voor-wie'
 */
export const voorWie = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: voorWie.url(options),
    method: 'get',
})

voorWie.definition = {
    methods: ["get","head"],
    url: '/voor-wie',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:32
 * @route '/voor-wie'
 */
voorWie.url = (options?: RouteQueryOptions) => {
    return voorWie.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:32
 * @route '/voor-wie'
 */
voorWie.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: voorWie.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:32
 * @route '/voor-wie'
 */
voorWie.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: voorWie.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:32
 * @route '/voor-wie'
 */
    const voorWieForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: voorWie.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:32
 * @route '/voor-wie'
 */
        voorWieForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: voorWie.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:32
 * @route '/voor-wie'
 */
        voorWieForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: voorWie.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    voorWie.form = voorWieForm
/**
 * @see routes/web.php:38
 * @route '/over-ons'
 */
export const overOns = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overOns.url(options),
    method: 'get',
})

overOns.definition = {
    methods: ["get","head"],
    url: '/over-ons',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:38
 * @route '/over-ons'
 */
overOns.url = (options?: RouteQueryOptions) => {
    return overOns.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:38
 * @route '/over-ons'
 */
overOns.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overOns.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:38
 * @route '/over-ons'
 */
overOns.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overOns.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:38
 * @route '/over-ons'
 */
    const overOnsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overOns.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:38
 * @route '/over-ons'
 */
        overOnsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overOns.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:38
 * @route '/over-ons'
 */
        overOnsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overOns.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overOns.form = overOnsForm
const marketing = {
    oplossing: Object.assign(oplossing, oplossing),
functionaliteiten: Object.assign(functionaliteiten, functionaliteiten),
prijzen: Object.assign(prijzen, prijzen),
voorWie: Object.assign(voorWie, voorWie),
overOns: Object.assign(overOns, overOns),
}

export default marketing