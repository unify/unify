/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * The TabBar is an singleton element of the ui. If it is enabled by adding
 * buttons to it, the tab bar is displayed on all views. It is possible to
 * set a view to "full screen" (@see unify.view.StaticView#isFullScreen)
 * to prevent display of tab bar on this view. The default and recommended behaviour
 * is to display it on all views.
 */
qx.Class.define("unify.view.TabViewManager",
{
  extend : qx.core.Object,

  construct : function(viewManager)
  {
    this.base(arguments);
    
    if (qx.core.Variant.isSet("qx.debug", "on"))
    {
      if (viewManager == null) {
        throw new Error("TabViewManager needs a ViewManager at construction time!");
      }
    }
    
    this.__viewManager = viewManager;
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __viewManager : null,
    __element : null,
    __bar : null,
    __pane : null,
    
    
    
    getElement : function()
    {
      var elem = this.__element;
      if (!elem)
      {
        var elem = this.__element = document.createElement("div");
        elem.className = "tab-view";
        
        var pane = this.__pane = document.createElement("div");
        pane.className = "pane";
        elem.appendChild(pane);
        
        var bar = this.__bar = document.createElement("div");
        bar.className = "bar";
        elem.appendChild(bar);
      }

      return elem;
    },
        
    
    /**
     * Adds a view to the tab bar. The buttons are displayed in the order of
     * execution of this function.
     *
     * @param viewClass {Class} Class of the view to register {@see unify.view.StaticView}
     */
    add : function(viewClass)
    {
      var root = this.getElement();
      var viewInstance = viewClass.getInstance();

      var elem = document.createElement("div");
      elem.className = "tab-bar-element";
      elem.setAttribute("goto", viewInstance.getId());
      elem.innerHTML = "<div class='tab-bar-element-image'></div>" + viewInstance.getTitle("tab-bar");

      this.__bar.appendChild(elem);
      this.__pane.appendChild(viewInstance.getElement());
    }
  }
});
