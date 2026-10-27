import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplComplaintView from './complaint-view';

const deepFreeze = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

// Frozen, so any in-place sort of the complaint (the query cache) throws
const complaint = deepFreeze({
  id: 1,
  certificationBody: { id: 1, name: 'Drummond Group' },
  complainantType: { id: 1, name: 'Developer' },
  receivedDate: '2024-01-02',
  summary: 'A summary',
  criteria: [],
  surveillances: [],
  listings: [
    { id: 2, chplProductNumber: '15.04.04.2913.Proc.10.01.1.231201' },
    { id: 1, chplProductNumber: '15.02.05.1234.ABCD.01.00.0.190101' },
  ],
});

describe('a complaint', () => {
  it('lists its listings by CHPL Product Number, without reordering the complaint', () => {
    render(<ChplComplaintView complaint={complaint} dispatch={jest.fn()} canEdit={false} />);
    expect(screen.getAllByText(/^15\./).map((el) => el.textContent)).toEqual([
      '15.02.05.1234.ABCD.01.00.0.190101',
      '15.04.04.2913.Proc.10.01.1.231201',
    ]);
    expect(complaint.listings.map((l) => l.id)).toEqual([2, 1]);
  });
});
