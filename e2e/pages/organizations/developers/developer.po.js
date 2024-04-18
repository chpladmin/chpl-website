const elements = {
  directReviewsHeader: 'h2=Direct Review Activities',
  productsHeader: 'h2=Products',
  editProductsHeader: 'h2=Edit Product Details',
  editVersionHeader: 'h2=Edit Version Details',
  products: '.products__product',
  editProductName: '#product-name',
  editProductCode: '#product-code',
  currentProductOwner: '#product-owner-current',
  activeVersion: '#active-version',
  editVersionName: '#version-name',
  editVersionCode: '#version-code',
  splitVersionVersion: '#version-version',
  editDeveloper: 'button#developer-component-edit',
  versionName: '#version-name',
  errorMessage: '.text-danger.ng-scope',
  list: '.selectable-item.ng-scope.selectable-item',
  developerContact: 'chpl-developer-bridge',
  developerWebsite: '//div[text()=\'Website\']/following-sibling::div/a',
  developerStatus: '#developer-status-0',
  splitDeveloper: '#developer-component-split',
  developerName: '#name',
  joinDeveloper: '#developer-component-join',
  editWebsite: '#website',
  contact: {
    fullName: '#fullName',
    title: '#title',
    email: '#email',
    phone: '#phoneNumber',
  },
  address: {
    line1: '#line1',
    line2: '#line2',
    city: '#city',
    state: '#state',
    zipcode: '#zipcode',
    country: '#country',
  },
};

class DeveloperPage {
  constructor() {
    this.elements = elements;
  }

  getDeveloperPageTitle(developer) {
    return $(`h2=${developer}`);
  }

  get directReviewsHeader() {
    return $(this.elements.directReviewsHeader);
  }

  get productsHeader() {
    return $(this.elements.productsHeader);
  }

  get editProductsHeader() {
    return $(this.elements.editProductsHeader);
  }

  get editVersionHeader() {
    return $(this.elements.editVersionHeader);
  }

  get products() {
    return $$(this.elements.products);
  }

  get editWebsite() {
    return $(this.elements.editWebsite);
  }

  getProduct(product) {
    return $(`.products__product-header-item--first=${product}`).$('..').$('..');
  }

  getProductInfo(product) {
    return product.$('.product__product-info');
  }

  getVersionCount(product) {
    return product.$('.products__product-header').$$('.products__product-header-item--end')[0];
  }

  getSurveillanceData(product) {
    return product.$('.products__product-header').$$('.products__product-header-item')[1];
  }

  getListingCount(product) {
    return product.$('.products__product-header').$$('.products__product-header-item')[2];
  }

  get editProductName() {
    return $(this.elements.editProductName);
  }

  get editProductCode() {
    return $(this.elements.editProductCode);
  }

  get currentProductOwner() {
    return $(this.elements.currentProductOwner);
  }

  selectProductOwner(developerName) {
    this.currentProductOwner.selectByVisibleText(developerName);
  }

  get editVersionName() {
    return $(this.elements.editVersionName);
  }

  get splitVersionVersion() {
    return $(this.elements.splitVersionVersion);
  }

  get editVersionCode() {
    return $(this.elements.editVersionCode);
  }

  get editDeveloper() {
    return $(this.elements.editDeveloper);
  }

  getEditButton(product) {
    return product.$('.product__product-info').$('#edit-button');
  }

  getMergeButton(product) {
    return product.$('.product__product-info').$('#merge-button');
  }

  getSplitButton(product) {
    return product.$('.product__product-info').$('#split-button');
  }

