import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks';
import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import ContactComponent from '../../../components/contact/contact.po';
import LoginComponent from '../../../components/login/login.po';
import ToastComponent from '../../../components/toast/toast.po';

let actionBar, contact, hooks, login, page, toast;

describe('the Product part of the Developers page', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new DevelopersPage();
    actionBar = new ActionBarComponent();
    contact = new ContactComponent();
    login = new LoginComponent();
    toast = new ToastComponent();
    hooks = new Hooks();
    await hooks.open('#/organizations/developers');
  });

  describe('when logged in as Drummond ACB', () => {
    beforeEach(() => {
      login.logIn('drummond');
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      login.logOut();
    });

    describe('when on the "Greenway Health, LLC" Developer page', () => {
      beforeEach(() => {
        let developer = 'Greenway Health, LLC';
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
      });

      describe('when looking at "PrimeSuite" product', () => {
        let name = 'PrimeSuite';
        let product;
        beforeEach(() => {
          product = page.getProduct(name);
          product.scrollIntoView({block: 'center', inline: 'center'});
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({timeout: 55000});
        });

        it('should have split product button', () => {
          expect(page.getSplitButton(product)).toExist();
        });

        it('should not have merge product button', () => {
          expect(page.getMergeButton(product)).not.toExist();
        });

        it('should show correct error message when spliting product with listings owned by different ACBs', () => {
          const newName = name + ' - split - ' + (new Date()).getTime();
          const newCode = newName.substring(newName.length - 4);
          const movingVersionId = '2039';
          page.splitProduct(product);
          page.editProductName.setValue(newName);
          page.editProductCode.setValue(newCode);
          page.moveVersion(movingVersionId);
          actionBar.save();
          expect(actionBar.errorMessages.getText()).toEqual('Access is denied to update listing CHP-009386 because it is owned by CCHIT.');
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
  });

  describe('when logged in as an ONC', () => {
    beforeEach(() => {
      login.logIn('onc');
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      login.logOut();
    });

    describe('when on the "Medical Information Technology, Inc. (MEDITECH)" Developer page', () => {
      const developer = 'Medical Information Technology, Inc. (MEDITECH)';
      let product;

      beforeEach(() => {
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
      });

      describe('when on the "MEDITECH MAGIC Oncology" product', () => {
        const productName = 'MEDITECH MAGIC Oncology';

        beforeEach(() => {
          product = page.getProduct(productName);
          product.scrollIntoView({block: 'center', inline: 'center'});
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({timeout: 55000});
        });

        it('should have a product split', () => {
          expect(page.getSplitButton(product)).toExist();
        });

        it('should allow a split to happen', () => {
          // arrange
          let productCount = page.products.length;
          const newName = productName + ' - split - ' + (new Date()).getTime();
          const newCode = newName.substring(newName.length - 4);
          const movingVersionId = '6266';
          page.splitProduct(product);
          page.editProductName.setValue(newName);
          page.editProductCode.setValue(newCode);
          page.moveVersion(movingVersionId);

          // act
          actionBar.save();
          page.productsHeader.waitForDisplayed();

          // assert product list is updated
          expect(page.getProduct(productName)).toExist();
          expect(page.getProduct(newName)).toExist();
          expect(page.products.length).toBe(productCount + 1);

          // assert old product is updated
          product = page.getProduct(productName);
          product.scrollIntoView({block: 'center', inline: 'center'});
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({timeout: 55000});
          expect(page.getVersionCount(product).getText()).toBe('1 Version');

          // assert new product is correct
          product = page.getProduct(newName);
          product.scrollIntoView({block: 'center', inline: 'center'});
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({timeout: 55000});
          expect(page.getVersionCount(product).getText()).toBe('1 Version');
        });
      });

      describe('when on the "MEDITECH Client/Server" product', () => {
        const productName = 'MEDITECH Client/Server';
        const productToBeMerged = 'MEDITECH 6.0 CCD Exchange Suite';
        let timestamp = (new Date()).getTime();
        let newProduct = 'New product' + timestamp;

        beforeEach(() => {
          product = page.getProduct(productName);
          product.scrollIntoView({block: 'center', inline: 'center'});
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({timeout: 55000});
        });

        it('should have a product merge button', () => {
          expect(page.getProductMergeButton(product)).toExist();
        });

        it('should allow merge products to happen', () => {
          page.mergeProduct(product);
          page.moveProductToBeMerged(productToBeMerged);
          page.editProductName.clearValue();
          page.editProductName.addValue(newProduct);
          actionBar.save();
          page.productsHeader.waitForDisplayed();
          toast.clearAllToast();
          expect(page.getProduct(newProduct)).toExist();
          expect(page.getProduct(productName)).not.toExist();
          expect(page.getProduct(productToBeMerged)).not.toExist();
        });
      });
    });
  });
});
