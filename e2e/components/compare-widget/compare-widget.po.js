const elements = {
  compareWidget: '#compare-widget-toggle',
  compareProducts: '//button[text()="Compare products"]',
  removeProducts: '//button[text()="Remove all products"]',
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
    this.compareButton(listingId).scrollAndClick();
  }

  addToCompare (listingId){
    return $(`#toggle-compare-${listingId}`);
  }
}

export default CompareWidgetComponent;
