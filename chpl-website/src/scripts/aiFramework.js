

angular.module('aiFramework', ['aiDashboard', 'aiMenu', 'ngStorage']);



angular.module('aiFramework')
    .directive('aiUserProfileSmall', function () {
        return {
            templateUrl: 'ext-modules/aiFramework/aiUserProfile/aiUserProfileSmallTemplate.html'
        };
    });



angular.module('aiFramework')
    .directive('aiUserProfile', function () {
        return {
            templateUrl: 'ext-modules/aiFramework/aiUserProfile/aiUserProfileTemplate.html'
        };
    });



angular.module('aiMenu', ['ngAnimate']);

angular.module("aiMenu").run(["$templateCache", function($templateCache) {$templateCache.put("ext-modules/aiMenu/aiMenuGroupTemplate.html","<li class=\"ai-selectable-item\" ng-class=\"{\'ai-item-horizontal\' : !isVertical()}\" ng-click=\"clicked()\">\r\n  <div class=\"ai-noselect\">\r\n    <i class=\"fa fa-fw fa-lg {{ icon }} ai-menu-item\" />  {{ label }} <i class=\"fa fa-chevron-right ai-group-indicator-right\" ng-class=\"{\'fa-rotate-90\': isOpen}\" ng-if=\"isVertical()\" />\r\n  </div>\r\n</li>\r\n<div ng-show=\"isOpen\" class=\"ai-subitem-section ai-fade-in-animation\" ng-class=\"{\'ai-popup-menu\': !isVertical()}\">\r\n  <ul ng-transclude></ul>\r\n</div>\r\n");
$templateCache.put("ext-modules/aiMenu/aiMenuItemTemplate.html","<li class=\"ai-selectable-item\" ng-class=\"{\'ai-item-horizontal\' : !isVertical()}\">\r\n  <div class=\"ai-noselect\">\r\n    <i class=\"fa fa-fw {{ icon }} ai-menu-item\" />  {{ label }}\r\n  </div>\r\n  <i class=\"fa fa-2x fa-caret-left ai-menu-active-indicator\" ng-if=\"isActive() && isVertical()\" />\r\n</li>\r\n");
$templateCache.put("ext-modules/aiMenu/aiMenuTemplate.html","<div>\r\n  <ul class=\"ai-menu\" ng-transclude></ul>\r\n  <a class=\"btn ai-menu-layout-button\"\r\n     ng-show=\"allowHorizontalToggle\"\r\n     ng-click=\"toggleMenuOrientation()\"\r\n     ng-class=\"{\'ai-layout-button-horizontal\': !isVertical}\">\r\n    <i class=\"fa\" ng-class=\"{\'fa-chevron-up\': isVertical, \'fa-chevron-left\': !isVertical}\" />\r\n  </a>\r\n</div>\r\n");}]);


angular.module('aiMenu').directive('aiMenuItem', function() {
    return {
        require: '^aiMenu',
        scope: {
            label: '@',
            icon: '@',
            route: '@'
        },
        templateUrl: 'ext-modules/aiMenu/aiMenuItemTemplate.html',
        link: function (scope, el, attr, ctrl) {

            scope.isActive = function () {
                return el === ctrl.getActiveElement();
            };

            scope.isVertical = function () {
                return ctrl.isVertical() || el.parents('.ai-subitem-section').length > 0;
            };

            el.on('click', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                scope.$apply(function() {
                    ctrl.setActiveElement(el);
                    ctrl.setRoute(scope.route);
                });
            });
        }
    };
});



angular.module('aiMenu').directive('aiMenuGroup', function() {
    return {
        require: '^aiMenu',
        transclude: true,
        scope: {
            label: '@',
            icon: '@'
        },
        templateUrl: 'ext-modules/aiMenu/aiMenuGroupTemplate.html',
        link: function(scope, el, attrs, ctrl) {
            scope.isOpen = false;

            scope.closeMenu = function () {
                scope.isOpen = false;
            };

            scope.clicked = function () {
                scope.isOpen = !scope.isOpen;

                if (el.parents('.ai-subitem-section').length == 0)
                    scope.setSubmenuPosition();

                ctrl.setOpenMenuScope(scope);
            };

            scope.isVertical = function () {
                return ctrl.isVertical() || el.parents('.ai-subitem-section').length > 0;
            };

            scope.setSubmenuPosition = function () {
                var pos = el.offset();
                $('.ai-subitem-section').css({'left': pos.left + 20, 'top': 36});
            };
        }
    };
});



angular.module('aiMenu').directive('aiMenu', ['$timeout', function($timeout) {
    return {
        transclude: true,
        scope: {
        },
        controller: 'aiMenuController',
        templateUrl: 'ext-modules/aiMenu/aiMenuTemplate.html',
        link: function (scope, el, attr) {
            var item = el.find('.ai-selectable-item:first');
            $timeout(function () {
                item.trigger('click');
            });
        }
    };
}]);



