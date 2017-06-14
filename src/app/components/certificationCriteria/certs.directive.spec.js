(function () {
    'use strict';

    describe('chpl.certs.directive', function () {

        var vm, el, $log;

        var mock = {certs: '[{"title": "2011 Certifications","certs": [{"hasVersion": false,"number": "170.302(a)","title": "Dr","isActive": true},{"hasVersion": false,"number": "170.302(c)","title": "Main","isActive": false},],"numActive": 1},{"title": "2014 Certifications","certs": [{"hasVersion": false,"number": "170.314(a)(1)","title": "Compu","isActive": false},{"hasVersion": false,"number": "170.314(a)(2)","title": "Drug","isActive": true},],"numActive": 1},{"title": "Clinical Quality Measures","certs": [{"hasVersion": false,"number": "NQF 0001(A)","title": "Ast","isActive": true},{"hasVersion": false,"number": "NQF 0002(A)","title": "Ph","isActive": false},{"hasVersion": true,"number": "CMS100","title": "AM","isActive": false},{"hasVersion": true,"number": "CMS102","title": "St","isActive": true,"version": "v0"},],"numActive": 2}]'};

        beforeEach(function () {
            module('chpl.templates');
            module('chpl');

            inject(function ($compile, _$log_, $rootScope) {
                $log = _$log_;
                el = angular.element('<ai-certs edit-mode="true" certs=\'' + mock.certs + '\' cqms=\'' + mock.certs + '\'></ai-certs');
                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
        });
    });
})();
