import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplApiKeyConfirm from './api-key-confirm';

import { usePostConfirmApiKey } from 'api/api-keys';

jest.mock('api/api-keys', () => ({
  usePostConfirmApiKey: jest.fn(),
}));

describe('confirming an API key', () => {
  it('shows the skeleton, not an empty "Your API key is:", until the request answers', () => {
    usePostConfirmApiKey.mockReturnValue({ mutate: jest.fn() });
    render(<ChplApiKeyConfirm hash="hash" />);
    expect(screen.getByRole('status')).toHaveTextContent('Confirming your API key');
    expect(screen.queryByTestId('api-key-display')).not.toBeInTheDocument();
  });

  it('shows the key once the request succeeds', () => {
    usePostConfirmApiKey.mockReturnValue({ mutate: (_hash, { onSuccess }) => onSuccess({ key: 'abc123' }) });
    render(<ChplApiKeyConfirm hash="hash" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTestId('api-key-display')).toHaveTextContent('abc123');
  });

  it('shows the error once the request fails', () => {
    usePostConfirmApiKey.mockReturnValue({ mutate: (_hash, { onError }) => onError() });
    render(<ChplApiKeyConfirm hash="hash" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTestId('api-key-error')).toBeInTheDocument();
  });
});
