;(function () {
    'use strict';

    describe('app.common.util', function () {

        beforeEach(module('app.common'));

        var utilService, $log, mock;

        beforeEach(inject(function (_utilService_, _$log_) {
            $log = _$log_;
            utilService = _utilService_;
            mock = {
                options: [],
                newValue: 'fake',
                secondValue: 'a second value'
            };
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should have a function to add an option to a select', function () {
            expect(utilService.extendSelect).toBeDefined();
        });

        it('should update the options when a new item is changed', function () {
            var options = utilService.extendSelect(mock.options, mock.newValue);
            expect(options).toEqual([{name: mock.newValue}]);
        });

        it('shouldn\'t add a new object if one was already added', function () {
            var options = utilService.extendSelect(mock.options, mock.newValue);
            options = utilService.extendSelect(mock.options, mock.secondValue);
            expect(options).toEqual([{name: mock.secondValue}]);
            expect(options.length).toBe(1);
        });
    });
})();
