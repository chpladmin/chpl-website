import DevelopersPage from './developers.po';
import ContactComponent from '../../../components/contact/contact.po';
import Hooks from '../../../utilities/hooks';

let contact, hooks, page;

describe('the Developers page', () => {
    beforeEach(async () => {
        browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
        browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
        contact = new ContactComponent();
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
            let developer = 'GE Healthcare';
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
            let name = 'Centricity Perinatal';
            let product;
            beforeEach(() => {
                product = page.getProduct(name);
                product.scrollIntoView({block: 'center', inline: 'center'});
                browser.waitUntil(() => page.getVersionCount(product).getText() === '5 Versions');
                page.selectProduct(product);
                page.getProductInfo(product).waitForDisplayed({timeout: 55000});
            });

            it('should have product Contact information', () => {
                expect(contact.getFull(product).getText()).toBe('Tamara Grassle');
            });
        });
    });
});
