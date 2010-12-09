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
    /** {unify.view.ViewManager} Instance of attached view manager */
    __viewManager : null,
    __element : null,
    __bar : null,
    __pane : null,
    
    
    /**
     * Returns the tab view element
     * 
     * @return {Element} Root DOM element of tab view
     */
    getElement : function()
    {
      var elem = this.__element;
      if (!elem)
      {
        var elem = this.__element = document.createElement("div");
        elem.className = "tab-view";
        
        var pane = this.__viewManager.getElement();
        elem.appendChild(pane);
        
        var bar = this.__bar = document.createElement("div");
        bar.className = "tab-bar";
        elem.appendChild(bar);
        qx.event.Registration.addListener(bar, "tap", this.__onTap, this);
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
    },
    
    
    /**
     * Reacts on tabbing on the tabbar buttons.
     * 
     * @param e {unify.event.type.Touch} Touch event
     */
    __onTap : function(e) 
    {
      var elem = qx.dom.Hierarchy.closest(e.getTarget(), "div[goto]");
      if (elem)
      {
        var dest = elem.getAttribute("goto");
        var config = unify.view.Path.parseFragment(dest);
        this.__viewManager.navigate(new unify.view.Path(config));
      }
    }
  }
});
