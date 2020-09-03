import DirectReviewsComponent from './direct-reviews.po'
import DevelopersPage from '../../pages/organizations/developers/developers.po'
import Hooks from '../../utilities/hooks'

let component, hooks, page;

beforeEach(async () => {
    page = new DevelopersPage();
    component = new DirectReviewsComponent();
    hooks = new Hooks();
    await hooks.open('#/organizations/developers');
});

describe('the Direct Reviews component', () => {
    describe('for Radysans, Inc', () => {
        beforeEach(() => {
            page.selectDeveloper('Radysans, Inc');
        });

        it('should indicate the absence of DRs', () => {
            let directReviews = component.getDirectReviews();
            expect(directReviews.getText()).toBe('No Direct Reviews have been conducted');
        });
    });
});