angular.module('aiMenu').controller('aiMenuController',
                                    ['$scope', '$rootScope',
                                     function($scope, $rootScope) {

                                         $scope.showMenu = true;
                                         $scope.isVertical = true;
                                         $scope.openMenuScope = null;
                                         $scope.allowHorizontalToggle = true;

                                         this.getActiveElement = function() {
                                             return $scope.activeElement;
                                         }

                                         this.setActiveElement = function(el) {
                                             $scope.activeElement = el;
                                         };

                                         this.isVertical = function() {
                                             return $scope.isVertical;
                                         };

                                         this.setRoute = function(route) {
                                             $rootScope.$broadcast('ai-menu-item-selected-event',
                                                                   { route: route });
                                         };

                                         this.setOpenMenuScope = function (scope) {
                                             $scope.openMenuScope = scope;
                                         };

                                         $scope.$on('ai-menu-show', function (evt, data) {
                                             $scope.showMenu = data.show;
                                             $scope.isVertical = data.isVertical;
                                             $scope.allowHorizontalToggle = data.allowHorizontalToggle;
                                         });

                                         $scope.toggleMenuOrientation = function() {
                                             if ($scope.openMenuScope)
                                                 $scope.openMenuScope.closeMenu();

                                             $scope.isVertical = !$scope.isVertical;

                                             $rootScope.$broadcast('ai-menu-orientation-changed-event',
                                                                   { isMenuVertical: $scope.isVertical });
                                         };

                                         angular.element(document).bind('click', function(e) {
                                             if ($scope.openMenuScope && !$scope.isVertical) {
                                                 if ($(e.target).parent().hasClass('ai-selectable-item'))
                                                     return;
                                                 $scope.$apply(function() {
                                                     $scope.openMenuScope.closeMenu();
                                                 });
                                                 e.preventDefault();
                                                 e.stopPropagation();
                                             }
                                         });
                                     }]);

angular.module("aiFramework").run(["$templateCache", function($templateCache) {$templateCache.put("ext-modules/aiFramework/aiFrameworkTemplate.html","<div class=\"ai-title-bar\">\r\n  <div class=\"row\">\r\n    <div class=\"ai-logo-area col-sm-6\">\r\n      <img class=\"ai-icon\" ng-src=\"{{ iconFile }}\" />\r\n      <div class=\"ai-title-area\">\r\n        <p class=\"ai-logo-title\">{{ title }}</p>\r\n        <p class=\"ai-logo-subtitle\">{{ subtitle  }}</p>\r\n      </div>\r\n\r\n      <div ng-if=\"isMenuButtonVisible\" ng-click=\"menuButtonClicked()\" class=\"ai-collapsed-menu pull-right\">\r\n        <button type=\"button\" class=\"btn ai-nav-button\">\r\n          <i class=\"fa fa-bars\" />\r\n        </button>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"ai-right-side-controls col-sm-6\">\r\n      <ai-user-profile-small></ai-user-profile-small>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"ai-menu-area\"\r\n     ng-show=\"isMenuVisible\"\r\n     ng-class=\"{\'ai-menu-area-vertical\': isMenuVertical, \'ai-menu-area-horizontal\': !isMenuVertical}\">\r\n  <ai-user-profile></ai-user-profile>\r\n  <div ng-transclude></div>\r\n</div>\r\n\r\n<div ng-view class=\"ai-view\"\r\n     ng-class=\"{\'ai-view-full-width\': !isMenuVertical || !isMenuVisible}\">\r\n</div>\r\n");
$templateCache.put("ext-modules/aiFramework/aiUserProfile/aiUserProfileSmallTemplate.html","<div class=\"ai-user-profile-small pull-right\">\r\n  <img src=\"images/gravatar.png\" alt=\"user image\" />\r\n  <span>Bob Smith</span>\r\n  <button class=\"btn btn-default btn-sm\">\r\n    <i class=\"fa fa-chevron-down\" />\r\n  </button>\r\n</div>\r\n");
$templateCache.put("ext-modules/aiFramework/aiUserProfile/aiUserProfileTemplate.html","<div class=\"ai-user-profile\" ng-if=\"isMenuVertical && !isMenuButtonVisible\">\r\n  <img src=\"images/gravatar.png\" alt=\"user image\" />\r\n  <div>\r\n    <p>Bob</p>\r\n    <p>Smith</p>\r\n    <button class=\"btn btn-default btn-sm\">\r\n      <i class=\"fa fa-chevron-down\" />\r\n    </button>\r\n  </div>\r\n</div>\r\n");}]);


angular.module('aiFramework').directive('aiFramework', function() {
    return {
        transclude: true,
        scope: {
            title: '@',
            subtitle: '@',
            iconFile: '@'
        },
        controller: 'aiFrameworkController',
        templateUrl: 'ext-modules/aiFramework/aiFrameworkTemplate.html'
    };
});



