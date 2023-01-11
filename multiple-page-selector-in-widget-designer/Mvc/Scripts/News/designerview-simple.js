(function ($) {
  angular.module('designer').requires.push('expander', 'sfSelectors');

  angular.module('designer').controller('SimpleCtrl', ['$scope', 'propertyService', function ($scope, propertyService) {
    var sortOptions = ['PublicationDate DESC', 'LastModified DESC', 'Title ASC', 'Title DESC', 'AsSetManually'];
    var emptyGuid = '00000000-0000-0000-0000-000000000000';

    $scope.feedback.showLoadingIndicator = true;
    $scope.additionalFilters = {};
    $scope.newsSelector = { selectedItemsIds: [] };
    // start custom multiple page selector
    $scope.pageLinksSelector = {
      selectedPageLinksIds: [],
      selectedPageLinksItems: []
    };
    // end custom multiple page selector
    $scope.dateFilters = {};

    $scope.$watch(
      'additionalFilters.value',
      function (newAdditionalFilters, oldAdditionalFilters) {
        if ($scope.properties && newAdditionalFilters !== oldAdditionalFilters) {
          $scope.properties.SerializedAdditionalFilters.PropertyValue = JSON.stringify(newAdditionalFilters);
        }
      },
      true
    );

    $scope.$watch(
      'dateFilters.value',
      function (newDateFilters, oldDateFilters) {
        if ($scope.properties && newDateFilters !== oldDateFilters) {
          $scope.properties.SerializedDateFilters.PropertyValue = JSON.stringify(newDateFilters);
        }
      },
      true
    );

    $scope.$watch(
      'properties.ProviderName.PropertyValue',
      function (newProviderName, oldProviderName) {
        newProviderName = newProviderName || "";
        oldProviderName = oldProviderName || "";

        if ($scope.properties && newProviderName !== oldProviderName) {
          $scope.properties.SelectionMode.PropertyValue = 'AllItems';
          $scope.properties.SerializedSelectedItemsIds.PropertyValue = null;
        }
      },
      true
    );

    $scope.$watch(
      'newsSelector.selectedItemsIds',
      function (newSelectedItemsIds, oldSelectedItemsIds) {
        if (newSelectedItemsIds !== oldSelectedItemsIds) {
          if ($scope.properties && newSelectedItemsIds) {
            $scope.properties.SerializedSelectedItemsIds.PropertyValue = JSON.stringify(newSelectedItemsIds);
            if (newSelectedItemsIds.length === 1) {
              $scope.properties.ContentViewDisplayMode.PropertyValue = 'Detail';
            }
          }
        }
      },
      true
    );

    $scope.$watch(
      'properties.SelectionMode.PropertyValue',
      function (newSelectionModeValue, oldSelectionModeValue) {
        if (newSelectionModeValue !== oldSelectionModeValue) {
          if ($scope.properties.ContentViewDisplayMode.PropertyValue.toLowerCase() === "Detail".toLowerCase() && newSelectionModeValue !== "SelectedItems") {
            $scope.properties.ContentViewDisplayMode.PropertyValue = "Automatic";
          }
        }
      },
      true
    );

    // start custom multiple page selector

    $scope.$watchCollection(
      'pageLinksSelector.selectedPageLinksIds',
      function (pageLinksIds) {        
        if (typeof $scope.properties !== 'undefined' && $scope.properties.StringifiedPageLinksIds !== 'undefined') {
          $scope.properties.StringifiedPageLinksIds.PropertyValue = JSON.stringify(pageLinksIds);
        }        
      },
      true
    );

    $scope.$watchCollection(
      'pageLinksSelector.selectedPageLinksItems',
      function (pageLinksItems) {
        if (typeof $scope.properties !== 'undefined' && $scope.properties.StringifiedPageLinksItems !== 'undefined') {
          $scope.properties.StringifiedPageLinksItems.PropertyValue = JSON.stringify(pageLinksItems);
        }
      },
      true
    );

    // end custom multiple page selector

    $scope.updateSortOption = function (newSortOption) {
      if (newSortOption !== "Custom") {
        $scope.properties.SortExpression.PropertyValue = newSortOption;
      }
    };

    propertyService.get()
      .then(function (data) {
        if (data && data.Items) {
          $scope.properties = propertyService.toAssociativeArray(data.Items);

          var additionalFilters = $.parseJSON($scope.properties.SerializedAdditionalFilters.PropertyValue || null);

          $scope.additionalFilters.value = additionalFilters;

          var dateFilters = $.parseJSON($scope.properties.SerializedDateFilters.PropertyValue || null);
          $scope.dateFilters.value = dateFilters;

          var selectedItemsIds = $.parseJSON($scope.properties.SerializedSelectedItemsIds.PropertyValue || null);

          if (selectedItemsIds) {
            $scope.newsSelector.selectedItemsIds = selectedItemsIds;
          }

          var serializedPageLinksIds = $.parseJSON($scope.properties.StringifiedPageLinksIds.PropertyValue || null);

          if (serializedPageLinksIds != "") {
            $scope.pageLinksSelector.selectedPageLinksIds = serializedPageLinksIds;
          }

          var serializedPageLinksItems = $.parseJSON($scope.properties.StringifiedPageLinksItems.PropertyValue || null);

          if (serializedPageLinksItems != "") {
            $scope.pageLinksSelector.selectedPageLinksItems = serializedPageLinksItems;
          }

          if (sortOptions.indexOf($scope.properties.SortExpression.PropertyValue) >= 0) {
            $scope.selectedSortOption = $scope.properties.SortExpression.PropertyValue;
          }
          else {
            $scope.selectedSortOption = "Custom";
          }
        }
      },
        function (errorData) {
          $scope.feedback.showError = true;
          if (errorData && errorData.data)
            $scope.feedback.errorMessage = errorData.data.Detail;
        })
      .then(function () {
        $scope.feedback.savingHandlers.push(function () {
          if ($scope.properties.OpenInSamePage.PropertyValue && $scope.properties.OpenInSamePage.PropertyValue.toLowerCase() === 'true') {
            $scope.properties.DetailsPageId.PropertyValue = emptyGuid;
          }
          else {
            if (!$scope.properties.DetailsPageId.PropertyValue ||
              $scope.properties.DetailsPageId.PropertyValue === emptyGuid) {
              $scope.properties.OpenInSamePage.PropertyValue = true;
            }
          }

          if ($scope.properties.SelectionMode.PropertyValue !== "FilteredItems") {
            $scope.properties.SerializedAdditionalFilters.PropertyValue = null;
          }

          if ($scope.properties.SelectionMode.PropertyValue !== 'SelectedItems') {
            $scope.properties.SerializedSelectedItemsIds.PropertyValue = null;

            // If the sorting expression is AsSetManually but the selection mode is AllItems or FilteredItems, this is not a valid combination.
            // So set the sort expression to the default value: PublicationDate DESC
            if ($scope.properties.SortExpression.PropertyValue === "AsSetManually") {
              $scope.properties.SortExpression.PropertyValue = "PublicationDate DESC";
            }

            if ($scope.properties.ContentViewDisplayMode.PropertyValue.toLowerCase() === "Detail".toLowerCase()) {
              $scope.properties.SelectionMode.PropertyValue = "SelectedItems";
            }
          }
        });
      })
      .finally(function () {
        $scope.feedback.showLoadingIndicator = false;
      });
  }]);
})(jQuery);