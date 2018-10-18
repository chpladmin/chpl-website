(function () {
    'use strict';

    fdescribe('the Report Utility service', () => {
        var $log, service;

        beforeEach(() => {
            angular.mock.module('chpl.admin');

            inject((_$log_, _ReportService_) => {
                $log = _$log_;
                service = _ReportService_;
            })
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('when comparing MUU objects', () => {
            it('should report when an item was added to an empty array', () => {
                const before = [];
                const after = angular.copy(before).concat({ muuCount: 10, muuDate: 1439799743364 });
                expect(service.compareMuuHistory(before, after)).toEqual(['<li>Added MUU Count of 10 on Aug 17, 2015</li>']);
            });

            it('should report when an item was added to a populated array', () => {
                const before = [{ muuCount: 0, muuDate: 1539799743364 }];
                const after = angular.copy(before).concat({ muuCount: 10, muuDate: 1439799743364 });
                expect(service.compareMuuHistory(before, after)).toEqual(['<li>Added MUU Count of 10 on Aug 17, 2015</li>']);
            });

            it('should report when an item was removed making an empty array', () => {
                const before = [{ muuCount: 10, muuDate: 1439799743364 }];
                const after = [];
                expect(service.compareMuuHistory(before, after)).toEqual(['<li>Removed MUU Count of 10 from Aug 17, 2015</li>']);
            });

            it('should report when an item was removed, leaving a populated array', () => {
                const before = [{ muuCount: 0, muuDate: 1539799743364 }, { muuCount: 10, muuDate: 1439799743364 }];
                const after = angular.copy(before).slice(1);
                expect(service.compareMuuHistory(before, after)).toEqual(['<li>Removed MUU Count of 0 from Oct 17, 2018</li>']);
            });

            it('should report when a value was changed', () => {
                const before = [{ muuCount: 10, muuDate: 1439799743364 }];
                const after = angular.copy(before);
                after[0].muuCount = 30;
                expect(service.compareMuuHistory(before, after)).toEqual(['<li>MUU Count changed from 10 to 30 on Aug 17, 2015</li>']);
            });

            it('should handle nulls', () => {
                expect(service.compareMuuHistory(null, null)).toEqual([]);
            });

            it('should handle empty arrays', () => {
                expect(service.compareMuuHistory([], [])).toEqual([]);
            });

            it('should handle undefined', () => {
                expect(service.compareMuuHistory([], undefined)).toEqual([]);
            });

            it('should handle non-arrays', () => {
                expect(service.compareMuuHistory(8, {id: 'wrong'})).toEqual([]);
            });
        });
    });
})();
