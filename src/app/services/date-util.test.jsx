import { getDisplayDateFormat } from './date-util';

describe('the date utility', () => {
  describe('when displaying in the standard format', () => {
    it('should return "n/a" for objects', () => {
      const date = { value: 3 };
      const expected = 'N/A';
      expect(getDisplayDateFormat(date)).toBe(expected);
    });

    it('should return "n/a" for invalid strings', () => {
      const date = 'not a real date';
      const expected = 'N/A';
      expect(getDisplayDateFormat(date)).toBe(expected);
    });

    it('should parse long values', () => {
      const date = 1654091112985;
      const expected = 'Jun 1, 2022 9:45:12 AM';
      expect(getDisplayDateFormat(date)).toBe(expected);
    });

    it('should parse local date/times', () => {
      const date = '2022-09-30T15:13:00';
      const expected = 'Sep 30, 2022 3:13:00 PM';
      expect(getDisplayDateFormat(date)).toBe(expected);
    });

    it('should parse local dates', () => {
      const date = '2021-09-30';
      const expected = 'Sep 30, 2021';
      expect(getDisplayDateFormat(date)).toBe(expected);
    });
  });
});
