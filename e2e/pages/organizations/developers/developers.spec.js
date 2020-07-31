import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks'

let hooks, page;

describe('the Developers page', () => {
    beforeEach(async () => {
        page = new DevelopersPage();
        hooks = new Hooks();
        await hooks.open('#/organizations/developers');
    });

    it('should load a Developer', () => {
        page.selectDeveloper('Greenway Health, LLC');
        expect(browser).toHaveUrl('#/organizations/developers/1914', {containing: true});
    });

    describe('when on a specific Developer page', () => {
        beforeEach(() => {
            page.selectDeveloper('Greenway Health, LLC');
        });

        it('should have a Direct Reviews section', () => {
            expect(page.directReviewsHeader).toExist();
        });
    });
});
