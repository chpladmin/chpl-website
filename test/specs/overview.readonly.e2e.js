const { expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

const OverviewPage = require('../pageobjects/overview.page');

describe('the Overview page', () => {
  it('should have an ONC-ACB & ONC-ATL table', async () => {
    await OverviewPage.open();
    await expect(await OverviewPage.acbatlTable).toBeExisting();
  });
});
