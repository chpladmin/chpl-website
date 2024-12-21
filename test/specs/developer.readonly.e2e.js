import DeveloperPage from '../pageobjects/developer.page';
import LoginComponent from '../pageobjects/login-component.page';

let login;
let page;

describe('the Developer page for "gMed, Inc."', () => {
  beforeEach(async () => {
    page = new DeveloperPage();
    await page.open(1614);
  });

  it('should have a title', async () => {
    await expect(page.title).toHaveText('gMed, Inc.');
  });

  it('should not have the edit button for anonymous users', async () => {
    await expect(page.editDeveloperButton).not.toBeExisting();
  });

  describe('the Products section', () => {
    it('should have no results found by default', async () => {
      await expect(await page.getProductsSearchResults()).toHaveTextContaining('No results found');
    });

    describe('when browsing all listings', () => {
      beforeEach(async () => {
        await page.browseAllListings();
      });

      it('should not have "no results found"', async () => {
        await expect(await page.getProductsSearchResults()).not.toHaveTextContaining('No results found');
      });

      it('should have seven products', async () => {
        const products = await page.getProducts();
        expect(products.length).toBe(7);
      });

      it('should show "gGastro" as the third product', async () => {
        const products = await page.getProducts();
        const productName = await page.getProductName(products[2]);
        expect(productName).toHaveTextContaining('gGastro');
      });
    });

    describe('when filtering listings', () => {
      beforeEach(async () => {
        await page.browseAllListings();
      });

      it('should allow selection of a certification status', async () => {
        await page.filterBy('certificationStatuses', 'Withdrawn_by_Developer');
        const products = await page.getProducts();
        const productName = await page.getProductName(products[4]);
        expect(products.length).toBe(5);
        expect(productName).toHaveTextContaining('gMed Connect');
      });
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      login = new LoginComponent();
      await login.logIn('onc');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have the edit button for ASTP users', async () => {
      await expect(page.editDeveloperButton).toBeExisting();
    });
  });

  describe('when logged in as ONC-ACB', () => {
    beforeEach(async () => {
      login = new LoginComponent();
      await login.logIn('drummond');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have the edit button for ONC-ACB users', async () => {
      await expect(page.editDeveloperButton).toBeExisting();
    });
  });
});
