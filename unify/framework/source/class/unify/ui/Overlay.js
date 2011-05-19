/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Generic overlay class for dialogs, popups, activity, etc.
 */
qx.Class.define("unify.ui.Overlay",
{
  extend : unify.ui.Container,


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** Whether to enable animation during show/hide */
    enableAnimation :
    {
      check : "Boolean",
      init : true
    }
  },

  events :
  {
    /**
     * Fired when show animation finished (or immediatly on show if animation is disabled)
     */
    fadeIn : "qx.event.type.Event",

    /**
     * Fired when hide animation finished (or immediatly on hide if animation is disabled)
     */
    fadeOut : "qx.event.type.Event"
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
      PUBLIC API
    ---------------------------------------------------------------------------
    */


    /**
     * Whether the overlay is visible.
     *
     * @return {Boolean} <code>true</code> when the overlay is currently visible
     */
    isVisible : function()
    {
      var elem = this.getElement();
      return !!(elem && elem.parentNode && elem.style.display != "none");
    },


    /**
     * Shows the overlay
     */
    show : function()
    {
      if (this.__in || this.isVisible()) {
        return;
      }

      var elem = this.getElement();
      if (!elem.parentNode) {
        document.body.appendChild(elem);
      }

      var Class = qx.bom.element.Class;

      this.__in = true;
      if (this.__out)
      {
        Class.remove(elem, "out");
        this.__out = null;
      }

      if (!this.getEnableAnimation()){
        elem.style.display = "";
        this.__onTransitionEnd();
      } else {
        // Bring into start position
        Class.add(elem, "in");
        // Display it there and force rendering
        elem.style.display = "block";
        elem.offsetWidth;
        // The enable animation and remove start position data (switch to default position)
        Class.add(elem, "animate");
        Class.remove(elem, "in");
      }
    },


    /**
     * Hides the overlay
     */
    hide : function()
    {
      if (this.__out || !this.isVisible()) {
        return;
      }
      var Class = qx.bom.element.Class;
      var elem = this.getElement();
      this.__out = true;
      if (this.__in)
      {
        Class.remove(elem, "in");
        this.__in = null;
      }
      if (!this.getEnableAnimation()){
        this.__onTransitionEnd();
      } else {
        Class.addClasses(elem, ["out", "animate"]);
      }
    },



    /*
     * ---------------------------------------------------------------------------
     * INTERFACE METHODS
     * ---------------------------------------------------------------------------
     */

    // overridden
    _createElement : function()
    {
      var elem = document.createElement("div");
      qx.event.Registration.addListener(elem, "transitionEnd", this.__onTransitionEnd, this);

      return elem;
    },



    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Marker for active fade-in animation */
    __in : null,

    /** {Boolean} Marker for active fade-out animation */
    __out : null,

    /**
     * Internal helper to transition events
     */
    __onTransitionEnd : function()
    {
      var elem = this.getElement();
      var Class = qx.bom.element.Class;

      Class.removeClasses(elem, ["animate", "in", "out"]);

      if (this.__out)
      {
        elem.style.display = "none";
        this.fireEvent("fadeOut");
      }
      else if (this.__in)
      {
        this.fireEvent("fadeIn");
      }

      this.__in = this.__out = null;
    }
  }
});
