import DownloadPage from './download.po';
import Hooks from '../../../utilities/hooks';
import config from '../../../config/mainConfig';

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

inputs.forEach(input => {
  let file = input.file;
  let definitionFileName = input.definitionFileName;
  let dataFileName = input.dataFileName;
  let dfSize = input.dfSize;
  let fileExtension = input.fileExtension;
  let dSize = input.dSize;
  let days = input.days;
  let dfLines = input.dfLines;
  let dLines = input.dLines;
  let fileContents, filePath;

  describe(`When downloading ${file} definition file`, () => {

    it(`should download file successfully with file size more than ${dfSize} KB`, () => {
      if (!(file.includes('2014 edition products (xml)') || file.includes('2011 edition products (xml)'))) {
        page.downloadDropdown.selectByVisibleText(file);
        page.definitionFile.scrollAndClick();
        filePath = path.join(global.downloadDir, definitionFileName);
        browser.waitForFileExists(filePath,10000);
        expect(fs.existsSync(filePath)).toBe.true;
        var stat = fs.statSync(filePath);
        expect(stat.size).toBeGreaterThan(dfSize);
      }
    });
    if (fileExtension.includes('csv')) {

      it(`should have at-least ${dfLines} rows in the file`, () => {
        fileContents = fs.readFileSync(filePath, 'utf-8');
        var actualLines = fileContents.split('\n').length;
        expect(actualLines).toBeGreaterThanOrEqual(dfLines);
      });
    }
  });

  describe(`When downloading ${file} data file`, () => {
    let fileName;

    it(`should download file successfully with file size more than ${dSize} KB`, () => {
      page.downloadDropdown.selectByVisibleText(file);
      page.dataFile.scrollAndClick();
      browser.pause(config.timeout); // can't add explicit timeout as file name is dynamic here
      let dirCont = fs.readdirSync( global.downloadDir );
      fileName = dirCont.filter( file => file.match(new RegExp(dataFileName + `.*.(${fileExtension})`))).toString();
      filePath = path.join(global.downloadDir, fileName);
      expect(fs.existsSync(filePath)).toBe.true;
      var stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(dSize);
    });

    it(`should not be older than ${days} days `, () => {
      var actualDate = new Date(fileName.slice((fileName.length - 19),-11).replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3'));
      var currentDate = new Date();
      var diffDays = (actualDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
      expect(parseInt(diffDays)).toBeLessThanOrEqual(days);
    });

    if (fileExtension.includes('csv')) {

      it(`should have at-least ${dLines} rows in the file`, () => {
        fileContents = fs.readFileSync(filePath, 'utf-8');
        var actualLines = fileContents.split('\n').length;
        expect(actualLines).toBeGreaterThanOrEqual(dLines);
      });
    }

  });
});
