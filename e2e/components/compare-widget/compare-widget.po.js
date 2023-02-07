class CompareWidgetComponent {
  constructor() {
    this.elements = {
      compareWidget: '#compare-widget-toggle',
      compareProducts: '#compare-listings',
      removeProducts: '#remove-listings',
      compareButton: (listingId) => `#toggle-compare-${listingId}`,
      compareContent: '#compare-widget-dropdown',
      listingButton: (productName) => `div*=${productName}`,
    };
  }

  get compareWidget() {
    return $(this.elements.compareWidget);
  }

  get compareProductsButton() {
    return $(this.elements.compareProducts);
  }

  get removeProductsButton() {
    return $(this.elements.removeProducts);
  }

  addListingToCompare(listingId) {
    $(this.elements.compareButton(listingId)).scrollIntoView({ block: 'center', inline: 'center' });
    $(this.elements.compareButton(listingId)).click();
  }

  isInList(productName) {
    return $(this.elements.compareContent).$(this.elements.listingButton(productName)).isDisplayed();
  }
}

export default CompareWidgetComponent;
