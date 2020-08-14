/* eslint-disable no-console,angular/log */
import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks'
import LoginComponent from '../../../components/login/login.po';

let hooks, loginComponent, page;

describe('while logged in', () => {
    beforeEach(async () => {
        loginComponent = new LoginComponent();
        hooks = new Hooks();
        await hooks.open('#/resources/overview');
        console.log('-----\nawait-1\n------')
        await browser.saveScreenshot('test_reports/e2e/loggedIn-1.png');
        console.log('-----\nawait-2\n------')
        await loginComponent.loginAsACB();
        console.log('-----\nawait-3\n------')
        await browser.saveScreenshot('test_reports/e2e/loggedIn-2.png');
        console.log('-----\nawait-4\n------')
        await loginComponent.logoutButton.waitForDisplayed();
        console.log('-----\nawait-5\n------')
        await browser.saveScreenshot('test_reports/e2e/loggedIn-3.png');
        console.log('-----\nawait-6\n------')
    });

    describe('on the Developers page', () => {
        beforeEach(async () => {
            browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
            browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
            await hooks.open('#/organizations/developers');
            browser.saveScreenshot('test_reports/e2e/onDevPage.png');
        });

        describe('when on a specific Developer page', () => {
            beforeEach(() => {
                let developer = 'Greenway Health, LLC';
                page = new DevelopersPage();
                page.selectDeveloper(developer);
                page.getDeveloperPageTitle(developer).waitForDisplayed();
            });

            describe('when looking at a specific Product', () => {
                beforeEach(() => {
                    let product = 'Greenway Intergy Meaningful Use Edition';
                    page.selectProduct(page.getProduct(product));
                    page.productsHeader.scrollIntoView({block: 'center', inline: 'center'});
                    page.getProductInfo(product).waitForDisplayed();
                });

                it('should have an edit button', () => {
                    expect(page.getEditButton('Greenway Intergy Meaningful Use Edition').getText()).toBeDisplayed();
                });
            });
        });
    });
});
