import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplResourcesApi from './api';

describe('the ChplResourcesApi page', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(async () => {
    render(
      <ChplResourcesApi />,
    );
  });

  describe('when rendering', () => {
    it('should have a title', async () => {
      const item = screen.queryByText(/CHPL API/i);

      await waitFor(() => {
        expect(item).not.toBe(null);
      });
    });
  });
});
