var app = angular.module('inventoryManagementApp');

app.controller("loginCtrl", function ($scope, $state, $pouchDB, $rootScope) {
    $rootScope.isLoggedIn=false;
    /**
     * Funtion to log in the app
     * @param {string} username 
     * @param {string} password 
     */
    $scope.doLogin = function (username, password) {
        if (!!username && !!password) {
            $pouchDB.get('config').then(function (result) {
                var resp = result;
                if (resp.username === username && resp.password === password) {
                    $rootScope.isLoggedIn=true;
                    $state.go("list");
                } else {
                    alert('Bad Credentials ! Login Failed .');
                }
            });
        }
    }
})

