(function () {
    'use strict';
    angular.module('chpl.components')
        .directive('aiA', aiA);

    /** @ngInclude */
    function aiA () {
        return {
            template: aiATemplate,
            restrict: 'A',
        }
    }

    function aiATemplate (element) {
        return (element.text() +
                '<a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" class="pull-right">' +
                '<i class="fa fa-external-link"></i>' +
                '<span class="sr-only">Web Site Disclaimers</span>' +
                '</a>');
    }
})();
