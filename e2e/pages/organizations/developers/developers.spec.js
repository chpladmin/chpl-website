import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks';
import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import ActionConfirmationComponent from '../../../components/action-confirmation/action-confirmation.po';
import ContactComponent from '../../../components/contact/contact.po';
import LoginComponent from '../../../components/login/login.po';
import ToastComponent from '../../../components/toast/toast.po';

let actionBar, actionConfirmation, contact, hooks, login, page, toast;

describe('the Developers page', () => {
    beforeEach(async () => {
        browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
        browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
        hooks = new Hooks();
        actionBar = new ActionBarComponent();
        actionConfirmation = new ActionConfirmationComponent();
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

        describe('when on the "Greenway Health, LLC" Developer page', () => {
            beforeEach(() => {
                let developer = 'Greenway Health, LLC';
                page = new DevelopersPage();
                page.selectDeveloper(developer);
                page.getDeveloperPageTitle(developer).waitForDisplayed();
            });

            describe('when editing developer information', () => {
                beforeEach(() => {
                    page.editDeveloper.click();
                });

                it('should not have friendly name text box under POC', () => {
                    expect(contact.friendlyName.isDisplayed()).toBe(false);
                });
            });

            describe('when looking at "Intergy EHR"', () => {
                let name = 'Intergy EHR';
                let product;
                beforeEach(() => {
                    product = page.getProduct(name);
                    product.scrollIntoView({block: 'center', inline: 'center'});
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

                    it('should not have friendly name text box under POC', () => {
                        expect(contact.friendlyName.isDisplayed()).toBe(false);
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
                        page.selectProduct(product);
                        page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                        expect(contact.get(product)).toHaveTextContaining(poc.full);
                        expect(contact.get(product)).toHaveTextContaining(poc.title);
                        expect(contact.get(product)).toHaveTextContaining(poc.email);
                        expect(contact.get(product)).toHaveTextContaining(poc.phone);
                    });
                });
            });

            describe('when planning to change "MediaDent 10.0 using SuccessEHS 7.20"\'s name', () => {
                let name = 'MediaDent 10.0 using SuccessEHS 7.20';
                let product;
                beforeEach(() => {
                    product = page.getProduct(name);
                    product.scrollIntoView({block: 'center', inline: 'center'});
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

        describe('when on the "Procentive" Developer page, on the "Procentive" Product', () => {
            let developer = 'Procentive';
            let productName = 'Procentive';
            let productId = '1987';
            let product;

            beforeEach(() => {
                page = new DevelopersPage();
                page.selectDeveloper(developer);
                page.getDeveloperPageTitle(developer).waitForDisplayed();
                product = page.getProduct(productName);
                product.scrollIntoView({block: 'center', inline: 'center'});
                page.selectProduct(product);
                page.getProductInfo(product).waitForDisplayed({timeout: 55000});
            });

            describe('when editing Version "2015"', () => {
                let version = '2015';

                beforeEach(() => {
                    page.selectVersion(product, productId, version);
                    page.editVersion(product);
                    page.editVersionHeader.waitForDisplayed();
                });

                it('should allow Versions to be edited', () => {
                    let timestamp = (new Date()).getTime();
                    let newVersion = version + ' - ' + timestamp;
                    page.editVersionName.clearValue();
                    page.editVersionName.setValue(newVersion);
                    actionBar.save();
                    page.productsHeader.waitForDisplayed();
                    toast.clearAllToast();
                    product = page.getProduct(productName);
                    product.scrollIntoView({block: 'center', inline: 'center'});
                    page.selectProduct(product);
                    page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                    expect(page.getActiveVersion(product, productId)).toHaveTextContaining(newVersion);
                    page.selectVersion(product, productId, newVersion);
                    page.editVersion(product);
                    page.editVersionHeader.waitForDisplayed();
                    expect(page.editVersionName).toBeDisplayed();
                    expect(page.editVersionName.getValue()).toBe(newVersion);
                });
            });

            describe('when editing Version "Version 2015"', () => {
                let version = 'Version 2015';

                beforeEach(() => {
                    page.selectVersion(product, productId, version);
                    page.editVersion(product);
                    page.editVersionHeader.waitForDisplayed();
                });

                it('should allow cancellation', () => {
                    let timestamp = (new Date()).getTime();
                    let newVersion = version + ' - ' + timestamp;
                    page.editVersionName.clearValue();
                    page.editVersionName.setValue(newVersion);
                    actionBar.cancel();
                    actionConfirmation.yes.click();
                    page.productsHeader.waitForDisplayed();
                    product = page.getProduct(productName);
                    product.scrollIntoView({block: 'center', inline: 'center'});
                    page.selectProduct(product);
                    page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                    expect(page.getActiveVersion(product, productId)).toHaveTextContaining(version);
                    expect(page.getActiveVersion(product, productId)).not.toHaveTextContaining(newVersion);
                    page.selectVersion(product, productId, version);
                    page.editVersion(product);
                    page.editVersionHeader.waitForDisplayed();
                    expect(page.editVersionName).toBeDisplayed();
                    expect(page.editVersionName.getValue()).toBe(version);
                    expect(page.editVersionName.getValue()).not.toBe(newVersion);
                });
            });
        });
    });
    describe('when logged in as an Admin', () => {
        beforeEach(() => {
            login.logInWithEmail('admin');
            login.logoutButton.waitForDisplayed();
        });

        afterEach(() => {
            login.logOut();
        });

        describe('when on the "Greenway Health, LLC" Developer page', () => {
            const name = 'Greenway Intergy Meaningful Use Edition';
            const productId = 837;
            let product, version;
            let timestamp = (new Date()).getTime();
            beforeEach(() => {
                let developer = 'Greenway Health, LLC';
                page = new DevelopersPage();
                page.selectDeveloper(developer);
                page.getDeveloperPageTitle(developer).waitForDisplayed();
                hooks.waitForSpinnerToDisappear();
            });

            describe('when merging versions of "Greenway Intergy Meaningful Use Edition" product', () => {
                version = 'v10.10';
                const versionToBeMerged = 'v9.30';
                let newVersion = 'New version - ' + timestamp;
                beforeEach(() => {
                    product = page.getProduct(name);
                    product.scrollIntoView({block: 'center', inline: 'center'});
                    page.selectProduct(product);
                    page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                    page.selectVersion(product, productId, version);
                });

                it('should create new version successfully', () => {
                    page.mergeButton.click();
                    page.versionMergeButton.click();
                    page.moveVersionToBeMerged(versionToBeMerged);
                    page.versionName.clearValue();
                    page.versionName.addValue(newVersion);
                    actionBar.save();
                    page.productsHeader.waitForDisplayed();
                    toast.clearAllToast();
                    product = page.getProduct(name);
                    product.scrollIntoView({block: 'center', inline: 'center'});
                    page.selectProduct(product);
                    page.getProductInfo(product).waitForDisplayed({timeout: 55000});
                    expect(page.getActiveVersion(product, productId)).toHaveTextContaining(newVersion);
                    expect(page.getActiveVersion(product, productId)).not.toHaveTextContaining(version);
                    expect(page.getActiveVersion(product, productId)).not.toHaveTextContaining(versionToBeMerged);
                });
            });
        });
    });
});
