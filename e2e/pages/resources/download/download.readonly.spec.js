import DownloadPage from './download.po';
import Hooks from '../../../utilities/hooks';

const path = require('path');
const fs = require('fs');
const inputs = require('./download-dp');

let hooks, page;
const productFile2015 = 'The 2015 Edition Products file is updated nightly.';
const productFile2014And2011 = 'The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.';
const summaryFile2015 = 'The 2015 Edition Summary file is updated nightly.';
const summaryFile2014 = 'The 2014 Edition Summary file is updated quarterly.';
const directReview = 'Entire collection of Direct Review activity reported to the CHPL. Available as a CSV file.';
const surveillanceNonConformity = 'Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above "Surveillance Activity" file. Available as a CSV file.';
const surveillanceActivity = 'Entire collection of surveillance activity reported to the CHPL. Available as a CSV file.';

beforeEach(async () => {
  page = new DownloadPage();
  hooks = new Hooks();
  await hooks.open('#/resources/download');
});

describe('the Download page - 2015/2014/2011 Edition products section', () => {

  it('should have correct information about 2015 edition products file', () => {
    expect(page.downloadListingText.getText()).toContain(productFile2015);
  });

  it('should have correct information about 2014 and 2011 edition products file', () => {
    expect(page.downloadListingText.getText()).toContain(productFile2014And2011);
  });
});

describe('the Download page - 2015/2014 Edition summary section', () => {

  it('should have correct information about 2015 edition summary file', () => {
    expect(page.downloadListingText.getText()).toContain(summaryFile2015);
  });

  it('should have correct information about 2014 edition summary file', () => {
    expect(page.downloadListingText.getText()).toContain(summaryFile2014);
  });
});

describe('the Download page - compliance activities section', () => {

  it('should have correct information about Surveillance Activity', () => {
    expect(page.complianceActivityText.getText()).toContain(surveillanceActivity);
  });

  it('should have correct information about Surveillance Non-Conformities', () => {
    expect(page.complianceActivityText.getText()).toContain(surveillanceNonConformity);
  });

  it('should have correct information about Direct Review Activity', () => {
    expect(page.complianceActivityText.getText()).toContain(directReview);
  });
});

describe('When downloading definition file', () => {

  inputs.forEach(input => {
    let file = input.file;
    let downloadedFileName = input.downloadedFileName;
    let size = input.size;

    it(`${file} - should download successfully with correct file size`, () => {
      page.downloadDropdown.selectByVisibleText(file);
      page.definitionFile.scrollAndClick();
      const filePath = path.join(global.downloadDir, downloadedFileName);
      browser.waitForFileExists(filePath,10000);
      expect(fs.existsSync(filePath)).toBe.true;
      var stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(size);
    });
  });

});
