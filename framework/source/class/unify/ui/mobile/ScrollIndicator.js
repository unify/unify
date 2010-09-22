/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */    
/**
 * Used exclusively by {@link ScrollView} for displaying scroll position indicators.
 */
qx.Class.define("unify.ui.mobile.ScrollIndicator",
{
  extend : unify.ui.mobile.Abstract,
  

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
    
  /**
   * @param orientation {String} One of "horizontal" or "vertical"
   */
  construct : function(orientation)
  {
    this.base(arguments);
    
    if (orientation == null) {
      throw new Error("Invalid orientation: " + orientation);
    }
    
    this.setOrientation(orientation);
  },


  
  /*
  *****************************************************************************
     STATICs
  *****************************************************************************
  */
  
  statics : 
  {
    /** {Integer} Size of the scroll indicator */
    THICKNESS : 5,
    
    /** {Integer} Size of the end pieces */
    ENDSIZE : 3,
    
    /** {Integer} Distance from edges */
    DISTANCE : 2
  },
  


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
  
  properties :
  {
    /** Orientation of the scroll indicator */
    orientation : 
    {
      check : ["horizontal", "vertical"],
      nullable : true,
      apply : "_applyOrientation"
    },
    
    /** Whether the indicator is visible */
    visible : 
    {
      check : "Boolean",
      init : false,
      apply : "_applyVisible"
    }
  },

  


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
  
  members : 
  {
    // default values
    __isFadingOut : false,
    __isVisible : false,
    
    // these could be compiled out
    __position : null,
    __size : null,
    __startElem : null,
    __middleElem : null,
    __endElem : null,
    __horizontal : null,    
    
    
    
    /*
    ---------------------------------------------------------------------------
      INTERFACE METHODS
    ---------------------------------------------------------------------------
    */

    // overridden
    _createElement : function()
    {    
      var doc = document;
      var elem = doc.createElement("div");
      elem.className = "scroll-indicator " + this.getOrientation();    

      // Build sub elements
      this.__startElem = elem.appendChild(doc.createElement("div"));
      this.__middleElem = elem.appendChild(doc.createElement("div"));
      this.__endElem = elem.appendChild(doc.createElement("div"));
    
      // Listener for animation proposes
      qx.event.Registration.addListener(elem, "transitionEnd", this.__onTransitionEnd, this, false);
          
      return elem;
    },
    
    
    
    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */    
    
    /**
     * Move scroll indicator to given position and updates the size
     * 
     * Optimized for performance. This is also basically the reason why these 
     * things are NOT stored in properties. This method may be called hundreds of times
     * a second!
     * 
     * @param position {Integer} Position of indicator
     * @param size {Integer} Size of indicator
     */
    render : function(position, size) 
    {
      var Style = qx.bom.element2.Style;
      
      if (this.__position !== position) 
      {
        // Update internal fields
        this.__position = position;
        
        // Omit update when invisible or fading out
        // We move the scrollbar out of view as soon as it is not visible anymore
        if (this.__isVisible) 
        {
          var translate = this.__horizontal ? "translate3d(" + position + "px,0,0)" : "translate3d(0," + position + "px,0)";
          Style.set(this.getElement(), "transform", translate);
        }
      }
      
      if (this.__size !== size)
      {
        // Update internal field
        this.__size = size;
        
        // Compute sizes based on CSS stored size of end pieces
        var scaleX=1, scaleY=1, endPosX=0, endPosY=0;
        var endpieces = unify.ui.mobile.ScrollIndicator.ENDSIZE;
        if (this.__horizontal) 
        {
          scaleX = size - (endpieces * 2);
          endPosX = size - endpieces;
        }
        else
        {
          scaleY = size - (endpieces * 2);
          endPosY = size - endpieces;
        }
      
        // Apply transforms for best-in-class performance
        Style.set(this.__middleElem, "transform", "translate3d(0,0,0) scale(" + scaleX + "," + scaleY + ")");
        Style.set(this.__endElem, "transform", "translate3d(" + endPosX + "px," + endPosY + "px,0)");          
      }
    },
        


    /*
    ---------------------------------------------------------------------------
      APPLY ROUTINES
    ---------------------------------------------------------------------------
    */
    
    // property apply
    _applyOrientation : function(value) 
    {
      // Additional storage, higher memory but reduced number of function calls in render()
      this.__horizontal = value === "horizontal";
    },

    
    // property apply
    _applyVisible : function(value)
    {
      // Additional storage, higher memory but reduced number of function calls in render()
      this.__isVisible = value;

      var style = this.getElement().style;
      if (value)
      {
        // Recover old position
        var translate = this.__horizontal ? "translate3d(" + this.__position + "px,0,0)" : "translate3d(0," + this.__position + "px,0)";
        qx.bom.element2.Style.set(this.getElement(), "transform", translate);
        
        // Fade in
        this.__isFadingOut = false;
        style.opacity = 1;
      }
      else if (!this.__isFadingOut)
      {
        // Fade out
        this.__isFadingOut = true;
        style.opacity = 0;
      }
    },
    
    

    
    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER
    ---------------------------------------------------------------------------
    */    

    /**
     * Event handler for transition event
     * 
     * @param ev {Event} Transition event object
     */
    __onTransitionEnd : function(ev)
    {
      if (this.__isFadingOut)
      {
        qx.bom.element2.Style.set(this.getElement(), "transform", null);
        this.__isFadingOut = false;
      }
    }  
  }
});
