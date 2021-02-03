angular.module("inventoryManagementApp", [
    "ui.router"
])
        .run(function ($pouchDB, $rootScope, $state) {

            $rootScope.isLoggedIn = false;

            $pouchDB.setDatabase("InventoryDB");

            $pouchDB.get('config').catch(function (err) {
                if (err.name === 'not_found') {
                    var configData = {
                        _id: 'config',
                        username: 'admin',
                        password: 'test123'
                    };
                    $pouchDB.save(configData).then(function (response) {
                    }, function (error) {
                    });
                } else {
                    throw err;
                }
            }).then(function (configDoc) {
                // on config load
            }).catch(function (err) {
            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                if (!$rootScope.isLoggedIn && toState.name !== "login") {
                    event.preventDefault();
                    $state.go('login');
                }
            });
        })
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state("login", {
                        "url": "/login",
                        "templateUrl": "templates/login.html",
                        "controller": "loginCtrl"
                    })
                    .state("list", {
                        "url": "/list",
                        "templateUrl": "templates/list.html",
                        "controller": "productCtrl",
                    })
                    .state("item", {
                        "url": "/item/:documentId/:documentRevision",
                        "templateUrl": "templates/product.html",
                        "controller": "productCtrl",
                    })
                    .state("view", {
                        "url": "/view/:documentId/:documentRevision",
                        "templateUrl": "templates/product.html",
                        "controller": "productCtrl",
                    });
            $urlRouterProvider.otherwise("login");
        });

