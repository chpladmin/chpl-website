import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks'

let hooks, page;

describe('the Developers page', () => {
    beforeEach(async () => {
        browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
        browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
        page = new DevelopersPage();
        hooks = new Hooks();
        await hooks.open('#/organizations/developers');
    });

    it('should load a Developer', () => {
        page.selectDeveloper('Greenway Health, LLC');
        expect(browser).toHaveUrl('#/organizations/developers/1914', {containing: true});
    });

    describe('when on a specific Developer page', () => {
        beforeEach(() => {
            let developer = 'Greenway Health, LLC';
            page.selectDeveloper(developer);
            page.getDeveloperPageTitle(developer).waitForDisplayed();
        });

        it('should have a Direct Reviews section', () => {
            expect(page.directReviewsHeader).toExist();
        });

        it('should have Products', () => {
            expect(page.products.length).toBeGreaterThan(0);
        });

        describe('when looking at a specific Product', () => {
            beforeEach(() => {
                let product = 'Greenway Intergy Meaningful Use Edition';
                page.selectProduct(page.getProduct(product));
                page.productsHeader.scrollIntoView({block: 'center', inline: 'center'});
                page.getProductInfo(product).waitForDisplayed({timeout: 35000}); // demo of using a longer timeout than default
            });

            it('should have the last modified date', () => {
                expect(page.getLastModifed(page.getProduct('Greenway Intergy Meaningful Use Edition')).getText()).toBe('Aug 19, 2016');
            });
        });
    });
});
