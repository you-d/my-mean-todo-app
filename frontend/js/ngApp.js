var validatorModule = require('validator');

var meanTodoModule = angular.module('myMeanTodoApp', ['ngRoute','ngResource','ngCookies'], function() {

});

//---------------
// Routes
//---------------
meanTodoModule.config(['$routeProvider', '$locationProvider',
                        function($routeProvider, $locationProvider) {
  // use HTML5 history API to remove the hashtag in the url
  // Don't forget to set the <base> tag, and url redirect in express app.js
  // to redirect /register to /#/register
  $locationProvider.html5Mode(true);
  // get_partials is resolved in app.js
  $routeProvider.
      when('/', {
        templateUrl: '/get_partials/main.html',
        controller: 'MainPageController'
      }).
      when('/register', {
        templateUrl: '/get_partials/user-register.html',
        controller: 'UserAuthController'
      }).
      when('/login', {
        templateUrl: '/get_partials/user-login.html',
        controller: 'UserAuthController'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);
//---------------
// Constants and Values
//---------------
meanTodoModule.constant('siteTitleModuleConst', "My Mean Todo App - [v.0.0.1]");

//---------------
// Services
//---------------
meanTodoModule.factory('CookiesFactory', ["$cookies", function($cookies) {
  var showUsrRegSuccessMsg = false;

  return {
      setCookieData: function(cookieSignature, cookieValue) {
        switch(cookieSignature) {
          case "showUsrRegSuccessMsg":
              showUsrRegSuccessMsg = cookieValue;
              $cookies.put("showUsrRegSuccessMsg", showUsrRegSuccessMsg);
              break;
          default:
        }
      },
      getCookieData: function(cookieSignature) {
        switch(cookieSignature) {
          case "showUsrRegSuccessMsg":
              showUsrRegSuccessMsg = $cookies.get("showUsrRegSuccessMsg");
              return showUsrRegSuccessMsg;
              break;
          default:
        }
      },
      clearCookieData: function(cookieSignature) {
        switch(cookieSignature) {
          case "showUsrRegSuccessMsg":
              showUsrRegSuccessMsg = false;
              $cookies.remove("showUsrRegSuccessMsg");
              break;
          default:
        }
      }
  }
}]);
//---------------
// Controllers
//---------------
meanTodoModule.controller('LayoutController',
                          ['$scope', 'siteTitleModuleConst',
                          function($scope, $siteTitleModuleConst) {
    $scope.exportedData = function(signature, value) {
        $scope.siteTitle = $siteTitleModuleConst;

        $scope.isUserLoggedIn = JSON.parse(value).checkResult;
        $scope.loggedUserInfo = {
            "username" : "", "firstname" : "", "lastname" : ""
        };

        if($scope.isUserLoggedIn) {
            $scope.loggedUserInfo = {
                "username" : JSON.parse(value).loggedUserName,
                "firstname" : JSON.parse(value).loggedUserFirstName,
                "lastname" : JSON.parse(value).loggedUserLastName
            };
        }
    }
}]);
meanTodoModule.controller('MainPageController',
                          ['$scope', '$http', 'siteTitleModuleConst',
                          function($scope, $http, siteTitleModuleConst) {
  $scope.siteTitle = siteTitleModuleConst;
  $scope.labelTab1 = "[ #1 ] Todo List";
  $scope.labelTab2 = "[ #2 ] Secret Sauce";
  $scope.urlRegister = "/#/register";
  $scope.urlLogin = "/#/login";

  $scope.showContainer = 1;

  $scope.clickNavBtn1 = function(viewport) {
      $(".tab1-nav-btn").addClass("active");
      $(".tab2-nav-btn").removeClass("active");

      clickNavbarToggleNarrowView(viewport);

      $scope.showContainer = 1;
  }
  $scope.clickNavBtn2 = function(viewport) {
      $(".tab1-nav-btn").removeClass("active");
      $(".tab2-nav-btn").addClass("active");

      clickNavbarToggleNarrowView(viewport);

      $scope.showContainer = 2;
  }

  var clickNavbarToggleNarrowView = function(viewport) {
      if(viewport == 'narrow') {
          $(".navbar-toggle").click();
      }
  }

  /*** Handle user logout ***/
  $scope.processUserLogout = function() {
      $http.post('/users/logout').
                      success(function() {
                          window.location = "/";
                      }).
                      error(function(err) {

                      });
  }
}]);
meanTodoModule.controller('UserAuthController',
                          ['$scope', '$location', '$http', 'siteTitleModuleConst', 'CookiesFactory',
                          function($scope, $location, $http, siteTitleModuleConst, CookiesFactory) {
  $scope.siteTitle = siteTitleModuleConst;
  $scope.showNewUserRegisteredMsg = CookiesFactory.getCookieData('showUsrRegSuccessMsg');
  $scope.show401ErrorMsg = false;

  $scope.clickSignInExtLink = function() {
      $location.path("/login");
  };

  $scope.clickRegisterExtLink = function() {
      $location.path("/register");
  };

  /*** Handle user registration ***/
  $scope.processUserRegistration = function(userData, passValidation) {
      if(passValidation) {
          $http.post('/users/register', userData).
                                  success(function(userData) {
                                      CookiesFactory.setCookieData('showUsrRegSuccessMsg', true);
                                      $location.path("/login");
                                  }).
                                  error(function(err) {

                                  });
      }
  };

  /*** Handle user login ***/
  $scope.processUserLogin = function(userData, passValidation) {
      CookiesFactory.clearCookieData('showUsrRegSuccessMsg');
      if(passValidation) {
          $http.post('/users/login', userData).
                                  success(function(userData) {
                                      // I can't use $location.path because I want a
                                      // complete page refresh so that those
                                      // hidden inputs in the main page can get the
                                      // most up-to-date session values.
                                      //$location.path("/");
                                      window.location = "/";
                                  }).
                                  error(function(err) {
                                      $scope.show401ErrorMsg = true;
                                  });
      }
  };
}]);
