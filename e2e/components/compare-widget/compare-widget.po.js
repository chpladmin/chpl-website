const elements = {
    compareWidget: '#compare-widget-toggle',
    compareProducts: '//button[text()="Compare products"]',
    removeProducts: '//button[text()="Remove all products"]',
}

class compareWidgetComponent {
    constructor () { }

    get compareWidget () {
        return $(elements.compareWidget);
    }

    get compareProductsButton () {
        return $(elements.compareProducts);
    }

    get removeProductsButton () {
        return $(elements.removeProducts);
    }

}

export default compareWidgetComponent;
