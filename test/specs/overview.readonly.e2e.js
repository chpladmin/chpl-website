const { browser, expect } = require('@wdio/globals');

const OverviewPage = require('../pageobjects/overview.page');

describe('the Overview page', () => {
  it('should have an ONC-ACB & ONC-ATL table', async () => {
    await OverviewPage.open();
    console.log('--------------------------------------------------------------------------------');
    console.log(await browser.getUrl());
    console.log('--------------------------------------------------------------------------------');
    await browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
    await expect(await OverviewPage.acbatlTable).toBeExisting();
  });
});
