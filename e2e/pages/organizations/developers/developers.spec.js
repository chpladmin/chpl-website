import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks';
import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import ContactComponent from '../../../components/contact/contact.po';
import LoginComponent from '../../../components/login/login.po';
import ToastComponent from '../../../components/toast/toast.po';

let actionBar, contact, hooks, login, page, toast;

describe('the Developers page', () => {
    beforeEach(async () => {
        browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
        browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
        hooks = new Hooks();
        actionBar = new ActionBarComponent();
        contact = new ContactComponent();
        login = new LoginComponent();
        toast = new ToastComponent();
        await hooks.open('#/organizations/developers');
    });

    describe('when logged in as an ACB', () => {
        beforeEach(() => {
            login.logIn('acb');
            login.logoutButton.waitForDisplayed();
        });

        afterEach(() => {
            login.logOut();
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
                        let poc = {
                            full: 'name' + timestamp,
                            title: 'title' + timestamp,
                            email: 'email' + timestamp + '@example.com',
                            phone: 'phone' + timestamp,
                        };
                        contact.set(poc);
                        actionBar.save();
                        page.productsHeader.waitForDisplayed();
                        toast.clearAllToast();
                        product.scrollIntoView({block: 'center', inline: 'center'});
                        browser.waitUntil(() => page.getVersionCount(product).getText() === '1 Version');
                        page.selectProduct(product);
                        page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                        expect(contact.get(product)).toEqual(poc);
                    });
                });
            });

            describe('when planning to change a Product name', () => {
                let name = 'MediaDent 10.0 using SuccessEHS 7.20';
                let product;
                beforeEach(() => {
                    product = page.getProduct(name);
                    product.scrollIntoView({block: 'center', inline: 'center'});
                    browser.waitUntil(() => page.getVersionCount(product).getText() === '1 Version');
                    page.selectProduct(product);
                    page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                    page.editProduct(product);
                    page.editProductsHeader.waitForDisplayed();
                });

                describe('when editing that Product', () => {
                    it('should allow editing of the Name', () => {
                        let timestamp = (new Date()).getTime();
                        let newName = name + ' - ' + timestamp;
                        page.editProductName.setValue(newName);
                        actionBar.save();
                        page.productsHeader.waitForDisplayed();
                        toast.clearAllToast();
                        product = page.getProduct(newName);
                        product.scrollIntoView({block: 'center', inline: 'center'});
                        browser.waitUntil(() => page.getVersionCount(product).getText() === '1 Version');
                        page.selectProduct(product);
                        page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                        page.editProduct(product);
                        page.editProductsHeader.waitForDisplayed();
                        expect(page.editProductName).toBeDisplayed();
                        expect(page.editProductName.getValue()).toBe(newName);
                    });
                });
            });
        });
    });
});
