import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { bool, string } from 'prop-types';

import useResultsUpdating, { minimumSortUpdate } from './use-results-updating';

function ChplUpdatingProbe({ isFetching = false, isPreviousData = false, sortKey = 'developer-false' }) {
  const isUpdating = useResultsUpdating({ isFetching, isPreviousData, sortKey });
  return <div data-testid="state">{ isUpdating ? 'updating' : 'idle' }</div>;
}

ChplUpdatingProbe.propTypes = {
  isFetching: bool,
  isPreviousData: bool,
  sortKey: string,
};

const state = () => screen.getByTestId('state');

describe('whether results are updating', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  describe('as before', () => {
    it('is idle on first load, before any change', () => {
      render(<ChplUpdatingProbe />);

      expect(state()).toHaveTextContent('idle');
    });

    it('is updating while old results wait for a new page of them', () => {
      render(<ChplUpdatingProbe isFetching isPreviousData />);

      expect(state()).toHaveTextContent('updating');
    });

    it('ignores a background refetch of results already on screen', () => {
      render(<ChplUpdatingProbe isFetching />);

      expect(state()).toHaveTextContent('idle');
    });
  });

  describe('after a change of sort answered from the cache', () => {
    it('shows as updating for a moment, then settles', () => {
      const { rerender } = render(<ChplUpdatingProbe sortKey="developer-false" />);
      rerender(<ChplUpdatingProbe sortKey="developer-true" />);

      expect(state()).toHaveTextContent('updating');

      act(() => { jest.advanceTimersByTime(minimumSortUpdate); });

      expect(state()).toHaveTextContent('idle');
    });

    it('starts over each time the direction flips back and forth', () => {
      const { rerender } = render(<ChplUpdatingProbe sortKey="developer-false" />);
      rerender(<ChplUpdatingProbe sortKey="developer-true" />);
      act(() => { jest.advanceTimersByTime(minimumSortUpdate - 100); });
      rerender(<ChplUpdatingProbe sortKey="developer-false" />);
      act(() => { jest.advanceTimersByTime(minimumSortUpdate - 100); });

      expect(state()).toHaveTextContent('updating');

      act(() => { jest.advanceTimersByTime(100); });

      expect(state()).toHaveTextContent('idle');
    });

    it('stays updating past the moment if the new sort is still loading', () => {
      const { rerender } = render(<ChplUpdatingProbe sortKey="developer-false" />);
      rerender(<ChplUpdatingProbe sortKey="developer-true" isFetching isPreviousData />);
      act(() => { jest.advanceTimersByTime(minimumSortUpdate); });

      expect(state()).toHaveTextContent('updating');
    });
  });
});
