/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * ViewManager Interface
 */
qx.Interface.define("unify.view.IViewManager", {
  members : {
    /**
     * Returns the already created of new created base widget of the viewmanager.
     *
     * @return {unify.ui.core.Widget} Base widget of the viewmanager
     */
    getWidgetElement : function() {},
    
    /**
     * Returns the currently selected view instance
     *
     * @return {unify.view.StaticView} View instance which is currently selected
     */
    getCurrentView : function() {},
    
    /**
     * Returns the view instance stored behind the given ID.
     *
     * @param id {String} Identifier of the view.
     * @return {unify.view.Abstract} Instance derived from the StaticView class.
     */
    getView : function(id) {},
    
    /**
     * Navigates to the given path
     *
     * @param path {unify.view.Path} Path object
     */
    navigate : function(path) {}
  }
});