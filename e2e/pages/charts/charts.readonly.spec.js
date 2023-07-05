import Hooks from '../../utilities/hooks';

import ChartsPage from './charts.po';

const config = require('../../config/mainConfig');

let hooks;
let page;

describe('the charts page', () => {
  beforeAll(async () => {
    page = new ChartsPage();
    hooks = new Hooks();
    hooks.open('#/charts');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should display unique product charts tab', () => {
    expect(page.chartTabs('Unique Product charts').isDisplayed()).toBe(true);
  });

  it('should display developer charts tab', () => {
    expect(page.chartTabs('Developer charts').isDisplayed()).toBe(true);
  });

  it('should display SED participant charts tab', () => {
    expect(page.chartTabs('SED Participant charts').isDisplayed()).toBe(true);
  });

  it('should display nonconformity charts tab', () => {
    expect(page.chartTabs('Nonconformity charts').isDisplayed()).toBe(true);
  });

  describe('unique product charts tab', () => {
    beforeEach(() => {
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => page.chartTitle.isDisplayed(), config.shortTimeout);
    });

    it('should display 1 chart', () => {
      expect(page.chart.length).toBe(1);
    });

    it('should display correct title of the chart about 2015 edition products', () => {
      expect(page.chartTitle.getText()).toBe('Number of 2015 Edition Unique Products certified to specific Certification Criteria');
    });

    it('should have the right options in the "view certification criteria" dropdown', () => {
      const expected = new Set(['All', '2015', '2015 Cures Update']);
      expect(page.programTypeDropdownOptions.length).toBe(expected.size);
      const options = [...new Set(page.programTypeDropdownOptions.map((item) => item.getText()))];
      options.forEach((option) => {
        expect(expected.has(option)).toBe(true, `did not find expected option: "${option}"`);
      });
    });
  });

  describe('non-conformity charts tab', () => {
    beforeEach(() => {
      page.chartTabs('Nonconformity charts').click();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => page.chartTitle.isDisplayed(), config.shortTimeout);
    });

    it('should display 1 chart', () => {
      expect(page.chart.length).toBe(1);
    });

    it('should have the right options in the "View the number of Non-conformities" dropdown', () => {
      const expected = new Set(['All', '2015', '2015 Cures Update', 'Program']);
      expect(page.programTypeDropdownOptions.length).toBe(expected.size);
      const options = [...new Set(page.programTypeDropdownOptions.map((item) => item.getText()))];
      options.forEach((option) => {
        expect(expected.has(option)).toBe(true, `did not find expected option: "${option}"`);
      });
    });

    it('should have the right options in the "Y-Axis Type" dropdown', () => {
      const expected = new Set(['Linear', 'Log']);
      expect(page.axisDropdownOptions.length).toBe(expected.size);
      const options = [...new Set(page.axisDropdownOptions.map((item) => item.getText()))];
      options.forEach((option) => {
        expect(expected.has(option)).toBe(true, `did not find expected option: "${option}"`);
      });
    });
  });

  describe('SED participant charts tab', () => {
    beforeEach(() => {
      page.chartTabs('SED Participant charts').click();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => page.chartTitle.isDisplayed(), config.shortTimeout);
    });

    it('should display 7 charts', () => {
      expect(page.chart.length).toBe(7);
    });
  });

  describe('developer charts tab', () => {
    beforeEach(() => {
      page.chartTabs('Developer charts').click();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => page.chartTitle.isDisplayed(), config.shortTimeout);
    });

    it('should display 5 charts', () => {
      expect(page.chart.length).toBe(5);
    });

    it('should have the right options in the "Certification status" dropdown', () => {
      const expected = new Set(['Active', 'Suspended by ONC-ACB', 'Withdrawn by Developer', 'Withdrawn by ONC-ACB']);
      expect(page.certificationStatusDropdownOptions.length).toBe(expected.size);
      const options = [...new Set(page.certificationStatusDropdownOptions.map((item) => item.getText()))];
      options.forEach((option) => {
        expect(expected.has(option)).toBe(true, `did not find expected option: "${option}"`);
      });
    });

    it('should have the right options in the "Stacking type" dropdown', () => {
      const expected = new Set(['Percent', 'Absolute', 'None']);
      expect(page.stackingTypeDropdownOptions.length).toBe(expected.size);
      const options = [...new Set(page.stackingTypeDropdownOptions.map((item) => item.getText()))];
      options.forEach((option) => {
        expect(expected.has(option)).toBe(true, `did not find expected option: "${option}"`);
      });
    });
  });
});
