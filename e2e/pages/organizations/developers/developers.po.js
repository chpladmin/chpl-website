const elements = {
    developersSelect: '#developer-select',
    developersButton: '#developer-button',
    directReviewsHeader: 'h2=Direct Review Activities',
    productsHeader: 'h2=Products',
    editProductsHeader: 'h2=Edit Product Details',
    editVersionHeader: 'h2=Edit Version Details',
    products: '.products__product',
    editProductName: '#product-name',
    activeVersion: '#active-version',
    editVersionName: '#version-name',
    editDeveloper: 'button#developer-component-edit',
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
        return product.$('.products__product-header').$$('.products__product-header-item')[2];
    }

    get editProductName () {
        return $(elements.editProductName);
    }

    get editVersionName () {
        return $(elements.editVersionName);
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

    selectProduct (product) {
        product.$('.products__product-header').click();
    }

    selectVersion (product, productId, versionName) {
        product.$(elements.activeVersion + '-' + productId).selectByVisibleText(versionName);
    }

    editProduct (product) {
        this.getEditButton(product).click();
        product.$('.product__product-info-item-action').$('.dropdown-menu').$$('li')[0].click();
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
}

export default DevelopersPage;
