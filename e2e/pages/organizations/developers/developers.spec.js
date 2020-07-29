import DevelopersPage from './developers.po.js';
import Hooks from '../../../utilities/hooks'
const config = require('../../../config/mainConfig');

let hooks, page;

describe('the Developers page', () => {
    beforeEach(async () => {
        page = new DevelopersPage();
        hooks = new Hooks();
        await hooks.open('/organizations/developers');
    });

    it('should load a Developer', () => {
        page.selectDeveloper('Greenway Health, LLC');
        expect(browser).toHaveUrl(config.baseUrl + '/organizations/developers/1914');
    });
});
