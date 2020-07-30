import DirectReviewsComponent from './direct-reviews.po'
import DevelopersPage from '../../pages/organizations/developers/developers.po'
import Hooks from '../../utilities/hooks'

let component, hooks, page;

beforeEach(async () => {
    page = new DevelopersPage();
    component = new DirectReviewsComponent();
    hooks = new Hooks();
    await hooks.open('/organizations/developers');
});

describe('the Direct Reviews component', () => {
    describe('for Greenway Health', () => {
        beforeEach(() => {
            page.selectDeveloper('Greenway Health, LLC');
        });

        it('should have four direct reviews', () => {
            expect(component.directReviews.length).toBe(4);
        });

        it('should sort them "open" first', () => {
            let directReviews = component.directReviews;
            expect(component.getDirectReviewTitle(directReviews[0]).getText()).toBe('Open Direct Review');
            expect(component.getDirectReviewTitle(directReviews[1]).getText()).toBe('Open Direct Review');
            expect(component.getDirectReviewTitle(directReviews[2]).getText()).toBe('Closed Direct Review');
            expect(component.getDirectReviewTitle(directReviews[3]).getText()).toBe('Closed Direct Review');
        });

        it('should sort them by date inside the type first', () => {
            let directReviews = component.directReviews;
            expect(component.getDirectReviewSubtitle(directReviews[0]).getText()).toMatch(/Jul 1, 2020/);
            expect(component.getDirectReviewSubtitle(directReviews[1]).getText()).toMatch(/Jun 15, 2020/);
            expect(component.getDirectReviewSubtitle(directReviews[2]).getText()).toMatch(/Jun 29, 2020/);
            expect(component.getDirectReviewSubtitle(directReviews[3]).getText()).toMatch(/Jun 17, 2020/);
        });
    });
});
