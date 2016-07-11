'use strict';

/* jasmine specs for controllers go here */

describe('MyMeanTodoAppControllers', function() {
    // before each test, load the meanTodoModule module.
    beforeEach( module('meanTodoModule') );

    /********************
     * LayoutController
     ********************/
    describe('LayoutController', function() {
        // a mock http service, needed to test DI
        var $httpBackend;
        var scope;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;

            // Create a new scope for the LayoutController;
            scope = $rootScope.$new();
            // Use $controller to create an instance of the LayoutController
            ctrl = $controller('LayoutController', {$scope:scope});
        }));

        /*** Test Case 1 ***/
        /* TODO */
    });
});
