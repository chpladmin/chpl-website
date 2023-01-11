const elements = {
  compareWidget: '#compare-widget-toggle',
  compareProducts: '#compare-listings',
  removeProducts: '#remove-listings',
};

class CompareWidgetComponent {
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

  compareButton (listingId) {
    return $('#toggle-compare-' + listingId);
  }

  addListingToCompare (listingId) {
    this.compareButton(listingId).scrollIntoView({block: 'center', inline: 'center'});
    this.compareButton(listingId).click();
  }

  addToCompare (listingId){
    return $(`#toggle-compare-${listingId}`);
  }
}

export default CompareWidgetComponent;
