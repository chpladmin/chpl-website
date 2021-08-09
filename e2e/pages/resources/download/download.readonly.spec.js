import DownloadPage from './download.po';
import Hooks from '../../../utilities/hooks';
import config from '../../../config/mainConfig';

const path = require('path');
const fs = require('fs');
const inputs = require('./download-dp');

let hooks;
let page;

describe('the Download page', () => {
  beforeEach(async () => {
    page = new DownloadPage();
    hooks = new Hooks();
    await hooks.open('#/resources/download');
  });

  describe('2015/2014/2011 Edition products section', () => {
    it('should have correct information about 2015 edition products file', () => {
      const productFile2015 = 'The 2015 Edition Products file is updated nightly.';
      expect(page.downloadPage.getText()).toContain(productFile2015);
    });

    it('should have correct information about 2014 and 2011 edition products file', () => {
      const productFile2014And2011 = 'The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.';
      expect(page.downloadPage.getText()).toContain(productFile2014And2011);
    });
  });

  describe('2015/2014 Edition summary section', () => {
    it('should have correct information about 2015 edition summary file', () => {
      const summaryFile2015 = 'The 2015 Edition Summary file is updated nightly.';
      expect(page.downloadPage.getText()).toContain(summaryFile2015);
    });

    it('should have correct information about 2014 edition summary file', () => {
      const summaryFile2014 = 'The 2014 Edition Summary file is updated quarterly.';
      expect(page.downloadPage.getText()).toContain(summaryFile2014);
    });
  });

  describe('compliance activities section', () => {
    it('should have correct information about Surveillance Activity', () => {
      const surveillanceActivity = 'Entire collection of surveillance activity reported to the CHPL. Available as a CSV file.';
      expect(page.downloadPage.getText()).toContain(surveillanceActivity);
    });

    it('should have correct information about Surveillance Non-Conformities', () => {
      const surveillanceNonConformity = 'Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above "Surveillance Activity" file. Available as a CSV file.';
      expect(page.downloadPage.getText()).toContain(surveillanceNonConformity);
    });

    it('should have correct information about Direct Review Activity', () => {
      const directReview = 'Entire collection of Direct Review activity reported to the CHPL. Available as a CSV file.';
      expect(page.downloadPage.getText()).toContain(directReview);
    });
  });

  inputs.forEach((input) => {
    const { file } = input;
    const { definitionFileName } = input;
    const { dataFileName } = input;
    const { definitionFileSize } = input;
    const { fileExtension } = input;
    const { dataFileSize } = input;
    const { generationFrequencyInDays } = input;
    const { definitionFileLines } = input;
    const { dataLines } = input;
    let fileContents;
    let filePath;

    describe(`when downloading the ${file} definition file`, () => {
      it(`should download file successfully with file size more than ${definitionFileSize} KB`, () => {
        if (!(file.includes('2014 edition products (xml)') || file.includes('2011 edition products (xml)'))) {
          page.downloadDefinitionFile(file);
          filePath = path.join(global.downloadDir, definitionFileName);
          browser.waitForFileExists(filePath, 10000);
          expect(fs.existsSync(filePath)).toBe(true);
          const stat = fs.statSync(filePath);
          expect(stat.size / 1000).toBeGreaterThan(definitionFileSize);
        }
      });

      if (fileExtension.includes('csv')) {
        it(`should have at-least ${definitionFileLines} rows in the file`, () => {
          fileContents = fs.readFileSync(filePath, 'utf-8');
          const actualLines = fileContents.split('\n').length;
          expect(actualLines).toBeGreaterThanOrEqual(definitionFileLines);
        });
      }
    });

    describe(`when downloading the ${file} data file`, () => {
      let fileName;

      it(`should download file successfully with file size more than ${dataFileSize} KB`, () => {
        page.downloadDataFile(file);
        browser.pause(config.timeout); // can't add explicit timeout as file name is dynamic here
        const dirCont = fs.readdirSync(global.downloadDir);
        fileName = dirCont.filter((f) => f.match(new RegExp(`${dataFileName}.*.(${fileExtension})`))).toString();
        filePath = path.join(global.downloadDir, fileName);
        expect(fs.existsSync(filePath)).toBe(true);
        const stat = fs.statSync(filePath);
        if (process.env.ENV !== 'stage' && dataFileName === 'direct-reviews') {
          expect(stat.size / 1000).toBeGreaterThan(dataFileSize);
        }
      });

      it(`should not be older than ${generationFrequencyInDays} days `, () => {
        const actualDate = new Date(fileName.slice((fileName.length - 19), -11).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
        const currentDate = new Date();
        const diffDays = (actualDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
        expect(parseInt(diffDays, 10)).toBeLessThanOrEqual(generationFrequencyInDays);
      });

      if (fileExtension.includes('csv')) {
        it(`should have at-least ${dataLines} rows in the file`, () => {
          fileContents = fs.readFileSync(filePath, 'utf-8');
          const actualLines = fileContents.split('\n').length;
          expect(actualLines).toBeGreaterThanOrEqual(dataLines);
        });
      }
    });
  });
});
