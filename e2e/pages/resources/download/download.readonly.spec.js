import DownloadPage from './download.po';
import Hooks from '../../../utilities/hooks';

let hooks, page;
const productFile2015 = 'The 2015 Edition Products file is updated nightly.';
const productFile2014 = 'The 2014 Edition Products file is updated monthly.';
const productFile2011 = 'The 2011 Edition Products file is updated quarterly.';
const summaryFile2015 = 'The 2015 Edition Summary file is updated nightly.';
const summaryFile2014 = 'The 2014 Edition Summary file is updated monthly.';
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
        assert.include(page.productsFileText.getText(),productFile2015);
    });
    it('should have correct information about 2014 edition products file', () => {
        assert.include(page.productsFileText.getText(),productFile2014);
    });
    it('should have correct information about 2011 edition products file', () => {
        assert.include(page.productsFileText.getText(),productFile2011);
    });
});

describe('the Download page - 2015/2014 Edition summary section', () => {

    it('should have correct information about 2015 edition summary file', () => {
        assert.include(page.summaryFileText.getText(),summaryFile2015);
    });
    it('should have correct information about 2014 edition summary file', () => {
        assert.include(page.summaryFileText.getText(),summaryFile2014);
    });
});

describe('the Download page - compliance activities section', () => {

    it('should have correct information about Surveillance Activity', () => {
        assert.include(page.complianceActivityBullet.getText(),surveillanceActivity);
    });
    it('should have correct information about Surveillance Non-Conformities', () => {
        assert.include(page.complianceActivityBullet.getText(),surveillanceNonConformity);
    });
    it('should have correct information about Direct Review Activity', () => {
        assert.include(page.complianceActivityBullet.getText(),directReview);
    });
});
