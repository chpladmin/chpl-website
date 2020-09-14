const elements = {
    developersSelect: '#developer-select',
    developersButton: '#developer-button',
    directReviewsHeader: 'h2=Direct Review Activities',
    productsHeader: 'h2=Products',
    editProductsHeader: 'h2=Edit Product Details',
    products: '.products__product',
    editProductName: '#product-name',
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

    get products () {
        return $$(elements.products);
    }

    getProduct (product) {
        return $('h3=' + product).$('..').$('..').$('..');
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

    selectDeveloper (developerName) {
        this.developersSelect.selectByVisibleText(developerName);
        this.developersButton.click();
        return this;
    }

    getEditButton (product) {
        return product.$('.product__product-info').$('#edit-button');
    }

    selectProduct (product) {
        product.$('.products__product-header').click();
    }

    editProduct (product) {
        this.getEditButton(product).click();
        product.$('.product__product-info-item-edit').$('.dropdown-menu').$$('li')[0].click();
    }
}

export default DevelopersPage;
