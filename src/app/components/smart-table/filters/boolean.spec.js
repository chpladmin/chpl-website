import { boolean } from './boolean';

const mock = {
    collection: [
        true,
        false,
    ],
};

fdescribe('the boolean filter', () => {
    it('should not allow "blanks"', () => {
        const filter = {boolean: 'True'};
        let results = boolean(undefined, filter);
        expect(results).toBe(false);
    });

    it('should allow "Any"', () => {
        const filter = {boolean: 'Any'};
        let results = mock.collection.map(c => boolean(c, filter));
        expect(results).toEqual([true, true]);
    });

    it('should filter for "True"', () => {
        const filter = {boolean: 'True'};
        let results = mock.collection.map(c => boolean(c, filter));
        expect(results).toEqual([true, false]);
    });

    it('should filter for "False"', () => {
        const filter = {boolean: 'False'};
        let results = mock.collection.map(c => boolean(c, filter));
        expect(results).toEqual([false, true]);
    });
});
