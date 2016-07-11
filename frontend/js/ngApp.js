var meanTodoModule = angular.module('myMeanTodoApp',
                                    ['ngRoute','ngResource','ngCookies'],
                                    function() {

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
meanTodoModule.constant('siteTitleModuleConst', "My Mean Todo App");
meanTodoModule.constant('webAppVersionNumberConst',  "-[ver.0.0.3]-");

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
meanTodoModule.factory('TodoListApiFactory', ['$resource', function($resource) {
  return $resource('/todos/:id', null, {
    'resourceGet': { method:'GET' },
    'resourceSave': { method:'POST' },
    'resourceQuery': { method:'GET', isArray:'true' },
    'resourceUpdate': { method:'PUT' },
    'resourceRemove': { method:'DELETE' },
    'resourceDelete': { method:'DELETE' }
  });
}]);

//---------------
// Controllers
//---------------
meanTodoModule.controller('LayoutController',
                          ['$scope', '$rootScope', 'siteTitleModuleConst', 'webAppVersionNumberConst',
                          function($scope, $rootScope, $siteTitleModuleConst, $webAppVersionNumberConst) {
    /** RootScope is defined in the top-most parent controller **/
    $rootScope.isUserLoggedIn = false;

    $scope.webAppVersionNumber = $webAppVersionNumberConst;

    $scope.exportedData = function(signature, value) {
        $scope.siteTitle = $siteTitleModuleConst;

        $rootScope.isUserLoggedIn = JSON.parse(value).checkResult;
        $scope.loggedUserInfo = {
            "username" : "", "firstname" : "", "lastname" : ""
        };
        if($rootScope.isUserLoggedIn) {
            $scope.loggedUserInfo = {
                "username" : JSON.parse(value).loggedUserName,
                "firstname" : JSON.parse(value).loggedUserFirstName,
                "lastname" : JSON.parse(value).loggedUserLastName
            };
        }
    }
}]);
meanTodoModule.controller('MainPageController',
                          ['$scope', '$rootScope', '$http', 'siteTitleModuleConst',
                          function($scope, $rootScope, $http, siteTitleModuleConst) {
  $scope.siteTitle = siteTitleModuleConst;
  $scope.labelTab1 = "[ #1 ] Todo List - Angular";
  $scope.labelTab2 = "[ #2 ] Adventure - React";
  $scope.labelTab3 = "[ #3 ] Secret Sauce";
  $scope.urlRegister = "/#/register";
  $scope.urlLogin = "/#/login";

  $scope.showContainer = '1';

  $scope.clickNavBtn1 = function(viewport) {
    if($(".tab1-nav-btn").hasClass("active") == false) {
          $(".tab1-nav-btn").addClass("active");
          $(".tab2-nav-btn").removeClass("active");
          $(".tab3-nav-btn").removeClass("active");

          clickNavbarToggleNarrowView(viewport);

          //mainGame.pauseGame();

          $scope.showContainer = '1';
    }
  }
  $scope.clickNavBtn2 = function(viewport) {
      if($(".tab2-nav-btn").hasClass("active") == false) {
          $(".tab1-nav-btn").removeClass("active");
          $(".tab2-nav-btn").addClass("active");
          $(".tab3-nav-btn").removeClass("active");

          clickNavbarToggleNarrowView(viewport);

          //mainGame.runGame();

          $scope.showContainer = '2';
      }
  }
  $scope.clickNavBtn3 = function(viewport) {
      if($(".tab3-nav-btn").hasClass("active") == false) {
          $(".tab1-nav-btn").removeClass("active");
          $(".tab2-nav-btn").removeClass("active");
          $(".tab3-nav-btn").addClass("active");

          clickNavbarToggleNarrowView(viewport);

          //mainGame.pauseGame();

          $scope.showContainer = '3';
      }
  }

  $scope.$on('emitToMainPageControllerEvent', function(event, data) {
      switch(data['reason']) {
        case "accessingTodoDetailPage":
          $scope.showContainer = data['code'];

          // then, broadcast the content & row index of the todo document to the TodoDetailController
          $scope.$broadcast('broadcastToTodoDetailPageEvent',
                            { 'doc_id' : data['doc_id'],
                              'todoEntryName' : data['todoEntry.name'],
                              'todoEntryCompleted' : data['todoEntry.completed'],
                              'todoEntryNote' : data['todoEntry.note'],
                              'row_index' : data['row_index'] });
          break;
      }
  });
  $scope.$on('emitShowContainerEvent', function(event, data) {
      $scope.showContainer = data['code'];

      switch(data['reason']) {
          case "deleteTaskFrmDetailPage":
              // for this case, we've included the target row_index in the data package of
              // the broadcasted event. Now we need to pass the index to the TodoListController
              // so it can update the todo list by performing a splicing.
              $scope.$broadcast('broadcastToTodoListPageEvent',
                                { 'reason' : 'doSplicingAfterDeleteOperation',
                                  'row_index' : data['row_index'] });

              break;
          default:
      }
  });

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
meanTodoModule.controller('TodoListController',
                          ['$scope', '$rootScope', '$location', 'TodoListApiFactory',
                          function($scope, $rootScope, $location, TodoListApiFactory) {
  // A variable to show or hide the form to edit values.
  $scope.editMode = [];

  // Get all todo entries (documents) from the database
  $scope.resourceTodos = TodoListApiFactory.resourceQuery();

  $scope.createBtnText = "Create";
  // this function will be called during the non-logged in mode
  $scope.alterCreateBtnText = function(mouseState) {
      switch(mouseState) {
          case "mouseenter" :
            $scope.createBtnText = "Login";
            break;
          case "mouseleave" :
            $scope.createBtnText = "Create";
            break;
          default :
            $scope.createBtnText = "Create";
      }
  }

  // Add a new task
  $scope.invalidInputAddNewTodoInputField = false;
  $scope.addNewTodoSubmitAction = function(isValid) {
      if($rootScope.isUserLoggedIn) {
        if(isValid) {
            var newTodoDocument = new TodoListApiFactory({ name:$scope.newTaskNgModel,
                                                           completed:false,
                                                           note:"" });
            // save the document into the collection
            newTodoDocument.$resourceSave(function() {
                // perform 2 way data binding to the front-end, update it on-the-fly
                $scope.resourceTodos.push(newTodoDocument);
                // clear textbox
                $scope.newTaskNgModel = "";
            });
        } else {
          $scope.invalidInputAddNewTodoInputField = true;
        }
      } else {
        // if the user hasn't logged in yet, redirect to the login page
        $location.path("/login");
      }
  }

  // Initiate edit title mode
  $scope.defaultModeEditButtonClicked = function(index) {
      $scope.editMode[index] = angular.copy($scope.resourceTodos[index]);
  }

  // delete a document
  $scope.defaultModeDeleteButtonClicked = function(index) {
      var theTodo = $scope.resourceTodos[index];
      TodoListApiFactory.resourceDelete({id:theTodo._id}, function() {
                                              $scope.resourceTodos.splice(index, 1);
                                        });
  }

  // confirm update title and disable edit mode
  $scope.invalidInputEditUpdateTodoInputField = false;
  $scope.editUpdateTodoSubmitAction = function(isValid, index) {
      if (isValid) {
          var theTodo = $scope.resourceTodos[index];

          TodoListApiFactory.resourceUpdate({id: theTodo._id}, theTodo);
          $scope.editMode[index] = false;
      } else {
          $scope.invalidInputEditUpdateTodoInputField = true;
      }
  }

  // cancel update and disable edit mode
  $scope.editCancelTodoAction = function(index) {
      $scope.resourceTodos[index] = angular.copy($scope.editMode[index]);
      $scope.editMode[index] = false;
  }

  // title link clicked action -> accessing the edit detail page
  $scope.editDetailTitleLinkClicked = function(doc_id, row_index) {
      if($rootScope.isUserLoggedIn) {
          var todoEntry = TodoListApiFactory.resourceGet({ id : doc_id });
          todoEntry.$promise.then(function() {
              // promise fulfilled
              // note : the validator module has been moved to index.html to
              // make this file to be unit testable with Karma.
              todoEntry.note = validator.unescape(todoEntry.note);
              $scope.$emit('emitToMainPageControllerEvent', {'reason': 'accessingTodoDetailPage',
                                                             'code': '1e',
                                                             'row_index': row_index,
                                                             'doc_id': doc_id,
                                                             'todoEntry.name' : todoEntry.name,
                                                             'todoEntry.note' : todoEntry.note,
                                                             'todoEntry.completed' : todoEntry.completed});
          }, function(error) {
              // promise error

          });
      } else {
          $location.path("/login");
      }
  }
  $scope.$on('broadcastToTodoListPageEvent', function(event, data) {
      switch(data['reason']) {
        case "doSplicingAfterDeleteOperation" :
          $scope.resourceTodos.splice(data['row_index'], 1);
          break;
      }
  });

}]);
meanTodoModule.controller('TodoDetailController',
                          ['$scope', '$location', 'TodoListApiFactory',
                           function($scope, $location, TodoListApiFactory) {
   // Broadcasted from the MainPageController
   $scope.$on('broadcastToTodoDetailPageEvent', function(event, data) {
       $scope.tgtDocId = data['doc_id'];
       $scope.tgtRowIdx = data['row_index'];
       $scope.todoEntryNote = data['todoEntryNote'];
       $scope.todoEntryCompleted = data['todoEntryCompleted'];
       $scope.todoEntryName = data['todoEntryName'];
   });

   var clickedSubmitButton = "update";
   $scope.todoDetailPageBtnClicked = function(clickedButton) {
       switch(clickedButton) {
           case "update":
             clickedSubmitButton = "update";
             break;
           case "delete":
             clickedSubmitButton = "delete";
             break;
           case "cancel":
             clickedSubmitButton = "cancel";
             break;
           default:
             clickedSubmitButton = "cancel";
       }

       if (clickedSubmitButton == "cancel") {
         // emit it to the MainPageController because $scope.showContainer is
         // within the MainPageController.
         $scope.$emit('emitShowContainerEvent', {'code': '1',
                                                 'reason': ''});
       }
   }

   $scope.invalidInputEditTaskDetailInputField = false;
   $scope.editTaskDetailSubmitAction = function(isValid) {
     switch(clickedSubmitButton) {
         case "update" :
             if (isValid) {
                 // sanitise user input
                 // note : the validator module has been moved to index.html to
                 // make this file to be unit testable with Karma.
                 $scope.todoEntryNote = validator.escape($scope.todoEntryNote);

                 var updatedTodoEntry = { '_id' : $scope.tgtDocId,
                                          'name' : $scope.todoEntryName,
                                          'completed' : $scope.todoEntryCompleted,
                                          'note' : $scope.todoEntryNote };

                 TodoListApiFactory.resourceUpdate({ id : $scope.tgtDocId },
                                                   updatedTodoEntry,
                                                   function() {
                                                       $scope.$emit('emitShowContainerEvent', {'code': '1',
                                                                                               'reason': ''});
                                                   }

                 );
             } else {
                 $scope.invalidInputEditTaskDetailInputField = true;
             }
             break;
         case "delete" :
             TodoListApiFactory.resourceDelete({ id : $scope.tgtDocId },
                                                 function() {
                                                    $scope.$emit('emitShowContainerEvent', {'code': '1',
                                                                                            'reason': 'deleteTaskFrmDetailPage',
                                                                                            'row_index' : $scope.tgtRowIdx});
                                                 });
             break;
     }
   }
}]);
