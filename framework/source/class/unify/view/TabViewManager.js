/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * TODO
 */
qx.Class.define("unify.view.TabViewManager",
{
  extend : qx.core.Object,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param viewManager {unify.view.ViewManager} ViewManager to attach to
   */
  construct : function(viewManager)
  {
    this.base(arguments);
    
    if (qx.core.Environment.get("qx.debug"))
    {
      if (viewManager == null) {
        throw new Error("TabViewManager needs a ViewManager at construction time!");
      }
    }
    
    // Maps root views to full path objects
    this.__paths = {};
    
    // Remember view manager and react on changes of its path
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
    __paths : null,
  
    /** {unify.view.ViewManager} Instance of attached view manager */
    __viewManager : null,
    
    /** {Element} Container of "bar" and "pane" */
    __element : null,
    
    /** {Element} Root element which is used for the button bar */
    __bar : null,
    
    /** {Element} Root element of the attached view manager */
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
        qx.event.Registration.addListener(bar, "utap", this.__onTap, this);
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
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), "div[view]");
      if (elem)
      {
        var viewManager = this.__viewManager;
        var oldPath = viewManager.getPath();
        var oldRootView = oldPath[0].view;
        
        var newRootView = elem.getAttribute("view");
        
        // If root view has not changed we force jump to root of the view and not
        // using the stored deep path. This results into the intented behavior to
        // jump to top on the second click on the same button.
        
        if (oldRootView != newRootView) {
          var newPath = this.__paths[newRootView];
        }
        
        if (!newPath) {
          newPath = unify.view.Path.fromString(newRootView);
        }
        
        this.__viewManager.navigate(newPath);
        
        // Store path for old view
        this.__paths[oldRootView] = oldPath;
      }
    }
  }
});
