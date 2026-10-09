import { defaultFilter } from './filter-context';
import { certificationStatuses } from './filters';

const sortWith = (filter, displays) => displays
  .map((display) => ({ value: display, display }))
  .sort((a, b) => filter.sortValues(filter, a, b))
  .map((v) => v.display);

describe('filter value order', () => {
  it('sorts values by their display text, ignoring case, by default', () => {
    expect(sortWith(defaultFilter, ['Drummond', 'acb one', 'Leidos', 'ICSA'])).toEqual(['acb one', 'Drummond', 'ICSA', 'Leidos']);
  });

  it('orders numbers in the display text by value by default', () => {
    expect(sortWith(defaultFilter, ['Edition 2015', 'Edition 2011', 'Edition 2014'])).toEqual(['Edition 2011', 'Edition 2014', 'Edition 2015']);
  });

  it('keeps the certification statuses in their own fixed order', () => {
    const shuffled = ['Retired', 'Active', 'Withdrawn by Developer', 'Suspended by ONC'];
    expect(shuffled
      .map((value) => ({ value }))
      .sort((a, b) => certificationStatuses.sortValues(certificationStatuses, a, b))
      .map((v) => v.value)).toEqual(['Active', 'Suspended by ONC', 'Withdrawn by Developer', 'Retired']);
  });
});
