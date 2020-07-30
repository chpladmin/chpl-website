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
            expect(component.getDirectReviews().length).toBe(4);
        });

        it('should sort them "open" first', () => {
            let directReviews = component.getDirectReviews();
            expect(component.getDirectReviewTitle(directReviews[0]).getText()).toBe('Open Direct Review');
            expect(component.getDirectReviewTitle(directReviews[1]).getText()).toBe('Open Direct Review');
            expect(component.getDirectReviewTitle(directReviews[2]).getText()).toBe('Closed Direct Review');
            expect(component.getDirectReviewTitle(directReviews[3]).getText()).toBe('Closed Direct Review');
        });

        it('should sort them by date inside the type first', () => {
            let directReviews = component.getDirectReviews();
            expect(component.getDirectReviewSubtitle(directReviews[0]).getText()).toMatch(/Jul 1, 2020/);
            expect(component.getDirectReviewSubtitle(directReviews[1]).getText()).toMatch(/Jun 15, 2020/);
            expect(component.getDirectReviewSubtitle(directReviews[2]).getText()).toMatch(/Jun 29, 2020/);
            expect(component.getDirectReviewSubtitle(directReviews[3]).getText()).toMatch(/Jun 17, 2020/);
        });

        it('should have basic DR data', () => {
            let directReviews = component.getDirectReviews();
            directReviews[2].scrollIntoView({block: 'center', inline: 'center'});
            directReviews[2].click();
            expect(component.getDirectReviewBegan(directReviews[2]).getText()).toMatch(/Jun 10, 2020/);
            expect(component.getDirectReviewEnded(directReviews[2]).getText()).toMatch(/Jun 29, 2020/);
            let circumstances = component.getDirectReviewCircumstances(directReviews[2]);
            expect(circumstances.length).toBe(2);
            expect(circumstances[0].getText()).toBe('Patient safety issue');
            expect(circumstances[1].getText()).toBe('Impediment to ONC-ACB');
            expect(component.getDirectReviewNonconformities(directReviews[2]).length).toBe(3);
        });

        describe('for nonconformities', () => {
            let nonconformities;
            beforeEach(() => {
                let directReviews = component.getDirectReviews();
                directReviews[2].scrollIntoView({block: 'center', inline: 'center'});
                directReviews[2].click();
                nonconformities = component.getDirectReviewNonconformities(directReviews[2]);
            });

            it('should sort them "open" first', () => {
                expect(component.getNonconformityResult(nonconformities[0]).getText()).toBe('Open');
                expect(component.getNonconformityResult(nonconformities[1]).getText()).toBe('Closed');
                expect(component.getNonconformityResult(nonconformities[2]).getText()).toBe('None recorded');
            });

            it('should have NC data', () => {
                let nc = nonconformities[1];
                nc.scrollIntoView({block: 'center', inline: 'center'});
                nc.click();
                expect(component.getNonconformityRequirement().getText()).toBe('170.406(b)(1)');
                expect(component.getNonconformityDateOfDetermination().getText()).toBe('1 June 2020');
                expect(component.getNonconformityFindings().getText()).toBe('some findings');
                expect(component.getNonconformityCapApprovalDate().getText()).toBe('2 June 2020');
                expect(component.getNonconformityCapStartDate().getText()).toBe('8 June 2020');
                expect(component.getNonconformityCapMustCompleteDate().getText()).toBe('30 June 2020');
                expect(component.getNonconformityDeveloperExplanation().getText()).toBe('an explanation by the developer');
                expect(component.getNonconformityCapCompletedDate().getText()).toBe('26 June 2020');
                expect(component.getNonconformityResolution().getText()).toBe('it\'s fixed!');
                let dal = component.getNonconformityDeveloperAssociatedListings();
                expect(dal.length).toBe(2);
                expect(dal[0].getText()).toBe('15.04.04.2913.Gree.11.00.1.171101');
                expect(dal[1].getText()).toBe('15.04.04.2913.Gree.19.01.1.200214');
            });
        });

        describe('for DRs without NCs', () => {
            it('should indicate the absence of NCs', () => {
                let directReviews = component.getDirectReviews();
                directReviews[1].scrollIntoView({block: 'center', inline: 'center'});
                directReviews[1].click();
                expect(component.getDirectReviewNonconformities(directReviews[1]).getText()).toBe('No Requirements or Non-Conformities exist for this Direct Review');
            });
        });
    });

    describe('for Radysans, Inc', () => {
        beforeEach(() => {
            page.selectDeveloper('Radysans, Inc');
        });

        it('should indicate the absence of DRs', () => {
            let directReviews = component.getDirectReviews();
            expect(directReviews.getText()).toBe('No Direct Reviews have been conducted for this listing');
        });
    });
});
