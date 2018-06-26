(function () {
    'use strict';
    angular.module('chpl')
        .directive('aiA', aiA);

    /** @ngInclude */
    function aiA () {
        return {
            template: aiATemplate,
            restrict: 'A',
            link: function (scope, element, attr) {
                var link = attr['href'];
                if (checkHttp(link) !== link){
                    attr['$$element'][0].href = checkHttp(link);
                    scope.$watch(link, function () {
                        attr['$$element'][0].href = checkHttp(link);
                    });
                }
            },
        }
    }

    function aiATemplate (element) {
        return (element.text() +
                '<a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" class="pull-right">' +
                '<i class="fa fa-external-link"></i>' +
                '<span class="sr-only">Web Site Disclaimers</span>' +
                '</a>');
    }

    function checkHttp (url) {
        if (url.substring(0,7) === 'http://' || url.substring(0,8) === 'https://') {
            return url;
        } else {
            return 'http://' + url;
        }
    }
})();