  getProductSplitButton(product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="split-button"]').$$('li')[0];
  }

  getProductMergeButton(product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="merge-button"]').$$('li')[0];
  }

  getVersionSplitButton(product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="split-button"]').$$('li')[1];
  }

  getVersionMergeButton(product) {
    return product.$('.product__product-info').$('ul[aria-labeledby="merge-button"]').$$('li')[1];
  }

  selectProduct(product) {
    product.$('.products__product-header').click();
  }

  getSelectableVersions(product, productId) {
    return product.$(`${this.elements.activeVersion}-${productId}`).$$('option');
  }

  selectVersion(product, productId, versionName) {
    product.$(`${this.elements.activeVersion}-${productId}`).selectByVisibleText(versionName);
  }

  editProduct(product) {
    this.getEditButton(product).click();
    product.$('.product__product-info-item-action').$('.dropdown-menu').$$('li')[0].click();
  }

  splitProduct(product) {
    this.getSplitButton(product).click();
    const btn = product.$$('li').filter((item) => item.getText() === 'Product')[0];
    btn.click();
  }

  mergeProduct(product) {
    this.getMergeButton(product).click();
    const btn = product.$$('li').filter((item) => item.getText() === 'Product')[0];
    btn.click();
  }

  moveProductToBeMerged(productName) {
    const count = $$(this.elements.list).length;
    for (let i = 0; i < count; i++) {
      if ($$(this.elements.list)[i].getText() === productName) {
        $$(this.elements.list)[i].scrollIntoView({ block: 'center', inline: 'center' });
        $$(this.elements.list)[i].click();
      }
    }
  }

  moveVersion(id) {
    $(`#products-version-move-new-${id}`).click();
  }

  moveListing(id) {
    $(`#listings-listing-move-new-${id}`).click();
  }

  restoreListing(id) {
    $(`#listings-listing-move-old-${id}`).click();
  }

  getActiveVersion(product, productId) {
    return product.$(`${this.elements.activeVersion}-${productId}`);
  }

  getActiveContact(product) {
    return product.$('chpl-contact');
  }

  editVersion(product) {
    this.getEditButton(product).click();
    product.$('.product__product-info-item-action').$('.dropdown-menu').$$('li')[1].click();
  }

  mergeVersion(product) {
    this.getMergeButton(product).click();
    const btn = product.$$('li').filter((itm) => itm.getText() === 'Version')[0];
    btn.click();
  }

  get versionMergeButton() {
    return $$('.product__product-action-filter-item.ng-scope')[2];
  }

  get versionName() {
    return $(this.elements.versionName);
  }

  moveVersionToBeMerged(versionName) {
    const count = $$(this.elements.list).length;
    for (let i = 0; i < count; i++) {
      if ($$(this.elements.list)[i].getText() === versionName) {
        $$(this.elements.list)[i].click();
      }
    }
  }

  get errorMessage() {
    return $(this.elements.errorMessage);
  }

  get developerContact() {
    return $(this.elements.developerContact);
  }

  get developerWebsite() {
    return $(this.elements.developerWebsite);
  }

  get developerStatus() {
    return $(this.elements.developerStatus);
  }

  get splitDeveloper() {
    return $(this.elements.splitDeveloper);
  }

  get developerName() {
    return $(this.elements.developerName);
  }

  get joinDeveloper() {
    return $(this.elements.joinDeveloper);
  }

  get fullName() {
    return $(this.elements.contact.fullName);
  }

  get title() {
    return $(this.elements.contact.title);
  }

  get email() {
    return $(this.elements.contact.email);
  }

  get phone() {
    return $(this.elements.contact.phone);
  }

  get line1() {
    return $(this.elements.address.line1);
  }

  get line2() {
    return $(this.elements.address.line2);
  }

  get city() {
    return $(this.elements.address.city);
  }

  get state() {
    return $(this.elements.address.state);
  }

  get zipcode() {
    return $(this.elements.address.zipcode);
  }

  get country() {
    return $(this.elements.address.country);
  }

  moveDeveloperToSplit(id) {
    $(`#developers-product-move-new-${id}`).click();
  }

  moveDeveloperToBeJoined(developerName) {
    $(`td=${developerName}`).parentElement().$('button').click();
  }

  selectAllCertificationStatus() {
    $('#filter-button').click();
    $('chpl-filter-multiple').$$('.filter-multiple__item')[0].click();
    $('#filter-button').click();
  }

  setAddress(address) {
    $(this.elements.address.line1).setValue(address.line1);
    $(this.elements.address.line2).setValue(address.line2);
    $(this.elements.address.city).setValue(address.city);
    $(this.elements.address.state).setValue(address.state);
    $(this.elements.address.zipcode).setValue(address.zipcode);
    $(this.elements.address.country).setValue(address.country);
  }

  setContact(contact) {
    $(this.elements.contact.fullName).setValue(contact.fullName);
    $(this.elements.contact.title).setValue(contact.title);
    $(this.elements.contact.email).setValue(contact.email);
    $(this.elements.contact.phone).setValue(contact.phone);
  }
}

export default DeveloperPage;
