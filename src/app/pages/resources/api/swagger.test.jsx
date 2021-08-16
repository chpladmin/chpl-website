import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplSwagger from './api';

const url = 'http://www.example.com';

describe('the ChplSwagger component', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(async () => {
    render(
      <ChplSwagger url={url} />,
    );
  });

  describe('when rendering', () => {
    it('should exist', async () => {
      await waitFor(() => {
        expect(screen).not.toBe(null);
      });
    });
  });
});
