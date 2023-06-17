import LoginComponent from '../../../components/login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import ManagePage from './manage.po';

let hooks;
let login;
let page;

beforeEach(async () => {
  page = new ManagePage();
  login = new LoginComponent();
  hooks = new Hooks();
  hooks.open('#/surveillance/manage');
});

describe('when logged in as ROLE_ADMIN', () => {
  beforeEach(() => {
    login.logIn('admin');
  });

  afterEach(() => {
    login.logOut();
  });

  describe('when on the manage surveillance page', () => {
    describe('after it\'s loaded', () => {
      beforeEach(() => {
        browser.waitUntil(() => hooks.getTableRows().length > 0);
      });

      it('should have table headers in a defined order', () => {
        const expectedHeaders = ['CHPL Product Number', 'Developer', 'Product', 'Version', 'ONC-ACB', 'Certification Edition', 'Certification Status', '# Open Surveillances', '# Closed Surveillances', '# Open NCs', '# Closed NCs'];
        const actualHeaders = hooks.getTableHeaders();
        expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of headers');
        actualHeaders.forEach((header, idx) => {
          expect(header.getText()).toContain(expectedHeaders[idx]);
        });
      });

      describe('when filtering', () => {
        let countBefore;
        let countAfter;
        beforeEach(() => {
          countBefore = page.totalCount();
        });

        afterEach(() => {
          page.clearFilters.click();
        });

        describe('using certification status filter', () => {
          it('should filter listing results', () => {
            page.expandFilterOptions('certificationStatus');
            page.chooseFilter('Retired');
            countAfter = page.totalCount();
            expect(countAfter).toBeGreaterThan(countBefore);
          });
        });

        describe('using the "ONC/ACBs" filter', () => {
          it('should filter listing results', () => {
            page.expandFilterOptions('acb');
            page.chooseFilter('Drummond_Group');
            countAfter = page.totalCount();
            expect(countAfter).toBeLessThan(countBefore);
          });
        });

        describe('using certification edition 2014', () => {
          it('should filter listing results', () => {
            page.expandFilterOptions('edition');
            page.chooseFilter('2014');
            countAfter = page.totalCount();
            expect(countAfter).toBeLessThanOrEqual(countBefore);
          });
        });

        describe('while in the "has had a surveillance activity" filter', () => {
          it('should filter listing results on "open non conformity"', () => {
            page.expandFilterOptions('surveillance');
            page.chooseSurveillanceFilter('has-had-surveillance');
            page.chooseSurveillanceFilter('open-nonconformity');
            countAfter = page.totalCount();
            expect(countAfter).toBeLessThan(countBefore);
          });
        });
      });
    });
  });
});
