(function () {
    'use strict';

    angular.module('chpl.collections')
    //        .directive('aiCompile', aiCompile);

        .directive('aiCompile', ['$compile', function ($compile) {
            return function(scope, element, attrs) {
                scope.$watch(
                    function(scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.aiCompile);
                    },
                    function(value) {
                        // when the 'compile' expression changes
                        // assign it into the current DOM
                        element.html(value);

                        // compile the new DOM and link it to the current
                        // scope.
                        // NOTE: we only compile .childNodes so that
                        // we don't get into infinite loop compiling ourselves
                        $compile(element.contents())(scope);
                    }
                );
            };
        }]);
    /*
      /** @ngInject */ /*
          function aiCompile ($compile) {
          return function (scope, element, attrs) {
          scope.$watch(
          function (scope) {
          return scope.$eval(attrs.aiCompile);
          },
          function (value) {
          element.html(value);
          $compile(element.contents())(scope);
          });
          },
          }
          })();
                       */
})();
