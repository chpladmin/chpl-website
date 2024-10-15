import OverviewPage from '../pageobjects/overview.page';

const { expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

let page;

describe('the Overview page', () => {
  beforeEach(async () => {
    page = new OverviewPage();
    await page.open();
  });

  it('should have an ONC-ACB & ONC-ATL table', async () => {
    await expect(page.acbatlTable).toBeExisting();
  });
});
