const ctxs = [];
ctxs.push({module: 'chpl.admin', ctx: require.context('./admin/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.administration', ctx: require.context('./pages/administration/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.charts', ctx: require.context('./pages/charts/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.chpl_api', ctx: require.context('./pages/resources/chpl-api/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.compare', ctx: require.context('./pages/compare/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.components', ctx: require.context('./components/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.cms_lookup', ctx: require.context('./pages/resources/cms-lookup/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.collections', ctx: require.context('./pages/collections/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.download', ctx: require.context('./pages/resources/download/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.listing', ctx: require.context('./pages/listing/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.navigation', ctx: require.context('./navigation/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.overview', ctx: require.context('./pages/resources/overview/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.organizations', ctx: require.context('./pages/organizations/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.product', ctx: require.context('./product/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.registration', ctx: require.context('./pages/registration/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.reports', ctx: require.context('./pages/reports/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.search', ctx: require.context('./pages/search/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.services', ctx: require.context('./services/', true, /.*\.html$/)});

ctxs.forEach(obj => {
    angular.module(obj.module).run([
        '$templateCache',
        function ($templateCache) {
            obj.ctx.keys().forEach(key => {
                $templateCache.put(key.replace('./', `${ obj.module }/`), obj.ctx(key));
            });
        },
    ]);
});
