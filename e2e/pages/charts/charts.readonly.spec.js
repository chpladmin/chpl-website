import ChartsPage from './charts.po';
import Hooks from '../../utilities/hooks';

const config = require('../../config/mainConfig');

let hooks, page;

describe('the charts page', () => {
  beforeAll(async () => {
    page = new ChartsPage();
    hooks = new Hooks();
    hooks.open('#/charts');
    await hooks.waitForSpinnerToDisappear();
  });

  describe('unique product charts', () => {
    beforeEach(() => {
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => page.chartTitle.isDisplayed(), config.shortTimeout);
    });

    it('should only show 2015 edition products', () => {
      expect(page.chartTitle.getText()).toBe('Number of 2015 Edition Unique Products certified to specific Certification Criteria');
    });

    it('should have the right options in the "view certification criteria" dropdown', () => {
      const expected = new Set(['All', '2015', '2015 Cures Update']);
      expect(page.dropdownOptions.length).toBe(expected.size);
      let options = [...new Set(page.dropdownOptions.map(item => item.getText()))];
      options.forEach(option => {
        expect(expected.has(option)).toBe(true, 'did not find expected option: "' + option + '"');
      });
    });
  });

  describe('non-conformity charts', () => {
    beforeEach( () => {
      page.nonconformityChartButton.click();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => page.chartTitle.isDisplayed(), config.shortTimeout);
    });

    it('should have the right options in the "view certification criteria" dropdown', () => {
      const expected = new Set(['All', '2015', '2015 Cures Update', 'Program']);
      expect(page.dropdownOptions.length).toBe(expected.size);
      let options = [...new Set(page.dropdownOptions.map(item => item.getText()))];
      options.forEach(option => {
        expect(expected.has(option)).toBe(true, 'did not find expected option: "' + option + '"');
      });
    });
  });
});
