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
    it('should have correct information about 2015 edition products file', () => {
      const expectedText = 'The 2015 Edition Products file is updated nightly.';
      expect(page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about 2014 and 2011 edition products file', () => {
      const expectedText = 'The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.';
      expect(page.content.getText()).toContain(expectedText);
    });
  });

  describe('in the 2015/2014 Edition summary section', () => {
    it('should have correct information about 2015 edition summary file', () => {
      const expectedText = 'The 2015 Edition Summary file is updated nightly.';
      expect(page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about 2014 edition summary file', () => {
      const expectedText = 'The 2014 Edition Summary file is updated quarterly.';
      expect(page.content.getText()).toContain(expectedText);
    });
  });

  it('should have correct information about SVAP', () => {
    const expectedText = 'Standards Version Advancement Process (SVAP) Summary: Entire collection of SVAP values that have been associated with a criterion for a certified product. Multiple rows for a single product will appear in the file for any products containing multiple SVAP values and/or SVAP values for multiple criteria. Available as a CSV file; updated nightly.';
    expect(page.content.getText()).toContain(expectedText);
  });

  describe('in the compliance activities section', () => {
    it('should have correct information about Surveillance Activity', () => {
      const expectedText = 'Entire collection of surveillance activity reported to the CHPL. Available as a CSV file.';
      expect(page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about Surveillance Non-Conformities', () => {
      const expectedText = 'Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above "Surveillance Activity" file. Available as a CSV file.';
      expect(page.content.getText()).toContain(expectedText);
    });

    it('should have correct information about Direct Review Activity', () => {
      const expectedText = 'Entire collection of Direct Review activity reported to the CHPL. Available as a CSV file.';
      expect(page.content.getText()).toContain(expectedText);
    });
  });

  describe('when logged in as ROLE_ONC', () => {
    beforeEach(() => {
      browser.call(() => login.logIn('onc'));
    });

    afterEach(() => {
      browser.call(() => login.logOut());
    });

    it('should have correct information about the basic surveillance file', () => {
      const expectedText = 'Surveillance (Basic): Entire collection of surveillance activity reported to the CHPL, with only basic details about non-conformities. Includes statistics on timeframes related to discovered non-conformities. Available as a CSV file.';
      expect(page.content.getText()).toContain(expectedText);
    });
  });
});
