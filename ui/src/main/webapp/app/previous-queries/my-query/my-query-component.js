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
            chain: '='
        }
    }
}

function MyQueryController(operationChain, navigation, previousQueries, $mdSidenav, $mdDialog) {
    var vm = this;

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

    vm.operationIndex = 0;

    //var OPERATION_CHAIN_CLASS = "uk.gov.gchq.gaffer.operation.OperationChain";

    /**
     * Loads the operation into the operation chain builder
     */
    vm.load = function() {
        operationChain.setOperationChain(vm.model.operations);
        navigation.goToQuery();
    }

    vm.toggleSideNav  = function (event) {
    vm.updatedQuery = {
        name: vm.model.operations[event].selectedOperation.name,
        description: vm.model.operations[event].selectedOperation.description,
        index: event
    }
        $mdSidenav('right').toggle();

        if($mdSidenav('right').isOpen()) {

            vm.operationIndex = event;

            console.log('1. Operation Index: ', vm.operationIndex);
            console.log('1. Operation Chain: ', vm.chain);
            console.log('1. Model Name: ', vm.model.operations[vm.updatedQuery.index].selectedOperation.name);
        }
    }

    vm.saveUpdatedDetails = function() {
        console.log('2. Operation Index: ', vm.operationIndex);
        console.log('2. Operation Chain: ', vm.chain);
        console.log('2. Model Name: ', vm.model.operations[vm.updatedQuery.index].selectedOperation.name);

        if (vm.updatedQuery.name != null && vm.updatedQuery.name != '') {
            $mdDialog.show(confirm).then(() => {
                // Need to add the updatedQuery values to the model
//                vm.model.operations[vm.operationIndex].selectedOperation.name = vm.updatedQuery.name;
//                vm.model.operations[vm.operationIndex].selectedOperation.description = vm.updatedQuery.description;

                previousQueries.updateQuery(vm.chain, vm.operationIndex, vm.updatedQuery);

                $mdSidenav('right').toggle();
            });
        } else {
            // Name is mandatory
            $mdDialog.show(invalidName);
        }
    }
}
