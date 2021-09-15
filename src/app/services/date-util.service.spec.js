(() => {
  describe('the Date service', () => {
    let $log;
    let date;
    const mock = {
      dateObject: { year: 2020, month: 'SEPTEMBER', dayOfMonth: 22 },
      dateLong: 1596810840000,
    };

    beforeEach(() => {
      angular.mock.module('chpl.services');

      inject((_$log_, _DateUtil_) => {
        $log = _$log_;
        date = _DateUtil_;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('when getting the certification date of a listing', () => {
      it('should convert a "long" object into the standard form', () => {
        const listing = {
          certificationDate: mock.dateLong,
        };
        expect(date.getCertificationDay(listing)).toBe('Aug 7, 2020');
      });
    });

    describe('when converting dates to display form', () => {
      it('should convert a "Date" object into standard form', () => {
        const localDate = '2020-09-09';
        expect(date.getDisplayDateFormat(localDate)).toBe('Sep 9, 2020');
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

    // These test are being skipped for the time being.  All of the hour checks are off by
    // 4 hours when run on the server as part of the plan.
    xdescribe('when converting a date parts to a timestamp', () => {
      it('should convert the year, month, and day into a timestamp', () => {
        const timestamp = date.datePartsToTimestamp(2020, 9, 9);
        const d = new Date(timestamp);
        expect(d.getFullYear()).toBe(2020);
        expect(d.getMonth()).toBe(8);
        expect(d.getDate()).toBe(9);
      });

      it('should have a time of midnight, if no time is passed in', () => {
        const timestamp = date.datePartsToTimestamp(2020, 9, 9);
        const d = new Date(timestamp);
        expect(d.getHours()).toBe(0);
        expect(d.getMinutes()).toBe(0);
        expect(d.getSeconds()).toBe(0);
      });

      it('should have a time of noon, when noon is passed in', () => {
        const timestamp = date.datePartsToTimestamp(2020, 9, 9, date.TimeOfDay.NOON);
        const d = new Date(timestamp);
        expect(d.getHours()).toBe(12);
        expect(d.getMinutes()).toBe(0);
        expect(d.getSeconds()).toBe(0);
      });

      it('should have a custom time, when a custom time is passed in', () => {
        const timestamp = date.datePartsToTimestamp(2020, 9, 9, 14, 21, 28, 10);
        const d = new Date(timestamp);
        expect(d.getHours()).toBe(14);
        expect(d.getMinutes()).toBe(21);
        expect(d.getSeconds()).toBe(28);
      });
    });

    xdescribe('when updating the time portion of a timestamp', () => {
      it('should correctly update the time portion of the timestamp, based on a constant', () => {
        const orig = new Date();
        const timestamp = date.updateTimePortionOfTimestamp(orig.getTime(), date.TimeOfDay.END_OF_DAY);
        const d = new Date(timestamp);
        expect(d.getHours()).toBe(23);
        expect(d.getMinutes()).toBe(59);
        expect(d.getSeconds()).toBe(59);
      });

      it('should correctly update the time portion of the timestamp, based on a custom time', () => {
        const orig = new Date();
        const timestamp = date.updateTimePortionOfTimestamp(orig.getTime(), 14, 21, 28, 10);
        const d = new Date(timestamp);
        expect(d.getHours()).toBe(14);
        expect(d.getMinutes()).toBe(21);
        expect(d.getSeconds()).toBe(28);
      });
    });

    xdescribe('when converting a timestamp to string', () => {
      it('should use the default format, when no format is passed in', () => {
        const orig = new Date(2020, 8, 9, 10, 11, 12, 13);
        const str = date.timestampToString(orig.getTime());
        expect(str).toBe('Sep 9, 2020 10:11:12 AM ET');
      });

      it('should use the passed in format, when provided', () => {
        const orig = new Date(2020, 8, 9, 10, 11, 12, 13);
        const str = date.timestampToString(orig.getTime(), 'MM/dd/yyyy');
        expect(str).toBe('09/09/2020');
      });
    });
  });
})();
