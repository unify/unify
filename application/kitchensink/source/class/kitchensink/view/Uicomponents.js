/* ************************************************************************

  kitchensink

  Copyright:
    2011 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Uicomponents View
 */
qx.Class.define("kitchensink.view.Uicomponents", {
  extend : unify.view.StaticView,
  type : "singleton",
  
  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "UI Components";
    },
    
    // overridden
    _createView : function() 
    {
      // first we define some content elements
      var 
        // the main layer for this view
        mainLayer = new unify.ui.Layer(this),
        
        // a navigation bar on top
        navBar = new unify.ui.NavigationBar(this),
        
        // a scrollable view below the navigation bar
        mainScrollContent = new unify.ui.ScrollView(),
        
        // this is a var used later on, variable hoisting puts it here
        mainMenu = '',
        
        // this is a tool bar on the bottom of the page
        toolBar = new unify.ui.ToolBar(this);
      
      
      // add navigation bar, main scroller and tool bar
      mainLayer.add(navBar);
      mainLayer.add(mainScrollContent);
      mainLayer.add(toolBar);
      
      
      // fill navigation bar
      navBar.setLeftItems(
        [
          {
            icon : true,
            jump : "settings",
            kind : "button"
          },
          {
            icon : true,
            jump : "clock",
            kind : "button"
          },
          {
            icon : true,
            jump : "puzzle",
            kind : "button"
          }
        ]
      );
      
      // center can only contain one item (actually only a segmented control)
      navBar.setCenterItem(
        {
          kind : 'segmented',
          view : this,
          buttons : 
          [
            {
              label : 'One',
              segment : 'one'
            },
            {
              label : 'Two',
              segment : 'two'
            },
            {
              label : 'Three',
              segment : 'three'
            }
          ]
        }
      );
      
      
      navBar.setRightItems(
        [
          { 
            kind : "button",
            icon : true,
            exec : "refresh"
          }
        ]
      );
      
      
      // fill main scroller - h2 is pre-styled
      mainScrollContent.add("<h2>This is a ScrollView - Move It!</h2>");
      mainScrollContent.add("<p>Please also note the 'Back' button on top within the navigation bar - it's automatically generated</p>");
      
      mainScrollContent.add(mainMenu);
      
      // fill tool bar
      toolBar.setItems(
        [
          {
            icon : true,
            jump : "settings",
            kind : "button"
          },
          {
            icon : true,
            jump : "clock",
            kind : "button"
          },
          {
            kind : 'spacer'
          },
          {
            kind : 'segmented',
            view : this,
            buttons : 
            [
              {
                label : 'Four',
                segment : 'four'
              },
              {
                label : 'Five',
                segment : 'five'
              }
            ]
          },
          {
            kind : 'spacer'
          },
          {
            icon : true,
            jump : "puzzle",
            kind : "button"
          },
          {
            kind : 'spacer'
          },
          {
            icon : true,
            jump : "puzzle",
            kind : "button"
          },
          {
            kind : 'spacer'
          },
          {
            icon : true,
            jump : "puzzle",
            kind : "button"
          }
        ]
      );
      
      // the _createView method returns the main layer as the view
      return mainLayer;
    }
  }
});
