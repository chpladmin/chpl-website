(function () {
  angular.module('chpl.services')
    .factory('authService', authService);

  /** @ngInclude */
  /** @ngInject */
  function authService($rootScope) {
    const service = {
      getToken,
      saveCurrentUser,
      saveRefreshToken,
      saveToken,
    };
    return service;

    /// /////////////////////////////////////////////////////////////////////

    function getToken() {
      return JSON.parse(localStorage.getItem('ngStorage-jwtToken'));
    }

    function saveCurrentUser(user) {
      localStorage.setItem('ngStorage-currentUser', JSON.stringify(user));
    }

    function saveToken(token) {
      localStorage.setItem('ngStorage-jwtToken', JSON.stringify(token));
    }

    function saveRefreshToken(token) {
      localStorage.setItem('ngStorage-refreshToken', JSON.stringify(token));
    }
  }
}());
