import ListingPage from './listing.po';
import Hooks from '../../utilities/hooks';

let hooks, page;

describe('the Listing page', () => {
    beforeEach(() => {
        page = new ListingPage();
        hooks = new Hooks();
    });

    describe('when a 2014 edition listing is loaded', () => {
        beforeEach(async () => {
            await hooks.open('#/listing/1048');
        });

        it('should not have Real World Testing section', () => {
            expect(page.realWortldTestingHeader).not.toExist();
        });
    });

    describe('when a 2015 edition listing without RWT criteria is loaded', () => {
        beforeEach(async () => {
            await hooks.open('#/listing/10303');
        });

        it('should not have Real World Testing section', () => {
            expect(page.realWortldTestingHeader).not.toExist();
        });
    });

    describe('when a 2015 edition listing that has been withdrawn', () => {
        beforeEach(async () => {
            await hooks.open('#/listing/10020');
        });

        it('should not have Real World Testing section', () => {
            expect(page.realWortldTestingHeader).not.toExist();
        });
    });
});
