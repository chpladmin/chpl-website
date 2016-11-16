;(function () {
    'use strict';

    describe('app.common.certs.directive', function () {

        var element;
        var scope;
        var $log;

        var certs = '[{"title": "2011 Certifications","certs": [{"hasVersion": false,"number": "170.302(a)","title": "Dr","isActive": true},{"hasVersion": false,"number": "170.302(c)","title": "Main","isActive": false},],"numActive": 1},{"title": "2014 Certifications","certs": [{"hasVersion": false,"number": "170.314(a)(1)","title": "Compu","isActive": false},{"hasVersion": false,"number": "170.314(a)(2)","title": "Drug","isActive": true},],"numActive": 1},{"title": "Clinical Quality Measures","certs": [{"hasVersion": false,"number": "NQF 0001(A)","title": "Ast","isActive": true},{"hasVersion": false,"number": "NQF 0002(A)","title": "Ph","isActive": false},{"hasVersion": true,"number": "CMS100","title": "AM","isActive": false},{"hasVersion": true,"number": "CMS102","title": "St","isActive": true,"version": "v0"},],"numActive": 2}]';

        beforeEach(module('app.common',
                          'app/common/components/certs.html',
                          'app/common/components/certificationCriteria.html',
                          'app/common/components/a.html',
                          'app/common/components/cap.html',
                          'app/common/components/array.html'));

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            var template = $templateCache.get('app/common/components/certs.html');
            $templateCache.put('common/components/certs.html', template);
            template = $templateCache.get('app/common/components/certificationCriteria.html');
            $templateCache.put('common/components/certificationCriteria.html', template);
            template = $templateCache.get('app/common/components/a.html');
            $templateCache.put('common/components/a.html', template);
            template = $templateCache.get('app/common/components/cap.html');
            $templateCache.put('common/components/cap.html', template);
            template = $templateCache.get('app/common/components/array.html');
            $templateCache.put('common/components/array.html', template);
            $httpBackend.whenGET('common/components/surveillance/surveillance.html')
                .respond(200, '<div></div>');

            element = angular.element('<ai-certs edit-mode="true" certs=\'' + certs + '\' cqms=\'' + certs + '\'></ai-certs');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {
            var scope;
            var ctrl;

            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new({});

                ctrl = $controller('CertsController', {$scope: scope, $element: null});
            }));

            it('should exist', function() {
                expect(ctrl).toBeDefined();
            });
        });
    });
})();
