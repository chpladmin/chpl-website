import { dateRange } from './date-range';

const mock = {
    collection: [
        100,
        200,
    ],
};

describe('the dateRange filter', () => {
    it('should allow blank ranges"', () => {
        const filter = {};
        let results = mock.collection.map(c => dateRange(c, filter));
        expect(results).toEqual([true, true]);
    });

    it('should filter for "Before"', () => {
        const filter = {before: 150};
        let results = mock.collection.map(c => dateRange(c, filter));
        expect(results).toEqual([true, false]);
    });

    it('should filter for "After"', () => {
        const filter = {after: 150};
        let results = mock.collection.map(c => dateRange(c, filter));
        expect(results).toEqual([false, true]);
    });
});
