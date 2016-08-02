;(function () {
    'use strict';

    angular.module('app.common')
        .service('utilService', function ($log) {
            var self = this;

            self.extendSelect = extendSelect;

            ////////////////////////////////////////////////////////////////////

            function extendSelect (options, value) {
                var newValue = { name: value };
                var addingNew = true;
                for (var i = 0; i < options.length; i++) {
                    if (angular.isUndefined(options[i].id)) {
                        options[i] = newValue;
                        addingNew = false;
                    }
                }
                if (addingNew) {
                    options.push(newValue);
                }
                return options;
            }
        });
})();
