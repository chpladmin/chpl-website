import { interpretCertificationStatusChanges, interpretPIHistory } from './history.service';

const deepFreeze = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

// Frozen, so writing onto or sorting the (cached) listing throws
const listing = () => deepFreeze({
  promotingInteroperabilityUserHistory: [
    { id: 2, userCount: 20, userCountDate: '2021-06-01' },
    { id: 1, userCount: 10, userCountDate: '2020-01-01' },
    { id: 3, userCount: 30, userCountDate: '2022-03-15' },
  ],
  certificationEvents: [
    { id: 1, eventTypeId: 1, eventDay: '2020-01-01' },
    { id: 2, certificationStatusName: 'Withdrawn by Developer', eventDay: '2021-01-01' },
    { id: 3, status: { name: 'Retired' }, eventDay: '2099-01-01' },
  ],
});

describe('listing history', () => {
  it('describes promoting interoperability changes in date order', () => {
    const changes = interpretPIHistory(listing());
    expect(changes.map((c) => c.id)).toEqual([1, 2, 3]);
    expect(changes[0].change[0]).toMatch(/^Estimated number of Promoting Interoperability Users became 10 on /);
    expect(changes[1].change[0]).toMatch(/changed from 10 to 20 on /);
    expect(changes.every((c) => typeof c.activityDate === 'number')).toBe(true);
  });

  it('leaves the listing\'s own promoting interoperability history untouched', () => {
    const original = listing();
    interpretPIHistory(original);
    expect(original.promotingInteroperabilityUserHistory.map((h) => h.id)).toEqual([2, 1, 3]);
    expect(original.promotingInteroperabilityUserHistory[0].change).toBeUndefined();
  });

  it('describes past certification status changes, without writing onto the listing\'s events', () => {
    const original = listing();
    const changes = interpretCertificationStatusChanges(original);
    expect(changes.map((c) => c.change[0])).toEqual([
      'Certification Status became "Active"',
      'Certification Status became "Withdrawn by Developer"',
    ]);
    expect(original.certificationEvents[0].change).toBeUndefined();
    expect(original.certificationEvents[0].activityDate).toBeUndefined();
  });
});
