class CompareWidgetComponent {
  constructor() {
    this.elements = {
      compareWidget: '#compare-widget-toggle',
      compareProducts: '#compare-listings',
      removeProducts: '#remove-listings',
      compareButton: (listingId) => `#toggle-compare-${listingId}`,
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
}

export default CompareWidgetComponent;
