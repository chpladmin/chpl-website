/* eslint-disable no-console,angular/log */
import { compliance } from './compliance';

const mock = {
  collection: [
    '{"complianceCount":0,"openNonConformityCount":0,"closedNonConformityCount":0}',
    '{"complianceCount":1,"openNonConformityCount":0,"closedNonConformityCount":0}',
    '{"complianceCount":1,"openNonConformityCount":0,"closedNonConformityCount":1}',
    '{"complianceCount":1,"openNonConformityCount":1,"closedNonConformityCount":0}',
    '{"complianceCount":2,"openNonConformityCount":1,"closedNonConformityCount":1}',
  ],
};

describe('the compliance filter', () => {
  it('should not allow listings without compliance data', () => {
    const filter = {compliance: 'never'};
    let results = compliance(undefined, filter);
    expect(results).toBe(false);
  });

  it('should filter on "never"', () => {
    const filter = {compliance: 'never'};
    let results = mock.collection.map(c => compliance(c, filter));
    expect(results).toEqual([true, false, false, false, false]);
  });

  it('should filter on "has-had"', () => {
    const filter = {compliance: 'has-had'};
    let results = mock.collection.map(c => compliance(c, filter));
    expect(results).toEqual([false, true, true, true, true]);
  });

  describe('when "has-had" the nonconformity subsection', () => {
    it('should filter on "no NCs"', () => {
      const filter = {compliance: 'has-had', NC: {never: true}};
      let results = mock.collection.map(c => compliance(c, filter));
      expect(results).toEqual([false, true, false, false, false]);
    });

    it('should filter on "closed NCs"', () => {
      const filter = {compliance: 'has-had', NC: {closed: true}};
      let results = mock.collection.map(c => compliance(c, filter));
      expect(results).toEqual([false, false, true, false, true]);
    });

    it('should filter on "open NCs"', () => {
      const filter = {compliance: 'has-had', NC: {open: true}};
      let results = mock.collection.map(c => compliance(c, filter));
      expect(results).toEqual([false, false, false, true, true]);
    });

    describe('when matching all', () => {
      it('should only allow filter on "!never & closed & open"', () => {
        const filter = {compliance: 'has-had', matchAll: true, NC: {closed: true, open: true}};
        let results = mock.collection.map(c => compliance(c, filter));
        expect(results).toEqual([false, false, false, false, true]);
      });

      it('should filter out other "all"', () => {
        const filter = {compliance: 'has-had', matchAll: true, NC: {never: true, closed: true, open: true}};
        let results = mock.collection.map(c => compliance(c, filter));
        expect(results).toEqual([false, false, false, false, false]);
      });
    });

    describe('when matching any', () => {
      it('should filter on "open | closed NCs"', () => {
        const filter = {compliance: 'has-had', NC: {open: true, closed: true}};
        let results = mock.collection.map(c => compliance(c, filter));
        expect(results).toEqual([false, false, true, true, true]);
      });

      it('should filter on "never | closed NCs"', () => {
        const filter = {compliance: 'has-had', NC: {never: true, closed: true}};
        let results = mock.collection.map(c => compliance(c, filter));
        expect(results).toEqual([false, true, true, false, true]);
      });

      it('should filter on "never | open NCs"', () => {
        const filter = {compliance: 'has-had', NC: {never: true, open: true}};
        let results = mock.collection.map(c => compliance(c, filter));
        expect(results).toEqual([false, true, false, true, true]);
      });

      it('should filter on "never, closed | open NCs"', () => {
        const filter = {compliance: 'has-had', NC: {never: true, closed: true, open: true}};
        let results = mock.collection.map(c => compliance(c, filter));
        expect(results).toEqual([false, true, true, true, true]);
      });
    });
  });
});
