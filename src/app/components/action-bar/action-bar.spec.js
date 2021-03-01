import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';

import {ChplActionBar} from './action-bar.jsx';

let container = null;

describe('the ChplActionBar component', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('renders', () => {
    act(() => {
      render(<ChplActionBar />, container);
    });
    expect(container.textContent).not.toBeUndefined();
  });

  describe('when there are errors and/or warnings', () => {
    it('should indicate there are more than one error', () => {
      act(() => {
        let errors = ['b', 'a'];
        render(<ChplActionBar errors={errors} />, container);
      });
      let text = container.textContent;
      const expected = 'Errors';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });

    it('should indicate there is exactly one error', () => {
      act(() => {
        let errors = ['b'];
        render(<ChplActionBar errors={errors} />, container);
      });
      let text = container.textContent;
      const expected = 'Error';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });

    it('should indicate there are more than one warning', () => {
      act(() => {
        let warnings = ['b', 'a'];
        render(<ChplActionBar warnings={warnings} />, container);
      });
      let text = container.textContent;
      const expected = 'Warnings';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });

    it('should indicate there is exactly one warning', () => {
      act(() => {
        let warnings = ['b'];
        render(<ChplActionBar warnings={warnings} />, container);
      });
      let text = container.textContent;
      const expected = 'Warning';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });

    it('should indicate there are errors and warnings', () => {
      act(() => {
        let errors = ['c', 'd'];
        let warnings = ['b', 'a'];
        render(<ChplActionBar errors={errors} warnings={warnings} />, container);
      });
      let text = container.textContent;
      const expected = 'Errors and Warnings';
      expect(text.startsWith(expected)).toBe(true, `expected: "${expected}" got: "${text}"`);
    });
  });
});
