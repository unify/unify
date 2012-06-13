/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * ViewManager Interface
 */
core.Interface("unify.view.IViewManager", {
  
  members : {
    
    /**
     * {unify.view.StaticView} Returns the currently selected view instance
     */
    getCurrentView : function() {},
    
    /**
     * {unify.view.StaticView} Returns the view instance stored behind the given ID @id {String}.
     */
    getView : function(id) {},
    
    /**
     * Registers a new view @viewClass {Function}. All views must be registered before being used.
     * If @isDefault {Boolean?false} is set to true it is the first visible view if no path is
     * given in URL.
     */
    register : function(viewClass, isDefault) {},
    
    /**
     * Navigates to the given @path {unify.view.Path}
     */
    navigate : function(path) {},
    
    /**
     * {Boolean} true if this ViewManager currently animates the transition between 2 views
     */
    isInAnimation : function() {}
  }
});