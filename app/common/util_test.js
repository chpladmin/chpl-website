;(function () {
    'use strict';

    describe('app.common.util', function () {

        beforeEach(module('app.common'));

        var util, $log, mock;
        mock = {
            options: [],
            newValue: 'fake',
            secondValue: 'a second value'
        };

        beforeEach(inject(function (_utilService_, _$log_) {
            $log = _$log_;
            util = _utilService_;
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should have a function to add an option to a select', function () {
            expect(util.extendSelect).toBeDefined();
        });

        it('should update the options when a new item is changed', function () {
            var options = util.extendSelect(mock.options, mock.newValue);
            expect(options).toEqual([{name: mock.newValue}]);
        });

        it('shouldn\'t add a new object if one was already added', function () {
            var options = util.extendSelect(mock.options, mock.newValue);
            options = util.extendSelect(mock.options, mock.secondValue);
            expect(options).toEqual([{name: mock.secondValue}]);
            expect(options.length).toBe(1);
        });

        it('should be able to sort certs', function () {
            expect(util.sortCert('170.314 (a)(1)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
            expect(util.sortCert('170.314 (a)(2)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
            expect(util.sortCert('170.314 (a)(2)')).toBeLessThan(util.sortCert('170.315 (a)(10)'));
            expect(util.sortCert('170.302 (a)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
        });

        it('should be able to sort cqms', function () {
            expect(util.sortCqm('NQF-0031')).toBeLessThan(util.sortCqm('NQF-0100'));
            expect(util.sortCqm('NQF-0031')).toBeGreaterThan(util.sortCqm('CMS107'));
            expect(util.sortCqm('CMS26')).toBeLessThan(util.sortCqm('CMS107'));
        });
    });
})();
