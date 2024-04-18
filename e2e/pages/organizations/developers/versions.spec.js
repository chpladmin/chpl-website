import ActionBarComponent from '../../../components/action-bar/action-bar-legacy.po';
import ActionConfirmationComponent from '../../../components/action-confirmation/action-confirmation.po';
import LoginComponent from '../../../components/login/login.sync.po';
import ToastComponent from '../../../components/toast/toast.po';
import Hooks from '../../../utilities/hooks';

import DevelopersPage from './developers.po';

let actionBar;
let actionConfirmation;
let hooks;
let login;
let page;
let toast;

describe('the Version part of the Developers page', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    hooks = new Hooks();
    actionBar = new ActionBarComponent();
    actionConfirmation = new ActionConfirmationComponent();
    login = new LoginComponent();
    toast = new ToastComponent();
    await hooks.open('#/organizations/developers');
  });

  afterEach(() => {
    if (toast.toastContainer.isDisplayed()) {
      toast.clearAllToast();
    }
    login.logOut();
  });

  describe('when logged in as drummond ACB', () => {
    beforeEach(() => {
      login.logIn('drummond');
    });

    describe('when on the "Procentive" Developer page, on the "Procentive" Product', () => {
      const developer = 'Procentive';
      const productName = 'Procentive';
      const productId = '1987';
      let product;

      beforeEach(() => {
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
        product = page.getProduct(productName);
        product.scrollIntoView({ block: 'center', inline: 'center' });
        page.selectProduct(product);
        page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
      });

      describe('when editing Version "2015"', () => {
        const version = '2015';

        beforeEach(() => {
          page.selectVersion(product, productId, version);
          page.editVersion(product);
          page.editVersionHeader.waitForDisplayed();
        });

        it('should allow Versions to be edited', () => {
          const timestamp = (new Date()).getTime();
          const newVersion = `${version} - ${timestamp}`;
          page.editVersionName.clearValue();
          page.editVersionName.setValue(newVersion);
          actionBar.save();
          page.selectAllCertificationStatus();
          page.productsHeader.waitForDisplayed();
          toast.clearAllToast();
          product = page.getProduct(productName);
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
          expect(page.getActiveVersion(product, productId)).toHaveTextContaining(newVersion);
          page.selectVersion(product, productId, newVersion);
          page.editVersion(product);
          page.editVersionHeader.waitForDisplayed();
          expect(page.editVersionName).toBeDisplayed();
          expect(page.editVersionName.getValue()).toBe(newVersion);
        });
      });

      describe('when editing Version "Version 2015"', () => {
        const version = 'Version 2015';

        beforeEach(() => {
          page.selectVersion(product, productId, version);
          page.editVersion(product);
          page.editVersionHeader.waitForDisplayed();
        });

        it('should allow cancellation', () => {
          const timestamp = (new Date()).getTime();
          const newVersion = `${version} - ${timestamp}`;
          page.editVersionName.clearValue();
          page.editVersionName.setValue(newVersion);
          actionBar.cancel();
          actionConfirmation.yes.click();
          page.selectAllCertificationStatus();
          page.productsHeader.waitForDisplayed();
          product = page.getProduct(productName);
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
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
      describe('when splitting "Version 2015"', () => {
        const version = 'Version 2015';

        it('should show error message to split a version which has listings owned by different ACB than logged in ACB', () => {
          const newVersion = `${version} - split - ${(new Date()).getTime()}`;
          const newCode = newVersion.substring(newVersion.length - 2);
          const movingListingId = '6299';
          page.selectVersion(product, productId, version);
          page.getSplitButton(product).click();
          page.getVersionSplitButton(product).click();
          page.splitVersionVersion.setValue(newVersion);
          page.editVersionCode.setValue(newCode);
          page.moveListing(movingListingId);
          actionBar.save();
          expect(actionBar.errorMessages.getText()).toEqual('Version split involves multiple ONC-ACBs, which requires additional approval. Please contact ONC.');
        });
      });
    });
  });

  describe('when logged in as an Admin', () => {
    beforeEach(() => {
      login.logIn('admin');
    });

    describe('when on the "Greenway Health, LLC" Developer page', () => {
      const name = 'Greenway Intergy Meaningful Use Edition';
      const productId = 837;
      let newVersion; let product; let timestamp; let
        version;

      beforeEach(() => {
        const developer = 'Greenway Health, LLC';
        timestamp = (new Date()).getTime();
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
        hooks.waitForSpinnerToDisappear();
      });

      describe('when merging versions of "Greenway Intergy Meaningful Use Edition" product', () => {
        version = 'v10.10';
        const versionToBeMerged = 'v9.30';

        beforeEach(() => {
          newVersion = `New version - ${timestamp}`;
          product = page.getProduct(name);
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
          page.selectVersion(product, productId, version);
        });

        it('should create new version successfully', () => {
          page.mergeVersion(product);
          page.moveVersionToBeMerged(versionToBeMerged);
          page.versionName.clearValue();
          page.versionName.addValue(newVersion);
          actionBar.save();
          page.productsHeader.waitForDisplayed();
          toast.clearAllToast();
          page.selectAllCertificationStatus();
          product = page.getProduct(name);
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
          expect(page.getActiveVersion(product, productId)).toHaveTextContaining(newVersion);
          expect(page.getActiveVersion(product, productId)).not.toHaveTextContaining(version);
          expect(page.getActiveVersion(product, productId)).not.toHaveTextContaining(versionToBeMerged);
        });
      });
    });

    describe('when on the "Mana Health" Developer page, looking at "Mana Health Patient Gateway" Product', () => {
      let product;
      const productName = 'Mana Health Patient Gateway';
      const productId = 1351;
      const version = '1.0.0';
      beforeEach(() => {
        const developer = 'Mana Health';
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
        product = page.getProduct(productName);
        product.scrollIntoView({ block: 'center', inline: 'center' });
        page.selectProduct(product);
        page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
      });

      xit('should have a version split, but not a product split', () => {
        page.getSplitButton(product).click();
        expect(page.getSplitButton(product)).toExist();
        expect(page.getProductSplitButton(product).getText()).toBe('Product\n(Cannot split Product with only one Version)');
        expect(page.getVersionSplitButton(product).getText()).toBe('Version\n(Select a specific Version to split)');
        page.selectVersion(product, productId, version);
        page.getSplitButton(product).click();
        expect(page.getVersionSplitButton(product).getText()).toBe('Version');
      });

      it('should allow a split to happen', () => {
        // arrange
        const versionCountText = page.getVersionCount(product).getText();
        const versionCount = page.getSelectableVersions(product, productId).length;
        const newVersion = `${version} - split - ${(new Date()).getTime()}`;
        const newCode = newVersion.substring(newVersion.length - 2);
        const movingListingId = '6678';
        page.selectVersion(product, productId, version);
        page.getSplitButton(product).click();
        page.getVersionSplitButton(product).click();
        page.splitVersionVersion.setValue(newVersion);
        page.editVersionCode.setValue(newCode);
        page.moveListing(movingListingId);

        // act
        actionBar.save();
        toast.clearAllToast();
        page.selectAllCertificationStatus();
        page.productsHeader.waitForDisplayed();
        product = page.getProduct(productName);
        product.scrollIntoView({ block: 'center', inline: 'center' });
        page.selectProduct(product);
        page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });

        // assert version count has increased
        expect(page.getVersionCount(product).getText()).not.toBe(versionCountText);
        expect(page.getSelectableVersions(product, productId).length).toBe(versionCount + 1);
      });
    });
  });
});
