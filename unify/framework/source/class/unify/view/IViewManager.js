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
     * Registers a new view. All views must be registered before being used.
     *
     * @param viewClass {Class} Class of the view to register
     * @param isDefault {Boolean?false} Whether the added view functions as the default view for this manager.
     */
    register : function(viewClass, isDefault) {},
    
    /**
     * Navigates to the given path
     *
     * @param path {unify.view.Path} Path object
     */
    navigate : function(path) {},
    
    /**
     * @return {Boolean} true if this ViewManager currently animates the transition between 2 views
     */
    isInAnimation : function() {}
  }
});