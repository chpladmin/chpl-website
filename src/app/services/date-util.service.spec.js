(() => {
    'use strict';

    fdescribe('the Date service', () => {
        var $log, date, mock;

        mock = {
            dateObject: {year: 2020, month: 'SEPTEMBER', dayOfMonth: 22},
            dateLong: 1596810840000,
        };

        beforeEach(() => {
            angular.mock.module('chpl.services');

            inject((_$log_, _DateUtil_) => {
                $log = _$log_;
                date = _DateUtil_;
            })
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('when converting dates to display form', () => {
            it('should convert a "Date" object into standard form', () => {
                expect(date.getDisplayDateFormat(mock.dateObject)).toBe('Sep 22, 2020');
            });

            it('should convert a "long" date into standard form', () => {
                expect(date.getDisplayDateFormat(mock.dateLong)).toBe('Aug 7, 2020');
            });

            it('should have a default when no value is provided', () => {
                expect(date.getDisplayDateFormat(undefined)).toBe('N/A');
                expect(date.getDisplayDateFormat(null)).toBe('N/A');
                expect(date.getDisplayDateFormat({})).toBe('N/A');
            });

            it('should allow a specified default when no value is provided', () => {
                expect(date.getDisplayDateFormat(undefined, 'no date provided')).toBe('no date provided');
                expect(date.getDisplayDateFormat(null, 'what date')).toBe('what date');
                expect(date.getDisplayDateFormat({}, 'not available')).toBe('not available');
            });
        });
    });
})();
