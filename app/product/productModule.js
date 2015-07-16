;(function () {
    'use strict';

    angular.module('app.product', ['ngRoute', 'app.common', 'ui.bootstrap'])
        .constant('searchAPI', 'http://ainq.com')
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/product/:id', {
                templateUrl: 'product/product.html'
            });
        }])
        .filter('splitArrayFilter', function ($log) {  // <div class="row" ng-repeat="row in filtered = (cert.certs | splitArrayFilter:2)">
            return function(arr, lengthofsublist) {
                if (!angular.isUndefined(arr) && arr.length > 0) {
                    var arrayToReturn = [];
                    var subArray = [];
                    var pushed = true;
                    for (var i = 0; i < arr.length; i++){
                        if ((i + 1) % lengthofsublist === 0) {
                            subArray.push(arr[i]);
                            arrayToReturn.push(subArray);
                            subArray = [];
                            pushed = true;
                        } else {
                            subArray.push(arr[i]);
                            pushed = false;
                        }
                    }
                    if (!pushed)
                        arrayToReturn.push(subArray);

                    $log.info(JSON.stringify(arrayToReturn));
                    return arrayToReturn;
                }
            }
        });
})();
