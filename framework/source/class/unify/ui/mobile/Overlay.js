/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Generic overlay class for dialogs, popups, activity, etc.
 */
qx.Class.define("unify.ui.mobile.Overlay",
{
  extend : unify.ui.mobile.Container,
  
  
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
      var elem = this.getElement();
      if (!elem.parentNode) {
        document.body.appendChild(elem);
      }
      
      if (!this.getEnableAnimation()) 
      {
        elem.style.display = "";
        return;
      }
            
      if (this.__in) {
        return;
      }
      
      var Class = qx.bom.element2.Class;
      
      this.__in = true;
      if (this.__out) 
      {
        Class.remove(elem, "out");
        this.__out = null;
      }
      
      // Bring into start position
      Class.add(elem, "in");
      
      // Display it there and force rendering
      elem.style.display = "block";
      elem.offsetWidth;
      
      // The enable animation and remove start position data (switch to default position)
      Class.add(elem, "animate");
      Class.remove(elem, "in");
    },
    
    
    /**
     * Hides the overlay
     */
    hide : function() 
    {
      var elem = this.getElement();
      if (!this.getEnableAnimation()) 
      {
        elem.style.display = "none";
        return;
      }
      
      if (this.__out) {
        return;
      }
      
      var Class = qx.bom.element2.Class;
      
      this.__out = true;
      if (this.__in) 
      {
        Class.remove(elem, "in");
        this.__in = null;
      }
      
      Class.add(elem, "out animate");
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
      var Class = qx.bom.element2.Class;

      Class.remove(elem, "animate in out");
      
      if (this.__out) 
      {
        elem.style.display = "none";
        this.fireEvent("fadeIn");
      }
      else if (this.__in)
      {
        this.fireEvent("fadeOut");
      }
      
      this.__in = this.__out = null;
    }
  }
});
