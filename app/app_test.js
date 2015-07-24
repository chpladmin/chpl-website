;(function () {
    'use strict';

    describe('[app module]', function () {

        beforeEach(module('app'));

        var $log;
        beforeEach(inject(function (_$log_) {
            $log = _$log_;
        }));
        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should map "otherwise" routes to /search', function () {
            inject(function($route) {
                expect($route.routes[null].redirectTo).toEqual('/search');
            });
        });
    });
})();
