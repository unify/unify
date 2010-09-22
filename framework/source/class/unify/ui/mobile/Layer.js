/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Layer control. Top level control for each view.
 */
qx.Class.define("unify.ui.mobile.Layer",
{
  extend : unify.ui.mobile.Container,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param view {unify.view.mobile.StaticView} View instance to connect to
    */
  construct : function(view)
  {
    this.base(arguments);
    
    if (qx.core.Variant.isSet("qx.debug", "on")) 
    {
      if (!view) {
        throw new Error(this.toString() + ": Constructor misses view instance!");
      } else if (!(view instanceof unify.view.mobile.StaticView)) {
        throw new Error(this.toString() + ": Constructor got invalid view instance: " + view);
      }
    }
    
    this.__view = view;
    view.addListener("changeActive", this.__onViewChangeActive, this);
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __view : null,
    
    
    /**
     * Returns view of leyer.
     * 
     * @return {unify.view.mobile.StaticView} View of layer
     */
    getView : function() {
      return this.__view;
    },
    
    
    
    /*
    ---------------------------------------------------------------------------
      CONTROL INTERFACE
    ---------------------------------------------------------------------------
    */
      
    // overridden
    _createElement : function()
    {
      var elem = document.createElement("div");
      elem.id = this.__view.getId();
      elem.className = "layer";
      
      return elem;
    },
    
    
    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */
    
    
    /**
     * Event handler for change active view.
     * 
     * @param e {qx.event.type.Data} Change view event
     */
    __onViewChangeActive : function(e)
    {
      if (!e.getData()) {
        return;
      }

      var Class = qx.bom.element2.Class;
      var elem = this.getElement();
      var view = this.__view;
      
      // Update TabBar display
      view.isModal() || view.isFullScreen() ? Class.remove(elem, "has-tabbar") : Class.add(elem, "has-tabbar");
    }
  },  
   
   
  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() 
  {
    this.__view.removeListener("changeActive", this.__onViewChangeActive, this);
    this.__view = null;
  }
});
