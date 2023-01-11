# Multiple page selector in the built-in News widget designer

- [Summary](#Summary)
- [Installation](#Installation)
- [Details](#Details)
- [Usage](#Usage)
- [License](#License)
- [EnsoDX](#EnsoDX)


---
### Summary
---

<br />
This sample contains a sample that extends the built-in News widget designer with a new tab that has a page selector where you can select multiple Sitefinity pages or you can add multiple external links
<br />
It can be used as a reference for any other content type designers including custom widget designer.
<br />
The sample is developed with Sitefinity 14.3 but should work without any issues with older Sitefinity versions too.
<br />
<br />

---
### Installation
---

<br />
This code assumes you have a working version of Sitefinity 14.3 (or older) running.
<br />
If you are extending the built-in News widget designer, you can just reuse the sample - be careful and check if you already have an existing custom NewsModel and etc.
<br />
If you are extending other content type widget designers or custom widget designers make sure to follow the naming conventions for the designer files and the folder structure based on the Sitefinity documentation.
<br />
<br />

---
### Details
---

<br />

**Model/Controller**
<br />
<br />
In the Model (or in the Controller if you are developing a custom widget) add the public properties:
<br />

    public string SelectedPageLinksItems { get; set; }
    public string SelectedPageLinksIds { get; set; }
    public string StringifiedPageLinksIds { get; set; }
    public string StringifiedPageLinksItems { get; set; }

<br />

**DesignerView.Simple.json**
<br />
<br />
In the DesignerView.Simple.json in the components add the "sf-page-selector"
<br />

    {
    "priority": 1,
    "components": [ "sf-provider-selector", "sf-news-selector", "sf-filter-selector", "sf-page-selector", "sf-expander", "sf-style-dropdown" ],
    "scripts": [ "client-components/selectors/common/sf-selected-items-view.js" ]
    }

<br />

**designerview-simple.js**

<br />
In the designerview-simple.js make sure you have the sfSelectors in the list of designer module dependencies.
    angular.module('designer').requires.push('expander', 'sfSelectors');
<br />
Define a local scope variable for the page selector called pageLinksSelector and initialize it as an object with 2 empty array fields named selectedPageLinksIds and selectedPageLinksItems:
<br />
<br />

    $scope.pageLinksSelector = {
        selectedPageLinksIds: [],
        selectedPageLinksItems: []
    };

<br />
Add $scope.watchCollection functions to watch when the pageLinksSelector.selectedPageLinksIds and pageLinksSelector.selectedPageLinksItems change and if there is a change update the respective stringified server properties (the ones we added in the Model/Controller - StringifiedPageLinksIds and StringifiedPageLinksItems) with the updated and stringified array of pageLinksIds and pageLinksItems so Sitefinity can persist the string values in the database after we click Save changes in the designer:
<br />
<br />

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

<br />

In the propertyService.get() method (it triggers when the designer is opened and passes the widget properties to the widget designer) update the values of the selectedPageLinksIds and selectedPageLinksItems arrays by parsing the stringified values into a JSON so Sitefinity can properly visualize them in the designer:
<br />
<br />

    propertyService.get()
      .then(function (data) {
        if (data && data.Items) {
          $scope.properties = propertyService.toAssociativeArray(data.Items);

          var serializedPageLinksIds = $.parseJSON($scope.properties.StringifiedPageLinksIds.PropertyValue || null);

          if (serializedPageLinksIds != "") {
            $scope.pageLinksSelector.selectedPageLinksIds = serializedPageLinksIds;
          }

          var serializedPageLinksItems = $.parseJSON($scope.properties.StringifiedPageLinksItems.PropertyValue || null);

          if (serializedPageLinksItems != "") {
            $scope.pageLinksSelector.selectedPageLinksItems = serializedPageLinksItems;
          }
        }
      },

<br />

**DesignerView.Simple.cshtml**

<br />
In the DesignerView.Simple.cshtml we bind the local scoper variable we defined in the designerview-simple.js to the sf-list-selector properties.
<br />
We bind the pageLinksSelector.selectedPageLinksIds variable to the sf-selected-ids property of the selector.
<br />
And we bind the pageLinksSelector.selectedPageLinksItems variable to the sf-selected-items property of the selector.
<br />
<br />


    <uib-tab heading="Select additional pages">
        <div class="form-group">
            <div>
                <div>
                    <sf-list-selector sf-page-selector
                        sf-multiselect="true" sf-sortable="true" 
                        sf-provider="properties.ProviderName.PropertyValue"
                        sf-selected-ids="pageLinksSelector.selectedPageLinksIds" 
                        sf-selected-items="pageLinksSelector.selectedPageLinksItems">
                    </sf-list-selector>
                </div>
            </div>
        </div>
    </uib-tab>

<br />
You can update the tab heading here:

<br />

    <uib-tab heading="Select additional pages">

<br />

---
### Usage
---

<br />

1. Drag the News widget (or the widget you are implementing it for) on a page
2. Click on the custom tab - in the sample it is "Select additional pages" tab
3. Click on the "Select" button to select Sitefinity page or multiple pages or to add external urls
4. Done selecting 
4. Save changes


That's it!
<br />


##### __Select additional pages tab in the designer__
![alt text](../../ensodx/assets/sitefinity-samples/multiple-page-selector-in-widget-designer/select-additional-pages-tab.png)

<br />

---
### License
---

Free to use under the [MIT license](http://opensource.org/licenses/MIT).
<br />
Sitefinity is a registered trademark of [Progress Software Corporation](https://www.progress.com/sitefinity-cms).
<br />
<br />

---
### EnsoDX
---

Enso DX is a service provider company, specializing in scaling and digital experience transformation and migration projects. We focus on architecting, developing and streamlining the implementation for web and multi-channel projects by taking a holistic approach to ensure successful project implementations that align with your long term and sustainable strategic objectives.