import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplTestToolsView from './test-tools-view';

import { FilterProvider } from 'components/filter';

const deepFreeze = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

const criterion = (id, number) => ({
  id, number, title: number, status: 'ACTIVE',
});

// Frozen, so sorting a test tool's criteria (the query cache) in place throws
const testTools = deepFreeze([
  {
    id: 2, value: 'beta tool', startDay: '2020-01-01', criteria: [criterion(2, '170.315 (b)(1)'), criterion(1, '170.315 (a)(1)')],
  },
  {
    id: 1, value: 'Alpha tool', startDay: '2019-01-01', criteria: [],
  },
]);

describe('the test tools list', () => {
  it('sorts the tools by value, ignoring case, and lists each one\'s criteria in order, without reordering them', () => {
    render(
      <FilterProvider filters={[]} storageKey="test-testTools">
        <ChplTestToolsView testTools={testTools} dispatch={jest.fn()} />
      </FilterProvider>,
    );
    expect(screen.getAllByText(/ tool$/).map((el) => el.textContent)).toEqual(['Alpha tool', 'beta tool']);
    expect(screen.getByText('170.315 (a)(1), 170.315 (b)(1)')).toBeInTheDocument();
    expect(testTools[0].criteria.map((c) => c.id)).toEqual([2, 1]);
  });
});
