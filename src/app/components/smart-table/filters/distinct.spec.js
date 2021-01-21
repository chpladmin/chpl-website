import { distinct } from './distinct';

const mock = {
    collection: [
        'aabb',
        'aabbcc',
        'bb',
    ],
};

let filter;

fdescribe('the distinct filter', () => {
    beforeEach(() => {
        filter = {
            distinct: undefined,
        };
    });

    it('should not allow items that don\'t have values', () => {
        let results = distinct(undefined, filter);
        expect(results).toEqual(false);
    });

    it('should match against values', () => {
        filter.distinct = 'aabb';
        let results = mock.collection.map(c => distinct(c, filter));
        expect(results).toEqual([true, false, false]);
    });
});
