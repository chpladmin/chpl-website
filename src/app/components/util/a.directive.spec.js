(() => {
  describe('the chpl-a directive', () => {
    let el;
    let $log;

    beforeEach(() => {
      angular.mock.module('chpl.components');
    });

    beforeEach(inject(($compile, _$log_, $rootScope) => {
      $log = _$log_;

      el = angular.element('<a ai-a href="link">text</a>');
      $compile(el)($rootScope.$new());
    }));

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('template', () => {
      it('should have the disclaimer link', () => {
        expect(el.html()).toBe('text<a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" class="pull-right" analytics-on="click" analytics-event="Go to Website Disclaimers" analytics-properties="{ category: \'Navigation\'}"><i class="fa fa-external-link"></i><span class="sr-only">Web Site Disclaimers</span></a>');
      });
    });
  });
})();
