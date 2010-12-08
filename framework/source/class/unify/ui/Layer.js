/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Layer control. Top level control for each view.
 */
qx.Class.define("unify.ui.Layer",
{
  extend : unify.ui.Container,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param view {unify.view.StaticView} View instance to connect to
    */
  construct : function(view)
  {
    this.base(arguments);

    if (qx.core.Variant.isSet("qx.debug", "on"))
    {
      if (!view) {
        throw new Error(this.toString() + ": Constructor misses view instance!");
      } else if (!(view instanceof unify.view.StaticView)) {
        throw new Error(this.toString() + ": Constructor got invalid view instance: " + view);
      }
    }

    this.__view = view;
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
     * @return {unify.view.StaticView} View of layer
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
    }
  }
});
