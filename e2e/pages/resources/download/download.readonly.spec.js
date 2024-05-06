import LoginComponent from '../../../components/login/login.po';
import { open } from '../../../utilities/hooks';

import DownloadPage from './download.po';

let login;
let page;

describe('the Download page', () => {
  beforeEach(async () => {
    page = new DownloadPage();
    login = new LoginComponent();
    await open('#/resources/download');
  });

  describe('in the Certified Products Summary section', () => {
    it('should have correct information about Active Products Summary file', async () => {
      const expectedText = 'The Active products summary file is updated nightly.';
      await expect(await page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about Inactive Products Summary file', async () => {
      const expectedText = 'The Inactive products summary file is updated nightly.';
      await expect(await page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about 2014 Edition Summary file', async () => {
      const expectedText = 'The 2014 Edition Summary file is updated quarterly.';
      await expect(await page.content.getText()).toContain(expectedText);
    });
  });

  it('should have correct information about SVAP Summary (CSV)', async () => {
    const expectedText = 'Entire collection of SVAP values that have been associated with a criterion for a certified product. Multiple rows for a single product will appear in the file for any products containing multiple SVAP values and/or SVAP values for multiple criteria. Updated nightly.';
    await expect(await page.content.getText()).toContain(expectedText);
  });

  describe('in the compliance activities section', () => {
    it('should have correct information about Surveillance Activity (CSV)', async () => {
      const expectedText = 'Entire collection of surveillance activity reported to the CHPL.';
      await expect(await page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about Surveillance Non-Conformities (CSV)', async () => {
      const expectedText = 'Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above "Surveillance Activity" file.';
      await expect(await page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about Direct Review Activity (CSV)', async () => {
      const expectedText = 'Entire collection of Direct Review activity reported to the CHPL.';
      await expect(await page.content.getText()).toContain(expectedText);
    });
  });

  describe('when logged in as ROLE_ONC', () => {
    beforeEach(async () => {
      await browser.call(() => login.logIn('onc'));
    });

    afterEach(async () => {
      await browser.call(() => login.logOut());
    });

    it('should have correct information about Surveillance (Basic) (CSV)', async () => {
      const expectedText = 'Entire collection of surveillance activity reported to the CHPL, with only basic details about non-conformities. Includes statistics on timeframes related to discovered non-conformities.';
      await expect(await page.content.getText()).toContain(expectedText);
    });
  });
});
