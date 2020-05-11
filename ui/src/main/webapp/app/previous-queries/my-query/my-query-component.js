/*
 * Copyright 2018-2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('app').component('myQuery', myQuery())

function myQuery() {
    return {
        templateUrl: 'app/previous-queries/my-query/my-query.html',
        controller: MyQueryController,
        controllerAs: 'ctrl',
        bindings: {
            model: '=',
            chain: '=',
        },
        require: {
            parent: '?^^myQueries'
        }
    }
}

function MyQueryController(operationChain, navigation, previousQueries, $mdSidenav, $mdDialog) {
    var vm = this;
    var queries = [];
    var confirm = $mdDialog.confirm()
    .title('Are you sure you want to change the Name and Description?')
    .ok('Ok')
    .cancel('Cancel')

    var invalidName = $mdDialog.confirm()
    .title('Invalid Data!')
    .textContent('Please enter a valid Name and Description')
    .ok('Ok')
    .cancel('Cancel')

    vm.updatedQuery = {
        name: null,
        description: null
    }

    /**
     * Loads the operation into the operation chain builder
     */
    vm.load = function() {
        operationChain.setOperationChain(vm.model.operations);
        navigation.goToQuery();
    }

    vm.closeSideNav = function() {
        if($mdSidenav('right').isOpen()) {
            $mdSidenav('right').toggle();
        }
    }

    vm.openSideNav = function (operationIndex, operation) {

        //var operationIndex = vm.model.operations.indexOf(operation);
        
        if(!$mdSidenav('right').isOpen()) {
            vm.updatedQuery = {
                name: operation.selectedOperation.name,
                description: operation.selectedOperation.description
            };
           
            $mdSidenav('right').toggle();
            previousQueries.setCurrentChain(vm.chain, operationIndex);
        }
    }

    vm.saveUpdatedDetails = function() {
        var chainToUpdate = previousQueries.getCurrentChain();

        if (vm.updatedQuery.name != null && vm.updatedQuery.name != '') {
            $mdDialog.show(confirm)
            .then(() => {
              
               queries = vm.parent.queriesList();
      
                //Update the local model to force the UI to update
                if (chainToUpdate.chain >= 0 && chainToUpdate.chain <= queries.length) {
                    var query = queries[chainToUpdate.chain];
                 
                    if (chainToUpdate.operationIndex >= 0 && chainToUpdate.operationIndex <= query.operations.length) {
                        var operationSelectedOperation = Object.assign({}, query.operations[chainToUpdate.operationIndex].selectedOperation);
                        operationSelectedOperation.name = vm.updatedQuery.name;
                        operationSelectedOperation.description = vm.updatedQuery.description;
                        query.operations[chainToUpdate.operationIndex] = {...query.operations[chainToUpdate.operationIndex], selectedOperation: operationSelectedOperation };
                    }
                }
              
                // Save the changes and close the side nav
                previousQueries.updateQuery(chainToUpdate.chain, chainToUpdate.operationIndex, vm.updatedQuery);
                $mdSidenav('right').toggle();
                
            })
            .catch(() => {
                // Do nothing on cancel
            });
        } else {
            // Name is mandatory
            $mdDialog.show(invalidName);
        }
       
    }
}
