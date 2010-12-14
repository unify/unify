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


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

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
    viewManager.addListener("changePath", this.__onViewManagerChangePath, this);
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
  
  properties : 
  {
    /** ID of selected view */
    selected : 
    {
      check : "String",
      event : "changeSelected",
      nullable : true,
      apply : "_applySelected"      
    }
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
      elem.setAttribute("view", viewInstance.getId());
      elem.innerHTML = "<div class='tab-bar-element-image'></div>" + viewInstance.getTitle("tab-bar");

      this.__bar.appendChild(elem);
    },
    
    
    /**
     * Reacts on path changes of the view manager and updates "selected" property accordingly.
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewManagerChangePath : function(e)
    {
      var path = e.getData();
      if (path)
      {
        var first = path[0];
        if (first) {
          return this.setSelected(first.view);
        }
      }
      
      this.resetSelected();
    },
    
    
    // property apply
    _applySelected : function(value, old)
    {
      this.debug("View: " + value);
      
      var Class = qx.bom.element2.Class;
      var bar = this.__bar;
      var children = bar.childNodes;
      for (var i=0, l=children.length; i<l; i++) 
      {
        var elem = children[i];
        var view = elem.getAttribute("view");
        
        if (view == value) {
          Class.add(elem, "selected");
        } else if (view == old) {
          Class.remove(elem, "selected");
        }
      }
    },
    
    
    /**
     * Reacts on tabbing on the tabbar buttons.
     * 
     * @param e {unify.event.type.Touch} Touch event
     */
    __onTap : function(e) 
    {
      var elem = qx.dom.Hierarchy.closest(e.getTarget(), "div[view]");
      if (elem)
      {
        var path = unify.view.Path.fromString(elem.getAttribute("view"));
        this.__viewManager.navigate(path);
      }
    }
  }
});
