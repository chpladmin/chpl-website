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

    describe('when on the "GE Healthcare" Developer page', () => {
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

        describe('when looking at "Centricity Perinatal"', () => {
            let name = 'Centricity Perinatal';
            let product;
            beforeEach(() => {
                product = page.getProduct(name);
                product.scrollIntoView({block: 'center', inline: 'center'});
                browser.waitUntil(() => page.getVersionCount(product).isDisplayed());
                page.selectProduct(product);
                page.getProductInfo(product).waitForDisplayed({timeout: 55000});
            });

            it('should have product Contact information', () => {
                expect(contact.get(product)).toHaveTextContaining('Tamara Grassle');
            });

            it('should have ACB name', () => {
                expect(page.getAcbName(product).getText()).toBe('UL LLC');
            });

            it('should have listings count', () => {
                expect(page.getListingCount(product).getText()).toBe('6 listings');
            });
        });
    });

    describe('when on the "Procentive" Developer page, on the "Procentive" Product', () => {
        let developer = 'Procentive';
        let productName = 'Procentive';
        let productId = '1987';
        let product;

        beforeEach(() => {
            page.selectDeveloper(developer);
            page.getDeveloperPageTitle(developer).waitForDisplayed();
            product = page.getProduct(productName);
            product.scrollIntoView({block: 'center', inline: 'center'});
            browser.waitUntil(() => page.getVersionCount(product).getText() === '3 Versions');
            page.selectProduct(product);
            page.getProductInfo(product).waitForDisplayed({timeout: 55000});
        });

        it('should have Versions', () => {
            expect(page.getActiveVersion(product, productId)).toHaveTextContaining('2011');
        });

        it('should not have an edit button', () => {
            expect(page.getEditButton(product)).not.toExist();
        });
    });
});

describe('When a user is on the Developer page for a Developer that doesn\'t exist', () => {
    beforeEach(async () => {
        hooks = new Hooks();
        const dummyDeveloperId = '0000';
        await hooks.open('#/organizations/developers/' + dummyDeveloperId);
    });

    it('should go to Home page', () => {
        hooks.waitForSpinnerToDisappear();
        expect(browser.getUrl()).toContain('#/search');
    });
});
