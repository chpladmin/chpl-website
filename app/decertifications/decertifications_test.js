;(function () {
    'use strict';

    describe('app.decertifications', function () {

        var scope, $log, mockAuthService, mockCommonService, ctrl;

        beforeEach(function () {
            module('app.decertifications');
        });

        it('should map /decertification routes to /decertifications', function () {
            inject(function($route) {
                expect($route.routes['/decertifications/developers'].templateUrl).toEqual('decertifications/developers/developers.html');
            });
        });
    });
})();
