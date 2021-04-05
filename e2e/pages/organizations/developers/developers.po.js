const elements = {
  developersSelect: '#developer-select',
  developersButton: '#developer-button',
  directReviewsHeader: 'h2=Direct Review Activities',
  productsHeader: 'h2=Products',
  editProductsHeader: 'h2=Edit Product Details',
  editVersionHeader: 'h2=Edit Version Details',
  products: '.products__product',
  editProductName: '#product-name',
  editProductCode: '#product-code',
  activeVersion: '#active-version',
  editVersionName: '#version-name',
  editVersionCode: '#version-code',
  splitVersionVersion: '#version-version',
  editDeveloper: 'button#developer-component-edit',
  versionName: '#version-name',
  errorMessage: '.text-danger.ng-scope',
  versionList: '.selectable-item.ng-scope.selectable-item',
  developerContact: 'chpl-contact',
  developerWebsite: '//div[text()=\'Website\']/following-sibling::div/a',
  developerStatus: '#developer-status-0',
  splitDeveloper: '#developer-component-split',
  developerName: '#developer-name',
  errors: 'div.text-danger',
  mergeDeveloper: '#developer-component-merge',
};

class DevelopersPage {
  constructor () { }

  get developersSelect () {
    return $(elements.developersSelect);
  }

  get developersButton () {
    return $(elements.developersButton);
  }

  getDeveloperPageTitle (developer) {
    return $('h2=' + developer);
  }

  get directReviewsHeader () {
    return $(elements.directReviewsHeader);
  }

  get productsHeader () {
    return $(elements.productsHeader);
  }

  get editProductsHeader () {
    return $(elements.editProductsHeader);
  }

  get editVersionHeader () {
    return $(elements.editVersionHeader);
  }

  get products () {
    return $$(elements.products);
  }

  getProduct (product) {
    return $('.products__product-header-item--first=' + product).$('..').$('..');
  }

  getProductInfo (product) {
    return product.$('.product__product-info');
  }

  getVersionCount (product) {
    return product.$('.products__product-header').$$('.products__product-header-item--end')[0];
  }

  getAcbName (product) {
    return product.$('.products__product-header').$$('.products__product-header-item')[1];
  }

  getListingCount (product) {
    return product.$('.products__product-header').$$('.products__product-header-item')[2];
  }

  get editProductName () {
    return $(elements.editProductName);
  }

  get editProductCode () {
    return $(elements.editProductCode);
  }

  get editVersionName () {
    return $(elements.editVersionName);
  }

  get splitVersionVersion () {
    return $(elements.splitVersionVersion);
  }

  get editVersionCode () {
    return $(elements.editVersionCode);
  }

  get editDeveloper () {
    return $(elements.editDeveloper);
  }

  selectDeveloper (developerName) {
    this.developersSelect.selectByVisibleText(developerName);
    this.developersButton.click();
  }

  getEditButton (product) {
    return product.$('.product__product-info').$('#edit-button');
  }

  getMergeButton (product) {
    return product.$('.product__product-info').$('#merge-button');
  }

  getSplitButton (product) {
    return product.$('.product__product-info').$('#split-button');
  }

  getProductSplitButton (product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="split-button"]').$$('li')[0];
  }

  getVersionSplitButton (product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="split-button"]').$$('li')[1];
  }

  selectProduct (product) {
    product.$('.products__product-header').click();
  }

  getSelectableVersions (product, productId) {
    return product.$(elements.activeVersion + '-' + productId).$$('option');
  }

  selectVersion (product, productId, versionName) {
    product.$(elements.activeVersion + '-' + productId).selectByVisibleText(versionName);
  }

  editProduct (product) {
    this.getEditButton(product).click();
    product.$('.product__product-info-item-action').$('.dropdown-menu').$$('li')[0].click();
  }

  splitProduct (product) {
    this.getSplitButton(product).click();
    let btn = product.$$('li').filter(item => item.getText() === 'Product')[0];
    btn.click();
  }

  moveVersion (id) {
    $('#products-version-move-new-' + id).click();
  }

  moveListing (id) {
    $('#listings-listing-move-new-' + id).click();
  }

  restoreListing (id) {
    $('#listings-listing-move-old-' + id).click();
  }

  getActiveVersion (product, productId) {
    return product.$(elements.activeVersion + '-' + productId);
  }

  getActiveContact (product) {
    return product.$('chpl-contact');
  }

  editVersion (product) {
    this.getEditButton(product).click();
    product.$('.product__product-info-item-action').$('.dropdown-menu').$$('li')[1].click();
  }

  mergeVersion (product) {
    this.getMergeButton(product).click();
    let btn = product.$$('li').filter(itm => itm.getText() === 'Version')[0];
    btn.click();
  }

  get versionMergeButton () {
    return $$('.product__product-action-filter-item.ng-scope')[2];
  }

  get versionName () {
    return $(elements.versionName);
  }

  moveVersionToBeMerged (versionName) {
    const count = $$(elements.versionList).length;
    for (var i = 0; i < count; i++) {
      if ($$(elements.versionList)[i].getText() === versionName) {
        $$(elements.versionList)[i].click();
      }
    }
  }

  get errorMessage () {
    return $(elements.errorMessage);
  }

  get developerContact () {
    return $(elements.developerContact);
  }

  get developerWebsite () {
    return $(elements.developerWebsite);
  }

  get developerStatus () {
    return $(elements.developerStatus);
  }

  get splitDeveloper () {
    return $(elements.splitDeveloper);
  }

  get developerName () {
    return $(elements.developerName);
  }

  get errors () {
    return $(elements.errors).$('ul');
  }

  get mergeDeveloper () {
    return $(elements.mergeDeveloper);
  }

  moveDeveloperToSplit (id) {
    $('#developers-product-move-new-' + id).scrollAndClick();
  }

  moveDeveloperToBeMerged (developerName) {
    $('//div[text()=\'' + developerName + '\']').click();
  }
}

export default DevelopersPage;
