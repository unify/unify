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
  type : "singleton",
  extend : qx.core.Object,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
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
    }
  }
});
