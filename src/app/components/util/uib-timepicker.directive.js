angular.module('chpl.components').directive('uibTimepicker', function (uibDateParser) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

            ngModel.$formatters.push(function (value) { // view
                if (!value) { return value; }

                return uibDateParser.fromTimezone(value, 'UTC');
            });

            ngModel.$parsers.push(function (value) { // model
                if (!value) { return value; }

                return uibDateParser.toTimezone(value, 'UTC');
            });

        },
    };
});
