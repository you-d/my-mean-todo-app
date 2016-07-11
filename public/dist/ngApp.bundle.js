!function(e){function o(n){if(t[n])return t[n].exports;var r=t[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,o),r.loaded=!0,r.exports}var t={};return o.m=e,o.c=t,o.p="",o(0)}([function(e,o){"use strict";var t=angular.module("myMeanTodoApp",["ngRoute","ngResource","ngCookies"],function(){});t.config(["$routeProvider","$locationProvider",function(e,o){o.html5Mode(!0),e.when("/",{templateUrl:"/get_partials/main.html",controller:"MainPageController"}).when("/register",{templateUrl:"/get_partials/user-register.html",controller:"UserAuthController"}).when("/login",{templateUrl:"/get_partials/user-login.html",controller:"UserAuthController"}).otherwise({redirectTo:"/"})}]),t.constant("siteTitleModuleConst","My Mean Todo App"),t.constant("webAppVersionNumberConst","-[ver.0.0.2]-"),t.factory("CookiesFactory",["$cookies",function(e){var o=!1;return{setCookieData:function(t,n){switch(t){case"showUsrRegSuccessMsg":o=n,e.put("showUsrRegSuccessMsg",o)}},getCookieData:function(t){switch(t){case"showUsrRegSuccessMsg":return o=e.get("showUsrRegSuccessMsg")}},clearCookieData:function(t){switch(t){case"showUsrRegSuccessMsg":o=!1,e.remove("showUsrRegSuccessMsg")}}}}]),t.factory("TodoListApiFactory",["$resource",function(e){return e("/todos/:id",null,{resourceGet:{method:"GET"},resourceSave:{method:"POST"},resourceQuery:{method:"GET",isArray:"true"},resourceUpdate:{method:"PUT"},resourceRemove:{method:"DELETE"},resourceDelete:{method:"DELETE"}})}]),t.controller("LayoutController",["$scope","$rootScope","siteTitleModuleConst","webAppVersionNumberConst",function(e,o,t,n){o.isUserLoggedIn=!1,e.webAppVersionNumber=n,e.exportedData=function(n,r){e.siteTitle=t,o.isUserLoggedIn=JSON.parse(r).checkResult,e.loggedUserInfo={username:"",firstname:"",lastname:""},o.isUserLoggedIn&&(e.loggedUserInfo={username:JSON.parse(r).loggedUserName,firstname:JSON.parse(r).loggedUserFirstName,lastname:JSON.parse(r).loggedUserLastName})}}]),t.controller("MainPageController",["$scope","$rootScope","$http","siteTitleModuleConst",function(e,o,t,n){e.siteTitle=n,e.labelTab1="[ #1 ] Todo List w/ Angular.JS",e.labelTab2="[ #2 ] Adventure w/ React.JS",e.labelTab3="[ #3 ] Secret Sauce",e.urlRegister="/#/register",e.urlLogin="/#/login",e.showContainer="1",e.clickNavBtn1=function(o){0==$(".tab1-nav-btn").hasClass("active")&&($(".tab1-nav-btn").addClass("active"),$(".tab2-nav-btn").removeClass("active"),$(".tab3-nav-btn").removeClass("active"),r(o),e.showContainer="1")},e.clickNavBtn2=function(o){0==$(".tab2-nav-btn").hasClass("active")&&($(".tab1-nav-btn").removeClass("active"),$(".tab2-nav-btn").addClass("active"),$(".tab3-nav-btn").removeClass("active"),r(o),e.showContainer="2")},e.clickNavBtn3=function(o){0==$(".tab3-nav-btn").hasClass("active")&&($(".tab1-nav-btn").removeClass("active"),$(".tab2-nav-btn").removeClass("active"),$(".tab3-nav-btn").addClass("active"),r(o),e.showContainer="3")},e.$on("emitToMainPageControllerEvent",function(o,t){switch(t.reason){case"accessingTodoDetailPage":e.showContainer=t.code,e.$broadcast("broadcastToTodoDetailPageEvent",{doc_id:t.doc_id,todoEntryName:t["todoEntry.name"],todoEntryCompleted:t["todoEntry.completed"],todoEntryNote:t["todoEntry.note"],row_index:t.row_index})}}),e.$on("emitShowContainerEvent",function(o,t){switch(e.showContainer=t.code,t.reason){case"deleteTaskFrmDetailPage":e.$broadcast("broadcastToTodoListPageEvent",{reason:"doSplicingAfterDeleteOperation",row_index:t.row_index})}});var r=function(e){"narrow"==e&&$(".navbar-toggle").click()};e.processUserLogout=function(){t.post("/users/logout").success(function(){window.location="/"}).error(function(e){})}}]),t.controller("UserAuthController",["$scope","$location","$http","siteTitleModuleConst","CookiesFactory",function(e,o,t,n,r){e.siteTitle=n,e.showNewUserRegisteredMsg=r.getCookieData("showUsrRegSuccessMsg"),e.show401ErrorMsg=!1,e.clickSignInExtLink=function(){o.path("/login")},e.clickRegisterExtLink=function(){o.path("/register")},e.processUserRegistration=function(e,n){n&&t.post("/users/register",e).success(function(e){r.setCookieData("showUsrRegSuccessMsg",!0),o.path("/login")}).error(function(e){})},e.processUserLogin=function(o,n){r.clearCookieData("showUsrRegSuccessMsg"),n&&t.post("/users/login",o).success(function(e){window.location="/"}).error(function(o){e.show401ErrorMsg=!0})}}]),t.controller("TodoListController",["$scope","$rootScope","$location","TodoListApiFactory",function(e,o,t,n){e.editMode=[],e.resourceTodos=n.resourceQuery(),e.createBtnText="Create",e.alterCreateBtnText=function(o){switch(o){case"mouseenter":e.createBtnText="Login";break;case"mouseleave":e.createBtnText="Create";break;default:e.createBtnText="Create"}},e.invalidInputAddNewTodoInputField=!1,e.addNewTodoSubmitAction=function(r){if(o.isUserLoggedIn)if(r){var a=new n({name:e.newTaskNgModel,completed:!1,note:""});a.$resourceSave(function(){e.resourceTodos.push(a),e.newTaskNgModel=""})}else e.invalidInputAddNewTodoInputField=!0;else t.path("/login")},e.defaultModeEditButtonClicked=function(o){e.editMode[o]=angular.copy(e.resourceTodos[o])},e.defaultModeDeleteButtonClicked=function(o){var t=e.resourceTodos[o];n.resourceDelete({id:t._id},function(){e.resourceTodos.splice(o,1)})},e.invalidInputEditUpdateTodoInputField=!1,e.editUpdateTodoSubmitAction=function(o,t){if(o){var r=e.resourceTodos[t];n.resourceUpdate({id:r._id},r),e.editMode[t]=!1}else e.invalidInputEditUpdateTodoInputField=!0},e.editCancelTodoAction=function(o){e.resourceTodos[o]=angular.copy(e.editMode[o]),e.editMode[o]=!1},e.editDetailTitleLinkClicked=function(r,a){if(o.isUserLoggedIn){var s=n.resourceGet({id:r});s.$promise.then(function(){s.note=validator.unescape(s.note),e.$emit("emitToMainPageControllerEvent",{reason:"accessingTodoDetailPage",code:"1e",row_index:a,doc_id:r,"todoEntry.name":s.name,"todoEntry.note":s.note,"todoEntry.completed":s.completed})},function(e){})}else t.path("/login")},e.$on("broadcastToTodoListPageEvent",function(o,t){switch(t.reason){case"doSplicingAfterDeleteOperation":e.resourceTodos.splice(t.row_index,1)}})}]),t.controller("TodoDetailController",["$scope","$location","TodoListApiFactory",function(e,o,t){e.$on("broadcastToTodoDetailPageEvent",function(o,t){e.tgtDocId=t.doc_id,e.tgtRowIdx=t.row_index,e.todoEntryNote=t.todoEntryNote,e.todoEntryCompleted=t.todoEntryCompleted,e.todoEntryName=t.todoEntryName});var n="update";e.todoDetailPageBtnClicked=function(o){switch(o){case"update":n="update";break;case"delete":n="delete";break;case"cancel":n="cancel";break;default:n="cancel"}"cancel"==n&&e.$emit("emitShowContainerEvent",{code:"1",reason:""})},e.invalidInputEditTaskDetailInputField=!1,e.editTaskDetailSubmitAction=function(o){switch(n){case"update":if(o){e.todoEntryNote=validator.escape(e.todoEntryNote);var r={_id:e.tgtDocId,name:e.todoEntryName,completed:e.todoEntryCompleted,note:e.todoEntryNote};t.resourceUpdate({id:e.tgtDocId},r,function(){e.$emit("emitShowContainerEvent",{code:"1",reason:""})})}else e.invalidInputEditTaskDetailInputField=!0;break;case"delete":t.resourceDelete({id:e.tgtDocId},function(){e.$emit("emitShowContainerEvent",{code:"1",reason:"deleteTaskFrmDetailPage",row_index:e.tgtRowIdx})})}}}])}]);