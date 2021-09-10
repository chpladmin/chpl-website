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
  list: '.selectable-item.ng-scope.selectable-item',
  developerContact: 'chpl-contact',
  developerWebsite: '//div[text()=\'Website\']/following-sibling::div/a',
  developerStatus: '#developer-status-0',
  splitDeveloper: '#developer-component-split',
  developerName: '#developer-name',
  errors: 'div.text-danger',
  mergeDeveloper: '#developer-component-merge',
  editWebsite: '#developer-website',
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

  get editWebsite () {
    return $(elements.editWebsite);
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

  getSurveillanceData (product) {
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
    this.developersButton.scrollAndClick();
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

  getProductMergeButton (product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="merge-button"]').$$('li')[0];
  }

  getVersionSplitButton (product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="split-button"]').$$('li')[1];
  }

  getVersionMergeButton (product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="merge-button"]').$$('li')[1];
  }

  selectProduct (product) {
    product.$('.products__product-header').scrollAndClick();
  }

  getSelectableVersions (product, productId) {
    return product.$(elements.activeVersion + '-' + productId).$$('option');
  }

  selectVersion (product, productId, versionName) {
    product.$(elements.activeVersion + '-' + productId).selectByVisibleText(versionName);
  }

  editProduct (product) {
    this.getEditButton(product).scrollAndClick();
    product.$('.product__product-info-item-action').$('.dropdown-menu').$$('li')[0].scrollAndClick();
  }

  splitProduct (product) {
    this.getSplitButton(product).scrollAndClick();
    const btn = product.$$('li').filter(item => item.getText() === 'Product')[0];
    btn.scrollAndClick();
  }

  mergeProduct (product) {
    this.getMergeButton(product).scrollAndClick();
    const btn = product.$$('li').filter(item => item.getText() === 'Product')[0];
    btn.scrollAndClick();
  }

  moveProductToBeMerged (productName) {
    const count = $$(elements.list).length;
    for (var i = 0; i < count; i++) {
      if ($$(elements.list)[i].getText() === productName) {
        $$(elements.list)[i].scrollIntoView({block: 'center', inline: 'center'});
        $$(elements.list)[i].scrollAndClick();
      }
    }
  }

  moveVersion (id) {
    $('#products-version-move-new-' + id).scrollAndClick();
  }

  moveListing (id) {
    $('#listings-listing-move-new-' + id).scrollAndClick();
  }

  restoreListing (id) {
    $('#listings-listing-move-old-' + id).scrollAndClick();
  }

  getActiveVersion (product, productId) {
    return product.$(elements.activeVersion + '-' + productId);
  }

  getActiveContact (product) {
    return product.$('chpl-contact');
  }

  editVersion (product) {
    this.getEditButton(product).scrollAndClick();
    product.$('.product__product-info-item-action').$('.dropdown-menu').$$('li')[1].scrollAndClick();
  }

  mergeVersion (product) {
    this.getMergeButton(product).scrollAndClick();
    const btn = product.$$('li').filter(itm => itm.getText() === 'Version')[0];
    btn.scrollAndClick();
  }

  get versionMergeButton () {
    return $$('.product__product-action-filter-item.ng-scope')[2];
  }

  get versionName () {
    return $(elements.versionName);
  }

  moveVersionToBeMerged (versionName) {
    const count = $$(elements.list).length;
    for (var i = 0; i < count; i++) {
      if ($$(elements.list)[i].getText() === versionName) {
        $$(elements.list)[i].scrollAndClick();
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
    $('//div[text()=\'' + developerName + '\']').scrollAndClick();
  }

  selectAllCertificationStatus () {
    $('#filter-button').scrollAndClick();
    $('chpl-filter-multiple').$$('.filter-multiple__item')[0].scrollAndClick();
    $('#filter-button').scrollAndClick();
  }
}

export default DevelopersPage;
