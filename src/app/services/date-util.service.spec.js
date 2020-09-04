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
                //expect(date.getDisplayDateFormat(mock.dateObject)).toBe('Sep 22, 2020');
                expect(date.getDisplayDateFormat(date.jsJoda().LocalDate.of(2020, 9, 22))).toBe('Sep 22, 2020');
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

        //TODO: Determine how we can mock js-joda correctly to run these tests
        describe('when converting a LocalDate object to string', () => {
            it('should use the format that was passed in, if passed in', () => { });

            it('should use the default format, if one is not passed in', () => { });

            it('should use the jsJoda library to do conversion', () => { });
        });

        describe('when converting a long to ZonedDateTime object', () => {
            it('should use jsJoda library to create a ZonedDateTime object', () => { });

            it('should always create the ZonedDateTime based on Eastern Time (America/New_York)', () => { });
        });

        describe('when converting a ZonedDateTime object to a long', () => {
            it('should use the jsJoda library to generate the long value', () => { });
        });

        describe('when converting a ZonedDateTime object to a string', () => {
            it('should use the format that was passed in, if passed in', () => { });

            it('should use the default format, if one is not passed in', () => { });

            it('should use the jsJoda library to do conversion', () => { });
        });

        describe('when creating a ZonedDateTime based on date and time parts', () => {
            it('should use the default time, if one was not passed in', () => { });

            it('should use the passed in time, if one was passed in', () => { });

            it('should use the jsJoda library to generate the ZonedDateTime object', () => { });
        });
    });
})();
