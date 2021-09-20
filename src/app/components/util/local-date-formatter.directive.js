(() => {
  /** @ngInclude */
  function chplLocalDateFormatter(uibDateParser) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {
        ngModel.$validators.date = () => true; // eslint-disable-line no-param-reassign

        ngModel.$parsers.push((data) => {
          if (!data) {
            return null;
          }
          const iso = data.toISOString();
          return iso.substring(0, iso.indexOf('T'));
        });

        ngModel.$formatters.push((data) => uibDateParser.parse(data, 'yyyy-MM-dd'));
      },
    };
  }

  angular.module('chpl.components')
    .directive('chplLocalDateFormatter', chplLocalDateFormatter);
})();
