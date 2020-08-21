import compareWidgetComponent from './compare-widget.po'
import SearchPage from '../../pages/search/search.po'
import Hooks from '../../utilities/hooks'

let component, hooks, page;
let ListingId1 = 9261;
let ListingId2 = 9956;
let chplId2 = '15.04.04.2916.smar.07.01.1.190328';
let chplId1 = '15.02.02.3007.A056.01.00.0.180214';

beforeEach(async () => {
    page = new SearchPage();
    component = new compareWidgetComponent();
    hooks = new Hooks();
    await hooks.open('#/search');
});

describe('on compare widget', () => {
    describe('if there is no listing added for compare', () => {

        it('should not have compare products button', () => {
            component.compareWidget.click();
            assert.isFalse(component.compareProductsButton.isDisplayed());
        })
        it('should not have remove all products button', () => {
            component.compareWidget.click();
            assert.isFalse(component.removeProductsButton.isDisplayed());
        })
    })
})

describe('on compare widget', () => {
    describe('if there is atleast 1 listing added for compare', () => {
        beforeAll(() => {
            page.searchForListing(chplId2);
            page.addListingToCompare(ListingId2);
        });

        it('should have compare products button but disabled', () => {
            assert.isTrue(component.compareProductsButton.isDisplayed());
            assert.isFalse(component.compareProductsButton.isClickable());
        })

        it('should have remove all products button and enabled', () => {
            assert.isTrue(component.removeProductsButton.isDisplayed());
            assert.isTrue(component.removeProductsButton.isClickable());
        })

        it('remove products removes products', () => {
            component.removeProductsButton.click();
            assert.isFalse(component.removeProductsButton.isDisplayed());
            assert.isFalse(component.compareProductsButton.isDisplayed());
        })

    })
})

describe('on compare widget', () => {
    describe('if there are atleast 2 listings added for compare', () => {
        beforeAll(() => {
            page.searchForListing(chplId1);
            page.addListingToCompare(ListingId1);
            page.searchForListing(chplId2);
            page.addListingToCompare(ListingId2);
        });

        it('should have compare products button and enabled', () => {
            assert.isTrue(component.compareProductsButton.isDisplayed());
            assert.isTrue(component.compareProductsButton.isClickable());
        })

        it('should have remove all products button and enabled', () => {
            assert.isTrue(component.removeProductsButton.isDisplayed());
            assert.isTrue(component.removeProductsButton.isClickable());
        })

        it('compare products button opens compare page for the selected listings', () => {
            component.compareProductsButton.click();
            assert.include(browser.getUrl(),'/compare/' + ListingId1 + '&' + ListingId2);
        })
    })
})
