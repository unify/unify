/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Basic control for low level interface creation.
 * @deprecated
 */
qx.Class.define("unify.ui.Abstract",
{
  extend : qx.core.Object,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __element : null,


    /*
    ---------------------------------------------------------------------------
      ABSTRACT METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * This method creates the (outer) DOM element for every control. This needs
     * to be overridden by more specific controls for implementation.
     *
     * @abstract
     * @return {Element} Should return the DOM element
     */
    _createElement : function()
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        this.trace();
        throw new Error(this.toString() + ": Called abstract method _createElement()!");
      }
    },




    /*
    ---------------------------------------------------------------------------
      FINAL METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the first matching element for the given selector
     *
     * @param selector {String} Any valid CSS selector
     * @return {Element} DOM element which matches or <code>null</code>
     */
    query : function(selector) {
      return qx.bom.Selector.query(selector, this.getElement())[0];
    },


    /**
     * Returns all matching element for the given selector
     *
     * @param selector {String} Any valid CSS selector
     * @return {Array(Element)} DOM element which matches or <code>null</code>
     */
    queryAll : function(selector) {
      return qx.bom.Selector.query(selector, this.getElement());
    },


    /**
     * Whether the DOM representation is created
     *
     * @final
     * @return {Boolean} <code>true</code> when the DOM element is created
     */
    isCreated : function() {
      return !!this.__element;
    },


    /**
     * Returns the DOM element of this control.
     *
     * @final
     * @return {Element} DOM element
     */
    getElement : function()
    {
      var current = this.__element;
      if (current) {
        return current;
      }

      current = this.__element = this._createElement();
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!current) {
          throw new Error(this.toString() + ": Implementation of _createElement did not return an element!");
        }
      }

      return current;
    },


    /**
     * Returns the DOM element of this control.
     *
     * @final
     * @return {Element} DOM element
     */
    toElement : function() {
      return this.getElement();
    }
  }
});
