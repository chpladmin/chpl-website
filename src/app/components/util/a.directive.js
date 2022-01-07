(() => {
  function checkHttp(url) {
    if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
      return url;
    }
    return `http://${url}`;
  }

  function aiATemplate(element) {
    return (`${element.text()
    }<a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" class="pull-right" analytics-on="click" analytics-event="Go to Website Disclaimers" analytics-properties="{ category: 'Navigation'}">`
                + '<i class="fa fa-external-link"></i>'
                + '<span class="sr-only">Web Site Disclaimers</span>'
                + '</a>');
  }

  /** @ngInclude */
  function aiA() {
    return {
      template: aiATemplate,
      restrict: 'A',
      link(scope, element, attr) {
        const link = attr.href;
        if (checkHttp(link) !== link) {
          attr.$$element[0].href = checkHttp(link);
          scope.$watch(link, () => {
            attr.$$element[0].href = checkHttp(link);
          });
        }
      },
    };
  }

  angular.module('chpl.components')
    .directive('aiA', aiA);
})();
