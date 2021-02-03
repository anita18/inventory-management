var app = angular.module('inventoryManagementApp');

app.controller("productCtrl", function ($scope, $rootScope, $state, $stateParams, $pouchDB, $timeout) {

    $scope.products = {};

    $scope.config = {
        isShowCreate: false
    };

    $scope.selectedProduct = null;

    $pouchDB.startListening();

    // Listen for changes which include create or update events
    $rootScope.$on("$pouchDB:change", function (event, data) {
        $scope.products[data.doc._id] = data.doc;
        $scope.$apply();
    });

    // Listen for changes which include only delete events
    $rootScope.$on("$pouchDB:delete", function (event, data) {
        delete $scope.products[data.doc._id];
        $scope.$apply();
    });

    // Look up a document if we landed in the info screen for editing a product
    if ($stateParams.documentId) {
        $pouchDB.get($stateParams.documentId).then(function (result) {
            $scope.inputForm = result;
        });
    }

    /**
     * this function update/insert the the product details .
     * @param {string} productName 
     * @param {string} description 
     * @param {number} quantity 
     * @param {number} price 
     */
    $scope.save = function (productName, description, quantity, price) {
        if (!!productName && !!quantity && !!price) {
            var jsonDocument = {
                "productName": productName,
                "description": description,
                "quantity": quantity,
                "price": price
            };
            // If we're updating, provide the most recent revision and product id
            if ($stateParams.documentId) {
                jsonDocument["_id"] = $stateParams.documentId;
                jsonDocument["_rev"] = $stateParams.documentRevision;
            }
            $pouchDB.save(jsonDocument).then(function (response) {
                $state.go("list");
            }, function (error) {
                console.log("ERROR -> " + error);
            });
        }
    };

    /**
     * this function delete the selected product from the list .
     * @param {string} id 
     * @param {string} rev 
     */
    $scope.delete = function (id, rev) {
        $pouchDB.delete(id, rev);
        alert("Product Deleted successfully !!");
    };

    /**
     * this function fetch the product details of the selected the product .
     * @param {string} id 
     * @param {string} rev 
     */
    $scope.fetchProduct = function (id, rev) {
        $pouchDB.get(id, rev).then(function (result) {
            $scope.selectedProduct = result;
            $timeout(function () {
                $scope.config.isShowCreate = true;
            }, 500);
        });
    };

    /**
     * this function returns to the product list view .
     */
    $scope.goToList = function () {
        $scope.config.isShowCreate = false;
        $scope.selectedProduct = null;
    };

    /**
     * Check the length of product list and return boolean value
     */
    $scope.checkLength = function () {
        return Object.keys($scope.products).length === 1;
    }

});

