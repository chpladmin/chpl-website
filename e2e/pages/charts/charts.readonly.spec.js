import { open } from '../../utilities/hooks';

import ChartsPage from './charts.po';

const config = require('../../config/mainConfig');

let page;

describe('the charts page', () => {
  beforeAll(async () => {
    page = new ChartsPage();
    await open('#/charts');    
  });

  it('should display unique product charts tab', async () => {
    await expect(await (await page.chartTabs('Unique Product charts')).isDisplayed()).toBe(true);
  });

  it('should display nonconformity charts tab', async () => {
    await expect(await (await page.chartTabs('Nonconformity charts')).isDisplayed()).toBe(true);
  });

  describe('unique product charts tab', () => {
    beforeEach(async () => {
      await browser.waitUntil(async () => page.chartTitle.isDisplayed(), config.shortTimeout);
    });

    it('should display 1 chart', async () => {
      await expect(page.chart.length).toBe(1);
    });

    it('should display correct title of the chart about 2015 edition products', async () => {
      await expect(await page.chartTitle.getText()).toBe('Number of Unique Products certified to specific Certification Criteria');
    });
  });

  describe('non-conformity charts tab', () => {
    beforeEach(async () => {
      await (await page.chartTabs('Nonconformity charts')).click();
      await browser.waitUntil(async () => page.chartTitle.isDisplayed(), config.shortTimeout);
    });

    it('should display 1 chart', async () => {
      await expect(page.chart.length).toBe(1);
    });

    it('should have the right number of options in the "View the number of Non-conformities" dropdown', async () => {
      const expected = new Set(['All', 'Certification Criteria', 'Program']);
      await expect(page.programTypeDropdownOptions.length).toBe(expected.size);
    });

    it('should have the right number of options in the "Y-Axis Type" dropdown', async () => {
      const expected = new Set(['Linear', 'Log']);
      await expect(page.axisDropdownOptions.length).toBe(expected.size);
    });
  });
});
