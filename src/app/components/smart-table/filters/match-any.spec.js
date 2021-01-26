import { matchAny } from './match-any';

const mock = {
    collection: [
        'aaaaa',
        'bbbbb',
        'aa',
    ],
};

let filter;

describe('the matchAny filter', () => {
    beforeEach(() => {
        filter = {
            matchAny: {
                items: [],
                matchFull: true,
            },
            separator: undefined,
        };
    });

    it('should allow items when there is nothing to compare to"', () => {
        let results = mock.collection.map(c => matchAny(c, filter));
        expect(results).toEqual([true, true, true]);
    });

    it('should not allow items that don\'t have values', () => {
        filter.matchAny.items.push('bbbbb');
        let results = matchAny(undefined, filter);
        expect(results).toEqual(false);
    });

    it('should match against full values', () => {
        filter.matchAny.items.push('bbbbb');
        let results = mock.collection.map(c => matchAny(c, filter));
        expect(results).toEqual([false, true, false]);
    });

    it('should match against partial values', () => {
        filter.matchAny.items.push('aa');
        filter.matchAny.matchFull = false;
        let results = mock.collection.map(c => matchAny(c, filter));
        expect(results).toEqual([true, false, true]);
    });

    it('should not match when nothing matches', () => {
        filter.matchAny.items.push('dddd');
        let results = mock.collection.map(c => matchAny(c, filter));
        expect(results).toEqual([false, false, false]);
    });

    it('should match against multiple values', () => {
        filter.matchAny.items.push('aaaaa');
        filter.matchAny.items.push('bbbbb');
        let results = mock.collection.map(c => matchAny(c, filter));
        expect(results).toEqual([true, true, false]);
    });
});
