import { matchAll } from './match-all';

const mock = {
    collection: [
        'aabb',
        'aabbcc',
        'bb',
    ],
};

let filter;

fdescribe('the matchAll filter', () => {
    beforeEach(() => {
        filter = {
            matchAll: {
                items: [],
            },
            separator: undefined,
        };
    });

    it('should allow items when there is nothing to compare to"', () => {
        let results = mock.collection.map(c => matchAll(c, filter));
        expect(results).toEqual([true, true, true]);
    });

    it('should not allow items that don\'t have values', () => {
        filter.matchAll.items.push('bbbbb');
        let results = matchAll(undefined, filter);
        expect(results).toEqual(false);
    });

    it('should match against full values', () => {
        filter.matchAll.items.push('aa');
        let results = mock.collection.map(c => matchAll(c, filter));
        expect(results).toEqual([true, true, false]);
    });

    it('should not match when nothing matches', () => {
        filter.matchAll.items.push('dd');
        let results = mock.collection.map(c => matchAll(c, filter));
        expect(results).toEqual([false, false, false]);
    });

    it('should match against multiple values', () => {
        filter.matchAll.items.push('aa');
        filter.matchAll.items.push('bb');
        let results = mock.collection.map(c => matchAll(c, filter));
        expect(results).toEqual([true, true, false]);
    });
});
