import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import ChplActionBar from './action-bar';

let container = null;
let dispatch;

describe('the ChplActionBar component', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    dispatch = jasmine.createSpy('dispatch');
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('renders', () => {
    act(() => {
      render(<ChplActionBar dispatch={dispatch} />, container);
    });
    expect(container.textContent).not.toBeUndefined();
  });

  describe('when there are errors and/or warnings', () => {
    it('should indicate there are more than one error', () => {
      act(() => {
        const errors = ['b', 'a'];
        render(<ChplActionBar dispatch={dispatch} errors={errors} />, container);
      });
      const text = container.textContent;
      const expected = 'Errors';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });

    it('should indicate there is exactly one error', () => {
      act(() => {
        const errors = ['b'];
        render(<ChplActionBar dispatch={dispatch} errors={errors} />, container);
      });
      const text = container.textContent;
      const expected = 'Error';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });

    it('should indicate there are more than one warning', () => {
      act(() => {
        const warnings = ['b', 'a'];
        render(<ChplActionBar dispatch={dispatch} warnings={warnings} />, container);
      });
      const text = container.textContent;
      const expected = 'Warnings';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });

    it('should indicate there is exactly one warning', () => {
      act(() => {
        const warnings = ['b'];
        render(<ChplActionBar dispatch={dispatch} warnings={warnings} />, container);
      });
      const text = container.textContent;
      const expected = 'Warning';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });

    it('should indicate there are errors and warnings', () => {
      act(() => {
        const errors = ['c', 'd'];
        const warnings = ['b', 'a'];
        render(<ChplActionBar dispatch={dispatch} errors={errors} warnings={warnings} />, container);
      });
      const text = container.textContent;
      const expected = 'Errors and Warnings';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });
  });
});
