const ctxs = [];
ctxs.push({module: 'chpl.admin', ctx: require.context('./admin/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.charts', ctx: require.context('./charts/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.chpl_api', ctx: require.context('./resources/chpl_api/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.compare', ctx: require.context('./compare/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.components', ctx: require.context('./components/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.cms_lookup', ctx: require.context('./resources/cms_lookup/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.collections', ctx: require.context('./collections/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.download', ctx: require.context('./resources/download/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.listing', ctx: require.context('./listing/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.navigation', ctx: require.context('./navigation/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.overview', ctx: require.context('./resources/overview/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.product', ctx: require.context('./product/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.registration', ctx: require.context('./registration/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.search', ctx: require.context('./search/', true, /.*\.html$/)});
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
