const ctxs = [];
ctxs.push({module: 'chpl.overview', ctx: require.context('./resources/overview/', true, /.*\.html$/)});
ctxs.push({module: 'chpl.services', ctx: require.context('./services/', true, /.*\.html$/)});

ctxs.forEach(obj => {
    angular.module(obj.module).run([
        '$templateCache',
        function($templateCache) {
            obj.ctx.keys().forEach(key => {
                $templateCache.put(key.replace('./', `${obj.module}/`), obj.ctx(key));
            });
        }
    ]);
});
