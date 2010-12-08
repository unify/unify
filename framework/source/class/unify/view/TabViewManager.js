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
qx.Class.define("unify.ui.TabBar",
{
  type : "singleton",
  extend : unify.ui.Abstract,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    var ViewManager = unify.view.ViewManager.getInstance();
    ViewManager.addListener("changeView", this.__onChangeView, this);

    var NavigationManager = unify.view.NavigationManager.getInstance();
    NavigationManager.addListener("navigate", this.__onNavigationChange, this);
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      CONTROL INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    _createElement : function()
    {
      var elem = document.createElement("div");
      elem.id = "tab-bar";
      return elem;
    },


    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */

    /**
     * Adds a view to the tab bar. The buttons are displayed in the order of
     * execution of this function.
     *
     * @param viewClass {Class} Class of the view to register (@see unify.view.StaticView)
     */
    add : function(viewClass)
    {
      var viewInstance = viewClass.getInstance();

      var elem = document.createElement("div");
      elem.className = "tab-bar-element";
      elem.setAttribute("goto", viewInstance.getId());
      elem.setAttribute("rel", "swap");
      elem.innerHTML = "<div class='tab-bar-element-image'></div>" + viewInstance.getTitle("tab-bar");

      this.getElement().appendChild(elem);
    },


    /**
     * Shows the tab bar.
     */
    show : function()
    {
      var Class = qx.bom.element2.Class;
      var element = this.getElement();
      if (Class.has(element, "active")) {
        return;
      }

      if (!element.parentNode) {
        qx.core.Init.getApplication().getRoot().appendChild(element);
      }

      Class.add(element, "active");
    },


    /**
     * Hides the tab bar.
     */
    hide : function()
    {
      var Class = qx.bom.element2.Class;
      var element = this.getElement();
      if (!Class.has(element, "active")) {
        return;
      }

      Class.remove(element, "active");
    },


    /**
     * Returns visible state of the tab bar.
     *
     * @return {Boolean} True if tab bar is shown, otherwise false
     */
    isShown : function() {
      return !!(this.isCreated() && qx.bom.element2.Class.has(this.getElement(), "active"));
    },


    /**
     * Reshows the tab bar immediately
     */
    reshowImmediately : function() {
      var element = this.getElement();
      if (element) {
        element.style.display = "";
      }
    },


    /**
     * Hides the tab bar immediately
     */
    hideImmediately : function() {
      var element = this.getElement();
      if (element) {
        element.style.display = "none";
      }
    },




    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    /**
     * Event handler for changeView event of {@link unify.view.ViewManager}.
     *
     * @param e {qx.event.type.Data} Property change event
     */
    __onChangeView : function(e)
    {
      var view = e.getData();

      if (view.isModal() || view.isFullScreen()) {
        this.hide();
      } else {
        this.show();
      }
    },


    /**
     * Updates active button to change marker
     *
     * @param e {unify.event.type.Navigate} Navigation path event object
     */
    __onNavigationChange : function(e)
    {
      var mode = e.getMode();
      if (mode != "swap" && mode != "initial") {
        return;
      }

      var path = e.getPath();
      var current = path.getView(0);
      var Class = qx.bom.element2.Class;
      var element = this.getElement();

      // Remove activation from previous element
      var oldLink = element.querySelector(".active");
      if (oldLink) {
        Class.remove(oldLink, "active");
      }

      // Build expression for selection
      var viewId = path.getView(0);
      var selector = '[goto=' + viewId + ']';

      var viewParam = path.getParam(0);
      if (viewParam != null) {
        selector = '[goto="' + viewId + ':' + viewParam + '"],' + selector;
      }

      // Add activation to new element
      var link = element.querySelector(selector);
      if (link) {
        Class.add(link, "active");
      }
    }
  },


  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    var ViewManager = unify.view.ViewManager.getInstance();
    ViewManager.removeListener("changeView", this.__onChangeView, this);

    var NavigationManager = unify.view.NavigationManager.getInstance();
    NavigationManager.removeListener("navigate", this.__onNavigationChange, this);
  }
});
