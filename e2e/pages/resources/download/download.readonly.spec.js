import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

import DownloadPage from './download.po';

let hooks;
let login;
let page;

describe('the Download page', () => {
  beforeEach(async () => {
    page = new DownloadPage();
    login = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/resources/download');
  });

  describe('in the 2015/2014/2011 Edition products section', () => {
    it('should have correct information about 2015 edition products file', async () => {
      const expectedText = 'The 2015 Edition Products file is updated nightly.';
      await expect(await page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about 2014 and 2011 edition products file', async () => {
      const expectedText = 'The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.';
      await expect(await page.content.getText()).toContain(expectedText);
    });
  });

  describe('in the 2015/2014 Edition summary section', () => {
    it('should have correct information about 2015 edition summary file', async () => {
      const expectedText = 'The 2015 Edition Summary file is updated nightly.';
      await expect(await page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about 2014 edition summary file', async () => {
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
