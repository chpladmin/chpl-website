const { expect } = require('@wdio/globals');

const OverviewPage = require('../pageobjects/overview.page');

describe('the Overview page', () => {
  it('should have an ONC-ACB & ONC-ATL table', async () => {
    await OverviewPage.open();
    await expect(await OverviewPage.acbatlTable).toBeExisting();
  });
});