angular.module('aiFramework')
    .controller('aiFrameworkController',
                ['$scope', '$rootScope', '$window', '$timeout', '$location', '$localStorage',
                 function($scope, $rootScope, $window, $timeout, $location, $localStorage) {

                     $scope.isMenuVisible = true;
                     $scope.isMenuButtonVisible = true;

                     $scope.isMenuVertical = ($localStorage.isMenuVertical != null) ? $localStorage.isMenuVertical : true;
                     $scope.$watch('isMenuVertical', function () {
                         $localStorage.isMenuVertical = $scope.isMenuVertical;
                     });

                     $scope.$on('ai-menu-item-selected-event', function (evt, data) {
                         $scope.routeString = data.route;
                         $location.path(data.route);
                         checkWidth();
                         broadcastMenuState();
                     });

                     $scope.$on('ai-menu-orientation-changed-event', function (evt, data) {
                         $scope.isMenuVertical = data.isMenuVertical;
                         $timeout(function () {
                             $($window).trigger('resize');
                         }, 0);
                     });

                     $($window).on('resize.aiFramework', function() {
                         $scope.$apply(function() {
                             checkWidth();
                             broadcastMenuState();
                         });
                     });

                     $scope.$on('$destroy', function() {
                         $($window).off('resize.aiFramework');
                     });

                     var checkWidth = function () {
                         var width = Math.max($($window).width(), $window.innerWidth);
                         $scope.isMenuVisible = (width >= 768);
                         $scope.isMenuButtonVisible = !$scope.isMenuVisible;
                         $scope.isMenuVertical = $scope.isMenuVertical;
                     };

                     $scope.menuButtonClicked = function () {
                         $scope.isMenuVisible = !$scope.isMenuVisible;
                         broadcastMenuState();
//                         $scope.$apply;
                     };

                     var broadcastMenuState = function () {
                         $rootScope.$broadcast('ai-menu-show',
                                               {
                                                   show: $scope.isMenuVisible,
                                                   isVertical: $scope.isMenuVertical,
                                                   allowHorizontalToggle: !$scope.isMenuButtonVisible
                                               });
                     };

                     $timeout(function() {
                         checkWidth();
                     }, 0);
                 }]);



angular.module('aiDashboard', ['gridster', 'ui.bootstrap']);

angular.module("aiDashboard").run(["$templateCache", function($templateCache) {$templateCache.put("ext-modules/aiDashboard/aiDashboardTemplate.html","<div class=\"ai-dashboard-header\">\r\n  {{ title }}\r\n  <div class=\"ai-dashboard-controls\">\r\n    <div class=\"dropdown\">\r\n      <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-expanded=\"true\">\r\n        <i class=\"fa fa-plus\" />\r\n        Add Widget\r\n        <span class=\"caret\"></span>\r\n      </button>\r\n      <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">\r\n        <li ng-repeat=\"widget in widgetDefinitions\">\r\n          <a role=\"menuitem\" ng-click=\"addNewWidget(widget)\">{{ widget.title }}</a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div gridster=\"gridsterOpts\">\r\n  <ul>\r\n    <li gridster-item=\"item\" ng-repeat=\"item in widgets\">\r\n      <ai-widget-body></ai-widget-body>\r\n    </li>\r\n  </ul>\r\n</div>\r\n");
$templateCache.put("ext-modules/aiDashboard/aiWidgetBodyTemplate.html","<div class=\"ai-widget-body\">\r\n  <div class=\"ai-widget-menu-area btn-group\">\r\n    <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n      <i class=\"fa fa-bars\" ng-click=\"iconClicked()\" />\r\n    </a>\r\n    <ul class=\"dropdown-menu\" role=\"menu\">\r\n      <li ng-click=\"close()\"><i class=\"fa fa-2x fa-close\" ng-click=\"iconClicked()\" /></li>\r\n      <li ng-click=\"settings()\"><i class=\"fa fa-2x fa-gear\" ng-click=\"iconClicked()\" /></li>\r\n    </ul>\r\n  </div>\r\n</div>\r\n");}]);


angular.module('aiDashboard')
    .directive('aiWidgetBody',
               ['$compile', '$modal', function ($compile, $modal) {
                   return {
                       templateUrl: 'ext-modules/aiDashboard/aiWidgetBodyTemplate.html',
                       link: function (scope, element, attrs) {
                           var newElement = angular.element(scope.item.template);
                           element.append(newElement);
                           $compile(newElement)(scope);

                           scope.close = function () {
                               scope.widgets.splice(scope.widgets.indexOf(scope.item), 1);
                           };

                           scope.settings = function () {
                               var options = {
                                   templateUrl: scope.item.widgetSettings.templateUrl,
                                   controller: scope.item.widgetSettings.controller,
                                   scope: scope
                               };
                               $modal.open(options);
                           };

                           scope.iconClicked = function () {
                               /* empty on purpose
                                *  keep focus from going to the gridster
                                */
                           };
                       }
                   };
               }]);



angular.module('aiDashboard').directive('aiDashboard', function() {
    return {
        templateUrl: 'ext-modules/aiDashboard/aiDashboardTemplate.html',
        link: function (scope, element, attrs) {
            scope.addNewWidget = function (widget) {
                var newWidget = angular.copy(widget.settings);
                scope.widgets.push(newWidget);
            }
        }
    };
});
