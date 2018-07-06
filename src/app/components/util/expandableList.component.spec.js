(function () {
    'use strict';

describe('the ai exapandable list', function() {
    var element, scope, $log, $compile, ctrl;
    
    beforeEach(module('chpl.templates', 'chpl'));

    beforeEach(inject(function($templateCache) {
        $templateCache.put('./app/components/util/expandableList.html',
          `<div ng-form="{{ $ctrl.identifier }}_form">
            <div ng-repeat="option in $ctrl.selectedItems track by $index">
                <div class="selected-item alert-success fade-in">
                    <button class="close" ng-click="$ctrl.removeItem(option)">
                        <span class="sr-only">Remove item {{ option.item.name }}</span>
                        <i class="fa fa-times"></i>
                    </button> 
                    <strong>{{ option.item.name }}</strong>
                    <div ng-if="$ctrl.additionalInput" class="additional-input">
                        <div class="row">
                            <div class="col-sm-5">
                                <label for="{{ $ctrl.identifier }}-additional-input-{{ $index }}">{{ $ctrl.additionalInputLabel }}</label>
                            </div>
                            <div class="col-sm-5">
                                <input type="text" 
                                    id="{{ $ctrl.identifier }}-additional-input-{{ $index }}"
                                    name="{{ $ctrl.identifier }}_additionalInput_{{ $index }}"
                                    ng-model="option.additionalInputValue"
                                    ng-change="$ctrl.additionalInputChange(option)" 
                                    ng-maxlength="$ctrl.additionalInputMaxLength"
                                    ng-required="{{ $ctrl.additionalInputRequired }}">
                            </div>
                        </div>
                        <p class="text-danger" ng-show="{{ $ctrl.identifier }}_form.{{ $ctrl.identifier }}_additionalInput_{{ $index }}.$error.maxlength">
                            {{ $ctrl.additionalInputLabel }} is too long.
                        </p>
                        <p class="text-danger" ng-show="{{ $ctrl.identifier }}_form.{{ $ctrl.identifier }}_additionalInput_{{ $index }}.$error.required">
                            {{ $ctrl.additionalInputLabel }} is required.
                        </p>
                    </div>
                    <div ng-if="$ctrl.additionalInput2" class="additional-input" >
                        <div class="row">
                            <div class="col-sm-5">
                                <label for="{{ $ctrl.identifier }}-additional-input-2-{{ $index }}">{{ $ctrl.additionalInput2Label }}</label>
                            </div>
                            <div class="col-sm-5">
                                <input type="text" 
                                    id="{{ $ctrl.identifier }}-additional-input-2-{{ $index }}"
                                    name="{{ $ctrl.identifier }}_additionalInput2_{{ $index }}"
                                    ng-model="option.additionalInput2Value"
                                    ng-change="$ctrl.additionalInput2Change(option)" 
                                    ng-maxlength="$ctrl.additionalInput2MaxLength"
                                    ng-required="{{ $ctrl.additionalInput2Required }}">
                            </div>
                        </div>
                        <p class="text-danger" ng-show="{{ $ctrl.identifier }}form.{{ $ctrl.identifier }}_additionalInput2_{{ $index }}.$error.maxlength">
                            {{ $ctrl.additionalInputLabel2 }} is too long.
                        </p>
                        <p class="text-danger" ng-show="{{ $ctrl.identifier }}_form.{{ $ctrl.identifier }}_additionalInput2_{{ $index }}.$error.required">
                            {{ $ctrl.additionalInputLabel2 }} is required.
                        </p>
                    </div>
                </div>
            </div>
        
        
            <div ng-if="! $ctrl.inAddMode">
                <select class="form-control" 
                    id="{{ $ctrl.identifier }} " 
                    name="{{ $ctrl.identifier }}"
                    ng-model="$ctrl.selectedItem"
                    ng-options="option.value as option.text disable when $ctrl.isItemDisabled(option.value) for option in $ctrl.options"
                    ng-change="$ctrl.selectOnChange()">
                    <option value="" disabled selected>{{ $ctrl.placeholder }}</option>
                </select> 
            </div>
            
            <div ng-show="$ctrl.inAddMode" class="input-group">
            <input type="text" ng-model='$ctrl.addOption' ng-focus="$ctrl.inAddMode" placeholder='{{ $ctrl.addItemsPlaceholder }}' class='form-control' id="{{ $ctrl.identifier }}-add-option" >
                <span class="input-group-btn">
                    <button class="btn btn-ai-success btn-sm" ng-click="$ctrl.addItemToListClick()" id="{{ $ctrl.identifier }}-add-option-ok"><i class="fa fa-check"></i></button>
                    <button class="btn btn-danger btn-sm" ng-click="$ctrl.cancelAddItemToListClick()"><i class="fa fa-close"></i></button>
                </span>
            </div>
        
        </div>` );
    }));

    beforeEach(function () {
        inject(function(_$compile_, _$log_, $rootScope) {
            $log = _$log_;
            $compile = _$compile_;
            
            scope = $rootScope.$new();
    
            scope.ctrl = {};
    
            scope.ctrl.itemsList = [
                {id: 1, name: 'test1'},
                {id: 2, name: 'test2'}, 
                {id: 3, name: 'test3'},
                {id: 4, name: 'test4'}
            ];
    
            scope.ctrl.selectedItems = [
                {key: 2, additionalInputValue: 'ad1', additionalInput2Value: 'ad2'},
                {key: 4, additionalInputValue: 'ad4', additionalInput2Value: 'ad3'},
            ];
        
            element = angular.element(`<ai-expandable-list
                                            identifier="testData"  
                                            item-key="id" 
                                            item-text="name" 
                                            items="ctrl.itemsList"
                                            selected-item-keys="ctrl.selectedItems"
                                            placeholder="Select Test Data"
                                            on-change="ctrl.onChangeCallBack(action)"
                                            additional-input="true"
                                            additional-input-label="Version"
                                            additional-input-max-length="50"
                                            additional-input-required="true"
                                            additional-input2="true"
                                            additional-input2-label="Alteration"
                                            additional-input2-max-length="50"
                                            additional-input2-required="false"
                                            add-items="true"
                                            add-items-option-text="Add a new option"
                                            add-items-placeholder="Enter new option">`);
        
            $compile(element)(scope);
            scope.$digest();
            ctrl  = element.isolateScope().$ctrl;
        });
    });


    describe ('on initialize', function() {
        it('should populate the options', function () {
            expect(ctrl.options.length).toBe(5);
        });
        it('should populate the selected items', function () {
            expect(ctrl.selectedItems.length).toBe(2);
        });
    });

    describe('on add item to list', function() {
        beforeEach(function () {
            ctrl  = element.isolateScope().$ctrl;
            ctrl.onChange = jasmine.createSpy('callback');
            ctrl.addOption = "New Option";
            ctrl.addItemToListClick();
            scope.$digest();
        });

        it('should set add mode = false', function ()  {
           expect(ctrl.inAddMode).toBe(false);
        });
        it('should add item to selected items', function ()  {
            expect(ctrl.selectedItems.length).toBe(3);
        });
        it('should call onChange callback'), function ()  {
            expect(ctrl.onChange).toHaveBeenCalled();
        }
        it('should add item to options', function ()  {
            expect(ctrl.options.length).toBe(6);
        });
        it('should clear the selected item', function ()  {
            expect(ctrl.selectedItem).toBe('');
        });
        it('should clear addOption', function() {
            expect(ctrl.addOption).toBe('');
        });
    });

    describe('on cancel of add item', function () {
        beforeEach(function () {
            ctrl  = element.isolateScope().$ctrl;
            ctrl.inAddMode = true;
            scope.$digest();

            ctrl.cancelAddItemToListClick();
        }); 

        it('should reset the control to not be in add mode', function () {
            expect(ctrl.inAddMode).toBe(false);
            expect(ctrl.selectedItem).toBe('');
            expect(ctrl.addOption).toBe('');
        });
    });

    describe('on calling itemdisabled callback', function () {
        it('should call the call back when it is defined', function() {
            ctrl.itemDisabled = jasmine.createSpy('callback').and.callFake(function(item) {return true;});
            ctrl.isItemDisabled({id: 2, name: 'test2'});
            expect(ctrl.itemDisabled).toHaveBeenCalled();
        });
        it('should return false when it is not defined', function() {
            ctrl.itemDisabled = undefined;
            expect(ctrl.isItemDisabled({id: 2, name: 'test2'})).toBe(false);
        });
    });

    describe('on removing an item', function() {
        beforeEach(function() {
            ctrl.onChange = jasmine.createSpy('callback');
            ctrl.removeItem(ctrl.selectedItems[0]);
        });

        it('should remove the item from selected items', function () {
            expect(ctrl.selectedItems.length).toBe(1);
        });
        it('should call the onChnage callback', function () {
            expect(ctrl.onChange).toHaveBeenCalled();
        });
    }); 
    
    describe('on an item being selected', function () {
        it('should should but the control in add mode', function () {
            
        });
        it('should should not add the selected item if it is already selected', function () {
            ctrl.selectedItem = ctrl.selectedItems[0]; //Exsiting in selectedItems
            ctrl.selectOnChange();
            scope.$digest();
            
            expect(ctrl.selectedItems.length).toBe(2);
        });
        it('should should add the selected item to selectedItems', function () {
            ctrl.selectedItem = {id: 3, name: 'test3'};
            ctrl.selectOnChange();
            scope.$digest();

            expect(ctrl.selectedItems.length).toBe(3);
        });
        it('should should call the onChange callback', function () {
            ctrl.selectedItem = {id: 3, name: 'test3'};
            ctrl.onChange = jasmine.createSpy('callback');
            ctrl.selectOnChange();
            scope.$digest();

            expect(ctrl.onChange).toHaveBeenCalled();
        });        
    });
});
})();
