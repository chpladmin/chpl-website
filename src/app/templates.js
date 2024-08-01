const ctxs = [];
ctxs.push({ module: 'chpl.administration', ctx: require.context('./pages/administration/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.charts', ctx: require.context('./pages/charts/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.compare', ctx: require.context('./pages/compare/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.components', ctx: require.context('./components/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.collections', ctx: require.context('./pages/collections/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.home', ctx: require.context('./pages/home/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.listing', ctx: require.context('./pages/listing/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.navigation', ctx: require.context('./navigation/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.organizations', ctx: require.context('./pages/organizations/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.registration', ctx: require.context('./pages/registration/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.reports', ctx: require.context('./pages/reports/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.resources', ctx: require.context('./pages/resources/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.services', ctx: require.context('./services/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.surveillance', ctx: require.context('./pages/surveillance/', true, /.*\.html$/) });
ctxs.push({ module: 'chpl.users', ctx: require.context('./pages/users/', true, /.*\.html$/) });

ctxs.forEach((obj) => {
  angular.module(obj.module).run([
    '$templateCache',
    ($templateCache) => {
      obj.ctx.keys().forEach((key) => {
        $templateCache.put(key.replace('./', `${obj.module}/`), obj.ctx(key));
      });
    },
  ]);
});
