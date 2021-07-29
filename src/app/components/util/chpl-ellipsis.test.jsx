import React from 'react';
import {
  cleanup, render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplEllipsis from './chpl-ellipsis';

describe('the ChplEllipsis component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without shortening', async () => {
    render(
      <ChplEllipsis
        text="A string"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('A string')).toBeInTheDocument();
    });
  });

  it('renders while shortening', async () => {
    const text = 'A string that is long';
    const length = 10;
    render(
      <ChplEllipsis
        text={text}
        maxLength={length}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
      expect(screen.getByText(text.substring(0, length))).toBeInTheDocument();
    });
  });

  it('renders while breaking on spaces', async () => {
    const text = 'A string that is long';
    const length = 10;
    const wordBreak = true;
    render(
      <ChplEllipsis
        text={text}
        maxLength={length}
        wordBoundaries={wordBreak}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
      expect(screen.queryByText('A string t')).not.toBeInTheDocument();
      expect(screen.getByText('A string')).toBeInTheDocument();
    });
  });

  it('renders while giving up on breaking on spaces', async () => {
    const text = 'Astringthatislong';
    const length = 10;
    const wordBreak = true;
    render(
      <ChplEllipsis
        text={text}
        maxLength={length}
        wordBoundaries={wordBreak}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
      expect(screen.getByText('Astringtha')).toBeInTheDocument();
    });
  });
});
