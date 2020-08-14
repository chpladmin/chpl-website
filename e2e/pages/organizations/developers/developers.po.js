/* eslint-disable no-console,angular/log */
const elements = {
    developersSelect: '#developer-select',
    developersButton: '#developer-button',
    directReviewsHeader: 'h2=Direct Review Activities',
    productsHeader: 'h2=Products',
    products: '.products__product',
    lastModified: '.product__product-info-item-last-modified',
}

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

    getLastModifed (product) {
        return product.$(elements.lastModified).$('.read-only-data');
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
}

export default DevelopersPage;
