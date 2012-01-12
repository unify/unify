/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Telekom AG
    Author: Dominik Göpel

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.view.TabbedViewManager", {
  extend : unify.view.ViewManager,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param managerId {String} globally unique ID of this manager
   * @param bar {unify.ui.container.Bar} bar element used as tabbar (gets added to the viewmanager automatically)
   * @param addBarConfig {Object} layout configuration map used as second parameter when adding the Bar to this widget
   * @param layout {qx.ui.layout.Abstract?null} Layout for this viewmanager
   */
  construct : function(managerId,bar,addBarConfig,layout)
  {
    this.base(arguments,managerId,layout);
    this.__bar=bar;
    this.__tabs={};
    this.__currentTab=null;
    this.addListener("changePath", this.__onViewManagerChangePath, this);
    this.add(bar,addBarConfig);
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /** {Element} Root element which is used for the button bar */
    __bar : null,
    __tabs : null,
    __currentTab: null,


    /**
     * Registers a new view. All views must be registered before being used.
     *
     * @param viewClass {Class} Class of the view to register
     * @param isDefault {Boolean?false} Whether the added view functions as the default view for this manager.
     * @param excludeFromTabs {Boolean?false} Whether the added view is excluded from the tabbed navigation (useful for views that are not first level)
     */
    register : function(viewClass, isDefault, excludeFromTabs){
      this.base(arguments,viewClass,isDefault);
      var viewInstance = viewClass.getInstance();
      if(!excludeFromTabs){
        var config={
          label:viewInstance.getTitle("tab-bar"),
          jump:viewInstance.getId(),
          rel:"same"
        };
        var item=this.__bar.addItem(config);
        this.__tabs[viewInstance]=item;
      }
    },



    /**
     * Reacts on path changes of the view manager and updates "selected" property accordingly.
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewManagerChangePath : function(e)
    {
      var view = this.getCurrentView();
      if(view){
        var tab=this.__tabs[view];
        var oldTab=this.__currentTab;
        if(tab){
          if(oldTab){
            oldTab.removeState("currentTab");
          }
          tab.addState("currentTab");
          this.__currentTab=tab;
        }
      }
    },

    /**
     * destructor
     */
    destruct : function(){
      this.removeListener("changePath",this.__onViewManagerChangePath,this);
      this.__currentTab=this.__tabs=this.__bar=null;
    }
  }
});