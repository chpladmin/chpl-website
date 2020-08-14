/* eslint-disable no-console,angular/log */
import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks'
import LoginComponent from '../../../components/login/login.po';

let hooks, loginComponent, page;

describe('when on the Developers page', () => {
    beforeEach(async () => {
        browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
        browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
        loginComponent = new LoginComponent();
        hooks = new Hooks();
        await hooks.open('#/organizations/developers');
    });

    describe('when logged in', () => {
        beforeEach(() => {
            loginComponent.loginAsACB();
            loginComponent.logoutButton.waitForDisplayed();
        });

        describe('when on a specific Developer page', () => {
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
            });
        });
    });
});
