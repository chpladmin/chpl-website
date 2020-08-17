/* eslint-disable no-console,angular/log */
import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks'
import LoginComponent from '../../../components/login/login.po';

let hooks, loginComponent, page;

describe('the Developers page', () => {
    beforeEach(async () => {
        browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
        browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
        loginComponent = new LoginComponent();
        hooks = new Hooks();
        await hooks.open('#/organizations/developers');
    });

    describe('when logged in as an ACB', () => {
        beforeEach(() => {
            loginComponent.logIn('acb');
            loginComponent.logoutButton.waitForDisplayed();
        });

        afterEach(() => {
            loginComponent.logOut();
        });

        describe('on a specific Developer page', () => {
            beforeEach(() => {
                let developer = 'Greenway Health, LLC';
                page = new DevelopersPage();
                page.selectDeveloper(developer);
                page.getDeveloperPageTitle(developer).waitForDisplayed();
            });

            describe('when looking at a specific Product', () => {
                let name = 'Intergy EHR';
                let product;
                beforeEach(() => {
                    product = page.getProduct(name);
                    product.scrollIntoView({block: 'center', inline: 'center'});
                    browser.waitUntil(() => page.getVersionCount(product).getText() === '1 Version');
                    page.selectProduct(product);
                    page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                });

                it('should have an edit button', () => {
                    expect(page.getEditButton(product)).toBeDisplayed();
                });

                describe('when editing that Product', () => {
                    beforeEach(() => {
                        page.editProduct(product);
                        page.editProductsHeader.waitForDisplayed();
                    });

                    it('should have the product name in an editable field', () => {
                        expect(page.editProductName).toBeDisplayed();
                        expect(page.editProductName.getValue()).toBe(name);
                    });

                    it('should allow editing of the POC', () => {
                        let timestamp = (new Date()).getTime();
                        page.editContactFull.setValue('name' + timestamp);
                        page.editContactTitle.setValue('title' + timestamp);
                        page.editContactEmail.setValue('email' + timestamp + '@example.com');
                        page.editContactPhone.setValue('phone' + timestamp);
                        browser.saveScreenshot('test_reports/e2e/entereddata.png');
                        page.save();
                        page.productsHeader.waitForDisplayed();
                        page.clearToast();
                        product.scrollIntoView({block: 'center', inline: 'center'});
                        browser.waitUntil(() => page.getVersionCount(product).getText() === '1 Version');
                        page.selectProduct(product);
                        page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                        browser.saveScreenshot('test_reports/e2e/entereddata-2.png');
                        expect(page.getContactFull(product).getText()).toBe('name' + timestamp);
                        expect(page.getContactTitle(product).getText()).toBe('title' + timestamp);
                        expect(page.getContactEmail(product).getText()).toBe('email' + timestamp + '@example.com');
                        expect(page.getContactPhone(product).getText()).toBe('phone' + timestamp);
                    });
                });
            });
        });
    });
});
